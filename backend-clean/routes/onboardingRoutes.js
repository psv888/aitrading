const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboardingController');

router.post('/', onboardingController.createOnboarding);
router.get('/:userId', onboardingController.getOnboarding);

module.exports = router; 