export default function getFaceName(state, imageId, faceIndex) {
  const key = `${imageId}::${faceIndex}`;

  const f = state.faces[key];
  if (!f || !f.details) return null;

  return f.details.name;
}
