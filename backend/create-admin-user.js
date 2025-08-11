// Create user with admin@gmail.com email
const OnboardingService = require('./models/onboardingService');

async function createAdminUser() {
  try {
    const adminUser = {
      userId: 'admin@gmail.com',
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

    console.log('Creating admin user...');
    await OnboardingService.createOnboardingItem(adminUser);
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@gmail.com');
    console.log('Password: 123456');
  } catch (error) {
    if (error.message === 'User already exists with this email') {
      console.log('✅ Admin user already exists!');
      console.log('Email: admin@gmail.com');
      console.log('Password: 123456');
    } else {
      console.error('❌ Error creating admin user:', error.message);
    }
  }
}

createAdminUser(); 