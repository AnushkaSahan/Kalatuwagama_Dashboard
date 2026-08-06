import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { getGalleryItem, updateGalleryItem } from "../../api/gallery";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import ImageUploadField from "../../components/common/ImageUploadField";
import toast from "react-hot-toast";

export default function GalleryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await getGalleryItem(id);
      setFormData({
        title: res.data.title || "",
        imageUrl: res.data.imageUrl || "",
        category: res.data.category || "",
      });
    } catch (error) {
      toast.error("Failed to load gallery item");
      navigate("/gallery");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      toast.error("Title and image are required");
      return;
    }
    setSubmitting(true);
    try {
      await updateGalleryItem(id, formData);
      toast.success("Image updated");
      navigate("/gallery");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="py-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/gallery")}
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">
          Edit Gallery Image
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              required
              autoFocus
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
            />
          </div>
          <div className="flex items-center gap-3 pt-4">
            <Button type="submit" icon={Save} disabled={submitting}>
              {submitting ? "Updating..." : "Update"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/gallery")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
