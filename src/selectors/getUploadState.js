export default function getUploadState(state, id) {
  const uploadState = state.uploads[id];
  if (!uploadState) return null;
  return uploadState.state;
}
