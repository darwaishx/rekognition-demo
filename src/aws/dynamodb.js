import AWS from './aws';

import { DYNAMODB_TABLE as TABLE, DYNAMODB_TIME_INDEX as TIME_INDEX } from '../config.json';

const DUMMY_VALUE = '1';

let _ddb;
const ddb = () => {
  if (!_ddb) _ddb = new AWS.DynamoDB.DocumentClient();
  return _ddb;
}

export function listFaces(limit, nextToken = null) {
  return ddb().scan({
    TableName: TABLE,
    ExclusiveStartKey: nextToken,
    Limit: limit
  }).promise()
    .then(({ Items, LastEvaluatedKey }) => {
      return { faces: Items, nextToken: LastEvaluatedKey }
    })
}

// TODO might want to ConsistentRead with this one
export function listRecentFaces(limit, nextToken = null) {
  return ddb().query({
    TableName: TABLE,
    IndexName: TIME_INDEX,
    ScanIndexForward: false,
    ExclusiveStartKey: nextToken,
    KeyConditionExpression: 'dummy = :x',
    ExpressionAttributeValues: {
      ':x': DUMMY_VALUE
    },
    Limit: limit
  }).promise()
    .then(({ Items, LastEvaluatedKey }) => {
      return { faces: Items, nextToken: LastEvaluatedKey }
    })
}

export function getFace(id) {
  return ddb().get({
    TableName: TABLE,
    Key: { id }
  }).promise()
    .then(({ Item }) => Item);
}

export function addFace(id, faceIndex, name, faceId) {
  const item = {
    id: `${id}::${faceIndex}`,
    timestamp: Date.now(),
    dummy: DUMMY_VALUE,
    faceId: faceId
  };

  if (name) {
    item.name = name;
  }

  return ddb().put({
    TableName: TABLE,
    Item: item
  }).promise()
}

export function setName(id, name) {
  return ddb().update({
    TableName: TABLE,
    Key: { id },
    UpdateExpression: 'set #n = :n',
    ExpressionAttributeNames: { '#n': 'name' },
    ExpressionAttributeValues: { ':n': name || null }
  }).promise();
}

export function deleteFace(id) {
  return ddb().delete({
    TableName: TABLE,
    Key: { id }
  }).promise()
}
