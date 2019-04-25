export default function getFaceIsSelected(state, imageId, faceIndex) {
  const f = state.uploader[`${imageId}::${faceIndex}`];
  return f && f.selected;
}
