// Backend API Configuration
const BACKEND_API_URL = 'http://localhost:3001/api/alpaca';

// Force demo mode until API keys are fixed
const FORCE_DEMO_MODE = false;

// Helper function to make requests to backend
const makeBackendRequest = async (endpoint, options = {}) => {
  const url = `${BACKEND_API_URL}${endpoint}`;
  console.log('Making request to:', url);
  
  // Add cache-busting parameter
  const cacheBuster = `?t=${Date.now()}`;
  const finalUrl = url.includes('?') ? `${url}&t=${Date.now()}` : `${url}${cacheBuster}`;
  
  const response = await fetch(finalUrl, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      ...options.headers
    },
    ...options
  });

  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Backend request failed:', errorData);
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Backend response data:', data);
  return data;
};

// Demo Data for fallback (when API keys are not configured)
const demoAccount = {
  id: "demo-account-123",
  account_number: "123456789",
  status: "ACTIVE",
  crypto_status: "ACTIVE",
  currency: "USD",
  buying_power: "100000.00",
  regt_buying_power: "100000.00",
  daytrading_buying_power: "100000.00",
  non_marginable_buying_power: "100000.00",
  cash: "50000.00",
  accrued_fees: "0.00",
  pending_transfer_out: "0.00",
  pending_transfer_in: "0.00",
  portfolio_value: "125000.00",
  pattern_day_trader: false,
  trading_blocked: false,
  transfers_blocked: false,
  account_blocked: false,
  created_at: "2024-01-01T00:00:00Z",
  trade_suspended_by_user: false,
  multiplier: "4",
  shorting_enabled: true,
  equity: "125000.00",
  last_equity: "124000.00",
  long_market_value: "75000.00",
  short_market_value: "0.00",
  initial_margin: "18750.00",
  maintenance_margin: "15000.00",
  last_maintenance_margin: "14800.00",
  sma: "0.00",
  daytrade_count: 0
};

const demoPortfolioHistory = {
  timestamp: [1640995200, 1641081600, 1641168000, 1641254400, 1641340800],
  equity: [124000, 124500, 125200, 124800, 125000],
  profit_loss: [0, 500, 1200, 800, 1000],
  profit_loss_pct: [0, 0.4, 0.97, 0.65, 0.81]
};

const demoPositions = [
  {
    asset_id: "b0b6dd9d-8b9b-4335-9f1a-0b9a3a9d8b8b",
    symbol: "AAPL",
    exchange: "NASDAQ",
    asset_class: "us_equity",
    avg_entry_price: "150.00",
    qty: "10",
    side: "long",
    market_value: "1600.00",
    cost_basis: "1500.00",
    unrealized_pl: "100.00",
    unrealized_plpc: "0.067",
    unrealized_intraday_pl: "50.00",
    unrealized_intraday_plpc: "0.033",
    current_price: "160.00",
    lastday_price: "155.00",
    change_today: "0.032"
  },
  {
    asset_id: "c1c7ee0e-9c0c-5446-0g2b-1c0b4b0e9c9c",
    symbol: "TSLA",
    exchange: "NASDAQ",
    asset_class: "us_equity",
    avg_entry_price: "700.00",
    qty: "5",
    side: "long",
    market_value: "3750.00",
    cost_basis: "3500.00",
    unrealized_pl: "250.00",
    unrealized_plpc: "0.071",
    unrealized_intraday_pl: "100.00",
    unrealized_intraday_plpc: "0.029",
    current_price: "750.00",
    lastday_price: "730.00",
    change_today: "0.027"
  },
  {
    asset_id: "d2d8ff1f-0d1d-6557-1h3c-2d1c5c1f0d0d",
    symbol: "MSFT",
    exchange: "NASDAQ",
    asset_class: "us_equity",
    avg_entry_price: "300.00",
    qty: "8",
    side: "long",
    market_value: "2480.00",
    cost_basis: "2400.00",
    unrealized_pl: "80.00",
    unrealized_plpc: "0.033",
    unrealized_intraday_pl: "40.00",
    unrealized_intraday_plpc: "0.017",
    current_price: "310.00",
    lastday_price: "305.00",
    change_today: "0.016"
  }
];

// Helper function to simulate API delay
const simulateApiCall = async (data, delay = 500) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return data;
};

// Account Information
export const getAccount = async () => {
  console.log('🔄 Calling backend API for account data...');
  const data = await makeBackendRequest('/account');
  console.log('✅ Real account data received:', data);
  return data;
};

