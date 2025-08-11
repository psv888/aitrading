import React, { useState } from 'react';
import { NeumorphicCard, NeumorphicButton } from '../../styles/Neumorphic';
import { useTheme } from '../../context/ThemeContext';

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

const Section5 = ({ onNext, onBack }) => {
  const [mode, setMode] = useState('');
  const [frequency, setFrequency] = useState('');
  const [report, setReport] = useState('');
  const { isLightMode } = useTheme();

  const handleNext = () => {
    if (onNext) onNext({ mode, frequency, report });
  };

  return (
    <NeumorphicCard isLightMode={isLightMode}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>AI Trader Preferences</h2>
      <div style={{ width: '100%', marginBottom: '2rem' }}>
        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>
          13. Would you like your trades to be:
        </div>
        {tradeModes.map(opt => (
          <NeumorphicButton
            key={opt.value}
            isLightMode={isLightMode}
            className={mode === opt.value ? 'selected' : ''}
            style={{
              width: '100%',
              margin: '0.5rem 0'
            }}
            onClick={() => setMode(opt.value)}
            type="button"
          >
            {opt.label}
          </NeumorphicButton>
        ))}
      </div>
      <div style={{ width: '100%', marginBottom: '2rem' }}>
        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>
          14. How often should the AI check for new trades?
        </div>
        {checkFrequencies.map(opt => (
          <NeumorphicButton
            key={opt.value}
            isLightMode={isLightMode}
            className={frequency === opt.value ? 'selected' : ''}
            style={{
              width: '100%',
              margin: '0.5rem 0'
            }}
            onClick={() => setFrequency(opt.value)}
            type="button"
          >
            {opt.label}
          </NeumorphicButton>
        ))}
      </div>
      <div style={{ width: '100%', marginBottom: '2rem' }}>
        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>
          15. Do you want to receive regular AI-generated insights or summaries?
        </div>
        {reportOptions.map(opt => (
          <NeumorphicButton
            key={opt.value}
            isLightMode={isLightMode}
            className={report === opt.value ? 'selected' : ''}
            style={{
              width: '100%',
              margin: '0.5rem 0'
            }}
            onClick={() => setReport(opt.value)}
            type="button"
          >
            {opt.label}
          </NeumorphicButton>
        ))}
      </div>
      <div style={{ display: 'flex', width: '100%', gap: '1rem', marginTop: '2rem' }}>
        <NeumorphicButton isLightMode={isLightMode} onClick={onBack} style={{ flex: 1 }}>
          Back
        </NeumorphicButton>
        <NeumorphicButton
          isLightMode={isLightMode}
          onClick={handleNext}
          style={{ flex: 1 }}
          disabled={!mode || !frequency || !report}
        >
          Next
        </NeumorphicButton>
      </div>
    </NeumorphicCard>
  );
};

export default Section5; 