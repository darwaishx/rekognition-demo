export default function getAnalysisState(state, id) {
  const analysisState = state.analysis[id];
  if (!analysisState) return null;
  return analysisState.state;
}
