import React, { useState } from 'react';

const tabList = ['Coins', 'Baskets'];
const filterList = ['Favourites', 'Top Gainers', 'Top Losers', 'New', 'Most Traded'];

const AssetTabs = () => {
  const [activeTab, setActiveTab] = useState('Coins');
  const [activeFilter, setActiveFilter] = useState('Favourites');

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
        {tabList.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === tab ? '#1ecb98' : '#fff',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              fontSize: '1.1rem',
              borderBottom: activeTab === tab ? '2px solid #1ecb98' : '2px solid transparent',
              padding: '0.5rem 0',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {filterList.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              background: activeFilter === filter ? '#1ecb98' : 'transparent',
              color: activeFilter === filter ? '#fff' : '#aaa',
              border: 'none',
              borderRadius: '20px',
              padding: '0.4rem 1.1rem',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AssetTabs; 