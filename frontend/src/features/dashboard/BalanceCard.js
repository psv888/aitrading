import React, { useState } from 'react';

const BalanceCard = ({ accountData, loading }) => {
  const [isVisible, setIsVisible] = useState(true);
  const portfolioValue = accountData ? parseFloat(accountData.portfolio_value) : 0;
  const cash = accountData ? parseFloat(accountData.cash) : 0;
  const buyingPower = accountData ? parseFloat(accountData.buying_power) : 0;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #23243a 0%, #1a1a3a 100%)',
      borderRadius: '1rem',
      padding: '2rem',
      minWidth: '260px',
      minHeight: '120px',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      marginBottom: '1rem',
    }}>
      <div style={{ fontSize: '1.1rem', color: '#aaa', marginBottom: '0.5rem' }}>
        Total Balance 
        <span 
          style={{ 
            fontSize: '1rem', 
            marginLeft: 6, 
            color: isVisible ? '#888' : '#4caf50',
            cursor: 'pointer',
            transition: 'color 0.2s ease'
          }}
          onClick={() => setIsVisible(!isVisible)}
          title={isVisible ? 'Hide balance' : 'Show balance'}
        >
          {isVisible ? '👁️' : '🙈'}
        </span>
      </div>
      {loading ? (
        <div style={{ fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Loading...</div>
      ) : (
        <>
          <div style={{ fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {isVisible ? (
              <>${portfolioValue.toLocaleString()} <span style={{ fontSize: '1.1rem', color: '#aaa' }}>USD</span></>
            ) : (
              <span style={{ fontSize: '1.5rem', color: '#888' }}>••••••••••••••••</span>
            )}
          </div>
          <div style={{ fontSize: '1rem', color: '#4caf50', display: 'flex', gap: '1.5rem' }}>
            <span>Buying Power: {isVisible ? `$${buyingPower.toLocaleString()}` : '••••••••••••••••'}</span>
            <span>Cash: {isVisible ? `$${cash.toLocaleString()}` : '••••••••••••••••'}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default BalanceCard; 