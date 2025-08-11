import React, { useState, useEffect } from 'react';
import { getAccount, getPortfolioHistory } from '../../utils/alpacaApi';
import { useTheme } from '../../context/ThemeContext';

const PortfolioSummary = () => {
  const { isLightMode } = useTheme();
  const [accountData, setAccountData] = useState(null);
  const [portfolioHistory, setPortfolioHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        const [account, history] = await Promise.all([
          getAccount(),
          getPortfolioHistory('1D', '1Hour')
        ]);
        
        setAccountData(account);
        setPortfolioHistory(history);
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  const calculateTodayChange = () => {
    if (!portfolioHistory || !portfolioHistory.equity) return { change: 0, percent: 0 };
    
    const equity = portfolioHistory.equity;
    if (equity.length < 2) return { change: 0, percent: 0 };
    
    const todayStart = equity[0];
    const current = equity[equity.length - 1];
    const change = current - todayStart;
    const percent = (change / todayStart) * 100;
    
    return { change, percent };
  };

  // Helper function to safely convert to number and format
  const formatCurrency = (value) => {
    const num = parseFloat(value) || 0;
    return num.toFixed(2);
  };

  if (loading) {
    return (
      <div style={{ 
        marginBottom: '2rem', 
        padding: '1rem', 
        background: isLightMode ? '#f5f6fa' : '#2c3e50', 
        borderRadius: 12,
        color: isLightMode ? '#2c3e50' : '#ffffff'
      }}>
        <h2>Portfolio Value</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        marginBottom: '2rem', 
        padding: '1rem', 
        background: isLightMode ? '#f5f6fa' : '#2c3e50', 
        borderRadius: 12,
        color: isLightMode ? '#2c3e50' : '#ffffff'
      }}>
        <h2>Portfolio Value</h2>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <p>Please check your Alpaca API credentials</p>
      </div>
    );
  }

  const { change, percent } = calculateTodayChange();
  const isPositive = change >= 0;

  return (
    <div style={{ 
      marginBottom: '2rem', 
      padding: '1rem', 
      background: isLightMode ? '#f5f6fa' : '#2c3e50', 
      borderRadius: 12,
      color: isLightMode ? '#2c3e50' : '#ffffff'
    }}>
      <h2>Portfolio Value</h2>
      <h1>${formatCurrency(accountData?.portfolio_value)}</h1>
      <p style={{ color: isPositive ? 'green' : 'red' }}>
        {isPositive ? '+' : ''}${change.toFixed(2)} ({isPositive ? '+' : ''}{percent.toFixed(2)}%) today
      </p>
      <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
        <p>Cash: ${formatCurrency(accountData?.cash)}</p>
        <p>Buying Power: ${formatCurrency(accountData?.buying_power)}</p>
      </div>
    </div>
  );
};

export default PortfolioSummary; 