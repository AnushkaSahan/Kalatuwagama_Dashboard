import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { getMonk, updateMonk } from "../../api/monks";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import ImageUploadField from "../../components/common/ImageUploadField";
import toast from "react-hot-toast";

export default function MonkEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    biography: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await getMonk(id);
      setFormData({
        name: res.data.name || "",
        position: res.data.position || "",
        biography: res.data.biography || "",
        imageUrl: res.data.imageUrl || "",
      });
    } catch (error) {
      toast.error("Failed to load monk");
      navigate("/monks");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSubmitting(true);
    try {
      await updateMonk(id, formData);
      toast.success("Monk updated");
      navigate("/monks");
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
          onClick={() => navigate("/monks")}
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">Edit Monk</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            />
          </div>
          <ImageUploadField
            label="Monk Image"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            aspect="circle"
          />
          <div className="flex items-center gap-3 pt-4">
            <Button type="submit" icon={Save} disabled={submitting}>
              {submitting ? "Updating..." : "Update"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/monks")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
