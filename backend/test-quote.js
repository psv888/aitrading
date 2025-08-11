const axios = require('axios');

const ALPACA_API_KEY = 'PKZ0MDDHJ0T33HUH6I1M';
const ALPACA_SECRET_KEY = 'fdIVAnylLN2axC51clLsxVtOd0EhRyj4u44nrlci';

async function testEndpoints() {
  console.log('Testing Alpaca API endpoints...\n');
  
  const endpoints = [
    {
      name: 'Account Info',
      url: 'https://paper-api.alpaca.markets/v2/account',
      headers: {
        'APCA-API-KEY-ID': ALPACA_API_KEY,
        'APCA-API-SECRET-KEY': ALPACA_SECRET_KEY
      }
    },
    {
      name: 'Latest Trade (v1beta3)',
      url: 'https://data.alpaca.markets/v1beta3/stocks/AAPL/trades/latest',
      headers: {
        'APCA-API-KEY-ID': ALPACA_API_KEY,
        'APCA-API-SECRET-KEY': ALPACA_SECRET_KEY
      }
    },
    {
      name: 'Latest Quote (v2)',
      url: 'https://data.alpaca.markets/v2/stocks/AAPL/latest/quote',
      headers: {
        'APCA-API-KEY-ID': ALPACA_API_KEY,
        'APCA-API-SECRET-KEY': ALPACA_SECRET_KEY
      }
    },
    {
      name: 'Snapshot (v2)',
      url: 'https://data.alpaca.markets/v2/stocks/AAPL/snapshot',
      headers: {
        'APCA-API-KEY-ID': ALPACA_API_KEY,
        'APCA-API-SECRET-KEY': ALPACA_SECRET_KEY
      }
    }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint.name}`);
      const response = await axios.get(endpoint.url, { headers: endpoint.headers });
      console.log(`✅ SUCCESS: ${endpoint.name}`);
      console.log(`Response:`, JSON.stringify(response.data, null, 2));
      console.log('---\n');
    } catch (error) {
      console.log(`❌ FAILED: ${endpoint.name}`);
      console.log(`Error:`, error.response?.data || error.message);
      console.log('---\n');
    }
  }
}

testEndpoints(); 