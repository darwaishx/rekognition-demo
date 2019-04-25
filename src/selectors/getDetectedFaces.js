export default function getDetectedFaces(state, id) {
  const analysisState = state.analysis[id];
  if (!analysisState) return [];
  return (analysisState.faces || []).map((face, idx) => idx);
}
