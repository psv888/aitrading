import React, { useState } from 'react';
import { NeumorphicCard, NeumorphicButton, NeumorphicInput } from '../../styles/Neumorphic';
import { useTheme } from '../../context/ThemeContext';

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

const Section4 = ({ onNext, onBack }) => {
  const [capital, setCapital] = useState('');
  const [budget, setBudget] = useState('');
  const [budgetPeriod, setBudgetPeriod] = useState('');
  const [reinvest, setReinvest] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [stopLossPeriod, setStopLossPeriod] = useState('day');
  const [stopLossEnabled, setStopLossEnabled] = useState('');
  const { isLightMode } = useTheme();

  const handleNext = () => {
    if (onNext) onNext({ capital, budget, budgetPeriod, reinvest, stopLoss, stopLossPeriod, stopLossEnabled });
  };

  return (
    <NeumorphicCard isLightMode={isLightMode}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Investment Amounts & Limits</h2>
      <div style={{ width: '100%', marginBottom: '2rem' }}>
        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>
          9. How much total capital do you want to allocate to automated trading?
        </div>
        <NeumorphicInput
          isLightMode={isLightMode}
          type="number"
          placeholder="$ Amount"
          value={capital}
          onChange={e => setCapital(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ width: '100%', marginBottom: '2rem' }}>
        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>
          10. What is your max trading budget?
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {budgetPeriods.map(opt => (
            <NeumorphicButton
              key={opt.value}
              isLightMode={isLightMode}
              className={budgetPeriod === opt.value ? 'selected' : ''}
              style={{
                flex: 1
              }}
              onClick={() => setBudgetPeriod(opt.value)}
              type="button"
            >
              {opt.label}
            </NeumorphicButton>
          ))}
        </div>
        <NeumorphicInput
          isLightMode={isLightMode}
          type="number"
          placeholder={`$ per ${budgetPeriod || 'period'}`}
          value={budget}
          onChange={e => setBudget(e.target.value)}
          style={{ width: '100%' }}
          disabled={!budgetPeriod}
        />
      </div>
      <div style={{ width: '100%', marginBottom: '2rem' }}>
        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>
          11. Do you want the AI to reinvest profits automatically?
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <NeumorphicButton
            isLightMode={isLightMode}
            className={reinvest === 'yes' ? 'selected' : ''}
            style={{
              flex: 1
            }}
            onClick={() => setReinvest('yes')}
            type="button"
          >
            Yes
          </NeumorphicButton>
          <NeumorphicButton
            isLightMode={isLightMode}
            className={reinvest === 'no' ? 'selected' : ''}
            style={{
              flex: 1
            }}
            onClick={() => setReinvest('no')}
            type="button"
          >
            No, hold profits in cash
          </NeumorphicButton>
        </div>
      </div>
      <div style={{ width: '100%', marginBottom: '2rem' }}>
        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>
          12. Should the AI stop trading if losses exceed a certain percentage?
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <NeumorphicButton
            isLightMode={isLightMode}
            className={stopLossEnabled === 'yes' ? 'selected' : ''}
            style={{
              flex: 1
            }}
            onClick={() => setStopLossEnabled('yes')}
            type="button"
          >
            Yes
          </NeumorphicButton>
          <NeumorphicButton
            isLightMode={isLightMode}
            className={stopLossEnabled === 'no' ? 'selected' : ''}
            style={{
              flex: 1
            }}
            onClick={() => setStopLossEnabled('no')}
            type="button"
          >
            No, keep trading based on strategy
          </NeumorphicButton>
        </div>
        {stopLossEnabled === 'yes' && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <NeumorphicInput
              isLightMode={isLightMode}
              type="number"
              placeholder="% Loss"
              value={stopLoss}
              onChange={e => setStopLoss(e.target.value)}
              style={{ width: '100px' }}
            />
            <span style={{ color: isLightMode ? '#2c3e50' : '#fff', fontWeight: 500 }}>in</span>
            {stopLossPeriods.map(opt => (
              <NeumorphicButton
                key={opt.value}
                isLightMode={isLightMode}
                className={stopLossPeriod === opt.value ? 'selected' : ''}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '1rem',
                  margin: '0 0.25rem'
                }}
                onClick={() => setStopLossPeriod(opt.value)}
                type="button"
              >
                {opt.label}
              </NeumorphicButton>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', width: '100%', gap: '1rem', marginTop: '2rem' }}>
        <NeumorphicButton isLightMode={isLightMode} onClick={onBack} style={{ flex: 1 }}>
          Back
        </NeumorphicButton>
        <NeumorphicButton
          isLightMode={isLightMode}
          onClick={handleNext}
          style={{ flex: 1 }}
          disabled={!capital || !budget || !budgetPeriod || !reinvest || (stopLossEnabled === 'yes' && !stopLoss)}
        >
          Next
        </NeumorphicButton>
      </div>
    </NeumorphicCard>
  );
};

export default Section4; 