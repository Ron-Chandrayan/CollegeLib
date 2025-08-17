const AWS = require('aws-sdk');

const s3Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  region: process.env.AWS_REGION || 'ap-south-1',
  bucketName: process.env.AWS_BUCKET_NAME || 'audacty-backend'
};

// Configure AWS
AWS.config.update({
  accessKeyId: s3Config.accessKeyId,
  secretAccessKey: s3Config.secretAccessKey,
  region: s3Config.region
});

// Create S3 instance
const s3 = new AWS.S3();

module.exports = { s3, s3Config }; 