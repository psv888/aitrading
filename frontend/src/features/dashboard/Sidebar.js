import React from 'react';

const Sidebar = ({ onProfileClick }) => (
  <nav style={{
    width: '220px',
    background: '#151c2c',
    minHeight: '100vh',
    padding: '2rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    color: '#fff',
    boxShadow: '2px 0 8px rgba(0,0,0,0.08)'
  }}>
    <div style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '2rem', letterSpacing: '1px' }}>
      ai-trader
    </div>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <li style={{ cursor: 'pointer' }}>🏠 Home</li>
      <li style={{ cursor: 'pointer' }}>🏀 Sports</li>
      <li style={{ cursor: 'pointer' }}>🔮 Predict</li>
      <li style={{ cursor: 'pointer' }}>💼 Accounts</li>
      <li style={{ cursor: 'pointer' }}>📈 Market</li>
      <li 
        style={{ cursor: 'pointer', color: '#4a90e2' }}
        onClick={onProfileClick}
      >
        ⚙️ Profile Settings
      </li>
      <li style={{ cursor: 'pointer' }}>⋯ More</li>
    </ul>
  </nav>
);

export default Sidebar; 