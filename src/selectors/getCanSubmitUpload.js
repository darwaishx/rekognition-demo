export default function getCanSubmitUpload(state) {
  if (state.uploader.state === 'PENDING') return false;

  const images = Object.keys(state.uploads);

  if (!images.every(img => state.uploads[img].state === 'FINISHED')) return false;

  return images.every(img => {
    const upl = state.uploads[img];
    if (!upl.state === 'FINISHED') return false;

    const analysis = state.analysis[img];
    if (!analysis || analysis.state !== 'DONE') return false;

    const faces = Object.keys(analysis.faces);

    return faces.every(f => {
      const ff = state.faces[`${img}::${f}`];
      if (!ff) return false;

      return ff.state === 'READY';
    });
  });
}
