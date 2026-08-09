import { useRef, useState } from "react";
import { Check, Move, RotateCcw, X } from "lucide-react";
import Button from "./Button";

// On-screen preview frame per aspect (matches how it will actually display)
const FRAME = {
  circle: { w: 260, h: 260, shape: "rounded-full" },
  square: { w: 260, h: 260, shape: "rounded-2xl" },
  video: { w: 320, h: 180, shape: "rounded-2xl" },
};

const CORNERS = [
  { key: "tl", style: { left: -7, top: -7, cursor: "nwse-resize" } },
  { key: "tr", style: { right: -7, top: -7, cursor: "nesw-resize" } },
  { key: "bl", style: { left: -7, bottom: -7, cursor: "nesw-resize" } },
  { key: "br", style: { right: -7, bottom: -7, cursor: "nwse-resize" } },
];

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

export default function ImagePositionModal({
  open,
  imageSrc,
  aspect = "video",
  onCancel,
  onConfirm,
}) {
  const frame = FRAME[aspect] || FRAME.video;
  const frameRef = useRef(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [zoom, setZoom] = useState(1);
  const panState = useRef(null);
  const resizeState = useRef(null);

  if (!open) return null;

  const frameCenter = () => {
    const rect = frameRef.current?.getBoundingClientRect();
    return rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: 0, y: 0 };
  };

  // --- Pan (drag anywhere inside the frame) ---
  const handlePanStart = (e) => {
    panState.current = { startX: e.clientX, startY: e.clientY, ...position };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePanMove = (e) => {
    if (!panState.current) return;
    const dx = e.clientX - panState.current.startX;
    const dy = e.clientY - panState.current.startY;
    setPosition({
      x: Math.min(100, Math.max(0, panState.current.x - (dx / frame.w) * 100)),
      y: Math.min(100, Math.max(0, panState.current.y - (dy / frame.h) * 100)),
    });
  };

  const handlePanEnd = () => {
    panState.current = null;
  };

  // --- Resize (drag a corner handle to zoom in/out) ---
  const handleResizeStart = (e) => {
    e.stopPropagation();
    const center = frameCenter();
    const dist = Math.hypot(e.clientX - center.x, e.clientY - center.y) || 1;
    resizeState.current = { startDist: dist, startZoom: zoom, center };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleResizeMove = (e) => {
    if (!resizeState.current) return;
    const { startDist, startZoom, center } = resizeState.current;
    const dist = Math.hypot(e.clientX - center.x, e.clientY - center.y) || 1;
    const nextZoom = Math.min(
      MAX_ZOOM,
      Math.max(MIN_ZOOM, startZoom * (dist / startDist)),
    );
    setZoom(nextZoom);
  };

  const handleResizeEnd = () => {
    resizeState.current = null;
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 50, y: 50 });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
      <div className="relative flex w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-gray-800">
              Choose what shows
            </h2>
            <p className="text-xs text-gray-500">
              Drag a corner to zoom, drag the photo to reposition it.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 p-5">
          <div className="relative" style={{ width: frame.w, height: frame.h }}>
            <div
              ref={frameRef}
              className={`relative h-full w-full touch-none select-none overflow-hidden bg-gray-900 ${frame.shape}`}
              style={{ cursor: "grab" }}
              onPointerDown={handlePanStart}
              onPointerMove={handlePanMove}
              onPointerUp={handlePanEnd}
              onPointerLeave={handlePanEnd}
            >
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img
                src={imageSrc}
                draggable={false}
                className="h-full w-full select-none object-cover"
                style={{
                  objectPosition: `${position.x}% ${position.y}%`,
                  transform: `scale(${zoom})`,
                  transformOrigin: `${position.x}% ${position.y}%`,
                }}
              />
              <div className="pointer-events-none absolute inset-0 border-2 border-white/70" />
            </div>

            {/* Corner resize handles */}
            {CORNERS.map((corner) => (
              <div
                key={corner.key}
                onPointerDown={handleResizeStart}
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
                onPointerLeave={handleResizeEnd}
                className="absolute z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary-900 bg-white shadow-md touch-none"
                style={corner.style}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Move className="h-3.5 w-3.5" />
            Drag to pan · Drag a corner to zoom
            <button
              type="button"
              onClick={handleReset}
              className="ml-2 inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              title="Reset"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50/60 px-5 py-4">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            icon={Check}
            onClick={() => onConfirm(position.x, position.y, zoom)}
          >
            Use This Photo
          </Button>
        </div>
      </div>
    </div>
  );
}
