import * as rek from '../aws/rekognition';

import fileToArrayBuffer from '../utils/fileToArrayBuffer';

import {getImageDataFromBlob} from '../utils/getImageData';
import { setFaceThumbnail } from './analysis';
import { cropImageToBox, cropImageToNiceSquare, downsample, getShadowedImage } from '../utils/crop';

export function clearSearcher() {
  return {
    type: 'CLEAR_SEARCHER'
  }
}

export function setSearchImage(image) {
  return {
    type: 'SET_SEARCH_IMAGE',
    image
  };
}

export function setSearchImageMeta(data) {
  return {
    type: 'SET_SEARCH_IMAGE_DATA',
    data
  };
}

export function setSearchImageShadow(img) {
  return {
    type: 'SET_SEARCH_IMAGE_SHADOW',
    img
  };
}

export function setSearchState(state) {
  return {
    type: 'SET_SEARCH_STATE',
    state
  }
}

export function setSearchFaceResults(faces) {
  return {
    type: 'SET_SEARCH_FACES',
    faces
  }
}

export function setSearchFaceThumbnail(index, thumb) {
  return setFaceThumbnail('_search', index, thumb);
}

export function setSearchFaceMatches(index, matches) {
  return {
    type: 'SET_SEARCH_MATCHES',
    index,
    matches
  }
}

export function setMatchThreshold(value) {
  return {
    type: 'SET_SEARCH_MATCH_THRESHOLD',
    value
  };
}

export function setSelectedFace(index) {
  return {
    type: 'SET_SELECTED_FACE',
    index
  };
}

export function selectNextFace() {
  return (dispatch, getState) => {
    const state = getState().searcher;
    const idx = state.selectedFace;
    const numFaces = state.faces.length;

    return dispatch(setSelectedFace((idx + 1) % numFaces))
  };
}

export function selectPrevFace() {
  return (dispatch, getState) => {
    const state = getState().searcher;
    const idx = state.selectedFace;
    const numFaces = state.faces.length;

    return dispatch(setSelectedFace((idx + numFaces - 1) % numFaces))
  };
}

export function cropAndSearchFace(img, index, face, isOnlyFace) {
  return async dispatch => {
    const { image } = await getImageDataFromBlob(img);
    const [ big, thumb ] = await Promise.all([
      cropImageToBox(image, face.BoundingBox),
      cropImageToNiceSquare(image, face.BoundingBox)
    ]);

    dispatch(setSearchFaceThumbnail(index, thumb));

    const lookupImage = isOnlyFace ? img : big;

    // LOOKINGUP

    try {
      const matches = await rek.searchFace(await fileToArrayBuffer(lookupImage));

      dispatch(setSearchFaceMatches(index, matches.map(m => {
        return {
          similarity: m.Similarity,
          id: m.Face.ExternalImageId
        }
      })))
    } catch (e) {
      // didn't find a face?
    }
  }
}

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

export function searchFace(img) {
  return async dispatch => {

    dispatch(setSearchImage(img));

    const d = await getImageDataFromBlob(img);
    dispatch(setSearchImageMeta(d));

    const shadowed = await getShadowedImage(d.image);
    dispatch(setSearchImageShadow(shadowed));

    dispatch(setSearchState('PROCESSING'));

    // TODO downsample if too big. Rek only allows 5MB
    if (img.size > MAX_IMAGE_SIZE) {
      img = await downsample(d.image, 2000);
    }
    let faces = await rek.detectFaces(await fileToArrayBuffer(img));

    // maybe filter?
    // faces = faces.filter(f => f.Confidence > 98);

    const centre = f => f.BoundingBox.Left + f.BoundingBox.Width / 2;

    faces = [...faces].sort((a, b) => centre(a) - centre(b));

    dispatch(setSearchFaceResults(faces));
    dispatch(setSearchState('DONE'));

    const proms = [];

    for (const [index, face] of faces.entries()) {
      proms.push(dispatch(cropAndSearchFace(img, index, face, faces.length === 1)));
    }

    await Promise.all(proms);
  }
}
