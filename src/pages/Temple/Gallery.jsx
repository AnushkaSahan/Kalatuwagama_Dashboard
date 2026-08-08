import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Save,
  Images,
  X,
  Calendar,
  ImagePlus,
} from "lucide-react";
import {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../../api/gallery";
import { getEvents } from "../../api/events";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import MultiImageUploadField from "../../components/common/MultiImageUploadField";
import ImageUploadField from "../../components/common/ImageUploadField";
import toast from "react-hot-toast";

const formatEventDate = (value) => {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Upload flow (pick event -> add multiple photos)
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadEventId, setUploadEventId] = useState("");
  const [lockEventPicker, setLockEventPicker] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("");
  const [uploadUrls, setUploadUrls] = useState([]);
  const [uploadSubmitting, setUploadSubmitting] = useState(false);

  // Album detail view
  const [activeAlbumId, setActiveAlbumId] = useState(null);

  // Per-photo edit
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    imageUrl: "",
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [galleryRes, eventsRes] = await Promise.all([
        getGalleryItems(),
        getEvents(),
      ]);
      setPhotos(galleryRes.data);
      setEvents(eventsRes.data);
    } catch (error) {
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  const albums = useMemo(() => {
    const list = events.map((event) => {
      const eventPhotos = photos
        .filter((photo) => photo.eventId === event.id)
        .sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
      const lastActivity = eventPhotos[0]?.createdAt || event.eventDate;
      return { event, photos: eventPhotos, lastActivity };
    });
    return list.sort(
      (a, b) => new Date(b.lastActivity || 0) - new Date(a.lastActivity || 0),
    );
  }, [photos, events]);

  const filteredAlbums = albums.filter((album) =>
    album.event.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const activeAlbum = albums.find((a) => a.event.id === activeAlbumId);

  // --- Upload flow ---

  const openUpload = (eventId = "") => {
    setUploadEventId(eventId);
    setLockEventPicker(Boolean(eventId));
    setUploadCategory("");
    setUploadUrls([]);
    setUploadOpen(true);
  };

  const closeUpload = () => {
    if (uploadSubmitting) return;
    setUploadOpen(false);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadEventId) {
      toast.error("Please select an event first");
      return;
    }
    if (uploadUrls.length === 0) {
      toast.error("Add at least one photo");
      return;
    }
    setUploadSubmitting(true);
    try {
      await Promise.all(
        uploadUrls.map((imageUrl) =>
          createGalleryItem({
            eventId: uploadEventId,
            imageUrl,
            title: "",
            category: uploadCategory,
          }),
        ),
      );
      toast.success(
        `${uploadUrls.length} photo${uploadUrls.length > 1 ? "s" : ""} added`,
      );
      setUploadOpen(false);
      setActiveAlbumId(uploadEventId);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploadSubmitting(false);
    }
  };

  // --- Per-photo edit / delete ---

  const openEditPhoto = (photo) => {
    setEditingPhoto(photo);
    setEditForm({
      title: photo.title || "",
      category: photo.category || "",
      imageUrl: photo.imageUrl || "",
    });
  };

  const closeEditPhoto = () => {
    if (editSubmitting) return;
    setEditingPhoto(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    try {
      await updateGalleryItem(editingPhoto.id, {
        ...editForm,
        eventId: editingPhoto.eventId,
      });
      toast.success("Photo updated");
      setEditingPhoto(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeletePhoto = async (id) => {
    if (!window.confirm("Delete this photo?")) return;
    try {
      await deleteGalleryItem(id);
      toast.success("Photo deleted");
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-gray-800">
            Gallery
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Photos organized by temple event — pick an event, then add its
            photos.
          </p>
        </div>
        <Button
          icon={Plus}
          onClick={() => openUpload()}
          disabled={events.length === 0}
        >
          Add Photos
        </Button>
      </div>

      <Card>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by event name..."
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
      ) : events.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-14 text-center">
          <div className="rounded-2xl bg-primary-50 p-4 text-primary-900">
            <Calendar className="h-7 w-7" />
          </div>
          <p className="font-medium text-gray-700">No events yet</p>
          <p className="max-w-sm text-sm text-gray-500">
            Gallery photos are organized under events. Create an event first,
            then come back here to add its photos.
          </p>
          <Link to="/events">
            <Button icon={Plus} className="mt-2">
              Go to Events
            </Button>
          </Link>
        </Card>
      ) : filteredAlbums.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-14 text-center">
          <div className="rounded-2xl bg-primary-50 p-4 text-primary-900">
            <Images className="h-7 w-7" />
          </div>
          <p className="font-medium text-gray-700">No matching events</p>
          <p className="max-w-sm text-sm text-gray-500">
            Try a different search term.
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredAlbums.map((album) => {
            const cover = album.photos[0];
            return (
              <div
                key={album.event.id}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-soft"
                onClick={() =>
                  album.photos.length > 0
                    ? setActiveAlbumId(album.event.id)
                    : openUpload(album.event.id)
                }
              >
                <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                  {cover ? (
                    <img
                      src={cover.imageUrl}
                      alt={album.event.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-primary-50 to-accent-50 text-primary-900/40">
                      <ImagePlus className="h-7 w-7" />
                      <span className="text-xs font-medium">Add photos</span>
                    </div>
                  )}
                  {album.photos.length > 0 && (
                    <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                      {album.photos.length} photo
                      {album.photos.length > 1 ? "s" : ""}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-display text-base font-semibold text-gray-800">
                    {album.event.title}
                  </h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatEventDate(album.event.eventDate || album.event.date)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Album detail modal */}
      <Modal
        open={Boolean(activeAlbum)}
        onClose={() => setActiveAlbumId(null)}
        title={activeAlbum?.event.title}
        subtitle={
          activeAlbum
            ? formatEventDate(
                activeAlbum.event.eventDate || activeAlbum.event.date,
              )
            : ""
        }
        maxWidth="max-w-3xl"
        footer={
          <Button
            icon={Plus}
            onClick={() => {
              setActiveAlbumId(null);
              openUpload(activeAlbum.event.id);
            }}
          >
            Add More Photos
          </Button>
        }
      >
        {activeAlbum?.photos.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-gray-500">
            <Images className="h-7 w-7 text-gray-300" />
            No photos added to this event yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {activeAlbum?.photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square overflow-hidden rounded-xl border border-gray-100 bg-gray-100"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title || activeAlbum.event.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 flex items-start justify-end gap-1 bg-black/0 p-1.5 opacity-0 transition-opacity duration-150 group-hover:bg-black/20 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => openEditPhoto(photo)}
                    className="rounded-lg bg-white/90 p-1.5 text-gray-700 backdrop-blur hover:bg-white"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="rounded-lg bg-white/90 p-1.5 text-red-600 backdrop-blur hover:bg-white"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Upload modal: pick event (if not locked) + add multiple photos */}
      <Modal
        open={uploadOpen}
        onClose={closeUpload}
        title="Add Photos"
        subtitle="Select the event these photos belong to, then upload as many as you like."
        footer={
          <>
            <Button type="button" variant="ghost" onClick={closeUpload}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="gallery-upload-form"
              icon={Save}
              disabled={uploadSubmitting}
            >
              {uploadSubmitting
                ? "Saving..."
                : `Save ${uploadUrls.length || ""} Photo${
                    uploadUrls.length === 1 ? "" : "s"
                  }`}
            </Button>
          </>
        }
      >
        <form
          id="gallery-upload-form"
          onSubmit={handleUploadSubmit}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Event *
            </label>
            {lockEventPicker ? (
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                <Calendar className="h-4 w-4 text-primary-900" />
                {events.find((ev) => ev.id === uploadEventId)?.title ||
                  "Selected event"}
              </div>
            ) : (
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary-900"
                value={uploadEventId}
                onChange={(e) => setUploadEventId(e.target.value)}
                required
              >
                <option value="">Select an event...</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title} — {formatEventDate(event.eventDate)}
                  </option>
                ))}
              </select>
            )}
          </div>

          <MultiImageUploadField
            label="Photos *"
            value={uploadUrls}
            onChange={setUploadUrls}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category (applied to all)
            </label>
            <Input
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              placeholder="e.g. Architecture, Ceremony"
            />
          </div>
        </form>
      </Modal>

      {/* Per-photo edit modal */}
      <Modal
        open={Boolean(editingPhoto)}
        onClose={closeEditPhoto}
        title="Edit Photo"
        footer={
          <>
            <Button type="button" variant="ghost" onClick={closeEditPhoto}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="gallery-edit-form"
              icon={Save}
              disabled={editSubmitting}
            >
              {editSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </>
        }
      >
        <form
          id="gallery-edit-form"
          onSubmit={handleEditSubmit}
          className="space-y-4"
        >
          <ImageUploadField
            label="Image"
            value={editForm.imageUrl}
            onChange={(url) => setEditForm({ ...editForm, imageUrl: url })}
            aspect="video"
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Caption
            </label>
            <Input
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              placeholder="Optional caption for this photo"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>
            <Input
              value={editForm.category}
              onChange={(e) =>
                setEditForm({ ...editForm, category: e.target.value })
              }
              placeholder="e.g. Architecture, Ceremony"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
