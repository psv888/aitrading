require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import CORS
const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

const onboardingRoutes = require('./routes/onboardingRoutes');
app.use('/api/onboarding', onboardingRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});