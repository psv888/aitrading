const AWS = require('../aws-config');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'Onboarding'; // Update this to your actual table name later

const OnboardingService = {
  async createItem(item) {
    const params = {
      TableName: TABLE_NAME,
      Item: item,
    };
    return dynamodb.put(params).promise();
  },
  async getItem(key) {
    const params = {
      TableName: TABLE_NAME,
      Key: key,
    };
    return dynamodb.get(params).promise();
  },
  // Add update and delete as needed
};

module.exports = OnboardingService; 