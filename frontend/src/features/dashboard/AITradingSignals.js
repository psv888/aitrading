import React, { useState, useEffect } from 'react';
import { placeOrder, getLatestQuote } from '../../utils/alpacaApi';

const AITradingSignals = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewSignalForm, setShowNewSignalForm] = useState(false);
  const [newSignal, setNewSignal] = useState({
    action: 'BUY',
    symbol: '',
    amount: '',
    confidence: 75,
    reason: ''
  });

  // Simulated AI signals for testing
  const mockAISignals = [
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
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      action: 'BUY',
      symbol: 'MSFT',
      amount: 1500,
      confidence: 91,
      reason: 'Earnings beat expectations, strong fundamentals',
      status: 'executed'
    }
  ];

  useEffect(() => {
    // Load mock signals for now
    setSignals(mockAISignals);
  }, []);

  const executeSignal = async (signal) => {
    setLoading(true);
    try {
      // Get current quote for the symbol
      const quote = await getLatestQuote(signal.symbol);
      const price = parseFloat(quote.latestTrade?.p || quote.latestQuote?.ap || 0);
      const quantity = Math.floor(signal.amount / price);

      const orderData = {
        symbol: signal.symbol,
        qty: quantity,
        side: signal.action.toLowerCase(),
        type: 'market',
        time_in_force: 'day',
        client_order_id: `ai-signal-${signal.id}-${Date.now()}`
      };

      console.log('Executing AI signal:', orderData);
      const result = await placeOrder(orderData);
      console.log('AI signal executed:', result);

      // Update signal status
      setSignals(prev => prev.map(s => 
        s.id === signal.id ? { ...s, status: 'executed' } : s
      ));

      alert(`AI ${signal.action} order executed for ${signal.symbol}!`);
    } catch (error) {
      console.error('Error executing AI signal:', error);
      alert(`Error executing AI signal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createNewSignal = async () => {
    if (!newSignal.symbol || !newSignal.amount) {
      alert('Please fill in all required fields');
      return;
    }

    const signal = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...newSignal,
      status: 'pending'
    };

    setSignals(prev => [signal, ...prev]);
    setNewSignal({
      action: 'BUY',
      symbol: '',
      amount: '',
      confidence: 75,
      reason: ''
    });
    setShowNewSignalForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffa500';
      case 'executed': return '#1ecb98';
      case 'failed': return '#f36c6c';
      default: return '#aaa';
    }
  };

  const getActionColor = (action) => {
    return action === 'BUY' ? '#1ecb98' : '#f36c6c';
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #23243a 0%, #1a1a3a 100%)',
      borderRadius: '1rem',
      padding: '2rem',
      color: '#fff',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      border: '1px solid #2a2a4a'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
          🤖 AI Trading Signals
        </h2>
        <button
          onClick={() => setShowNewSignalForm(!showNewSignalForm)}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            border: 'none',
            background: '#4a90e2',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {showNewSignalForm ? 'Cancel' : 'New Signal'}
        </button>
      </div>

      {/* New Signal Form */}
      {showNewSignalForm && (
        <div style={{
          background: '#1a1a3a',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid #2a2a4a'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#4a90e2' }}>Create New AI Signal</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <select
              value={newSignal.action}
              onChange={(e) => setNewSignal(prev => ({ ...prev, action: e.target.value }))}
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #2a2a4a',
                background: '#23243a',
                color: '#fff'
              }}
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
            <input
              type="text"
              placeholder="Symbol (e.g., AAPL)"
              value={newSignal.symbol}
              onChange={(e) => setNewSignal(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #2a2a4a',
                background: '#23243a',
                color: '#fff'
              }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="number"
              placeholder="Amount ($)"
              value={newSignal.amount}
              onChange={(e) => setNewSignal(prev => ({ ...prev, amount: e.target.value }))}
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #2a2a4a',
                background: '#23243a',
                color: '#fff'
              }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={newSignal.confidence}
              onChange={(e) => setNewSignal(prev => ({ ...prev, confidence: parseInt(e.target.value) }))}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Reason for signal"
              value={newSignal.reason}
              onChange={(e) => setNewSignal(prev => ({ ...prev, reason: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #2a2a4a',
                background: '#23243a',
                color: '#fff'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowNewSignalForm(false)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                border: '1px solid #2a2a4a',
                background: 'transparent',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={createNewSignal}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                border: 'none',
                background: '#1ecb98',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Create Signal
            </button>
          </div>
        </div>
      )}

      {/* Signals List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {signals.map((signal) => (
          <div
            key={signal.id}
            style={{
              background: '#1a1a3a',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #2a2a4a',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span
                  style={{
                    background: getActionColor(signal.action),
                    color: '#fff',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}
                >
                  {signal.action}
                </span>
                <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>
                  {signal.symbol}
                </span>
                <span style={{ color: '#ccc' }}>
                  ${parseFloat(signal.amount).toLocaleString()}
                </span>
              </div>
              <div style={{ color: '#aaa', fontSize: '0.9rem' }}>
                {signal.reason}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem' }}>
                <span style={{ color: '#ccc' }}>
                  {new Date(signal.timestamp).toLocaleString()}
                </span>
                <span style={{ color: '#ccc' }}>
                  Confidence: {signal.confidence}%
                </span>
                <span
                  style={{
                    color: getStatusColor(signal.status),
                    fontWeight: '600'
                  }}
                >
                  {signal.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {signal.status === 'pending' && (
                <button
                  onClick={() => executeSignal(signal)}
                  disabled={loading}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#1ecb98',
                    color: '#fff',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '0.8rem',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? 'Executing...' : 'Execute'}
                </button>
              )}
              <button
                onClick={() => {
                  setSignals(prev => prev.filter(s => s.id !== signal.id));
                }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #f36c6c',
                  background: 'transparent',
                  color: '#f36c6c',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {signals.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#aaa',
          fontSize: '1.1rem'
        }}>
          No AI signals available. Create your first signal above!
        </div>
      )}
    </div>
  );
};

export default AITradingSignals; 