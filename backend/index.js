require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import CORS
const app = express();
const axios = require('axios');

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

console.log('Setting up routes...');
const onboardingRoutes = require('./routes/onboardingRoutes');
console.log('Routes loaded, mounting at /api/onboarding');
app.use('/api/onboarding', onboardingRoutes);
console.log('Routes mounted successfully');

// Add a test route to verify the server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Log all registered routes for debugging
if (app._router && app._router.stack) {
  app._router.stack.forEach(function(r){
    if (r.route && r.route.path){
      console.log('Route:', Object.keys(r.route.methods), r.route.path);
    }
  });
}

// Alpaca API Configuration
const ALPACA_API_KEY = process.env.ALPACA_API_KEY || 'PKZ0MDDHJ0T33HUH6I1M';
const ALPACA_SECRET_KEY = process.env.ALPACA_API_SECRET || 'fdIVAnylLN2axC51clLsxVtOd0EhRyj4u44nrlci';
const ALPACA_BASE_URL = 'https://paper-api.alpaca.markets';
const ALPACA_DATA_URL = 'https://data.alpaca.markets';

// Helper function to make authenticated Alpaca requests
const makeAlpacaRequest = async (url, options = {}) => {
  const headers = {
    'APCA-API-KEY-ID': ALPACA_API_KEY,
    'APCA-API-SECRET-KEY': ALPACA_SECRET_KEY,
    'Content-Type': 'application/json',
    ...options.headers
  };

  console.log('🔑 Making Alpaca request with keys:', {
    key: ALPACA_API_KEY,
    secret: ALPACA_SECRET_KEY ? '***' + ALPACA_SECRET_KEY.slice(-4) : 'NOT_SET'
  });

  try {
    const response = await axios({
      url,
      method: options.method || 'GET',
      headers,
      data: options.body,
      ...options
    });

    return response.data;
  } catch (error) {
    console.error('❌ Alpaca API error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: url
    });
    throw error;
  }
};

// Get Alpaca account info
app.get('/api/alpaca/account', async (req, res) => {
  try {
    console.log('Received request to get Alpaca account info');
    const accountData = await makeAlpacaRequest(`${ALPACA_BASE_URL}/v2/account`);
    console.log('Alpaca account info retrieved successfully');
    res.json(accountData);
  } catch (error) {
    console.error('Error getting Alpaca account:', error.response?.data || error.message);
    // Return demo data when API fails
    const demoAccount = {
      id: "demo-account-123",
      account_number: "123456789",
      status: "ACTIVE",
      currency: "USD",
      buying_power: "100000.00",
      cash: "50000.00",
      portfolio_value: "125000.00",
      equity: "125000.00",
      long_market_value: "75000.00",
      short_market_value: "0.00"
    };
    res.json(demoAccount);
  }
});

// Get portfolio history
app.get('/api/alpaca/portfolio/history', async (req, res) => {
  try {
    const { period = '1M', timeframe = '1D' } = req.query;
    const historyData = await makeAlpacaRequest(
      `${ALPACA_BASE_URL}/v2/account/portfolio/history?period=${period}&timeframe=${timeframe}`
    );
    res.json(historyData);
  } catch (error) {
    console.error('Error getting portfolio history:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get portfolio history', details: error.response?.data || error.message });
  }
});

// Get positions
app.get('/api/alpaca/positions', async (req, res) => {
  try {
    const positionsData = await makeAlpacaRequest(`${ALPACA_BASE_URL}/v2/positions`);
    res.json(positionsData);
  } catch (error) {
    console.error('Error getting positions:', error.response?.data || error.message);
    // Return demo positions when API fails
    const demoPositions = [
      {
        symbol: "AAPL",
        qty: "10",
        side: "long",
        market_value: "1600.00",
        unrealized_pl: "100.00",
        unrealized_plpc: "0.067"
      }
    ];
    res.json(demoPositions);
  }
});

// Get watchlists
app.get('/api/alpaca/watchlists', async (req, res) => {
  try {
    const watchlistsData = await makeAlpacaRequest(`${ALPACA_BASE_URL}/v2/watchlists`);
    res.json(watchlistsData);
  } catch (error) {
    console.error('Error getting watchlists:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get watchlists', details: error.response?.data || error.message });
  }
});

// Get latest quote
app.get('/api/alpaca/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    console.log(`Fetching quote for ${symbol}...`);
    
    // Use the correct Alpaca data API endpoint for snapshot
    const quoteData = await makeAlpacaRequest(
      `${ALPACA_DATA_URL}/v2/stocks/${symbol}/snapshot`
    );
    
    console.log(`Quote data for ${symbol}:`, quoteData);
    res.json(quoteData);
  } catch (error) {
    console.error('Error getting quote:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get quote', details: error.response?.data || error.message });
  }
});

// Get historical data
app.get('/api/alpaca/bars/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1Day', start, end } = req.query;
    
    const params = new URLSearchParams({ timeframe });
    if (start) params.append('start', start);
    if (end) params.append('end', end);
    
    const historicalData = await makeAlpacaRequest(
      `${ALPACA_DATA_URL}/v2/stocks/${symbol}/bars?${params}`,
      {
        headers: {
          'APCA-API-KEY-ID': ALPACA_API_KEY,
          'APCA-API-SECRET-KEY': ALPACA_SECRET_KEY
        }
      }
    );
    res.json(historicalData);
  } catch (error) {
    console.error('Error getting historical data:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get historical data', details: error.response?.data || error.message });
  }
});

