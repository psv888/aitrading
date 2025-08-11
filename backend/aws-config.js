require('dotenv').config();
const AWS = require('aws-sdk');

// Only configure AWS if environment variables are available
if (process.env.AWS_REGION && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
} else {
  console.log('⚠️  AWS credentials not found, using mock mode');
}

module.exports = AWS; 