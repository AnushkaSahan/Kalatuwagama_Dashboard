import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { createGalleryItem } from "../../api/gallery";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import ImageUploadField from "../../components/common/ImageUploadField";
import toast from "react-hot-toast";

export default function GalleryCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      toast.error("Title and image are required");
      return;
    }
    setLoading(true);
    try {
      await createGalleryItem(formData);
      toast.success("Added to gallery");
      navigate("/gallery");
    } catch (error) {
      toast.error(error.response?.data?.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

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
          Add Gallery Image
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
              placeholder="e.g. Main shrine at dusk"
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
              placeholder="e.g. Architecture, Events"
            />
          </div>
          <div className="flex items-center gap-3 pt-4">
            <Button type="submit" icon={Save} disabled={loading}>
              {loading ? "Saving..." : "Save"}
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