// Search assets
app.get('/api/alpaca/assets', async (req, res) => {
  try {
    const { search } = req.query;
    const url = search ? `${ALPACA_BASE_URL}/v2/assets?search=${search}` : `${ALPACA_BASE_URL}/v2/assets`;
    const assetsData = await makeAlpacaRequest(url);
    res.json(assetsData);
  } catch (error) {
    console.error('Error searching assets:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to search assets', details: error.response?.data || error.message });
  }
});

// Place order
app.post('/api/alpaca/orders', async (req, res) => {
  try {
    const orderData = req.body;
    const orderResponse = await makeAlpacaRequest(`${ALPACA_BASE_URL}/v2/orders`, {
      method: 'POST',
      body: orderData
    });
    res.json(orderResponse);
  } catch (error) {
    console.error('Error placing order:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to place order', details: error.response?.data || error.message });
  }
});

// Get orders
app.get('/api/alpaca/orders', async (req, res) => {
  try {
    const { status = 'all' } = req.query;
    const ordersData = await makeAlpacaRequest(`${ALPACA_BASE_URL}/v2/orders?status=${status}`);
    res.json(ordersData);
  } catch (error) {
    console.error('Error getting orders:', error.response?.data || error.message);
    // Return demo orders when API fails
    const demoOrders = [
      {
        id: "demo-order-1",
        symbol: "AAPL",
        qty: "1",
        side: "buy",
        type: "market",
        status: "filled",
        filled_qty: "1",
        filled_avg_price: "150.00",
        created_at: new Date().toISOString()
      }
    ];
    res.json(demoOrders);
  }
});

// Get specific order
app.get('/api/alpaca/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderData = await makeAlpacaRequest(`${ALPACA_BASE_URL}/v2/orders/${orderId}`);
    res.json(orderData);
  } catch (error) {
    console.error('Error getting order:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get order', details: error.response?.data || error.message });
  }
});

// AI Trading Signals API
app.post('/api/ai/signals', async (req, res) => {
  try {
    const { action, symbol, amount, confidence, reason } = req.body;
    
    // Validate signal data
    if (!action || !symbol || !amount) {
      return res.status(400).json({ error: 'Missing required fields: action, symbol, amount' });
    }

    // Create signal record (you can store this in DynamoDB later)
    const signal = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action: action.toUpperCase(),
      symbol: symbol.toUpperCase(),
      amount: parseFloat(amount),
      confidence: confidence || 50,
      reason: reason || 'AI recommendation',
      status: 'pending'
    };

    console.log('AI Signal received:', signal);
    
    // For now, just return the signal
    // Later, you can store it in database and trigger notifications
    res.json({ 
      message: 'AI signal received successfully',
      signal: signal
    });
  } catch (error) {
    console.error('Error processing AI signal:', error);
    res.status(500).json({ error: 'Failed to process AI signal' });
  }
});

// Get AI signals
app.get('/api/ai/signals', async (req, res) => {
  try {
    // For now, return mock signals
    // Later, fetch from database
    const mockSignals = [
      {
        id: 1,
        timestamp: new Date().toISOString(),
        action: 'BUY',
        symbol: 'AAPL',
        amount: 1000,
        confidence: 85,
        reason: 'Strong technical indicators suggest upward momentum',
        status: 'pending'
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        action: 'SELL',
        symbol: 'TSLA',
        amount: 500,
        confidence: 72,
        reason: 'Overbought conditions detected',
        status: 'executed'
      }
    ];
    
    res.json(mockSignals);
  } catch (error) {
    console.error('Error getting AI signals:', error);
    res.status(500).json({ error: 'Failed to get AI signals' });
  }
});

// Legacy endpoint for backward compatibility
app.post('/api/alpaca/get-account', async (req, res) => {
  try {
    console.log('Received request to get Alpaca account info');

    // Get account info using Trading API
    const response = await axios.get(
      'https://paper-api.alpaca.markets/v2/account',
      {
        headers: {
          'APCA-API-KEY-ID': ALPACA_API_KEY,
          'APCA-API-SECRET-KEY': ALPACA_SECRET_KEY,
        },
      }
    );
    console.log('Alpaca account info:', response.data);

    // Save account info to DynamoDB (only if AWS is configured)
    try {
      const AWS = require('./aws-config');
      if (AWS.config.credentials) {
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        const userId = req.body.email || 'default';
        console.log('DynamoDB update userId:', userId);

        await dynamodb.update({
          TableName: 'Onboarding',
          Key: { userId },
          UpdateExpression: 'set alpacaAccountId = :aid, alpacaAccount = :aacc',
          ExpressionAttributeValues: {
            ':aid': response.data.id,
            ':aacc': response.data,
          },
        }).promise();
        console.log('Updated DynamoDB with Alpaca account:', userId, response.data.id, response.data);
      } else {
        console.log('AWS not configured, skipping DynamoDB update');
      }
    } catch (err) {
      console.error('DynamoDB update error:', err);
    }

    res.json({ alpacaAccountId: response.data.id, alpacaAccount: response.data });
  } catch (error) {
    console.error('Error getting Alpaca account:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get Alpaca account', details: error.response?.data || error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});