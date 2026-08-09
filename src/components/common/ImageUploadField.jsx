import { useRef, useState } from "react";
import {
  Upload,
  Link as LinkIcon,
  X,
  Loader2,
  ImageIcon,
  Move,
} from "lucide-react";
import { uploadImage } from "../../api/uploads";
import { withFocalPoint } from "../../utils/focalPoint";
import ImagePositionModal from "./ImagePositionModal";
import FocalImage from "./FocalImage";
import toast from "react-hot-toast";

const boxSize = {
  circle: "h-24 w-24 rounded-full",
  square: "aspect-square w-full max-w-[220px] rounded-xl",
  video: "aspect-video w-full rounded-xl",
};

export default function ImageUploadField({
  label = "Image",
  value,
  onChange,
  aspect = "video",
  required = false,
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [positionSrc, setPositionSrc] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);

  const size = boxSize[aspect] || boxSize.video;
  const rounded = aspect === "circle" ? "rounded-full" : "rounded-xl";

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be smaller than 8MB");
      return;
    }

    setPendingFile(file);
    setPositionSrc(URL.createObjectURL(file));
  };

  const closePositionModal = () => {
    if (positionSrc) URL.revokeObjectURL(positionSrc);
    setPositionSrc(null);
    setPendingFile(null);
  };

  const handlePositionConfirm = async (x, y, zoom) => {
    const file = pendingFile;
    closePositionModal();
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadImage(file);
      onChange(withFocalPoint(res.data.url, x, y, zoom));
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && "*"}
      </label>

      {value ? (
        <div
          className={`group relative ${size} overflow-hidden border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-dark-900`}
        >
          <FocalImage
            src={value}
            alt="Preview"
            className={`h-full w-full object-cover ${rounded}`}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="absolute inset-0 flex items-start justify-end gap-1 p-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => {
                setPendingFile(null);
                setPositionSrc(value);
              }}
              className="rounded-lg bg-black/50 p-1.5 text-white backdrop-blur hover:bg-black/70"
              title="Adjust what shows"
            >
              <Move className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-lg bg-black/50 p-1.5 text-white backdrop-blur hover:bg-black/70"
              title="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={`flex ${size} flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/60 text-gray-400 transition-all duration-200 hover:border-primary-400 hover:bg-primary-50/50 hover:text-primary-700 dark:border-gray-700 dark:bg-dark-900 dark:text-gray-500 dark:hover:border-primary-500/60 dark:hover:bg-primary-500/10 dark:hover:text-primary-400`}
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <ImageIcon className="h-5 w-5" />
              <span className="text-xs font-medium">Choose file to upload</span>
            </>
          )}
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-900 hover:underline disabled:opacity-50 dark:text-primary-400"
        >
          <Upload className="h-3.5 w-3.5" />
          {uploading ? "Uploading..." : value ? "Replace file" : "Choose file"}
        </button>
        {value && (
          <>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <button
              type="button"
              onClick={() => {
                setPendingFile(null);
                setPositionSrc(value);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              <Move className="h-3.5 w-3.5" />
              Adjust position
            </button>
          </>
        )}
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <button
          type="button"
          onClick={() => setShowUrlInput((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <LinkIcon className="h-3.5 w-3.5" />
          Use image URL
        </button>
      </div>

      {showUrlInput && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary-900 dark:border-gray-600 dark:bg-dark-850 dark:text-gray-100 dark:placeholder-gray-500"
        />
      )}

      <ImagePositionModal
        open={Boolean(positionSrc)}
        imageSrc={positionSrc}
        aspect={aspect}
        onCancel={closePositionModal}
        onConfirm={(x, y, zoom) => {
          if (pendingFile) {
            handlePositionConfirm(x, y, zoom);
          } else {
            // Repositioning an already-uploaded image — no re-upload needed
            onChange(withFocalPoint(value, x, y, zoom));
            closePositionModal();
          }
        }}
      />
    </div>
  );
}
