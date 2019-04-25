import uuid from 'uuid/v4';
import uploadFileToUrl from '../utils/uploadFileToUrl';
import fileToText from '../utils/fileToText';
import parseCSV from '../utils/parseCSV';

import * as s3 from '../aws/s3';

import { analyzeImage } from './analysis';
import { setFaceName } from './uploader';


function isCSVFile(file) {
  return file.type === 'text/csv';
}

async function getMappingFromCSV(file) {
  const txt = await fileToText(file);

  // todo handle errors
  const csv = parseCSV(txt);

  const headers = csv.shift();
  const fileField = headers.indexOf(headers.find(i => /file/i.test(i)));
  const nameField = headers.indexOf(headers.find(i => /name/i.test(i)));

  const map = {};
  for (const { [fileField]: file, [nameField]: name } of csv) {
    map[file] = name;
  }

  return map;
}

export function uploadImages(images) {
  return async dispatch => {
    let nameMapping;

    if (images.some(isCSVFile)) {
      nameMapping = await getMappingFromCSV(images.find(isCSVFile));
    }

    images.forEach(im => {
      if (isCSVFile(im)) return;

      dispatch(uploadImage(im, nameMapping));
    });
  }
}

export function setUploadState(id, state, progress) {
  return {
    type: 'SET_UPLOAD_STATE',
    id,
    state,
    progress
  }
}

export function addUploadingImage(image, id) {
  return {
    type: 'ADD_UPLOAD',
    id,
    image
  };
}

export function uploadImage(im, nameMapping = {}) {
  return async dispatch => {
    const id = uuid();

    dispatch(addUploadingImage(im, id));

    dispatch(setUploadState(id, 'LOADING', 0));

    const { name: fileName, type: contentType } = im;

    if (fileName in nameMapping) {
      dispatch(setFaceName(id, 0, nameMapping[fileName]));
    }

    const url = await s3.getUploadURL({
      path: id,
      contentType
    });

    dispatch(setUploadState(id, 'UPLOADING', 0));

    await uploadFileToUrl(url, im, progress => {
      dispatch(setUploadState(id, 'UPLOADING', progress));
    });

    dispatch(setUploadState(id, 'FINISHED', 1));
    dispatch(analyzeImage(id, true))
  }
}
