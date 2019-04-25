import * as s3 from '../aws/s3';

const thumbs = new Map();

export default function getFaceThumbnail(imageId, faceIndex) {
  const key = `${imageId}::${faceIndex}`;

  if (thumbs.has(key)) return thumbs.get(key)

  const prom = s3.getFaceThumbnail(imageId, faceIndex);
  thumbs.set(key, prom);
  return prom;
}
