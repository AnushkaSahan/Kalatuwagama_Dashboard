import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Clock3, Save } from "lucide-react";
import { getMonks, createMonk, updateMonk, deleteMonk } from "../../api/monks";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import ImageUploadField from "../../components/common/ImageUploadField";
import toast from "react-hot-toast";

const emptyForm = { name: "", position: "", biography: "", imageUrl: "" };

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
    .join("") || "M";

export default function MonkManagement() {
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
      const res = await getMonks();
      setData(res.data);
    } catch (error) {
      toast.error("Failed to load monks");
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
      biography: record.biography || "",
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
        await updateMonk(editingId, formData);
        toast.success("Monk profile updated");
      } else {
        await createMonk(formData);
        toast.success("Monk added");
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (editingId ? "Update failed" : "Creation failed"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this monk?")) return;
    try {
      await deleteMonk(id);
      toast.success("Deleted successfully");
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const filtered = data.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.position?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-gray-800">
            Monks
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage resident monks, their roles and biographies.
          </p>
        </div>
        <Button icon={Plus} onClick={openCreate}>
          Add Monk
        </Button>
      </div>

      <Card>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-56 animate-pulse rounded-2xl border border-gray-100 bg-white shadow-card"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-14 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-lg font-semibold text-primary-900">
            {searchTerm ? "?" : "M"}
          </div>
          <p className="font-medium text-gray-700">
            {searchTerm ? "No matching monks found" : "No monks added yet"}
          </p>
          <p className="max-w-sm text-sm text-gray-500">
            {searchTerm
              ? "Try a different search term."
              : "Add the resident monks so visitors can learn about them."}
          </p>
          {!searchTerm && (
            <Button icon={Plus} onClick={openCreate} className="mt-2">
              Add Monk
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => {
            const updated = timeAgo(item.updatedAt || item.createdAt);
            return (
              <div
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="flex items-start gap-4">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-primary-50"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-900 to-primary-700 text-lg font-semibold text-white ring-2 ring-primary-50">
                      {initials(item.name)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-lg font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    {item.position && (
                      <span className="mt-1 inline-block rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-medium text-accent-700">
                        {item.position}
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-500 line-clamp-3">
                  {item.biography || "No biography provided."}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock3 className="h-3.5 w-3.5" />
                    {updated ? `Updated ${updated}` : "No date"}
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
        title={editingId ? "Edit Monk Profile" : "Add Monk"}
        subtitle={
          editingId
            ? "Update the details below and save your changes."
            : "Add a resident monk's profile."
        }
        footer={
          <>
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="monk-form"
              icon={Save}
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : editingId
                  ? "Update Monk"
                  : "Save Monk"}
            </Button>
          </>
        }
      >
        <form id="monk-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Ven. Ambalangoda Sumana Thero"
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
              placeholder="e.g. Chief Incumbent"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Biography
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary-900"
              rows="5"
              value={formData.biography}
              onChange={(e) =>
                setFormData({ ...formData, biography: e.target.value })
              }
              placeholder="Share their background and role at the temple..."
            />
          </div>

          <ImageUploadField
            label="Monk Image"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            aspect="circle"
          />
        </form>
      </Modal>
    </div>
  );
}
