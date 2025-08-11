import React, { useEffect, useState } from 'react';
import { getLatestQuote, searchAssets } from '../../utils/alpacaApi';

const popularStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' }
];

const AssetTable = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        const stockData = await Promise.all(
          popularStocks.map(async (stock) => {
            try {
              const quote = await getLatestQuote(stock.symbol);
              console.log(`Quote for ${stock.symbol}:`, quote);
              return {
                name: stock.name,
                symbol: stock.symbol,
                price: `$${parseFloat(quote.latestTrade?.p || quote.latestQuote?.ap || 0).toFixed(2)}`,
                change: quote.dailyBar?.c && quote.dailyBar?.o ? `${((quote.dailyBar.c - quote.dailyBar.o) / quote.dailyBar.o * 100).toFixed(2)}%` : '0.00%',
                changeColor: quote.dailyBar?.c && quote.dailyBar?.o ? (quote.dailyBar.c >= quote.dailyBar.o ? '#1ecb98' : '#f36c6c') : '#aaa',
                volume: quote.dailyBar?.v ? parseInt(quote.dailyBar.v).toLocaleString() : 'N/A'
              };
            } catch (error) {
              console.error(`Error fetching ${stock.symbol}:`, error);
              return {
                name: stock.name,
                symbol: stock.symbol,
                price: 'Error',
                change: '0.00%',
                changeColor: '#aaa',
                volume: 'N/A'
              };
            }
          })
        );
        setAssets(stockData);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStockData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>
        Loading market data...
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
    }}>
      <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem' }}>Popular Stocks</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '1rem', color: '#aaa' }}>Symbol</th>
              <th style={{ textAlign: 'left', padding: '1rem', color: '#aaa' }}>Name</th>
              <th style={{ textAlign: 'right', padding: '1rem', color: '#aaa' }}>Price</th>
              <th style={{ textAlign: 'right', padding: '1rem', color: '#aaa' }}>Change</th>
              <th style={{ textAlign: 'right', padding: '1rem', color: '#aaa' }}>Volume</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, index) => (
              <tr key={asset.symbol} style={{ 
                borderBottom: '1px solid #333',
                cursor: 'pointer',
                transition: 'background 0.2s',
                ':hover': { background: '#2a2b4a' }
              }}>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{asset.symbol}</td>
                <td style={{ padding: '1rem', color: '#ccc' }}>{asset.name}</td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>{asset.price}</td>
                <td style={{ 
                  padding: '1rem', 
                  textAlign: 'right', 
                  color: asset.changeColor,
                  fontWeight: 'bold'
                }}>
                  {asset.change}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right', color: '#ccc' }}>{asset.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetTable; 