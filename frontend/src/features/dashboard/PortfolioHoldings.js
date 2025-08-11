import React, { useState, useEffect } from 'react';
import { getPositions } from '../../utils/alpacaApi';

const PortfolioHoldings = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true);
        const positionsData = await getPositions();
        setPositions(positionsData);
      } catch (error) {
        console.error('Error fetching positions:', error);
        setPositions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPositions, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  const formatPercentage = (value) => {
    const num = parseFloat(value);
    return `${num >= 0 ? '+' : ''}${(num * 100).toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #23243a 0%, #1a1a3a 100%)',
        borderRadius: '1rem',
        padding: '2rem',
        color: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
        textAlign: 'center'
      }}>
        Loading portfolio holdings...
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #23243a 0%, #1a1a3a 100%)',
      borderRadius: '1rem',
      padding: '2rem',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      marginBottom: '2rem'
    }}>
      <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem' }}>Portfolio Holdings</h3>
      
      {positions.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#aaa', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
          <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No positions yet</div>
          <div style={{ fontSize: '0.9rem' }}>Start trading to see your holdings here</div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#aaa' }}>Symbol</th>
                <th style={{ textAlign: 'right', padding: '1rem', color: '#aaa' }}>Shares</th>
                <th style={{ textAlign: 'right', padding: '1rem', color: '#aaa' }}>Avg Price</th>
                <th style={{ textAlign: 'right', padding: '1rem', color: '#aaa' }}>Market Value</th>
                <th style={{ textAlign: 'right', padding: '1rem', color: '#aaa' }}>P&L</th>
                <th style={{ textAlign: 'right', padding: '1rem', color: '#aaa' }}>P&L %</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position, index) => {
                const unrealizedPL = parseFloat(position.unrealized_pl);
                const unrealizedPLPc = parseFloat(position.unrealized_plpc);
                const isPositive = unrealizedPL >= 0;
                
                return (
                  <tr key={position.symbol} style={{ 
                    borderBottom: '1px solid #333',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    ':hover': { background: '#2a2b4a' }
                  }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                      {position.symbol}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {parseInt(position.qty).toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {formatCurrency(position.avg_entry_price)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
                      {formatCurrency(position.market_value)}
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      textAlign: 'right', 
                      color: isPositive ? '#1ecb98' : '#f36c6c',
                      fontWeight: 'bold'
                    }}>
                      {formatCurrency(position.unrealized_pl)}
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      textAlign: 'right', 
                      color: isPositive ? '#1ecb98' : '#f36c6c',
                      fontWeight: 'bold'
                    }}>
                      {formatPercentage(position.unrealized_plpc)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {positions.length > 0 && (
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          background: '#1a1a3a', 
          borderRadius: '0.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Total Positions</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              {positions.length} {positions.length === 1 ? 'position' : 'positions'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Total Market Value</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              {formatCurrency(positions.reduce((sum, pos) => sum + parseFloat(pos.market_value), 0))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioHoldings; 