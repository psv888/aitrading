import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import BalanceCard from './BalanceCard';
import PromoCard from './PromoCard';
import BuySellWidget from './BuySellWidget';
import AssetTabs from './AssetTabs';
import AssetTable from './AssetTable';
import PortfolioHoldings from './PortfolioHoldings';
import ProfileSettings from './ProfileSettings';
import AITradingSignals from './AITradingSignals';
import MarketNews from './MarketNews';
import { getAccount } from '../../utils/alpacaApi';

const DashboardContainer = ({ userData, onLogout, onProfileUpdate }) => {
  const [alpacaAccount, setAlpacaAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showSPModal, setShowSPModal] = useState(false);

  const fetchAlpacaAccount = async () => {
    try {
      setLoading(true);
      console.log('🔄 Starting to fetch Alpaca account...');
      const accountData = await getAccount();
      console.log('✅ Alpaca account data received:', accountData);
      console.log('💰 Buying power:', accountData.buying_power);
      console.log('📊 Portfolio value:', accountData.portfolio_value);
      console.log('💵 Cash:', accountData.cash);
      setAlpacaAccount(accountData);
    } catch (error) {
      console.error('❌ Error fetching Alpaca account:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlpacaAccount();
  }, []);

  // Function to refresh account data after trades
  const refreshAccountData = () => {
    console.log('🔄 Refreshing account data after trade...');
    // Force a fresh fetch by clearing the current data first
    setAlpacaAccount(null);
    setLoading(true);
    fetchAlpacaAccount();
  };

  const handleProfileUpdate = (updatedData) => {
    // Update the user data in the parent component
    if (onProfileUpdate) {
      onProfileUpdate(updatedData);
    }
    console.log('Profile updated:', updatedData);
  };

  console.log('userData in Dashboard:', userData);
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#10182b', color: '#fff' }}>
      <Sidebar onProfileClick={() => setShowProfileSettings(true)} />
      <main style={{ flex: 1, padding: '2rem' }}>
        {/* User Account Summary Card */}
        {userData ? (
          <div style={{
            background: '#23243a',
            color: '#fff',
            borderRadius: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            padding: '2rem',
            minWidth: 320,
            marginBottom: '2rem',
            zIndex: 2,
          }}>
            <h3 style={{ margin: 0, marginBottom: '1rem' }}>User Account Summary</h3>
            <div><b>Email:</b> {userData.email || userData.userId}</div>
            <div><b>Experience:</b> {userData.experience}</div>
            <div><b>Investment Goal:</b> {userData.goal}</div>
            <div><b>Risk Tolerance:</b> {userData.risk}</div>
            {loading ? (
              <div style={{ color: '#ffa500', marginTop: '0.5rem' }}>
                <b>Loading Alpaca account...</b>
              </div>
            ) : alpacaAccount ? (
              <>
                <div><b>Alpaca Account ID:</b> {alpacaAccount.id}</div>
                <div><b>Alpaca Status:</b> {alpacaAccount.status}</div>
                <div><b>Buying Power:</b> ${parseFloat(alpacaAccount.buying_power).toLocaleString()}</div>
                <div><b>Portfolio Value:</b> ${parseFloat(alpacaAccount.portfolio_value).toLocaleString()}</div>
                <div><b>Cash:</b> ${parseFloat(alpacaAccount.cash).toLocaleString()}</div>
              </>
            ) : (
              <div style={{ color: '#ffa500', marginTop: '0.5rem' }}>
                <b>Note:</b> Unable to load Alpaca account data.
              </div>
            )}
          </div>
        ) : (
          <div style={{
            background: '#23243a',
            color: '#fff',
            borderRadius: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            padding: '2rem',
            minWidth: 320,
            marginBottom: '2rem',
            zIndex: 2,
            textAlign: 'center',
          }}>
            <h3 style={{ margin: 0, marginBottom: '1rem' }}>User Account Summary</h3>
            <div>No user data found.</div>
          </div>
        )}

        {/* Action Bar */}
        <div style={{
          background: '#23243a',
          color: '#fff',
          borderRadius: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          padding: '1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            placeholder="Search coins..."
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '0.75rem',
              borderRadius: '12px',
              border: '1px solid #ccc',
              background: '#fff',
              color: '#000'
            }}
          />
          <button style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            border: 'none',
            background: '#4a90e2',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 600
          }}>
            Trade
          </button>
          <button style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            border: 'none',
            background: '#4caf50',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 600
          }}>
            Deposit
          </button>
          <button 
            onClick={() => setShowSPModal(true)}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              background: '#9e9e9e',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            SP
          </button>
          <button 
            onClick={onLogout}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              background: '#f44336',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Logout
          </button>
        </div>

        {/* Total Balance and Trading Controls */}


        {/* Rest of the dashboard content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <BalanceCard accountData={alpacaAccount} loading={loading} />
          <PromoCard />
        </div>
        
        <BuySellWidget onTradeComplete={refreshAccountData} />
        
        {/* AI Trading Signals */}
        <AITradingSignals />
        
        {/* Market News */}
        <MarketNews />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
          <AssetTabs />
          <PortfolioHoldings />
        </div>
        
        <AssetTable />
      </main>

      {/* Profile Settings Modal */}
      {showProfileSettings && (
        <ProfileSettings
          userData={userData}
          onClose={() => setShowProfileSettings(false)}
          onUpdate={handleProfileUpdate}
        />
      )}

      {/* SP Modal - Simple Profile Summary */}
      {showSPModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#23243a',
            color: '#fff',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h2 style={{ margin: 0 }}>Simple Profile (SP)</h2>
              <button
                onClick={() => setShowSPModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                ✕
              </button>
            </div>
            
            {userData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div><b>Email:</b> {userData.email || userData.userId}</div>
                <div><b>Experience:</b> {userData.experience || 'Not set'}</div>
                <div><b>Investment Goal:</b> {userData.goal || 'Not set'}</div>
                <div><b>Risk Tolerance:</b> {userData.risk || 'Not set'}</div>
                <div><b>Loss Tolerance:</b> {userData.loss || 'Not set'}</div>
                <div><b>Preferred Assets:</b> {userData.assets && userData.assets.length > 0 ? userData.assets.join(', ') : 'Not set'}</div>
                <div><b>Preferred Sectors:</b> {userData.sectors && userData.sectors.length > 0 ? userData.sectors.join(', ') : 'Not set'}</div>
                <div><b>Trading Mode:</b> {userData.mode || 'Not set'}</div>
                <div><b>Check Frequency:</b> {userData.frequency || 'Not set'}</div>
                <div><b>Reports:</b> {userData.report || 'Not set'}</div>
              </div>
            ) : (
              <div>No user data available</div>
            )}
            
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button
                onClick={() => {
                  setShowSPModal(false);
                  setShowProfileSettings(true);
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#4a90e2',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardContainer; 