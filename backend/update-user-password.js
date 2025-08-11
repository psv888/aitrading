// Update user with password
const OnboardingService = require('./models/onboardingService');
const bcrypt = require('bcryptjs');

async function updateUserPassword() {
  try {
    console.log('Updating user password...');
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('123456', saltRounds);
    
    // Update the user with password
    const AWS = require('./aws-config');
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    
    const params = {
      TableName: 'Onboarding',
      Key: { userId: 'admin@gmail.com' },
      UpdateExpression: 'set password = :password',
      ExpressionAttributeValues: {
        ':password': hashedPassword
      }
    };
    
    await dynamodb.update(params).promise();
    console.log('✅ Password updated successfully!');
    console.log('Email: admin@gmail.com');
    console.log('Password: 123456');
  } catch (error) {
    console.error('❌ Error updating password:', error.message);
  }
}

updateUserPassword(); 