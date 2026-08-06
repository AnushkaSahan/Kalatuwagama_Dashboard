import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { getAnnouncement, updateAnnouncement } from "../../api/announcements";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import toast from "react-hot-toast";

const toLocalInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
};

export default function AnnouncementEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    publishDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await getAnnouncement(id);
      setFormData({
        title: res.data.title || "",
        description: res.data.description || "",
        publishDate: toLocalInput(res.data.publishDate),
      });
    } catch (error) {
      toast.error("Failed to load announcement");
      navigate("/announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.publishDate) {
      toast.error("Title and publish date are required");
      return;
    }
    setSubmitting(true);
    try {
      await updateAnnouncement(id, {
        ...formData,
        publishDate: new Date(formData.publishDate).toISOString(),
      });
      toast.success("Announcement updated");
      navigate("/announcements");
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
          onClick={() => navigate("/announcements")}
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">
          Edit Announcement
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              rows="5"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Publish Date & Time *
            </label>
            <Input
              type="datetime-local"
              value={formData.publishDate}
              onChange={(e) =>
                setFormData({ ...formData, publishDate: e.target.value })
              }
              required
            />
          </div>
          <div className="flex items-center gap-3 pt-4">
            <Button type="submit" icon={Save} disabled={submitting}>
              {submitting ? "Updating..." : "Update"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/announcements")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
