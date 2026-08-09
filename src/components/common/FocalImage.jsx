import { getFocalPosition, getFocalZoom } from "../../utils/focalPoint";

// Drop-in replacement for <img> that respects a saved focal point + zoom
// (?fp=x,y&z=zoom in the URL) so photos show the part the admin chose,
// scaled the way they chose. Needs object-fit: cover (via className) to
// have any visible effect — it's applied automatically here.
export default function FocalImage({
  src,
  alt = "",
  className = "",
  style,
  onError,
}) {
  const position = getFocalPosition(src);
  const zoom = getFocalZoom(src);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        objectPosition: position,
        transform: zoom !== 1 ? `scale(${zoom})` : undefined,
        transformOrigin: position,
        ...style,
      }}
      onError={onError}
    />
  );
}
