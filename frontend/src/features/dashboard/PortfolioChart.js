import React, { useState, useEffect } from 'react';
import { getPortfolioHistory } from '../../utils/alpacaApi';

const PortfolioChart = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('1M');
  const [chartType, setChartType] = useState('line');

  const timeframes = [
    { key: '1D', label: '1 Day' },
    { key: '1W', label: '1 Week' },
    { key: '1M', label: '1 Month' },
    { key: '3M', label: '3 Months' },
    { key: '6M', label: '6 Months' },
    { key: '1Y', label: '1 Year' }
  ];

  const chartTypes = [
    { key: 'line', label: 'Line', icon: '📈' },
    { key: 'area', label: 'Area', icon: '📊' },
    { key: 'candlestick', label: 'Candlestick', icon: '🕯️' }
  ];

  useEffect(() => {
    fetchPortfolioData();
  }, [timeframe]);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const data = await getPortfolioHistory(timeframe, '1D');
      setPortfolioData(data);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      // Use mock data as fallback
      setPortfolioData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const days = timeframe === '1D' ? 24 : 
                 timeframe === '1W' ? 7 : 
                 timeframe === '1M' ? 30 : 
                 timeframe === '3M' ? 90 : 
                 timeframe === '6M' ? 180 : 365;
    
    const baseValue = 100000;
    const data = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      // Generate realistic price movement
      const volatility = 0.02; // 2% daily volatility
      const trend = 0.0005; // Slight upward trend
      const randomChange = (Math.random() - 0.5) * volatility;
      const trendChange = trend;
      
      const change = randomChange + trendChange;
      const value = i === 0 ? baseValue : data[i-1].value * (1 + change);
      
      data.push({
        date: date.toISOString(),
        value: Math.round(value),
        change: i === 0 ? 0 : Math.round((value - data[i-1].value)),
        changePercent: i === 0 ? 0 : ((value - data[i-1].value) / data[i-1].value * 100)
      });
    }
    
    return {
      timestamp: data.map(d => new Date(d.date).getTime() / 1000),
      equity: data.map(d => d.value),
      profit_loss: data.map(d => d.change),
      profit_loss_pct: data.map(d => d.changePercent)
    };
  };

  const calculateStats = () => {
    if (!portfolioData) return null;
    
    const values = portfolioData.equity;
    const changes = portfolioData.profit_loss_pct;
    
    const currentValue = values[values.length - 1];
    const startValue = values[0];
    const totalChange = currentValue - startValue;
    const totalChangePercent = ((currentValue - startValue) / startValue) * 100;
    
    // Calculate daily returns
    const dailyReturns = changes.slice(1); // Skip first day (no change)
    const avgDailyReturn = dailyReturns.reduce((sum, ret) => sum + ret, 0) / dailyReturns.length;
    
    // Calculate volatility (standard deviation of daily returns)
    const variance = dailyReturns.reduce((sum, ret) => sum + Math.pow(ret - avgDailyReturn, 2), 0) / dailyReturns.length;
    const volatility = Math.sqrt(variance);
    
    // Find max drawdown
    let maxDrawdown = 0;
    let peak = values[0];
    for (let i = 1; i < values.length; i++) {
      if (values[i] > peak) {
        peak = values[i];
      }
      const drawdown = (peak - values[i]) / peak * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }
    
    return {
      currentValue,
      startValue,
      totalChange,
      totalChangePercent,
      avgDailyReturn,
      volatility,
      maxDrawdown
    };
  };

  const renderChart = () => {
    if (!portfolioData) return null;
    
    const { equity, timestamp } = portfolioData;
    const stats = calculateStats();
    
    // Simple SVG chart
    const width = 800;
    const height = 300;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    const minValue = Math.min(...equity);
    const maxValue = Math.max(...equity);
    const valueRange = maxValue - minValue;
    
    const xScale = (timestamp - timestamp[0]) / (timestamp[timestamp.length - 1] - timestamp[0]);
    const yScale = (value - minValue) / valueRange;
    
    const points = equity.map((value, index) => {
      const x = padding + (index / (equity.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <svg width={width} height={height} style={{ maxWidth: '100%', height: 'auto' }}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
            <g key={i}>
              <line
                x1={padding}
                y1={padding + t * chartHeight}
                x2={width - padding}
                y2={padding + t * chartHeight}
                stroke="#2a2a4a"
                strokeWidth="1"
                opacity="0.3"
              />
              <text
                x={padding - 10}
                y={padding + t * chartHeight + 4}
                fill="#aaa"
                fontSize="12"
                textAnchor="end"
              >
                ${Math.round(minValue + (1 - t) * valueRange).toLocaleString()}
              </text>
            </g>
          ))}
          
          {/* Chart line */}
          <polyline
            points={points}
            fill="none"
            stroke="#4a90e2"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Area fill */}
          <polygon
            points={`${padding},${padding + chartHeight} ${points} ${width - padding},${padding + chartHeight}`}
            fill="url(#gradient)"
            opacity="0.2"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4a90e2" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4a90e2" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Data points */}
          {equity.map((value, index) => {
            const x = padding + (index / (equity.length - 1)) * chartWidth;
            const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="#4a90e2"
                opacity="0.8"
              />
            );
          })}
        </svg>
        
        {/* Chart stats */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Current Value</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#fff' }}>
                ${stats.currentValue.toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Total Change</div>
              <div style={{ 
                fontSize: '1.2rem', 
                fontWeight: '600', 
                color: stats.totalChange >= 0 ? '#1ecb98' : '#f36c6c' 
              }}>
                {stats.totalChange >= 0 ? '+' : ''}${stats.totalChange.toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Change %</div>
              <div style={{ 
                fontSize: '1.2rem', 
                fontWeight: '600', 
                color: stats.totalChangePercent >= 0 ? '#1ecb98' : '#f36c6c' 
              }}>
                {stats.totalChangePercent >= 0 ? '+' : ''}{stats.totalChangePercent.toFixed(2)}%
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Max Drawdown</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#f36c6c' }}>
                {stats.maxDrawdown.toFixed(2)}%
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #23243a 0%, #1a1a3a 100%)',
        borderRadius: '1rem',
        padding: '2rem',
        color: '#fff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        border: '1px solid #2a2a4a',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
        <div>Loading portfolio data...</div>
      </div>
    );
  }

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
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
          📊 Portfolio Performance
        </h2>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Timeframe selector */}
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {timeframes.map(tf => (
              <button
                key={tf.key}
                onClick={() => setTimeframe(tf.key)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: timeframe === tf.key ? '2px solid #4a90e2' : '1px solid #2a2a4a',
                  background: timeframe === tf.key ? '#4a90e2' : 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}
              >
                {tf.label}
              </button>
            ))}
          </div>
          
          {/* Chart type selector */}
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {chartTypes.map(ct => (
              <button
                key={ct.key}
                onClick={() => setChartType(ct.key)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: chartType === ct.key ? '2px solid #4a90e2' : '1px solid #2a2a4a',
                  background: chartType === ct.key ? '#4a90e2' : 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}
                title={ct.label}
              >
                {ct.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      {renderChart()}

      {/* Additional portfolio metrics */}
      {portfolioData && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <div style={{
            background: '#1a1a3a',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #2a2a4a',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
              Best Day
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1ecb98' }}>
              +{Math.max(...portfolioData.profit_loss_pct).toFixed(2)}%
            </div>
          </div>
          
          <div style={{
            background: '#1a1a3a',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #2a2a4a',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
              Worst Day
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f36c6c' }}>
              {Math.min(...portfolioData.profit_loss_pct).toFixed(2)}%
            </div>
          </div>
          
          <div style={{
            background: '#1a1a3a',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #2a2a4a',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
              Volatility
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#ffa500' }}>
              {calculateStats()?.volatility.toFixed(2)}%
            </div>
          </div>
          
          <div style={{
            background: '#1a1a3a',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #2a2a4a',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
              Avg Daily Return
            </div>
            <div style={{ 
              fontSize: '1.1rem', 
              fontWeight: '600', 
              color: calculateStats()?.avgDailyReturn >= 0 ? '#1ecb98' : '#f36c6c' 
            }}>
              {calculateStats()?.avgDailyReturn.toFixed(2)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioChart; 