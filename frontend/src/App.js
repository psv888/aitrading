import React, { useState } from 'react';
import OnboardingContainer from './features/onboarding/OnboardingContainer';
import DashboardContainer from './features/dashboard/DashboardContainer';
import { ThemeProvider } from './context/ThemeContext';

function LoginForm({ onLogin, onShowOnboarding }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/onboarding/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        cache: 'no-cache'
      });
      if (!res.ok) {
        setError('Invalid email or password.');
        setLoading(false);
        return;
      }
      
      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error('Error parsing login response:', jsonError);
        setError('Invalid response from server.');
        setLoading(false);
        return;
      }
      
      // Fetch latest user data
      const userRes = await fetch(`http://localhost:3001/api/onboarding/${encodeURIComponent(email)}`);
      let userData;
      if (userRes.ok) {
        try {
          userData = await userRes.json();
        } catch (jsonError) {
          console.error('Error parsing user data response:', jsonError);
          userData = { email };
        }
      } else {
        userData = { email };
      }
      onLogin(userData);
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 340, margin: '2rem auto', background: '#23243a', padding: '2rem', borderRadius: '1rem', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }}
        />
      </div>
      {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#2172e5', color: '#fff', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: 'pointer', marginBottom: '1rem' }}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <div style={{ textAlign: 'center' }}>
        <span>New user? </span>
        <button type="button" onClick={onShowOnboarding} style={{ background: 'none', border: 'none', color: '#1ecb98', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}>Sign up</button>
      </div>
    </form>
  );
}

function App() {
  const [userData, setUserData] = useState(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('userData');
    if (!savedUser) return null;
    
    try {
      return JSON.parse(savedUser);
    } catch (error) {
      console.error('Error parsing userData from localStorage:', error);
      // Clear invalid data from localStorage
      localStorage.removeItem('userData');
      return null;
    }
  });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLogin, setShowLogin] = useState(!userData); // Show login only if no user data
  const [isValidating, setIsValidating] = useState(!!userData); // Show loading if we have saved user data

  // Validate session on app load
  React.useEffect(() => {
    if (userData) {
      const validateSession = async () => {
        try {
          const res = await fetch(`http://localhost:3001/api/onboarding/${encodeURIComponent(userData.userId || userData.email)}`);
          if (!res.ok) {
            // Session invalid, clear and show login
            setUserData(null);
            localStorage.removeItem('userData');
            setShowLogin(true);
          }
        } catch (error) {
          console.error('Session validation failed:', error);
          // On error, keep the session (better UX)
        } finally {
          setIsValidating(false);
        }
      };
      validateSession();
    } else {
      setIsValidating(false);
    }
  }, [userData]);

  const handleOnboardingComplete = (user) => {
    setUserData(user);
    localStorage.setItem('userData', JSON.stringify(user));
    setShowOnboarding(false);
    setShowLogin(false);
  };

  const handleLogin = (user) => {
    setUserData(user);
    localStorage.setItem('userData', JSON.stringify(user));
    setShowOnboarding(false);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUserData(null);
    localStorage.removeItem('userData');
    setShowOnboarding(false);
    setShowLogin(true);
  };

  const handleProfileUpdate = (updatedData) => {
    // Update user data with the new profile information
    const updatedUserData = { ...userData, ...updatedData };
    setUserData(updatedUserData);
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
  };

  return (
    <ThemeProvider>
      <div style={{ minHeight: '100vh', background: '#181829', padding: '2rem' }}>
        {isValidating ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            color: '#fff',
            fontSize: '1.2rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
              <div>Validating session...</div>
            </div>
          </div>
        ) : showOnboarding ? (
          <OnboardingContainer onComplete={handleOnboardingComplete} onLogin={handleLogin} />
        ) : showLogin ? (
          <LoginForm onLogin={handleLogin} onShowOnboarding={() => { setShowOnboarding(true); setShowLogin(false); }} />
        ) : userData ? (
          <DashboardContainer 
            userData={userData} 
            onLogout={handleLogout}
            onProfileUpdate={handleProfileUpdate}
          />
        ) : null}
      </div>
    </ThemeProvider>
  );
}

export default App;
