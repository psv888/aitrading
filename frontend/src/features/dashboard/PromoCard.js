import React from 'react';

const PromoCard = () => (
  <div style={{
    background: 'linear-gradient(135deg, #23243a 0%, #1a1a3a 100%)',
    borderRadius: '1rem',
    padding: '2rem',
    minWidth: '320px',
    minHeight: '120px',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '1rem',
    gap: '1.5rem',
  }}>
    <div style={{ fontSize: '2.5rem' }}>🔭</div>
    <div>
      <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.3rem' }}>Prediction Trading is here</div>
      <div style={{ color: '#b0b0b0', fontSize: '0.98rem' }}>
        Predict the outcome of political, economic, and other global events. Get $10 if you’re right. <span style={{ color: '#1ecb98', cursor: 'pointer', marginLeft: 4 }}>Trade Now</span>
      </div>
    </div>
  </div>
);

export default PromoCard; 