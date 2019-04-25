import uploadFileToUrl from '../utils/uploadFileToUrl';

import { setFaceIndexSelected, setFaceIndexDeselected } from './uploader';

import * as s3 from '../aws/s3';
import * as rek from '../aws/rekognition';
import * as ddb from '../aws/dynamodb';

import rateLimited from '../utils/rateLimited'
import getImageData from '../utils/getImageData';
import { cropImageToBox, cropImageToNiceSquare } from '../utils/crop';

export function setAnalysisState(id, state) {
  return {
    type: 'SET_ANALYSIS_STATE',
    id,
    state
  };
}

export function setFaces(id, faces) {
  return {
    type: 'SET_FACES',
    id,
    faces
  };
}

export function setFaceState(id, faceIndex, state) {
  return {
    type: 'SET_FACE_STATE',
    id,
    faceIndex,
    state
  };
}

export function setFaceThumbnail(id, faceIndex, thumb) {
  return {
    type: 'SET_FACE_THUMBNAIL',
    id,
    faceIndex,
    thumb
  };
}

export function uploadToPath(blob, path) {
  return async dispatch => {
    const { /*name: fileName,*/ type: contentType } = blob;

    const url = await s3.getUploadURL({
      path,
      contentType
    });
    await uploadFileToUrl(url, blob);
  }
}

export function cropAndUploadFace(id, face, faceIndex) {
  return rateLimited(1, async (dispatch, getState) => {
    dispatch(setFaceState(id, faceIndex, 'PROCESSING'));

    const { image/*, url, width, height*/ } = await getImageData(getState(), id);

    const [ big, thumb ] = await Promise.all([
      cropImageToBox(image, face.BoundingBox),
      cropImageToNiceSquare(image, face.BoundingBox)
    ]);

    dispatch(setFaceThumbnail(id, faceIndex, thumb));

    await Promise.all([
      dispatch(uploadToPath(big, `${id}/${faceIndex}`)),
      dispatch(uploadToPath(thumb, `${id}/${faceIndex}-thumb.jpg`))
    ]);

    dispatch(setFaceState(id, faceIndex, 'READY'));
  });
}

export function analyzeImage(id, uploadCrops) {
  return async dispatch => {
    dispatch(setAnalysisState(id, 'ANALYZING'));

    const faces = await rek.detectFaces(id);

    dispatch(setFaces(id, faces));
    dispatch(setAnalysisState(id, 'DONE'));

    if (uploadCrops) {
      for (const [idx, f] of faces.entries()) {
        dispatch(setFaceIndexDeselected(id, idx));

        /* await? */ dispatch(cropAndUploadFace(id, f, idx));
      }
    }
  }
}

export function indexFace(id, faceIndex, name) {
  return async dispatch => {
    dispatch(setFaceState(id, faceIndex, 'INDEXING'));

    const { FaceId } = await rek.indexFace(id, faceIndex);
    ddb.addFace(id, faceIndex, name, FaceId);

    dispatch(setFaceState(id, faceIndex, 'DONE'));
  }
}
