const OnboardingService = require('../models/onboardingService');

exports.createOnboarding = async (req, res) => {
  try {
    console.log('Received onboarding data:', req.body); // Log incoming data
    await OnboardingService.createItem(req.body);
    res.status(201).json({ message: 'Onboarding data created' });
  } catch (err) {
    console.error('Error saving onboarding data:', err); // Log error
    res.status(500).json({ error: err.message });
  }
};

exports.getOnboarding = async (req, res) => {
  try {
    const data = await OnboardingService.getItem({ userId: req.params.userId });
    res.json(data.Item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 