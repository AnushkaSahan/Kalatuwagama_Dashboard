import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadImage } from "../../api/uploads";
import { withFocalPoint } from "../../utils/focalPoint";
import ImagePositionModal from "./ImagePositionModal";
import FocalImage from "./FocalImage";
import toast from "react-hot-toast";

export default function MultiImageUploadField({
  label = "Photos",
  value = [],
  onChange,
  aspect = "video",
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [queue, setQueue] = useState([]); // remaining File objects to position/upload
  const [currentSrc, setCurrentSrc] = useState(null);
  const uploadedCountRef = useRef(0);

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 8 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 8MB`);
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;

    uploadedCountRef.current = 0;
    setQueue(validFiles.slice(1));
    setCurrentSrc(URL.createObjectURL(validFiles[0]));
  };

  const advanceQueue = () => {
    if (currentSrc) URL.revokeObjectURL(currentSrc);
    if (queue.length === 0) {
      setCurrentSrc(null);
      if (uploadedCountRef.current > 0) {
        toast.success(
          `${uploadedCountRef.current} photo${
            uploadedCountRef.current > 1 ? "s" : ""
          } uploaded`,
        );
      }
      return;
    }
    const [next, ...rest] = queue;
    setQueue(rest);
    setCurrentSrc(URL.createObjectURL(next));
  };

  const handlePositionConfirm = async (x, y, zoom) => {
    const fileBlob = currentSrc;
    setUploading(true);
    try {
      const res = await fetch(fileBlob);
      const blob = await res.blob();
      const file = new File([blob], "photo.jpg", {
        type: blob.type || "image/jpeg",
      });
      const uploadRes = await uploadImage(file);
      onChange([
        ...(value || []),
        withFocalPoint(uploadRes.data.url, x, y, zoom),
      ]);
      uploadedCountRef.current += 1;
    } catch (error) {
      toast.error(error.response?.data?.message || "Some uploads failed");
    } finally {
      setUploading(false);
      advanceQueue();
    }
  };

  const handleCancel = () => {
    advanceQueue();
  };

  const removeAt = (index) => {
    const next = [...value];
    next.splice(index, 1);
    onChange(next);
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
          >
            <FocalImage
              src={url}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="absolute right-1.5 top-1.5 rounded-lg bg-black/50 p-1 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
              title="Remove"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || Boolean(currentSrc)}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/60 text-gray-400 transition-all duration-200 hover:border-primary-400 hover:bg-primary-50/50 hover:text-primary-700 disabled:opacity-60"
        >
          {uploading || currentSrc ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <ImagePlus className="h-5 w-5" />
              <span className="text-[10px] font-medium">Add photos</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFilesChange}
      />

      {(value.length > 0 || queue.length > 0) && (
        <p className="mt-2 text-xs text-gray-400">
          {value.length} photo{value.length === 1 ? "" : "s"} ready
          {queue.length > 0 ? ` · ${queue.length + 1} remaining` : ""}
        </p>
      )}

      <ImagePositionModal
        open={Boolean(currentSrc)}
        imageSrc={currentSrc}
        aspect={aspect}
        onCancel={handleCancel}
        onConfirm={handlePositionConfirm}
      />
    </div>
  );
}
