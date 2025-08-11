import React, { useState, useEffect } from 'react';
import { getPositions } from '../../utils/alpacaApi';
import { useTheme } from '../../context/ThemeContext';

const HoldingsTable = () => {
  const { isLightMode } = useTheme();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true);
        const data = await getPositions();
        setPositions(data);
      } catch (err) {
        console.error('Error fetching positions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        padding: '1rem', 
        background: isLightMode ? '#f5f6fa' : '#2c3e50', 
        borderRadius: 12,
        color: isLightMode ? '#2c3e50' : '#ffffff'
      }}>
        <h3>Holdings</h3>
        <p>Loading positions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '1rem', 
        background: isLightMode ? '#f5f6fa' : '#2c3e50', 
        borderRadius: 12,
        color: isLightMode ? '#2c3e50' : '#ffffff'
      }}>
        <h3>Holdings</h3>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div style={{ 
        padding: '1rem', 
        background: isLightMode ? '#f5f6fa' : '#2c3e50', 
        borderRadius: 12,
        color: isLightMode ? '#2c3e50' : '#ffffff'
      }}>
        <h3>Holdings</h3>
        <p>No positions found. Start trading to see your holdings here.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '1rem', 
      background: isLightMode ? '#f5f6fa' : '#2c3e50', 
      borderRadius: 12,
      color: isLightMode ? '#2c3e50' : '#ffffff'
    }}>
      <h3>Holdings</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${isLightMode ? '#ddd' : '#555'}` }}>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Symbol</th>
              <th style={{ textAlign: 'right', padding: '0.5rem' }}>Shares</th>
              <th style={{ textAlign: 'right', padding: '0.5rem' }}>Avg Price</th>
              <th style={{ textAlign: 'right', padding: '0.5rem' }}>Market Value</th>
              <th style={{ textAlign: 'right', padding: '0.5rem' }}>P&L</th>
              <th style={{ textAlign: 'right', padding: '0.5rem' }}>P&L %</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => {
              const isPositive = parseFloat(position.unrealized_pl) >= 0;
              return (
                <tr key={position.symbol} style={{ borderBottom: `1px solid ${isLightMode ? '#eee' : '#444'}` }}>
                  <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>{position.symbol}</td>
                  <td style={{ textAlign: 'right', padding: '0.5rem' }}>{parseFloat(position.qty).toFixed(2)}</td>
                  <td style={{ textAlign: 'right', padding: '0.5rem' }}>${parseFloat(position.avg_entry_price).toFixed(2)}</td>
                  <td style={{ textAlign: 'right', padding: '0.5rem' }}>${parseFloat(position.market_value).toFixed(2)}</td>
                  <td style={{ 
                    textAlign: 'right', 
                    padding: '0.5rem',
                    color: isPositive ? 'green' : 'red'
                  }}>
                    {isPositive ? '+' : ''}${parseFloat(position.unrealized_pl).toFixed(2)}
                  </td>
                  <td style={{ 
                    textAlign: 'right', 
                    padding: '0.5rem',
                    color: isPositive ? 'green' : 'red'
                  }}>
                    {isPositive ? '+' : ''}{parseFloat(position.unrealized_plpc * 100).toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoldingsTable; 