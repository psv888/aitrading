import React, { useState, useCallback, useRef, useEffect } from 'react';
import { NeumorphicCard, NeumorphicButton } from '../../styles/Neumorphic';
import ThemeToggle from '../../components/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { loginUser } from '../../utils/api';

const Welcome = ({ onNext, onLogin }) => {
  const { isLightMode } = useTheme();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Use refs to maintain input focus
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Focus management
  useEffect(() => {
    if (showLogin && emailInputRef.current) {
      const timer = setTimeout(() => {
        emailInputRef.current.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [showLogin]);

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
    setLoginError(''); // Clear error when user types
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
    setLoginError(''); // Clear error when user types
  }, []);

  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      setLoginError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      // Simple login - let the main App.js handle Alpaca account creation
      const res = await fetch('http://localhost:3001/api/onboarding/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        cache: 'no-cache'
      });
      
      if (!res.ok) {
        setLoginError('Invalid email or password.');
        setIsLoading(false);
        return;
      }
      
      const data = await res.json();
      // Fetch latest user data
      const userRes = await fetch(`http://localhost:3001/api/onboarding/${encodeURIComponent(email)}`);
      const userData = userRes.ok ? await userRes.json() : { email };
      
      if (onLogin) {
        onLogin(userData);
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, onLogin]);

  const openLoginModal = useCallback(() => {
    setShowLogin(true);
    setEmail('');
    setPassword('');
    setLoginError('');
  }, []);

  const closeLoginModal = useCallback(() => {
    setShowLogin(false);
    setEmail('');
    setPassword('');
    setLoginError('');
  }, []);

  const handleEmailKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && password) {
      handleLogin();
    } else if (e.key === 'Enter') {
      passwordInputRef.current?.focus();
    }
  }, [password, handleLogin]);

  const handlePasswordKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }, [handleLogin]);

  return (
    <>
      <NeumorphicCard isLightMode={isLightMode} style={{ 
        minWidth: 340, 
        minHeight: 320, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative'
      }}>
        {/* Theme Toggle positioned at top right */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem'
        }}>
          <ThemeToggle />
        </div>

        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '1.5rem', 
          fontSize: '2rem',
          color: isLightMode ? '#2c3e50' : '#ffffff'
        }}>
          Welcome to the App
        </h2>
        
        <div style={{ 
          color: isLightMode ? '#6c757d' : '#ffffff', 
          fontSize: '1.1rem', 
          textAlign: 'center', 
          marginBottom: '2.5rem',
          lineHeight: '1.6'
        }}>
          Uses AI to invest on your behalf with your risk and goals.
        </div>
        
        <NeumorphicButton 
          isLightMode={isLightMode}
          style={{ width: '100%', marginBottom: '1rem' }} 
          onClick={onNext}
        >
          Get Started
        </NeumorphicButton>
        
        <NeumorphicButton 
          isLightMode={isLightMode}
          style={{ 
            width: '100%',
            background: 'transparent',
            border: `1px solid ${isLightMode ? '#2c3e50' : '#ffffff'}`,
            color: isLightMode ? '#2c3e50' : '#ffffff'
          }} 
          onClick={openLoginModal}
        >
          Already have an account? Login
        </NeumorphicButton>
      </NeumorphicCard>
      
      {showLogin && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <NeumorphicCard isLightMode={isLightMode} style={{ 
            minWidth: 320,
            padding: '2rem'
          }}>
            <h3 style={{ 
              textAlign: 'center', 
              marginBottom: '1.5rem',
              color: isLightMode ? '#2c3e50' : '#ffffff'
            }}>
              Login to Your Account
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <input
                ref={emailInputRef}
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                onKeyPress={handleEmailKeyPress}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  opacity: isLoading ? 0.7 : 1
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <input
                ref={passwordInputRef}
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                onKeyPress={handlePasswordKeyPress}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  opacity: isLoading ? 0.7 : 1
                }}
              />
            </div>
            
            {loginError && (
              <div style={{ 
                color: 'red', 
                fontSize: '0.9rem', 
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {loginError}
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <NeumorphicButton 
                isLightMode={isLightMode}
                style={{ flex: 1 }}
                onClick={closeLoginModal}
                disabled={isLoading}
              >
                Cancel
              </NeumorphicButton>
              <NeumorphicButton 
                isLightMode={isLightMode}
                style={{ flex: 1 }}
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </NeumorphicButton>
            </div>
          </NeumorphicCard>
        </div>
      )}
    </>
  );
};

export default Welcome; 