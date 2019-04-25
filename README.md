# Face Detection, Analysis and Recognition Demo

This demo app powered by Amazon Rekognition shows different features of face detection, analysis and recognition.

## Installing

### Download the repo and install dependencies:

Download the repo and go to the root of the folder

Run `npm install`

### Creating / Updating the backend

The backend for this demo uses Rekognition, S3, DynamoDB and Cognito and is defined in a CloudFormation stack.

To create the AWS resources required to run the demo, spin up the CloudFormation stack by running:

`AWS_REGION=us-east-1 npm run create-backend`

(this uses out-of-the-box AWS credentials from your environment or local profile)

This will spin up the stack and write the necessary front-end config variables to `src/config.json`

### Build Web App and Upload to S3

Run `npm run build` to compile and build all the static assets into the `build` directory.

Upload all the files from build directory to an S3 bucket.

Enable static website hosting for your s3 bucket.

### Create a cognito user for web app

Go to Amazon Cognito in AWS Console and create a user in the User Pool.

Add user to admin or users groups. Admin can user all features of the app while regular users can readonly access and can not add or delete faces to collection.

## Run app

Go to the URL of your static website.

Login using the user your created in Amazon Cognito.

## CloudFront distribution

Web app allows you to take a photo and analyze that photo using Amazon Rekognition. This feature requires access the website over SSL.

To enable SSL, go to CloudFront in AWS Console and create a web distribution pointing to the S3 bucket that contains your web app.