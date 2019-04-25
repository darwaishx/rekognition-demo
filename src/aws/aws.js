import AWS from 'aws-sdk';

import { AWS_REGION } from '../config.json';

AWS.config.region = AWS_REGION;

export default AWS;

export function setCredentials(creds) {
  AWS.config.credentials = creds;
}
