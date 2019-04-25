export default function getUploaderName(state, imageId, faceIndex) {
  const f = state.uploader[`${imageId}::${faceIndex}`];
  return f && f.name;
}
