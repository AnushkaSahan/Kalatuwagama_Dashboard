import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Save,
  Phone,
  User,
  GraduationCap,
  Clock3,
} from "lucide-react";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../../api/students";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import toast from "react-hot-toast";

const emptyForm = {
  fullName: "",
  grade: "",
  guardianName: "",
  guardianPhone: "",
};

const timeAgo = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "S";

export default function Students() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeGrade, setActiveGrade] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getStudents();
      setData(res.data);
    } catch (error) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const grades = useMemo(() => {
    const unique = Array.from(
      new Set(data.map((item) => item.grade).filter(Boolean)),
    ).sort();
    return ["All", ...unique];
  }, [data]);

  const openCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditingId(record.id);
    setFormData({
      fullName: record.fullName || "",
      grade: record.grade || "",
      guardianName: record.guardianName || "",
      guardianPhone: record.guardianPhone || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.fullName.trim() ||
      !formData.guardianName.trim() ||
      !formData.guardianPhone.trim()
    ) {
      toast.error("Full name, guardian name and phone are required");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateStudent(editingId, formData);
        toast.success("Student updated");
      } else {
        await createStudent(formData);
        toast.success("Student added");
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this student?"))
      return;
    try {
      await deleteStudent(id);
      toast.success("Deleted successfully");
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const filtered = data.filter((item) => {
    const matchesSearch =
      item.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.guardianName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.guardianPhone?.includes(searchTerm);
    const matchesGrade = activeGrade === "All" || item.grade === activeGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-gray-800">
            Students
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Daham Pasala students and their guardian contacts.
          </p>
        </div>
        <Button icon={Plus} onClick={openCreate}>
          Add Student
        </Button>
      </div>

      <Card>
        <div className="flex flex-col gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by student or guardian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {grades.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {grades.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setActiveGrade(grade)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    activeGrade === grade
                      ? "bg-primary-900 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {grade === "All" ? "All Grades" : `Grade ${grade}`}
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-44 animate-pulse rounded-2xl border border-gray-100 bg-white shadow-card"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-14 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-lg font-semibold text-primary-900">
            {searchTerm || activeGrade !== "All" ? "?" : "S"}
          </div>
          <p className="font-medium text-gray-700">
            {searchTerm || activeGrade !== "All"
              ? "No matching students found"
              : "No students registered yet"}
          </p>
          <p className="max-w-sm text-sm text-gray-500">
            {searchTerm || activeGrade !== "All"
              ? "Try a different search or grade."
              : "Register Daham Pasala students to see them here."}
          </p>
          {!searchTerm && activeGrade === "All" && (
            <Button icon={Plus} onClick={openCreate} className="mt-2">
              Add Student
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => {
            const added = timeAgo(item.updatedAt || item.createdAt);
            return (
              <div
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-700 text-base font-semibold text-white ring-2 ring-accent-50">
                    {initials(item.fullName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-base font-semibold text-gray-800">
                      {item.fullName}
                    </h3>
                    {item.grade && (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-900">
                        <GraduationCap className="h-3 w-3" />
                        Grade {item.grade}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    {item.guardianName}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {item.guardianPhone}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock3 className="h-3.5 w-3.5" />
                    {added ? `Updated ${added}` : "No date"}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-primary-50 hover:text-primary-900"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Student" : "Add Student"}
        subtitle={
          editingId
            ? "Update the details below and save your changes."
            : "Register a Daham Pasala student."
        }
        footer={
          <>
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="student-form"
              icon={Save}
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : editingId
                  ? "Update Student"
                  : "Save Student"}
            </Button>
          </>
        }
      >
        <form id="student-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <Input
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="e.g. Nimal Perera"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Grade
            </label>
            <Input
              value={formData.grade}
              onChange={(e) =>
                setFormData({ ...formData, grade: e.target.value })
              }
              placeholder="e.g. 5, 6A"
              list="student-grades"
            />
            <datalist id="student-grades">
              {grades
                .filter((g) => g !== "All")
                .map((g) => (
                  <option key={g} value={g} />
                ))}
            </datalist>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Guardian Name *
            </label>
            <Input
              value={formData.guardianName}
              onChange={(e) =>
                setFormData({ ...formData, guardianName: e.target.value })
              }
              placeholder="e.g. Sunil Perera"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Guardian Phone *
            </label>
            <Input
              value={formData.guardianPhone}
              onChange={(e) =>
                setFormData({ ...formData, guardianPhone: e.target.value })
              }
              placeholder="0712345678"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
