import React, { useState, useEffect } from 'react';
import { placeOrder, getLatestQuote } from '../../utils/alpacaApi';

const BuySellWidget = ({ onTradeComplete }) => {
  const [tab, setTab] = useState('Buy');
  const [symbol, setSymbol] = useState('AAPL');
  const [quantity, setQuantity] = useState('1');
  const [orderType, setOrderType] = useState('market');
  const [timeInForce, setTimeInForce] = useState('day');
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(null);
  const [estimatedCost, setEstimatedCost] = useState(0);

  const popularStocks = ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'NFLX'];

  // Fetch latest quote when symbol changes
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const quoteData = await getLatestQuote(symbol);
        setQuote(quoteData);
        // Calculate estimated cost using the correct price field
        const price = parseFloat(quoteData.latestTrade?.p || quoteData.latestQuote?.ap || 0);
        const qty = parseFloat(quantity) || 0;
        setEstimatedCost(price * qty);
      } catch (error) {
        console.error('Error fetching quote:', error);
        setQuote(null);
        setEstimatedCost(0);
      }
    };
    fetchQuote();
  }, [symbol, quantity]);

  const handleTrade = async () => {
    if (!symbol || !quantity) {
      alert('Please enter symbol and quantity');
      return;
    }

    if (parseFloat(quantity) <= 0) {
      alert('Quantity must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      // Get current quote to set a reasonable limit price
      let limitPrice = null;
      if (quote && quote.latestTrade?.p) {
        const currentPrice = parseFloat(quote.latestTrade.p);
        // Set limit price slightly above current price for buy orders, slightly below for sell orders
        limitPrice = tab === 'Buy' ? currentPrice * 1.01 : currentPrice * 0.99;
      }

      const orderData = {
        symbol: symbol.toUpperCase(),
        qty: quantity,
        side: tab.toLowerCase(),
        type: limitPrice ? 'limit' : 'market', // Use limit order if we have a price
        time_in_force: 'day',
        client_order_id: `manual-${Date.now()}`,
        ...(limitPrice && { limit_price: limitPrice.toFixed(2) })
      };

      console.log('Placing order:', orderData);
      const result = await placeOrder(orderData);
      console.log('Order placed:', result);
      
      if (result && result.id) {
        alert(`${tab} order placed successfully for ${quantity} shares of ${symbol}!`);
        setQuantity('1');
        
        // Refresh account data multiple times to ensure it updates
        if (onTradeComplete) {
          console.log('🔄 Refreshing account data...');
          // Immediate refresh
          onTradeComplete();
          // Refresh again after 3 seconds
          setTimeout(() => onTradeComplete(), 3000);
          // Final refresh after 5 seconds
          setTimeout(() => onTradeComplete(), 5000);
        }
      } else {
        throw new Error('Order placement failed');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert(`Error placing order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAmount = (amount) => {
    if (quote) {
      const price = parseFloat(quote.latestTrade?.p || quote.latestQuote?.ap || 0);
      const qty = Math.floor(amount / price);
      setQuantity(qty.toString());
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #23243a 0%, #1a1a3a 100%)',
      borderRadius: '1rem',
      padding: '2rem',
      minWidth: '320px',
      minHeight: '400px',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '1rem',
      gap: '1.2rem',
    }}>
      {/* Buy/Sell Tabs */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setTab('Buy')}
          style={{
            background: tab === 'Buy' ? '#1ecb98' : 'transparent',
            color: tab === 'Buy' ? '#fff' : '#aaa',
            border: 'none',
            borderBottom: tab === 'Buy' ? '2px solid #1ecb98' : '2px solid transparent',
            fontWeight: 'bold',
            fontSize: '1rem',
            padding: '0.5rem 1.5rem',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Buy
        </button>
        <button
          onClick={() => setTab('Sell')}
          style={{
            background: tab === 'Sell' ? '#f36c6c' : 'transparent',
            color: tab === 'Sell' ? '#fff' : '#aaa',
            border: 'none',
            borderBottom: tab === 'Sell' ? '2px solid #f36c6c' : '2px solid transparent',
            fontWeight: 'bold',
            fontSize: '1rem',
            padding: '0.5rem 1.5rem',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Sell
        </button>
      </div>

      {/* Symbol Input */}
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>
          Symbol
        </label>
        <input
          type="text"
          placeholder="Enter stock symbol (e.g., AAPL)"
          value={symbol}
          onChange={e => setSymbol(e.target.value.toUpperCase())}
          style={{
            background: '#23243a',
            border: 'none',
            borderRadius: '8px',
            padding: '0.7rem 1.2rem',
            color: '#fff',
            fontSize: '1.1rem',
            width: '100%',
            outline: 'none',
            marginBottom: '0.5rem'
          }}
        />
        {quote && (
          <div style={{ fontSize: '0.9rem', color: '#1ecb98', marginBottom: '1rem' }}>
            ${parseFloat(quote.latestTrade?.p || quote.latestQuote?.ap || 0).toFixed(2)} • {quote.dailyBar?.c && quote.dailyBar?.o ? `${((quote.dailyBar.c - quote.dailyBar.o) / quote.dailyBar.o * 100).toFixed(2)}%` : '0.00%'}
          </div>
        )}
      </div>

      {/* Quantity Input */}
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>
          Quantity
        </label>
        <input
          type="number"
          placeholder="Number of shares"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          style={{
            background: '#23243a',
            border: 'none',
            borderRadius: '8px',
            padding: '0.7rem 1.2rem',
            color: '#fff',
            fontSize: '1.1rem',
            width: '100%',
            outline: 'none',
          }}
        />
      </div>

      {/* Order Type */}
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>
          Order Type
        </label>
        <select
          value={orderType}
          onChange={e => setOrderType(e.target.value)}
          style={{
            background: '#23243a',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.7rem 1.2rem',
            fontSize: '1.1rem',
            outline: 'none',
            width: '100%'
          }}
        >
          <option value="market">Market</option>
          <option value="limit">Limit</option>
        </select>
      </div>

      {/* Quick Amount Buttons */}
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>
          Quick Amounts
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[100, 500, 1000, 2000].map(amount => (
            <button
              key={amount}
              onClick={() => handleQuickAmount(amount)}
              style={{
                background: '#23243a',
                color: '#fff',
                border: '1px solid #23243a',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>

      {/* Estimated Cost */}
      {estimatedCost > 0 && (
        <div style={{
          background: '#1a1a3a',
          borderRadius: '8px',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
            Estimated Cost
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1ecb98' }}>
            ${estimatedCost.toFixed(2)}
          </div>
        </div>
      )}

      {/* Trade Button */}
      <button
        disabled={loading || !symbol || !quantity}
        style={{
          background: loading ? '#666' : (tab === 'Buy' ? '#1ecb98' : '#f36c6c'),
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '1rem 0',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          cursor: (loading || !symbol || !quantity) ? 'not-allowed' : 'pointer',
          width: '100%',
          marginTop: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        onClick={handleTrade}
      >
        {loading ? 'Placing Order...' : `${tab} ${symbol}`}
      </button>

      {/* Popular Stocks */}
      <div style={{ marginTop: '1rem' }}>
        <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
          Popular Stocks
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {popularStocks.map(stock => (
            <button
              key={stock}
              onClick={() => setSymbol(stock)}
              style={{
                background: symbol === stock ? '#2172e5' : '#23243a',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.3rem 0.8rem',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {stock}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuySellWidget; 