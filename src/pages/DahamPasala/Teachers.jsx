import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Save } from "lucide-react";
import {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../../api/teachers";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import ImageUploadField from "../../components/common/ImageUploadField";
import toast from "react-hot-toast";

const emptyForm = {
  name: "",
  position: "",
  phone: "",
  imageUrl: "",
};

export default function Teachers() {
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
      const res = await getTeachers();
      setData(res.data);
    } catch (error) {
      toast.error("Failed to load teachers");
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
      name: record.name || "",
      position: record.position || "",
      phone: record.phone || "",
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
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateTeacher(editingId, formData);
        toast.success("Teacher updated successfully");
      } else {
        await createTeacher(formData);
        toast.success("Teacher created successfully");
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
    if (!window.confirm("Are you sure you want to delete this teacher?"))
      return;
    try {
      await deleteTeacher(id);
      toast.success("Deleted successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Position", accessor: "position" },
    { header: "Phone", accessor: "phone" },
    {
      header: "Image",
      accessor: "imageUrl",
      cell: (url) =>
        url ? (
          <img
            src={url}
            alt="teacher"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
            No img
          </div>
        ),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (id) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openEdit(data.find((item) => item.id === id))}
            className="rounded p-1 hover:bg-gray-100"
          >
            <Pencil className="w-4 h-4 text-gray-600" />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(id)}
            className="rounded p-1 text-danger hover:bg-gray-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const filtered = data.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone?.includes(searchTerm),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Teachers</h1>
        <Button icon={Plus} onClick={openCreate}>
          Add Teacher
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Teacher" : "Add Teacher"}
        subtitle={
          editingId
            ? "Update the teacher details and save your changes."
            : "Create a teacher profile from this page."
        }
        footer={
          <>
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="teacher-form"
              icon={Save}
              disabled={submitting}
            >
              {submitting ? "Saving..." : editingId ? "Update" : "Save"}
            </Button>
          </>
        }
      >
        <form id="teacher-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Position
            </label>
            <Input
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              placeholder="e.g. Principal, Assistant Teacher"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone
            </label>
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="0712345678"
            />
          </div>
          <ImageUploadField
            label="Teacher Image"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            aspect="circle"
          />
        </form>
      </Modal>
    </div>
  );
}
