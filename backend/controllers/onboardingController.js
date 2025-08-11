const OnboardingService = require('../models/onboardingService');

exports.createOnboarding = async (req, res) => {
  try {
    console.log('Received onboarding data:', req.body); // Log incoming data
    
    // Hash the password and include it in onboarding data
    const onboardingData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    await OnboardingService.createOnboardingItem(onboardingData);
    
    res.status(201).json({ 
      message: 'User registered and onboarding data created successfully',
      userId: req.body.userId
    });
  } catch (err) {
    console.error('Error saving onboarding data:', err); // Log error
    if (err.message === 'User already exists with this email') {
      res.status(409).json({ error: 'User already exists with this email' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = await OnboardingService.authenticateUser(email, password);
    
    res.json({
      message: 'Login successful',
      user: user,
      onboardingData: user
    });
  } catch (err) {
    console.error('Login error:', err);
    if (err.message === 'User not found' || err.message === 'Invalid password') {
      res.status(401).json({ error: 'Invalid email or password' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.getOnboarding = async (req, res) => {
  try {
    const data = await OnboardingService.getOnboardingItem({ userId: req.params.userId });
    res.json(data.Item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserOnboarding = async (req, res) => {
  try {
    const data = await OnboardingService.getUserOnboarding(req.params.userId);
    res.json(data.Item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUserOnboarding = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    
    console.log('🔍 Update request received:');
    console.log('  - URL params:', req.params);
    console.log('  - User ID from params:', userId);
    console.log('  - Request body:', updateData);
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    console.log('  - Calling OnboardingService.updateOnboardingItem with:', { userId, updateData });
    
    await OnboardingService.updateOnboardingItem(userId, updateData);
    
    console.log('  - Update successful for user:', userId);
    
    res.json({ 
      message: 'User onboarding data updated successfully',
      userId: userId
    });
  } catch (err) {
    console.error('❌ Error updating onboarding data:', err);
    res.status(500).json({ error: err.message });
  }
}; 