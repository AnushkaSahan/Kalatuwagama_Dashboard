import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Save, Megaphone } from "lucide-react";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../api/announcements";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import toast from "react-hot-toast";

const emptyForm = { title: "", description: "", publishDate: "" };

// The backend stores publishDate as a zone-naive LocalDateTime string
// (e.g. "2026-08-20T10:00:00") — it's a plain wall-clock value with no
// timezone attached. Never round-trip it through `new Date(...).toISOString()`
// or `getTimezoneOffset()` math: that silently shifts the time (and
// sometimes the date) by the browser's UTC offset. Just pass the digits
// through as strings.

// Backend "2026-08-20T10:00:00" -> datetime-local input "2026-08-20T10:00"
const toLocalInput = (value) => {
  if (!value) return "";
  return String(value).slice(0, 16);
};

// Parse the zone-naive string manually into a local Date for display only
// (never re-serialized), so no timezone conversion happens.
const parseLocalDateTime = (value) => {
  if (!value) return null;
  const [datePart, timePart = "00:00:00"] = String(value).split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  if (!year || !month || !day) return null;
  const [hour = 0, minute = 0] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute);
};

const formatDate = (value) => {
  const date = parseLocalDateTime(value);
  if (!date) return "No date";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function Announcements() {
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
      const res = await getAnnouncements();
      const sorted = [...res.data].sort(
        (a, b) =>
          (parseLocalDateTime(b.publishDate)?.getTime() || 0) -
          (parseLocalDateTime(a.publishDate)?.getTime() || 0),
      );
      setData(sorted);
    } catch (error) {
      toast.error("Failed to load announcements");
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
      publishDate: toLocalInput(record.publishDate),
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.publishDate) {
      toast.error("Title and publish date are required");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        // Send the wall-clock value straight through — no UTC conversion.
        // formData.publishDate is "YYYY-MM-DDTHH:mm" from the datetime-local
        // input, which the backend's LocalDateTime parses correctly as-is.
        publishDate: formData.publishDate
          ? `${formData.publishDate}:00`
          : formData.publishDate,
      };
      if (editingId) {
        await updateAnnouncement(editingId, payload);
        toast.success("Announcement updated");
      } else {
        await createAnnouncement(payload);
        toast.success("Announcement published");
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
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;
    try {
      await deleteAnnouncement(id);
      toast.success("Deleted successfully");
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const filtered = data.filter((item) =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-gray-800">
            Announcements
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Publish notices and updates for the temple community.
          </p>
        </div>
        <Button icon={Plus} onClick={openCreate}>
          Add Announcement
        </Button>
      </div>

      <Card>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-2xl border border-gray-100 bg-white shadow-card"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-14 text-center">
          <div className="rounded-2xl bg-primary-50 p-4 text-primary-900">
            <Megaphone className="h-7 w-7" />
          </div>
          <p className="font-medium text-gray-700">
            {searchTerm
              ? "No matching announcements found"
              : "No announcements published yet"}
          </p>
          <p className="max-w-sm text-sm text-gray-500">
            {searchTerm
              ? "Try a different search term."
              : "Share news and updates with the temple community."}
          </p>
          {!searchTerm && (
            <Button icon={Plus} onClick={openCreate} className="mt-2">
              Add Announcement
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const isFuture =
              (parseLocalDateTime(item.publishDate)?.getTime() || 0) >
              Date.now();
            return (
              <div
                key={item.id}
                className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-card transition-all duration-200 hover:shadow-soft"
              >
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                  <Megaphone className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    {isFuture && (
                      <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary-900">
                        Scheduled
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {item.description || "No description provided."}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {formatDate(item.publishDate)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
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
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Announcement" : "Add Announcement"}
        subtitle={
          editingId
            ? "Update the details below and save your changes."
            : "Publish a new notice for the community."
        }
        footer={
          <>
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="announcement-form"
              icon={Save}
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : editingId
                  ? "Update Announcement"
                  : "Publish Announcement"}
            </Button>
          </>
        }
      >
        <form
          id="announcement-form"
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
              placeholder="e.g. Temple closed for renovation"
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
              placeholder="Write the announcement details..."
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
        </form>
      </Modal>
    </div>
  );
}
