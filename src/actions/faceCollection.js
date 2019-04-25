import * as ddb from '../aws/dynamodb';
import * as rek from '../aws/rekognition';

import getFaceThumbnail from '../utils/getFaceThumbnail';
import { setFaceThumbnail } from './analysis';

export function setCollectionLoading(isLoading) {
  return {
    type: 'SET_COLLECTION_LOADING',
    isLoading
  }
}

export function setDeleteConfirmFace(id) {
  return {
    type: 'SET_FACE_DELETE_CONFIRM',
    id
  }
}

export function deleteFace() {
  return async (dispatch, getState) => {
    const state = getState();

    const faceIndex = state.faceCollection.deletingFace;
    const { faceId } = state.faces[faceIndex].details;

    await Promise.all([
      ddb.deleteFace(faceIndex),
      rek.deleteFace(faceId)
    ]);

    dispatch(setDeleteConfirmFace(null));
    dispatch(clearFaceList());
  };
}

export function receiveFaces(faces, nextToken) {
  return {
    type: 'RECEIVE_COLLECTION_FACES',
    faces,
    nextToken
  };
}

export function receiveFace(fid, face) {
  const [ imageId, faceIndex ] = fid.split('::');

  return {
    type: 'RECEIVE_FACE_DETAILS',
    id: imageId,
    faceIndex,
    face,
  };
}

export function setFaceNameStatus(fid, status) {
  return receiveFace(fid, { nameStatus: status });
}

export function clearFaceList() {
  return {
    type: 'CLEAR_FACE_LIST'
  }
};

export function fetchFaceThumbnail(fid) {
  return async (dispatch, getState) => {
    const [ imageId, faceIndex ] = fid.split('::');

    const f = getState().faces[fid];
    if (f && f.thumbnail) return;

    const thumb = await getFaceThumbnail(imageId, faceIndex);
    dispatch(setFaceThumbnail(imageId, faceIndex, thumb))
  }
}

export function fetchFaceDetails(fid) {
  return async (dispatch, getState) => {
    const f = getState().faces[fid];

    if (f && f.details) return;

    const face = await ddb.getFace(fid);
    dispatch(receiveFace(fid, face));
  }
}

export function fetchFace(fid) {
  return async dispatch => {
    await Promise.all([
      dispatch(fetchFaceThumbnail(fid)),
      dispatch(fetchFaceDetails(fid))
    ]);
  }
}


export function fetchFaces(nt = null) {
  return async (dispatch, getState) => {
    dispatch(setCollectionLoading(true));

    const { faces, nextToken } = await ddb.listFaces(50, nt);

    for (const face of faces) {
      dispatch(receiveFace(face.id, face));
    }

    dispatch(receiveFaces(faces, nextToken));
    dispatch(setCollectionLoading(false));
  }
}

export function setFaceName(id, name) {
  return async dispatch => {
    dispatch(setFaceNameStatus(id, 'PENDING'));

    await ddb.setName(id, name);
    dispatch(receiveFace(id, { name }));

    dispatch(setFaceNameStatus(id, 'SAVED'));
  }
}
