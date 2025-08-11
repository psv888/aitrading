import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Welcome from './Welcome';
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import Section4 from './Section4';
import Section5 from './Section5';
import SectionFinal from './SectionFinal';
import SectionComplete from './SectionComplete';
import { createOnboarding } from '../../utils/api';

function filterSerializable(obj) {
  const result = {};
  for (const key in obj) {
    const value = obj[key];
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === null ||
      Array.isArray(value) ||
      (typeof value === 'object' && value !== null && !value.window && !value.document && !value.nodeType)
    ) {
      result[key] = value;
    }
  }
  return result;
}

function isPlainObject(obj) {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}

const OnboardingContainer = ({ onComplete, onLogin }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const { isLightMode } = useTheme();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // Store logged-in user
  const [alpacaLoading, setAlpacaLoading] = useState(false);
  const [alpacaError, setAlpacaError] = useState(null);

  console.log('OnboardingContainer render:', { step, user });

          useEffect(() => {
          // After onboarding is complete, get Alpaca account info
          if (step === 7 && user && !alpacaLoading) {
            console.log('Onboarding complete, getting Alpaca account info');
            console.log('User object:', user);
            const emailToUse = user.email || user.userId;
            console.log('Email used for Alpaca account:', emailToUse);
            
            const getAlpacaAccount = async () => {
              setAlpacaLoading(true);
              setAlpacaError(null);
              try {
                const res = await fetch('http://localhost:3001/api/alpaca/get-account', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: emailToUse }),
                });
                console.log('Alpaca account response:', res);
                if (!res.ok) {
                  const err = await res.json();
                  console.error('Alpaca account error response:', err);
                  throw new Error(err.error || 'Failed to get Alpaca account');
                }
                const data = await res.json();
                console.log('Alpaca account success data:', data);
                // Fetch latest user data from backend after Alpaca account fetch
                const userRes = await fetch(`http://localhost:3001/api/onboarding/${encodeURIComponent(emailToUse)}`);
                const userData = userRes.ok ? await userRes.json() : { email: emailToUse };
                setUser(userData);
                if (onComplete) {
                  onComplete(userData);
                }
              } catch (error) {
                setAlpacaError(error.message || 'Failed to get Alpaca account');
                console.error('Alpaca account exception:', error);
                // Still proceed to dashboard even if Alpaca fails
                if (onComplete) {
                  onComplete(user);
                }
              } finally {
                setAlpacaLoading(false);
              }
            };
            getAlpacaAccount();
          }
        }, [step, user, alpacaLoading, onComplete]);

  const handleNext = async (sectionAnswers) => {
    // Ignore event objects
    if (sectionAnswers && sectionAnswers.nativeEvent && sectionAnswers.preventDefault) {
      console.warn('Event object detected in handleNext, ignoring!');
      sectionAnswers = undefined;
    }
    let mergedAnswers = answers;
    if (isPlainObject(sectionAnswers)) {
      mergedAnswers = { ...answers, ...sectionAnswers };
      setAnswers(mergedAnswers);
    }
    // If next step is SectionComplete, submit to backend
    if (step === 6) {
      try {
        const dataToSend = filterSerializable(mergedAnswers);
        console.log('Submitting onboarding data:', dataToSend); // Debug log
        await createOnboarding(dataToSend);
        setSubmitted(true);
        setStep(step + 1);
      } catch (err) {
        setError('Failed to save onboarding data. Please try again.');
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const handleLogin = (userData) => {
    setUser(userData); // Save user info
    if (onLogin) {
      onLogin(userData);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      justifyContent: 'center',
      gap: '2rem',
      background: isLightMode 
        ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 50%, #a8caba 100%)'
        : 'linear-gradient(135deg, #1a1a3a 0%, #23234b 100%)',
      transition: 'background 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Metallic paint shimmer effect for light mode */}
      {isLightMode && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
          zIndex: 1
        }} />
      )}
      {/* Show Alpaca account info if logged in */}
      {user && user.alpacaAccount && (
        <div style={{
          background: isLightMode ? '#fff' : '#23243a',
          color: isLightMode ? '#222' : '#fff',
          borderRadius: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          padding: '2rem',
          minWidth: 320,
          marginBottom: '1rem',
          zIndex: 2,
        }}>
          <h3 style={{ margin: 0, marginBottom: '1rem' }}>Alpaca Account Summary</h3>
          <div><b>Account ID:</b> {user.alpacaAccountId}</div>
          <div><b>Email:</b> {user.email}</div>
          <div><b>Status:</b> {user.alpacaAccount?.status}</div>
        </div>
      )}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {alpacaLoading && (
          <div style={{ color: '#1ecb98', textAlign: 'center', marginBottom: '1rem' }}>Creating Alpaca account...</div>
        )}
        {alpacaError && (
          <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{alpacaError}</div>
        )}
        {step === 0 && (
          <Welcome onNext={handleNext} onLogin={handleLogin} />
        )}
        {step === 1 && (
          <Section1 onNext={handleNext} />
        )}
        {step === 2 && (
          <Section2 onNext={handleNext} onBack={handleBack} />
        )}
        {step === 3 && (
          <Section3 onNext={handleNext} onBack={handleBack} />
        )}
        {step === 4 && (
          <Section4 onNext={handleNext} onBack={handleBack} />
        )}
        {step === 5 && (
          <Section5 onNext={handleNext} onBack={handleBack} />
        )}
        {step === 6 && (
          <SectionFinal onNext={handleNext} onBack={handleBack} />
        )}
        {step === 7 && (
          <SectionComplete onComplete={handleComplete} />
        )}
        {error && (
          <div style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</div>
        )}
      </div>
    </div>
  );
};

export default OnboardingContainer; 