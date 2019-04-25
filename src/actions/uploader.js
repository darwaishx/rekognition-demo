import { indexFace } from './analysis'

import getDetectedFaces from '../selectors/getDetectedFaces';
import getFaceIsSelected from '../selectors/getFaceIsSelected';
import getUploaderName from '../selectors/getUploaderName';

export function setFaceIndexSelected(imageId, faceIndex) {
  return {
    type: 'SELECT_FACE',
    imageId,
    faceIndex
  }
}
export function setFaceIndexDeselected(imageId, faceIndex) {
  return {
    type: 'DESELECT_FACE',
    imageId,
    faceIndex
  }
}
export function setFaceName(imageId, faceIndex, name) {
  return {
    type: 'SET_UPLOADER_FACE_NAME',
    imageId,
    faceIndex,
    name
  }
}

export function clearUploader() {
  return {
    type: 'CLEAR_UPLOADER'
  }
}

export function setUploaderState(x) {
  return {
    type: 'SET_UPLOADER_STATE',
    state: x
  }
}

export function submitUpload() {
  return async (dispatch, getState) => {
    dispatch(setUploaderState('PENDING'));

    const state = getState();
    const imgs = Object.keys(state.uploads);

    const proms = [];

    for (const img of imgs) {
      const faces = getDetectedFaces(state, img);
      const selectedFaces = faces.filter(f => getFaceIsSelected(state, img, f));

      for (const face of selectedFaces) {
        proms.push(dispatch(indexFace(img, face, getUploaderName(state, img, face))));
      }
    }

    await Promise.all(proms);

    dispatch(setUploaderState('DONE'));
  }
}
