import React, { useState, useEffect } from 'react';
import { NeumorphicCard, NeumorphicButton, NeumorphicInput } from '../../styles/Neumorphic';
import { useTheme } from '../../context/ThemeContext';

const ProfileSettings = ({ userData, onClose, onUpdate }) => {
  const { isLightMode } = useTheme();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Initialize form data with user data
  useEffect(() => {
    if (userData) {
      setFormData({
        email: userData.email || userData.userId || '',
        experience: userData.experience || '',
        goal: userData.goal || '',
        risk: userData.risk || '',
        loss: userData.loss || '',
        assets: userData.assets || [],
        sectors: userData.sectors || [],
        avoid: userData.avoid || '',
        capital: userData.capital || '',
        budget: userData.budget || '',
        budgetPeriod: userData.budgetPeriod || '',
        reinvest: userData.reinvest || '',
        stopLoss: userData.stopLoss || '',
        stopLossPeriod: userData.stopLossPeriod || '',
        stopLossEnabled: userData.stopLossEnabled || '',
        mode: userData.mode || '',
        frequency: userData.frequency || '',
        report: userData.report || ''
      });
    }
  }, [userData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value, isChecked) => {
    setFormData(prev => ({
      ...prev,
      [field]: isChecked 
        ? [...(prev[field] || []), value]
        : (prev[field] || []).filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Use userId if available, otherwise use email as fallback
      const userId = userData.userId || userData.email;
      if (!userId) {
        setMessage('Error: No user ID or email found');
        setLoading(false);
        return;
      }

      // Debug: Log the URL being constructed
      const updateUrl = `http://localhost:3001/api/onboarding/update/${encodeURIComponent(userId)}`;
      console.log('Profile update URL:', updateUrl);
      console.log('User data:', userData);
      console.log('User ID being used:', userId);

      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
        if (onUpdate) {
          onUpdate(formData);
        }
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error || 'Failed to update profile'}`);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage(`Error: ${error.message || 'Network error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  const experienceOptions = [
    { label: 'Beginner (0–1 years)', value: 'Beginner' },
    { label: 'Intermediate (1–3 years)', value: 'Intermediate' },
    { label: 'Advanced (3+ years)', value: 'Advanced' }
  ];

  const goalOptions = [
    { label: 'Long-term growth', value: 'Long-term growth' },
    { label: 'Short-term gains', value: 'Short-term gains' },
    { label: 'Passive income', value: 'Passive income' },
    { label: 'Wealth preservation', value: 'Wealth preservation' },
    { label: 'Retirement planning', value: 'Retirement planning' }
  ];

  const riskOptions = [
    { label: 'Very low (conservative)', value: 'Very low' },
    { label: 'Low', value: 'Low' },
    { label: 'Moderate', value: 'Moderate' },
    { label: 'High', value: 'High' },
    { label: 'Very high (aggressive)', value: 'Very high' }
  ];

  const lossOptions = [
    { label: 'I prefer small, consistent gains and cannot tolerate losses.', value: 'No tolerance' },
    { label: 'I understand some losses are part of investing.', value: 'Some tolerance' },
    { label: 'I\'m fine with large swings if the potential reward is high.', value: 'High tolerance' }
  ];

  const assetOptions = [
    'U.S. stocks',
    'International stocks',
    'ETFs',
    'Tech stocks',
    'Blue-chip stocks',
    'Penny stocks',
    'Crypto (Bitcoin, Ethereum, etc.)'
  ];

  const sectorOptions = [
    'Technology',
    'Healthcare',
    'Energy',
    'Financials',
    'Consumer Goods',
    'Green Energy',
    'Real Estate',
    'AI & Robotics',
  ];

  const budgetPeriods = [
    { label: 'Per day', value: 'day' },
    { label: 'Per week', value: 'week' },
    { label: 'Per month', value: 'month' }
  ];

  const stopLossPeriods = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
  ];

  const tradeModes = [
    { label: 'Fully automated', value: 'automated' },
    { label: 'Suggested first, then approved manually', value: 'suggested' },
    { label: 'Combination of both', value: 'combination' }
  ];

  const checkFrequencies = [
    { label: 'Continuously (real-time)', value: 'realtime' },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'On demand only', value: 'ondemand' }
  ];

  const reportOptions = [
    { label: 'Daily report', value: 'daily' },
    { label: 'Weekly report', value: 'weekly' },
    { label: 'Only major events/alerts', value: 'alerts' }
  ];

  return (
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
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto',
        width: '100%'
      }}>
        <NeumorphicCard isLightMode={isLightMode}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <h2 style={{ margin: 0 }}>Profile Settings</h2>
            <NeumorphicButton
              isLightMode={isLightMode}
              onClick={onClose}
              style={{ padding: '0.5rem 1rem' }}
            >
              ✕
            </NeumorphicButton>
          </div>

          {message && (
            <div style={{
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              background: message.includes('Error') ? '#ffebee' : '#e8f5e8',
              color: message.includes('Error') ? '#c62828' : '#2e7d32',
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Basic Profile Section */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#4a90e2' }}>Basic Profile</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Email Address
                </label>
                <NeumorphicInput
                  isLightMode={isLightMode}
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={{ width: '100%' }}
                  disabled
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Experience Level
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {experienceOptions.map(opt => (
                    <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="radio"
                        name="experience"
                        value={opt.value}
                        checked={formData.experience === opt.value}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Investment Goal
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {goalOptions.map(opt => (
                    <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="radio"
                        name="goal"
                        value={opt.value}
                        checked={formData.goal === opt.value}
                        onChange={(e) => handleInputChange('goal', e.target.value)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk Profile Section */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#4a90e2' }}>Risk Profile</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Risk Tolerance
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {riskOptions.map(opt => (
                    <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="radio"
                        name="risk"
                        value={opt.value}
                        checked={formData.risk === opt.value}
                        onChange={(e) => handleInputChange('risk', e.target.value)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Loss Tolerance
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {lossOptions.map(opt => (
                    <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="radio"
                        name="loss"
                        value={opt.value}
                        checked={formData.loss === opt.value}
                        onChange={(e) => handleInputChange('loss', e.target.value)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Asset Preferences Section */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#4a90e2' }}>Asset Preferences</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Asset Types (Select all that apply)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {assetOptions.map(asset => (
                    <label key={asset} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        checked={(formData.assets || []).includes(asset)}
                        onChange={(e) => handleArrayChange('assets', asset, e.target.checked)}
                      />
                      {asset}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Sectors (Select all that apply)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {sectorOptions.map(sector => (
                    <label key={sector} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        checked={(formData.sectors || []).includes(sector)}
                        onChange={(e) => handleArrayChange('sectors', sector, e.target.checked)}
                      />
                      {sector}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Sectors to Avoid
                </label>
                <NeumorphicInput
                  isLightMode={isLightMode}
                  type="text"
                  value={formData.avoid || ''}
                  onChange={(e) => handleInputChange('avoid', e.target.value)}
                  placeholder="Enter sectors you want to avoid..."
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Investment Amounts Section */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#4a90e2' }}>Investment Amounts & Limits</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Total Capital Allocation
                </label>
                <NeumorphicInput
                  isLightMode={isLightMode}
                  type="number"
                  value={formData.capital || ''}
                  onChange={(e) => handleInputChange('capital', e.target.value)}
                  placeholder="$ Amount"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Max Trading Budget
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  {budgetPeriods.map(opt => (
                    <NeumorphicButton
                      key={opt.value}
                      isLightMode={isLightMode}
                      className={formData.budgetPeriod === opt.value ? 'selected' : ''}
                      style={{ flex: 1 }}
                      onClick={() => handleInputChange('budgetPeriod', opt.value)}
                      type="button"
                    >
                      {opt.label}
                    </NeumorphicButton>
                  ))}
                </div>
                <NeumorphicInput
                  isLightMode={isLightMode}
                  type="number"
                  value={formData.budget || ''}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder={`$ per ${formData.budgetPeriod || 'period'}`}
                  style={{ width: '100%' }}
                  disabled={!formData.budgetPeriod}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Auto-reinvest Profits
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="radio"
                      name="reinvest"
                      value="yes"
                      checked={formData.reinvest === 'yes'}
                      onChange={(e) => handleInputChange('reinvest', e.target.value)}
                    />
                    Yes
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="radio"
                      name="reinvest"
                      value="no"
                      checked={formData.reinvest === 'no'}
                      onChange={(e) => handleInputChange('reinvest', e.target.value)}
                    />
                    No
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Stop Loss
                </label>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="radio"
                      name="stopLossEnabled"
                      value="yes"
                      checked={formData.stopLossEnabled === 'yes'}
                      onChange={(e) => handleInputChange('stopLossEnabled', e.target.value)}
                    />
                    Enable
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="radio"
                      name="stopLossEnabled"
                      value="no"
                      checked={formData.stopLossEnabled === 'no'}
                      onChange={(e) => handleInputChange('stopLossEnabled', e.target.value)}
                    />
                    Disable
                  </label>
                </div>
                {formData.stopLossEnabled === 'yes' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <NeumorphicInput
                      isLightMode={isLightMode}
                      type="number"
                      value={formData.stopLoss || ''}
                      onChange={(e) => handleInputChange('stopLoss', e.target.value)}
                      placeholder="Stop loss amount"
                      style={{ flex: 1 }}
                    />
                    <select
                      value={formData.stopLossPeriod || 'day'}
                      onChange={(e) => handleInputChange('stopLossPeriod', e.target.value)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '12px',
                        border: '1px solid #ccc',
                        background: isLightMode ? '#fff' : '#23243a',
                        color: isLightMode ? '#000' : '#fff'
                      }}
                    >
                      {stopLossPeriods.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* AI Trader Preferences Section */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#4a90e2' }}>AI Trader Preferences</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Trading Mode
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {tradeModes.map(opt => (
                    <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="radio"
                        name="mode"
                        value={opt.value}
                        checked={formData.mode === opt.value}
                        onChange={(e) => handleInputChange('mode', e.target.value)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Trade Check Frequency
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {checkFrequencies.map(opt => (
                    <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="radio"
                        name="frequency"
                        value={opt.value}
                        checked={formData.frequency === opt.value}
                        onChange={(e) => handleInputChange('frequency', e.target.value)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  AI Insights & Reports
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {reportOptions.map(opt => (
                    <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="radio"
                        name="report"
                        value={opt.value}
                        checked={formData.report === opt.value}
                        onChange={(e) => handleInputChange('report', e.target.value)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <NeumorphicButton
                isLightMode={isLightMode}
                onClick={onClose}
                type="button"
                style={{ padding: '0.75rem 1.5rem' }}
              >
                Cancel
              </NeumorphicButton>
              <NeumorphicButton
                isLightMode={isLightMode}
                type="submit"
                disabled={loading}
                style={{ padding: '0.75rem 1.5rem' }}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </NeumorphicButton>
            </div>
          </form>
        </NeumorphicCard>
      </div>
    </div>
  );
};

export default ProfileSettings;
