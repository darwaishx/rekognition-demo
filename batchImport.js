const sharp = require('sharp');
const parse = require('csv-parse/lib/sync');
const uuid = require('uuid/v4');
const pMap = require('p-map');
const path = require('path');
const url = require('url');
const fs = require('fs');

const ProgressBar = require('progress');

const THUMB_SIZE = 125;

const awsConsts = require('./src/config.json');
const AWS = require('aws-sdk');

AWS.config.update({
  region: awsConsts.AWS_REGION
});

const s3 = new AWS.S3();
const rek = new AWS.Rekognition();
const ddb = new AWS.DynamoDB.DocumentClient();


async function getBytes(row) {
  if (row.file) {
    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(row.file), (err, data) => err ? reject(err) : resolve(data));
    });
  }

  if (row.url) {
    const parsed = url.parse(row.url);

    if (parsed.protocol !== 's3:') {
      throw new Error("Expected an S3 url, got " + row.url);
    }

    const bucket = parsed.host;
    const key = parsed.path.slice(1);


    const bytesPromise = s3.getObject({
      Bucket: bucket,
      Key: key
    }).promise()
      .then(resp => resp.Body);

    return await bytesPromise;
  }
}



(async() => {

const csv = fs.readFileSync(path.resolve(process.argv[2]), 'utf8')
  .replace(/^.*\r?\n/, x => x.toLowerCase());

const records = parse(csv, {
  columns: true
});

const pb = new ProgressBar('Indexing [:bar] :current / :total', { total: records.length });
pb.tick(0);

await pMap(records, async row => {
  try {
    await importRow(row);
    row.status = 'SUCCESS';
    row.message = '';
    pb.tick();
  } catch(e) {
    console.error('Something went wrong');
    console.error(row);
    console.error(e);
    row.status = 'FAIL';
    row.message = e.message;
  }
}, { concurrency: 10 });

const headers = Object.keys(records[0]);
const filename = 'result-' + (new Date().toISOString().replace(/\D/g, '').slice(0,14)) + '.csv';

const s = x => '"' + x.replace(/"/g, '""') + '"';

console.log('Writing results to %s', filename);
fs.writeFileSync(filename,
  [
    headers.join(','),
    ...records.map(x => headers.map(h => s(x[h])).join(','))
  ].join('\n') + '\n'
);

console.log('Done');
process.exit();

})();













async function importRow(row) {
  const bytes = await getBytes(row);

  const imageId = uuid();
  const key = imageId;
  row.key = key;

  await uploadJpeg(key, bytes);

  // console.log('Analysing %s', key);
  // console.log({ bytes });

  const detectedFaces = await rek.detectFaces({
    Attributes: [ 'DEFAULT' ],
    Image: {
      S3Object: {
        Bucket: awsConsts.S3_BUCKET,
        Name: key
      }
    }
  }).promise()
    .then(resp => resp.FaceDetails);

  if (detectedFaces.length !== 1) {
    throw new Error('Expected exactly one face in ' + (row.url || row.file) + ', found ' + detectedFaces.length);
  }

  // console.log({ detectedFaces });

  const img = sharp(bytes);
  const { width, height } = await img.metadata();

  const faceBox = detectedFaces[0].BoundingBox;

  // console.log('Cropping and uploading...');

  const boxCrop = (await crop(img, { width, height }, rounded(toImageCoordinates({ width, height }, faceBox))))
    .jpeg()
    .toBuffer();

  const thumbCrop = (await crop(img, { width, height }, rounded(toSquare(toImageCoordinates({ width, height }, faceBox)))))
    .resize(THUMB_SIZE, THUMB_SIZE)
    .jpeg()
    .toBuffer();

  const faceIndex = 0;

  await Promise.all([
    uploadJpeg(`${imageId}/${faceIndex}`, await boxCrop),
    uploadJpeg(`${imageId}/${faceIndex}-thumb.jpg`, await thumbCrop)
  ]);

  // console.log('Indexing...');

  const { FaceId } = await rek.indexFaces({
    CollectionId: awsConsts.REKOGNITION_COLLECTION_ID,
    ExternalImageId: `${imageId}::${faceIndex}`,
    Image: {
      S3Object: {
        Bucket: awsConsts.S3_BUCKET,
        Name: `${imageId}/${faceIndex}`
      }
    },
    MaxFaces: 1
  }).promise()
    .then(res => (res.FaceRecords[0] || {}).Face || {})

  await ddb.put({
    TableName: awsConsts.DYNAMODB_TABLE,
    Item: {
      id: `${imageId}::${faceIndex}`,
      timestamp: Date.now(),
      dummy: '1',
      faceId: FaceId,
      name: row.name
    }
  }).promise();
}


async function uploadJpeg(key, buffer) {
  return s3.putObject({
    Bucket: awsConsts.S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: 'image/jpeg'
  }).promise()
}

async function crop(img, { width, height }, { x, y, w, h }) {
  const mw = Math.max(width, x + w) - Math.min(0, x);
  const mh = Math.max(height, y + h) - Math.min(0, y);

  const ix = -Math.min(0, x);
  const iy = -Math.min(0, y);

  return sharp(
    await sharp({
      create: {
        width: mw,
        height: mh,
        channels: 3,
        background: { r: 0, g: 0, b: 0 }
      }
    }).overlayWith(await img.png().toBuffer(), { top: iy, left: ix })
      .png()
      .toBuffer()
  )
    .extract({
      left: x + ix,
      top: y + iy,
      width: w,
      height: h
    })
}

function toImageCoordinates({ width, height }, box) {
  const { Top, Left, Width, Height } = box;

  return rounded({
    x: Left * width,
    y: Top * height,
    w: Width * width,
    h: Height * height
  });
}

function toSquare(box) {
  const { x, y, w, h } = box;

  const cx = x + w / 2;
  const cy = y + h / 2;
  const r = Math.sqrt(w * w + h * h) / 2;

  return rounded({
    x: cx - r,
    y: cy - r,
    w: r * 2,
    h: r * 2
  });
}

function rounded(box) {
  const { x, y, w, h } = box;

  return {
    x: Math.round(x),
    y: Math.round(y),
    w: Math.round(w),
    h: Math.round(h),
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
