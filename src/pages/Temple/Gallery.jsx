import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, Save, Images, X } from "lucide-react";
import {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../../api/gallery";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import ImageUploadField from "../../components/common/ImageUploadField";
import toast from "react-hot-toast";

const emptyForm = { title: "", imageUrl: "", category: "" };

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

export default function Gallery() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getGalleryItems();
      setData(res.data);
    } catch (error) {
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(data.map((item) => item.category).filter(Boolean)),
    );
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
      title: record.title || "",
      imageUrl: record.imageUrl || "",
      category: record.category || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      toast.error("Title and image are required");
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await updateGalleryItem(editingId, formData);
        toast.success("Image updated");
      } else {
        await createGalleryItem(formData);
        toast.success("Added to gallery");
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
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteGalleryItem(id);
      toast.success("Deleted successfully");
      setData((prev) => prev.filter((item) => item.id !== id));
      setPreview((prev) => (prev?.id === id ? null : prev));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const filtered = data.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-gray-800">
            Gallery
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Curate photos of the temple, events, and community life.
          </p>
        </div>
        <Button icon={Plus} onClick={openCreate}>
          Add Image
        </Button>
      </div>

      <Card>
        <div className="flex flex-col gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-primary-900 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="aspect-square animate-pulse rounded-2xl border border-gray-100 bg-white shadow-card"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-14 text-center">
          <div className="rounded-2xl bg-primary-50 p-4 text-primary-900">
            <Images className="h-7 w-7" />
          </div>
          <p className="font-medium text-gray-700">
            {searchTerm || activeCategory !== "All"
              ? "No matching images found"
              : "No images uploaded yet"}
          </p>
          <p className="max-w-sm text-sm text-gray-500">
            {searchTerm || activeCategory !== "All"
              ? "Try a different search or category."
              : "Add photos to showcase the temple and its activities."}
          </p>
          {!searchTerm && activeCategory === "All" && (
            <Button icon={Plus} onClick={openCreate} className="mt-2">
              Add Image
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => {
            const added = timeAgo(item.createdAt);
            return (
              <div
                key={item.id}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-[1.5rem] border border-gray-100 bg-gray-100 shadow-card ring-1 ring-transparent transition-all duration-200 hover:-translate-y-1 hover:shadow-soft hover:ring-primary-200"
                onClick={() => setPreview(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 text-white transition-transform duration-200 group-hover:translate-y-0">
                  <div className="flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {item.title}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        {item.category && (
                          <span className="inline-block rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                            {item.category}
                          </span>
                        )}
                        {added && (
                          <span className="inline-block rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur">
                            Added {added}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(item);
                        }}
                        className="rounded-lg bg-white/15 p-1.5 text-white backdrop-blur transition-colors hover:bg-white/25"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="rounded-lg bg-white/15 p-1.5 text-white backdrop-blur transition-colors hover:bg-red-500/80"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox preview */}
      {preview && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-10"
          onClick={() => setPreview(null)}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="absolute right-5 top-5 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="relative z-10 flex max-h-full max-w-4xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={preview.imageUrl}
              alt={preview.title}
              className="max-h-[75vh] w-auto rounded-2xl object-contain shadow-2xl"
            />
            <div className="mt-4 flex items-center gap-3 text-center text-white">
              <p className="font-display text-lg font-semibold">
                {preview.title}
              </p>
              {preview.category && (
                <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium backdrop-blur">
                  {preview.category}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Gallery Image" : "Add Gallery Image"}
        subtitle={
          editingId
            ? "Update the details below and save your changes."
            : "Add a new photo to the gallery."
        }
        footer={
          <>
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="gallery-form"
              icon={Save}
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : editingId
                  ? "Update Image"
                  : "Save Image"}
            </Button>
          </>
        }
      >
        <form id="gallery-form" onSubmit={handleSubmit} className="space-y-4">
          <ImageUploadField
            label="Image"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            aspect="video"
            required
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Main shrine at dusk"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>
            <Input
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              placeholder="e.g. Architecture, Events"
              list="gallery-categories"
            />
            <datalist id="gallery-categories">
              {categories
                .filter((c) => c !== "All")
                .map((c) => (
                  <option key={c} value={c} />
                ))}
            </datalist>
          </div>
        </form>
      </Modal>
    </div>
  );
}
