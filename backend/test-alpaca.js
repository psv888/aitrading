// Test Alpaca API connection
const axios = require('axios');

const ALPACA_API_KEY = process.env.ALPACA_API_KEY || 'PKZ0MDDHJ0T33HUH6I1M';
const ALPACA_SECRET_KEY = process.env.ALPACA_API_SECRET || 'fdIVAnylLN2axC51clLsxVtOd0EhRyj4u44nrlci';
const ALPACA_BASE_URL = 'https://paper-api.alpaca.markets';

async function testAlpacaConnection() {
  try {
    console.log('Testing Alpaca API connection...');
    console.log('API Key:', ALPACA_API_KEY);
    console.log('Secret:', '***' + ALPACA_SECRET_KEY.slice(-4));
    console.log('Base URL:', ALPACA_BASE_URL);
    
    const response = await axios.get(`${ALPACA_BASE_URL}/v2/account`, {
      headers: {
        'APCA-API-KEY-ID': ALPACA_API_KEY,
        'APCA-API-SECRET-KEY': ALPACA_SECRET_KEY,
      },
    });
    
    console.log('✅ Alpaca API connection successful!');
    console.log('Account ID:', response.data.id);
    console.log('Status:', response.data.status);
    console.log('Buying Power:', response.data.buying_power);
    
  } catch (error) {
    console.error('❌ Alpaca API connection failed:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    console.error('Full error:', error.response?.data);
    
    if (error.response?.status === 403) {
      console.log('\n🔧 Possible solutions:');
      console.log('1. Check if your Alpaca account is activated');
      console.log('2. Verify API keys are correct');
      console.log('3. Make sure you have the right permissions');
      console.log('4. Try regenerating your API keys on Alpaca dashboard');
      console.log('5. Check if you\'re using the correct environment (paper vs live)');
    }
  }
}

testAlpacaConnection(); 