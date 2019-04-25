import getUrlForBlob from '../utils/getUrlForBlob';

export default function getImageUrl(state, id) {
  const image = state.uploads[id].file;
  return getUrlForBlob(image);
}
