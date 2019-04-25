const aws = require('aws-sdk');
const awsConsts = require('./src/config.json');

aws.config.update({
  region: awsConsts.AWS_REGION
});

const rek = new aws.Rekognition();
const s3 = new aws.S3();
const ddb = new aws.DynamoDB.DocumentClient();

(async () => {

  while (true) {
    const faces = (await rek.listFaces({
      CollectionId: awsConsts.REKOGNITION_COLLECTION_ID
    }).promise()).Faces

    // console.log(faces); break;

    if (!faces.length) break;

    console.log('Deleting %s faces...', faces.length);

    await rek.deleteFaces({
      CollectionId: awsConsts.REKOGNITION_COLLECTION_ID,
      FaceIds: faces.map(f => f.FaceId)
    }).promise();
  }

  while(true) {
    const objects = (await s3.listObjectsV2({
      Bucket: awsConsts.S3_BUCKET
    }).promise()).Contents;

    // console.log(objects); break;

    if (!objects.length) break;

    console.log('Deleting %s objects...', objects.length);

    await s3.deleteObjects({
      Bucket: awsConsts.S3_BUCKET,
      Delete: {
        Objects: objects.map(x => ({
          Key: x.Key
        }))
      }
    }).promise();
  }

  while (true) {
    const items = (await ddb.scan({
      TableName: awsConsts.DYNAMODB_TABLE,
      AttributesToGet: [ 'id' ],
      ConsistentRead: true,
      Limit: 25
    }).promise()).Items;

    if (!items.length) break;

    console.log('Deleting %s items...', items.length);

    await ddb.batchWrite({
      RequestItems: {
        [awsConsts.DYNAMODB_TABLE]: items.map(i => {
          return {
            DeleteRequest: {
              Key: { id: i.id }
            }
          }
        })
      }
    }).promise()
  }

})();
