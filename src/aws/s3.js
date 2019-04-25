import AWS from './aws';

import rateLimited from '../utils/rateLimited';
import cached from '../utils/cached';

import { S3_BUCKET } from '../config.json';

let _s3;
const s3 = () => {
  if (!_s3) _s3 = new AWS.S3();
  return _s3;
}

export function getUploadURL({ path, contentType }) {
  return new Promise((resolve, reject) => {
    // since getSignedUrl *can* return synchronously, it doesn't
    // have a .promise() method. So we have to use callbacks :(
    s3().getSignedUrl('putObject', {
      Bucket: S3_BUCKET,
      Key: path,
      ContentType: contentType
    }, (err, url) => {
      if (err) return reject(err);
      resolve(url);
    });
  });
}

export const getFaceThumbnail = cached('thumbs', rateLimited(5, async(imageId, faceIndex) => {
  const { Body } = await s3().getObject({
    Bucket: S3_BUCKET,
    Key: `${imageId}/${faceIndex}-thumb.jpg`
  }).promise();

  return new Blob([ Body ], { type: 'image/jpeg' /* TODO use from s3 */});
}));
