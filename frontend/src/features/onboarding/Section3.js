import React, { useState } from 'react';
import { NeumorphicCard, NeumorphicButton, NeumorphicInput } from '../../styles/Neumorphic';
import { useTheme } from '../../context/ThemeContext';

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

const Section3 = ({ onNext, onBack }) => {
  const [assets, setAssets] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [otherSector, setOtherSector] = useState('');
  const [avoid, setAvoid] = useState('');
  const { isLightMode } = useTheme();

  const toggleAsset = (asset) => {
    setAssets((prev) =>
      prev.includes(asset) ? prev.filter((a) => a !== asset) : [...prev, asset]
    );
  };

  const toggleSector = (sector) => {
    setSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    );
  };

  const handleNext = () => {
    const allSectors = otherSector ? [...sectors, otherSector] : sectors;
    if (onNext) onNext({ assets, sectors: allSectors, avoid, otherSector });
  };

  return (
    <NeumorphicCard isLightMode={isLightMode}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Asset Preferences</h2>
      <div style={{ width: '100%', marginBottom: '2rem' }}>
        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>
          6. What types of assets would you like to trade? (Select all that apply)
        </div>
        {assetOptions.map(opt => (
          <NeumorphicButton
            key={opt}
            isLightMode={isLightMode}
            className={assets.includes(opt) ? 'selected' : ''}
            style={{
              width: '100%',
              margin: '0.5rem 0'
            }}
            onClick={() => toggleAsset(opt)}
            type="button"
          >
            {opt}
          </NeumorphicButton>
        ))}
      </div>
      <div style={{ width: '100%', marginBottom: '2rem' }}>
        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>
          7. Are there specific industries/sectors you want to focus on? (Select multiple)
        </div>
        {sectorOptions.map(opt => (
          <NeumorphicButton
            key={opt}
            isLightMode={isLightMode}
            className={sectors.includes(opt) ? 'selected' : ''}
            style={{
              width: '100%',
              margin: '0.5rem 0'
            }}
            onClick={() => toggleSector(opt)}
            type="button"
          >
            {opt}
          </NeumorphicButton>
        ))}
        <NeumorphicInput
          isLightMode={isLightMode}
          type="text"
          placeholder="Other sector..."
          value={otherSector}
          onChange={e => setOtherSector(e.target.value)}
          style={{ width: '100%', marginTop: '1rem' }}
        />
      </div>
      <div style={{ width: '100%', marginBottom: '2rem' }}>
        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>
          8. Are there any industries or companies you want to avoid?
        </div>
        <NeumorphicInput
          isLightMode={isLightMode}
          type="text"
          placeholder="e.g., weapons, tobacco, fossil fuels"
          value={avoid}
          onChange={e => setAvoid(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ display: 'flex', width: '100%', gap: '1rem', marginTop: '2rem' }}>
        <NeumorphicButton isLightMode={isLightMode} onClick={onBack} style={{ flex: 1 }}>
          Back
        </NeumorphicButton>
        <NeumorphicButton
          isLightMode={isLightMode}
          onClick={handleNext}
          style={{ flex: 1 }}
          disabled={assets.length === 0}
        >
          Next
        </NeumorphicButton>
      </div>
    </NeumorphicCard>
  );
};

export default Section3; 