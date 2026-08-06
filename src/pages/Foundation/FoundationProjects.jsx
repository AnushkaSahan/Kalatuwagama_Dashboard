import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Save } from "lucide-react";
import {
  getFoundationProjects,
  createFoundationProject,
  updateFoundationProject,
  deleteFoundationProject,
} from "../../api/foundationProjects";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
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

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Start Date", accessor: "startDate" },
    { header: "End Date", accessor: "endDate" },
    {
      header: "Image",
      accessor: "imageUrl",
      cell: (url) =>
        url ? (
          <img
            src={url}
            alt="project"
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
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
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Foundation Projects
        </h1>
        <Button icon={Plus} onClick={openCreate}>
          Add Project
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
        title={editingId ? "Edit Foundation Project" : "Add Foundation Project"}
        subtitle={
          editingId
            ? "Update the project details and save your changes."
            : "Create a project from the Projects page."
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
            <label className="mb-1 block text-sm font-medium text-gray-700">
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
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary-900"
              rows="4"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
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
              <label className="mb-1 block text-sm font-medium text-gray-700">
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
