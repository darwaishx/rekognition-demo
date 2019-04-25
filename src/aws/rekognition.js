import AWS from './aws';

import { S3_BUCKET, REKOGNITION_COLLECTION_ID as COLLECTION_ID } from '../config.json';

let _rek;
const rek = () => {
  if (!_rek) _rek = new AWS.Rekognition();
  return _rek;
}

export function detectFaces(id) {
  return rek().detectFaces({
    Attributes: [ 'ALL' ],
    Image: typeof id === 'object' ? { Bytes: id } : {
      S3Object: {
        Bucket: S3_BUCKET,
        Name: id
      }
    }
  }).promise()
    .then(resp => resp.FaceDetails);
}

export function indexFace(id, faceIndex) {
  return rek().indexFaces({
    CollectionId: COLLECTION_ID,
    ExternalImageId: `${id}::${faceIndex}`,
    Image: {
      S3Object: {
        Bucket: S3_BUCKET,
        Name: `${id}/${faceIndex}`
      }
    },
    MaxFaces: 1
  }).promise()
    .then(res => (res.FaceRecords[0] || {}).Face || {})
}

export function listFaces(limit, nextToken = null) {
  return rek().listFaces({
    CollectionId: COLLECTION_ID,
    MaxResults: limit,
    NextToken: nextToken
  }).promise()
}

// TODO maybe concurrency limit this?
export function searchFace(img) {
  return rek().searchFacesByImage({
    CollectionId: COLLECTION_ID,
    Image: { Bytes: img },
    MaxFaces: 4096,
    FaceMatchThreshold: 60
  }).promise()
    .then(res => res.FaceMatches)
}

export function deleteFace(faceId) {
  return rek().deleteFaces({
    CollectionId: COLLECTION_ID,
    FaceIds: [ faceId ]
  }).promise()
}
