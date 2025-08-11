const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboardingController');

router.post('/', onboardingController.createOnboarding);
router.post('/login', onboardingController.login);
router.get('/:userId', onboardingController.getUserOnboarding);
router.put('/update/:userId', onboardingController.updateUserOnboarding);

module.exports = router; 