// Portfolio History
export const getPortfolioHistory = async (period = '1M', timeframe = '1D') => {
  try {
    return await makeBackendRequest(`/portfolio/history?period=${period}&timeframe=${timeframe}`);
  } catch (error) {
    console.warn('Backend API failed, using demo data:', error.message);
    return simulateApiCall(demoPortfolioHistory);
  }
};

// Positions (Holdings)
export const getPositions = async () => {
  try {
    return await makeBackendRequest('/positions');
  } catch (error) {
    console.warn('Backend API failed, using demo data:', error.message);
    return simulateApiCall(demoPositions);
  }
};

// Watchlist
export const getWatchlists = async () => {
  try {
    return await makeBackendRequest('/watchlists');
  } catch (error) {
    console.warn('Backend API failed, using demo data:', error.message);
    return simulateApiCall([
      {
        id: "demo-watchlist-1",
        name: "My Watchlist",
        assets: [
          { symbol: "AAPL", name: "Apple Inc." },
          { symbol: "TSLA", name: "Tesla Inc." },
          { symbol: "MSFT", name: "Microsoft Corp." }
        ]
      }
    ]);
  }
};

// Market Data - Latest Quote
export const getLatestQuote = async (symbol) => {
  try {
    const quote = await makeBackendRequest(`/quote/${symbol}`);
    console.log(`Real quote for ${symbol}:`, quote);
    return quote;
  } catch (error) {
    console.error(`Failed to get quote for ${symbol}:`, error.message);
    throw error; // Don't fall back to demo data
  }
};

// Market Data - Historical Data
export const getHistoricalData = async (symbol, timeframe = '1Day', start, end) => {
  try {
    const params = new URLSearchParams({ timeframe });
    if (start) params.append('start', start);
    if (end) params.append('end', end);
    
    return await makeBackendRequest(`/bars/${symbol}?${params}`);
  } catch (error) {
    console.warn('Backend API failed, using demo data:', error.message);
  }
  
  const historicalData = {
    symbol: symbol,
    bars: [
      { t: "2024-01-01T00:00:00Z", o: 150, h: 155, l: 149, c: 153, v: 1000000 },
      { t: "2024-01-02T00:00:00Z", o: 153, h: 158, l: 152, c: 156, v: 1100000 },
      { t: "2024-01-03T00:00:00Z", o: 156, h: 160, l: 155, c: 158, v: 1200000 }
    ]
  };
  return simulateApiCall(historicalData);
};

// Search Assets
export const searchAssets = async (query) => {
  try {
    return await makeBackendRequest(`/assets?search=${query}`);
  } catch (error) {
    console.warn('Backend API failed, using demo data:', error.message);
  }
  
  const assets = [
    { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", asset_class: "us_equity" },
    { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", asset_class: "us_equity" },
    { symbol: "MSFT", name: "Microsoft Corp.", exchange: "NASDAQ", asset_class: "us_equity" }
  ];
  const filtered = assets.filter(asset => 
    asset.symbol.toLowerCase().includes(query.toLowerCase()) ||
    asset.name.toLowerCase().includes(query.toLowerCase())
  );
  return simulateApiCall(filtered);
};

// Get Asset Details
export const getAsset = async (symbol) => {
  try {
    return await makeBackendRequest(`/assets/${symbol}`);
  } catch (error) {
    console.warn('Backend API failed, using demo data:', error.message);
  }
  
  const assets = {
    AAPL: { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", asset_class: "us_equity" },
    TSLA: { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", asset_class: "us_equity" },
    MSFT: { symbol: "MSFT", name: "Microsoft Corp.", exchange: "NASDAQ", asset_class: "us_equity" }
  };
  return simulateApiCall(assets[symbol] || { symbol, name: "Unknown", exchange: "NASDAQ", asset_class: "us_equity" });
};

// Place Order (Paper Trading)
export const placeOrder = async (orderData) => {
  console.log('🔄 Placing order via backend API...');
  const result = await makeBackendRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
  console.log('✅ Order placed successfully:', result);
  return result;
};

// Get Orders
export const getOrders = async (status = 'all') => {
  try {
    return await makeBackendRequest(`/orders?status=${status}`);
  } catch (error) {
    console.warn('Backend API failed, using demo data:', error.message);
  }
  
  const demoOrders = [
    {
      id: "demo-order-1",
      symbol: "AAPL",
      qty: "10",
      side: "buy",
      type: "market",
      status: "filled",
      created_at: "2024-01-01T10:00:00Z",
      filled_at: "2024-01-01T10:01:00Z",
      filled_qty: "10",
      filled_avg_price: "150.00"
    }
  ];
  return simulateApiCall(demoOrders);
}; 