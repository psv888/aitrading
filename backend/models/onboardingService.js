const AWS = require('../aws-config');
const bcrypt = require('bcryptjs');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const ONBOARDING_TABLE = 'Onboarding'; // Your DynamoDB table name

const OnboardingService = {
  async createOnboardingItem(item) {
    try {
      // Hash the password if it exists
      let itemWithTimestamp = {
        ...item,
        createdAt: new Date().toISOString()
      };
      
      if (item.password) {
        const saltRounds = 10;
        itemWithTimestamp.password = await bcrypt.hash(item.password, saltRounds);
      }
      
      const params = {
        TableName: ONBOARDING_TABLE,
        Item: itemWithTimestamp,
        ConditionExpression: 'attribute_not_exists(userId)' // Prevent duplicate users
      };

      await dynamodb.put(params).promise();
      return { Item: itemWithTimestamp };
    } catch (error) {
      if (error.code === 'ConditionalCheckFailedException') {
        throw new Error('User already exists with this email');
      }
      throw error;
    }
  },

  async authenticateUser(email, password) {
    try {
      const params = {
        TableName: ONBOARDING_TABLE,
        Key: {
          userId: email
        }
      };

      const result = await dynamodb.get(params).promise();
      
      if (!result.Item) {
        throw new Error('User not found');
      }

      if (!result.Item.password) {
        throw new Error('Invalid password');
      }

      const isValidPassword = await bcrypt.compare(password, result.Item.password);
      
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = result.Item;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  },

  async getOnboardingItem(key) {
    const params = {
      TableName: ONBOARDING_TABLE,
      Key: key,
    };
    return dynamodb.get(params).promise();
  },

  async getUserOnboarding(userId) {
    const params = {
      TableName: ONBOARDING_TABLE,
      Key: { userId },
    };
    return dynamodb.get(params).promise();
  },

  async updateOnboardingItem(userId, updateData) {
    try {
      // First, get the existing item to preserve the password
      const existingItem = await this.getUserOnboarding(userId);
      
      if (!existingItem.Item) {
        throw new Error('User not found');
      }

      // Prepare update expression and attribute values
      const updateExpression = [];
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};
      
      // Build update expression dynamically
      Object.keys(updateData).forEach(key => {
        if (key !== 'userId' && key !== 'password') { // Don't update userId or password
          const attributeName = `#${key}`;
          const attributeValue = `:${key}`;
          
          updateExpression.push(`${attributeName} = ${attributeValue}`);
          expressionAttributeNames[attributeName] = key;
          expressionAttributeValues[attributeValue] = updateData[key];
        }
      });

      // Add updatedAt timestamp only if not already provided
      if (!updateData.updatedAt) {
        updateExpression.push('#updatedAt = :updatedAt');
        expressionAttributeNames['#updatedAt'] = 'updatedAt';
        expressionAttributeValues[':updatedAt'] = new Date().toISOString();
      }

      const params = {
        TableName: ONBOARDING_TABLE,
        Key: { userId },
        UpdateExpression: `SET ${updateExpression.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      };

      const result = await dynamodb.update(params).promise();
      return result;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = OnboardingService; 