import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadImage } from "../../api/uploads";
import toast from "react-hot-toast";

export default function MultiImageUploadField({
  label = "Photos",
  value = [],
  onChange,
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFilesChange = async (e) => {
    const files = Array.from(e.target.files || []);
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

    if (!validFiles.length) {
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const uploaded = await Promise.all(
        validFiles.map((file) => uploadImage(file).then((res) => res.data.url)),
      );
      onChange([...(value || []), ...uploaded]);
      toast.success(
        `${uploaded.length} photo${uploaded.length > 1 ? "s" : ""} uploaded`,
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Some uploads failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
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
            <img
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
          disabled={uploading}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/60 text-gray-400 transition-all duration-200 hover:border-primary-400 hover:bg-primary-50/50 hover:text-primary-700 disabled:opacity-60"
        >
          {uploading ? (
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

      {value.length > 0 && (
        <p className="mt-2 text-xs text-gray-400">
          {value.length} photo{value.length > 1 ? "s" : ""} ready
        </p>
      )}
    </div>
  );
}
