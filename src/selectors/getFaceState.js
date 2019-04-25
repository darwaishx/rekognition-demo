export default function getFaceState(state, imageId, faceIndex) {
  const f = state.faces[`${imageId}::${faceIndex}`];
  if (!f) return null;

  return f.state;
}
