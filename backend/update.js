/*

STACK CREATE / UPDATE SCRIPT

This script is mostly a bunch of helpers and utilities
for putting the process of creating / updating the backend
stack and saving the output values for config into a single
script.

There are essentially three things this script does, which
can easily be done manually if you like:

1. When first creating the stack, a Rekognition Face Collection
   needs to be created since it's not supported by CloudFormation.
   This is done here with a random ID (see below around CREATE_COLLECTION)

2. With the Rekognition collection id as input, the CloudFormation
   stack is created or updated. The stack is defined in stack.yaml
   This can be done via CLI or console if you like. In here, the
   stack's name is hardcoded using the STACK_NAME below

2.5. There's some back-and-forth rigmarole involved in setting up
     the Cognito ID Pool's role resolution policy which involves
     doing a double-update if necessary.

3. The outputs from the CloudFormation stack need to be passed into
   the code that the front-end can use. They are all defined at the
   bottom of stack.yaml and correspond to values in `src/config.json`
   that is used by the front-end. If doing stack updates manually,
   these values will need to be manually copy-pasted and re-built
   for the front-end to use.

*/
const STACK_NAME = 'rekognition-demo';



const AWS = require('aws-sdk');
const rek = new AWS.Rekognition();
const { yamlParse } = require('yaml-cfn');
const uuid = require('uuid/v4');
const fs = require('fs');
const path = require('path');

const performUpdate = require('./performUpdate');

(async() => {

  const CREATE_COLLECTION = process.argv.includes('--create-collection');

  let collectionId = performUpdate.USE_PREVIOUS;

  if (CREATE_COLLECTION) {
    const collId = uuid();
    await rek.createCollection({
      CollectionId: collId
    }).promise();
    collectionId = collId;
  }

  const f = fs.readFileSync(path.resolve(__dirname, 'stack.yaml'), 'utf8');
  const template = yamlParse(f);

  // Cloudformation doesn't support dynamic keys which cross-reference
  // other resources so we have to do an ugly double-update here
  // see https://forums.aws.amazon.com/thread.jspa?threadID=255584&tstart=0
  function setUserPoolProvider(name) {
    template.Resources.cognitoRoleAttachment = {
      Type: 'AWS::Cognito::IdentityPoolRoleAttachment',
      Properties: {
        IdentityPoolId: { Ref: 'cognitoIDPool' },
        Roles: {
          authenticated: { 'Fn::GetAtt': [ 'readOnlyRole', 'Arn' ] }
        },
        RoleMappings: {
          [name]: {
            Type: 'Token',
            AmbiguousRoleResolution: 'AuthenticatedRole'
          }
        }
      }
    };
  }


  const existingUserPool = CREATE_COLLECTION ? null : require('../src/config.json').COGNITO_USER_POOL_PROVIDER;

  if (existingUserPool) {
    setUserPoolProvider(existingUserPool);
  }

  let outputs = await performUpdate(STACK_NAME, template, {
    rekCollectionId: collectionId
  });

  const expectedUserPool = outputs.userPoolProvider + ':' + outputs.userPoolClientId;

  if (existingUserPool !== expectedUserPool) {
    setUserPoolProvider(expectedUserPool);

    outputs = await performUpdate(STACK_NAME, template, {
      rekCollectionId: collectionId
    });
  }

  fs.writeFileSync(path.resolve(__dirname, '..', 'src', 'config.json'), JSON.stringify({
    AWS_REGION: outputs.region,
    COGNITO_ID_POOL: outputs.idPoolName,
    COGNITO_USER_POOL_PROVIDER: expectedUserPool,
    COGNITO_USER_POOL: outputs.userPool,
    COGNITO_CLIENT_ID: outputs.userPoolClientId,
    DYNAMODB_TABLE: outputs.ddbTableName,
    DYNAMODB_TIME_INDEX: outputs.ddbTimeIndex,
    REKOGNITION_COLLECTION_ID: outputs.rekCollectionId,
    S3_BUCKET: outputs.s3BucketName
  }, null, 2));

  process.exit();
})().catch(e => {
  console.error(e);
});
