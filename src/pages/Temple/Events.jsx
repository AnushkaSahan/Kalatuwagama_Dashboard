import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  MapPin,
  Save,
  CalendarOff,
} from "lucide-react";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../api/events";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import ImageUploadField from "../../components/common/ImageUploadField";
import toast from "react-hot-toast";

const emptyForm = {
  title: "",
  description: "",
  location: "",
  eventDate: "",
  imageUrl: "",
  imageFit: "cover",
};

// The backend stores eventDate as a zone-naive LocalDateTime string
// (e.g. "2026-08-20T10:00:00") — a plain wall-clock value with no
// timezone attached. Never round-trip it through `new Date(...).toISOString()`
// or `getTimezoneOffset()` math: that silently shifts the time (and
// sometimes the date) by the browser's UTC offset. Just pass the digits
// through as strings, and parse manually for display.

// Backend "2026-08-20T10:00:00" -> datetime-local input "2026-08-20T10:00"
const toLocalInput = (value) => {
  if (!value) return "";
  return String(value).slice(0, 16);
};

const parseLocalDateTime = (value) => {
  if (!value) return null;
  const [datePart, timePart = "00:00:00"] = String(value).split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  if (!year || !month || !day) return null;
  const [hour = 0, minute = 0] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute);
};

const dateParts = (value) => {
  const date = parseLocalDateTime(value);
  if (!date) return { month: "—", day: "—", time: "" };
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }),
    day: date.toLocaleDateString("en-US", { day: "2-digit" }),
    time: date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
  };
};

export default function Events() {
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
      const res = await getEvents();
      const sorted = [...res.data].sort(
        (a, b) =>
          (parseLocalDateTime(a.eventDate)?.getTime() || 0) -
          (parseLocalDateTime(b.eventDate)?.getTime() || 0),
      );
      setData(sorted);
    } catch (error) {
      toast.error("Failed to load events");
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
      location: record.location || "",
      eventDate: toLocalInput(record.eventDate),
      imageUrl: record.imageUrl || "",
      imageFit: record.imageFit || "cover",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.eventDate) {
      toast.error("Title and date are required");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        // Send the wall-clock value straight through — no UTC conversion.
        eventDate: formData.eventDate
          ? `${formData.eventDate}:00`
          : formData.eventDate,
      };
      if (editingId) {
        await updateEvent(editingId, payload);
        toast.success("Event updated");
      } else {
        await createEvent(payload);
        toast.success("Event created");
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
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id);
      toast.success("Deleted successfully");
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const filtered = data.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-gray-800">
            Events
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Plan and manage temple events and programs.
          </p>
        </div>
        <Button icon={Plus} onClick={openCreate}>
          Add Event
        </Button>
      </div>

      <Card>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by title or location..."
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
              className="h-28 animate-pulse rounded-2xl border border-gray-100 bg-white shadow-card"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-14 text-center">
          <div className="rounded-2xl bg-primary-50 p-4 text-primary-900">
            <CalendarOff className="h-7 w-7" />
          </div>
          <p className="font-medium text-gray-700">
            {searchTerm
              ? "No matching events found"
              : "No events scheduled yet"}
          </p>
          <p className="max-w-sm text-sm text-gray-500">
            {searchTerm
              ? "Try a different search term."
              : "Add the temple's next program or celebration."}
          </p>
          {!searchTerm && (
            <Button icon={Plus} onClick={openCreate} className="mt-2">
              Add Event
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => {
            const isPast =
              (parseLocalDateTime(item.eventDate)?.getTime() || 0) < Date.now();
            const { month, day, time, weekday } = dateParts(item.eventDate);

            return (
              <div
                key={item.id}
                className={`group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft ${
                  isPast ? "opacity-70" : ""
                }`}
              >
                {item.imageUrl && (
                  <div className="relative h-36 overflow-hidden bg-gray-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className={`h-full w-full ${
                        item.imageFit === "contain"
                          ? "object-contain"
                          : "object-cover"
                      } transition-transform duration-300 group-hover:scale-105`}
                      onError={(e) => {
                        e.currentTarget.parentElement.style.display = "none";
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    <div
                      className={`absolute left-3 top-3 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                        isPast
                          ? "bg-white/85 text-gray-700"
                          : "bg-primary-900/85 text-white"
                      }`}
                    >
                      {month} {day}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-sm font-semibold text-gray-800">
                        {item.title}
                      </h3>

                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-500">
                        <span>{time}</span>

                        {item.location && (
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {item.location}
                          </span>
                        )}

                        <span>{weekday}</span>
                      </div>
                    </div>

                    {isPast && (
                      <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-gray-500">
                        Past
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-0.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="rounded-md p-1.5 text-gray-400 hover:bg-primary-50 hover:text-primary-900"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
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
        title={editingId ? "Edit Event" : "Add Event"}
        subtitle={
          editingId
            ? "Update the details below and save your changes."
            : "Schedule a new temple event or program."
        }
        footer={
          <>
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="event-form"
              icon={Save}
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : editingId
                  ? "Update Event"
                  : "Save Event"}
            </Button>
          </>
        }
      >
        <form id="event-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Vesak Day Celebration"
              required
              autoFocus
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Event Date & Time *
              </label>
              <Input
                type="datetime-local"
                value={formData.eventDate}
                onChange={(e) =>
                  setFormData({ ...formData, eventDate: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Location
              </label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g. Main Shrine"
              />
            </div>
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
              placeholder="What should visitors know about this event?"
            />
          </div>

          <ImageUploadField
            label="Event Image"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            fit={formData.imageFit}
            onFitChange={(fit) => setFormData({ ...formData, imageFit: fit })}
            aspect="video"
          />
        </form>
      </Modal>
    </div>
  );
}
