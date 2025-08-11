import React, { useState, useEffect } from 'react';
import { getWatchlists, getLatestQuote } from '../../utils/alpacaApi';
import { useTheme } from '../../context/ThemeContext';

const Watchlist = () => {
  const { isLightMode } = useTheme();
  const [watchlist, setWatchlist] = useState([]);
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatchlistData = async () => {
      try {
        setLoading(true);
        const watchlists = await getWatchlists();
        if (watchlists.length > 0) {
          const assets = watchlists[0].assets;
          setWatchlist(assets);
          
          // Fetch quotes for each asset
          const quotesData = {};
          for (const asset of assets) {
            const quote = await getLatestQuote(asset.symbol);
            quotesData[asset.symbol] = quote;
          }
          setQuotes(quotesData);
        }
      } catch (err) {
        console.error('Error fetching watchlist data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistData();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        marginBottom: '2rem', 
        padding: '1rem', 
        background: isLightMode ? '#f5f6fa' : '#2c3e50', 
        borderRadius: 12,
        color: isLightMode ? '#2c3e50' : '#ffffff'
      }}>
        <h3>Watchlist</h3>
        <p>Loading watchlist...</p>
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
        <h3>Watchlist</h3>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div style={{ 
        marginBottom: '2rem', 
        padding: '1rem', 
        background: isLightMode ? '#f5f6fa' : '#2c3e50', 
        borderRadius: 12,
        color: isLightMode ? '#2c3e50' : '#ffffff'
      }}>
        <h3>Watchlist</h3>
        <p>No watchlist items found. Add stocks to your watchlist to see them here.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      marginBottom: '2rem', 
      padding: '1rem', 
      background: isLightMode ? '#f5f6fa' : '#2c3e50', 
      borderRadius: 12,
      color: isLightMode ? '#2c3e50' : '#ffffff'
    }}>
      <h3>Watchlist</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${isLightMode ? '#ddd' : '#555'}` }}>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Symbol</th>
            <th style={{ textAlign: 'right', padding: '0.5rem' }}>Price</th>
            <th style={{ textAlign: 'right', padding: '0.5rem' }}>Change</th>
          </tr>
        </thead>
        <tbody>
          {watchlist.map((asset) => {
            const quote = quotes[asset.symbol];
            const price = quote?.last_price || 0;
            const change = ((price - 150) / 150) * 100; // Demo change calculation
            const isPositive = change >= 0;
            
            return (
              <tr key={asset.symbol} style={{ borderBottom: `1px solid ${isLightMode ? '#eee' : '#444'}` }}>
                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>{asset.symbol}</td>
                <td style={{ textAlign: 'right', padding: '0.5rem' }}>${price.toFixed(2)}</td>
                <td style={{ 
                  textAlign: 'right', 
                  padding: '0.5rem',
                  color: isPositive ? 'green' : 'red'
                }}>
                  {isPositive ? '+' : ''}{change.toFixed(1)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Watchlist; 