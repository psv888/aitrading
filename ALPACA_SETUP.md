# Alpaca API Setup Guide

## Step 1: Get Alpaca API Keys

1. Go to [Alpaca Markets](https://alpaca.markets/)
2. Sign up for a free account
3. Navigate to "Paper Trading" (for testing)
4. Go to "API Keys" section
5. Generate new API keys

## Step 2: Configure API Keys

1. Open `ai-trading-app/frontend/src/utils/alpacaApi.js`
2. Replace the placeholder values:
   ```javascript
   const ALPACA_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
   const ALPACA_SECRET_KEY = 'YOUR_ACTUAL_SECRET_KEY_HERE';
   ```

## Step 3: Test the Integration

1. Start your backend server: `cd backend && node index.js`
2. Start your frontend: `cd frontend && npm start`
3. Login to your dashboard
4. You should see real portfolio data from Alpaca

## Available Features

✅ **Portfolio Summary** - Real account balance and daily changes  
✅ **Holdings Table** - Current positions with P&L  
✅ **Market Data** - Real-time quotes and historical data  
✅ **Paper Trading** - Safe testing environment  

## API Endpoints Used

- Account Information: `/v2/account`
- Portfolio History: `/v2/account/portfolio/history`
- Positions: `/v2/positions`
- Market Data: `/v2/stocks/{symbol}/quote`
- Historical Data: `/v2/stocks/{symbol}/bars`

## Next Steps

1. Add real-time price updates
2. Implement trading functionality
3. Add watchlist management
4. Create order placement interface

## Important Notes

- Using **Paper Trading** for safety
- API calls are rate-limited
- Data is real but trades are simulated
- Perfect for testing and development 