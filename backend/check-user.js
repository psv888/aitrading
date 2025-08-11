// Check user data in database
const OnboardingService = require('./models/onboardingService');

async function checkUser() {
  try {
    console.log('Checking user data...');
    
    // Try to get the user data
    const result = await OnboardingService.getOnboardingItem({ userId: 'admin@gmail.com' });
    
    if (result.Item) {
      console.log('✅ User found!');
      console.log('User data:', JSON.stringify(result.Item, null, 2));
    } else {
      console.log('❌ User not found');
    }
  } catch (error) {
    console.error('Error checking user:', error.message);
  }
}

checkUser(); 