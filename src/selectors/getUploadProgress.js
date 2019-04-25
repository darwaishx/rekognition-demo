export default function getUploadProgress(state, id) {
  const uploadState = state.uploads[id];
  if (!uploadState) return null;
  return uploadState.progress;
}
