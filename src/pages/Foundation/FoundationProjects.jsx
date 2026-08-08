import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Save,
  HeartHandshake,
  CalendarDays,
  FolderOpen,
} from "lucide-react";
import {
  getFoundationProjects,
  createFoundationProject,
  updateFoundationProject,
  deleteFoundationProject,
} from "../../api/foundationProjects";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import ImageUploadField from "../../components/common/ImageUploadField";
import toast from "react-hot-toast";

const emptyForm = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  imageUrl: "",
};

const formatDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
};

const formatDisplayDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function FoundationProjects() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
      const res = await getFoundationProjects();
      setData(res.data);
    } catch (error) {
      toast.error("Failed to load foundation projects");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditingId(record.id);
    setFormData({
      title: record.title || "",
      description: record.description || "",
      startDate: formatDateInput(record.startDate),
      endDate: formatDateInput(record.endDate),
      imageUrl: record.imageUrl || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      };
      if (editingId) {
        await updateFoundationProject(editingId, payload);
        toast.success("Project updated successfully");
      } else {
        await createFoundationProject(payload);
        toast.success("Project created successfully");
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
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      await deleteFoundationProject(id);
      toast.success("Deleted successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const filtered = data.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-lg shadow-primary-900/25">
            <HeartHandshake className="h-5 w-5" />
          </div> */}
          <div>
            <h1 className="font-display text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Foundation Projects
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage community initiatives and charitable projects.
            </p>
          </div>
        </div>
        <Button icon={Plus} onClick={openCreate}>
          Add Project
        </Button>
      </div>

      {/* Search bar */}
      <Card className="!p-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-2xl border border-gray-100 bg-white shadow-card dark:border-white/5 dark:bg-dark-850"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-14 text-center">
          <div className="rounded-2xl bg-primary-50 p-4 text-primary-900 dark:bg-primary-500/15 dark:text-primary-300">
            <FolderOpen className="h-7 w-7" />
          </div>
          <p className="font-medium text-gray-700 dark:text-gray-200">
            {searchTerm
              ? "No matching projects found"
              : "No foundation projects yet"}
          </p>
          <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
            {searchTerm
              ? "Try a different search term."
              : "Add the temple's first community initiative."}
          </p>
          {!searchTerm && (
            <Button icon={Plus} onClick={openCreate} className="mt-2">
              Add Project
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft dark:border-white/5 dark:bg-dark-850"
            >
              {item.imageUrl ? (
                <div className="relative h-36 overflow-hidden bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.parentElement.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute left-3 top-3 rounded-full bg-primary-900/85 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                    Project
                  </div>
                </div>
              ) : (
                <div className="flex h-36 items-center justify-center bg-gradient-to-br from-primary-900 to-primary-700">
                  <HeartHandshake className="h-10 w-10 text-accent-400" />
                </div>
              )}

              <div className="flex flex-1 flex-col gap-2 p-3">
                <div className="min-w-0">
                  <h3 className="truncate font-display text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {item.title}
                  </h3>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3 shrink-0" />
                      {formatDisplayDate(item.startDate)}
                    </span>
                    <span>→</span>
                    <span>{formatDisplayDate(item.endDate)}</span>
                  </div>
                </div>

                {item.description && (
                  <p className="line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-end gap-0.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-primary-50 hover:text-primary-900 dark:hover:bg-primary-500/15 dark:hover:text-primary-300"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Foundation Project" : "Add Foundation Project"}
        subtitle={
          editingId
            ? "Update the project details and save your changes."
            : "Create a new community initiative."
        }
        footer={
          <>
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="foundation-project-form"
              icon={Save}
              disabled={submitting}
            >
              {submitting ? "Saving..." : editingId ? "Update" : "Save"}
            </Button>
          </>
        }
      >
        <form
          id="foundation-project-form"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary-900 dark:border-gray-700 dark:bg-dark-850 dark:text-gray-100"
              rows="4"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="What is this project about?"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date
              </label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date
              </label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>
          <ImageUploadField
            label="Project Image"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            aspect="video"
          />
        </form>
      </Modal>
    </div>
  );
}
