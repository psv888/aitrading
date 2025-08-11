// Simple script to create a test user for login
const OnboardingService = require('./models/onboardingService');

async function createTestUser() {
  try {
    const testUser = {
      userId: 'amdin@gmail.com',
      password: '123456',
      experience: 'Intermediate',
      comfort: 'Not comfortable',
      goal: 'Wealth preservation',
      risk: 'Very high',
      loss: 'Some tolerance',
      assets: ['Crypto (Bitcoin, Ethereum, etc.)'],
      sectors: ['Technology'],
      avoid: '',
      otherSector: '',
      capital: '11',
      budget: '4',
      budgetPeriod: 'week',
      reinvest: 'no',
      stopLoss: '',
      stopLossPeriod: 'day',
      stopLossEnabled: 'no',
      mode: 'automated',
      frequency: 'daily',
      report: 'alerts',
      ack: true,
      simulation: 'live'
    };

    console.log('Creating test user...');
    await OnboardingService.createOnboardingItem(testUser);
    console.log('✅ Test user created successfully!');
    console.log('Email: amdin@gmail.com');
    console.log('Password: 123456');
  } catch (error) {
    if (error.message === 'User already exists with this email') {
      console.log('✅ Test user already exists!');
      console.log('Email: amdin@gmail.com');
      console.log('Password: 123456');
    } else {
      console.error('❌ Error creating test user:', error.message);
    }
  }
}

createTestUser(); 