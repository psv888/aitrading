import React from 'react';

const Header = ({ onLogout }) => (
  <header style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem 2rem 1.5rem 0',
    background: 'transparent',
    borderBottom: '1px solid #23243a',
    marginBottom: '2rem',
    position: 'sticky',
    top: 0,
    zIndex: 10
  }}>
    <div style={{ flex: 1 }}>
      <input
        type="text"
        placeholder="Search coins"
        style={{
          background: '#23243a',
          border: 'none',
          borderRadius: '8px',
          padding: '0.7rem 1.2rem',
          color: '#fff',
          fontSize: '1rem',
          width: '260px',
          outline: 'none',
        }}
      />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <button style={{
        background: '#2172e5',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '0.7rem 1.5rem',
        fontWeight: 'bold',
        fontSize: '1rem',
        cursor: 'pointer',
        marginRight: '0.5rem',
        boxShadow: '0 2px 8px rgba(33,114,229,0.08)'
      }}>
        Trade
      </button>
      <button style={{
        background: '#1ecb98',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '0.7rem 1.5rem',
        fontWeight: 'bold',
        fontSize: '1rem',
        cursor: 'pointer',
        marginRight: '1.5rem',
        boxShadow: '0 2px 8px rgba(30,203,152,0.08)'
      }}>
        Deposit
      </button>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: '#23243a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        SP
      </div>
      <button
        onClick={onLogout}
        style={{
          background: '#e74c3c',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '0.7rem 1.2rem',
          fontWeight: 'bold',
          fontSize: '1rem',
          cursor: 'pointer',
          marginLeft: '1.5rem',
          boxShadow: '0 2px 8px rgba(231,76,60,0.08)'
        }}
      >
        Logout
      </button>
    </div>
  </header>
);

export default Header; 