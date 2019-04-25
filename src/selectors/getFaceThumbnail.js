const urls = new WeakMap();

export default function getFaceThumbnail(state, imageId, faceIndex) {
  const f = state.faces[`${imageId}::${faceIndex}`];
  if (!f || !f.thumbnail) return null;

  if (urls.has(f.thumbnail)) return urls.get(f.thumbnail);

  const url = URL.createObjectURL(f.thumbnail);
  urls.set(f.thumbnail, url);
  return url;
}
