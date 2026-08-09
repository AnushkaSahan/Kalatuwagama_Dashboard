// Focal point + zoom are stored right in the image URL as query params, e.g.
// https://.../photo.jpg?fp=30,70&z=150 — no backend/DB changes needed, and
// static file servers ignore unknown query strings when serving the file.

const parseParams = (url) => {
  if (!url) return null;
  const match = url.match(/[?&]fp=([\d.]+),([\d.]+)(?:&z=([\d.]+))?/);
  if (!match) return null;
  return {
    x: Number(match[1]),
    y: Number(match[2]),
    zoom: match[3] ? Number(match[3]) / 100 : 1,
  };
};

export const getFocalPosition = (url) => {
  const p = parseParams(url);
  return p ? `${p.x}% ${p.y}%` : "50% 50%";
};

export const getFocalZoom = (url) => {
  const p = parseParams(url);
  return p ? p.zoom : 1;
};

export const getFocalPoint = (url) => {
  const p = parseParams(url);
  return p ? { x: p.x, y: p.y, zoom: p.zoom } : { x: 50, y: 50, zoom: 1 };
};

export const withFocalPoint = (url, x, y, zoom = 1) => {
  if (!url) return url;
  const base = url.split(/[?&]fp=/)[0];
  return `${base}?fp=${Math.round(x)},${Math.round(y)}&z=${Math.round(zoom * 100)}`;
};
