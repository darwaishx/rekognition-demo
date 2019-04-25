export default function getHeaderTitle(state) {
  switch (state.routing.hash) {
    case 'collection':
      return 'Amazon Rekognition Collection Manager';
    case 'detect':
      if (!state.searcher.imageData) return 'Detect faces';
      if (!state.searcher.faces) return 'Detecting faces...';
      return 'Detected faces';
    case 'analyze':
      if (!state.searcher.imageData) return 'Analyze faces';
      if (!state.searcher.faces) return 'Detecting faces...';
      if (state.searcher.selectedFace !== null) return 'Face Analysis';
      return 'Choose a face to analyze';
    case 'search':
      if (!state.searcher.imageData) return 'Recognize faces';
      if (!state.searcher.faces) return 'Detecting faces...';
      if (state.searcher.selectedFace !== null) return 'Face Recognition';
      return 'Choose a face to recognize';
    case 'upload':
      return 'Add to collection...';
    case '':
    default:
      return 'Home';
  }
}
