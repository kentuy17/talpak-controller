import { useState } from 'react';
import './App.css';
import BettingDisplay from './components/BettingDisplayRefactored';
import LoginPage from './components/LoginPage';
import { BettingProvider } from './context/BettingContext';

// Helper function to get cookie value
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

function App() {
  const [token, setToken] = useState(() => {
    // Check for token in cookies on mount
    return getCookie('auth_token');
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (authToken) => {
    setToken(authToken);
  };

  const handleLogout = () => {
    // Clear token from cookie
    document.cookie =
      'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    // Clear user data from localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    localStorage.removeItem('tellerNo');
    localStorage.removeItem('userId');
    setToken(null);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[#060714]'>
        <div className='text-white text-2xl'>Loading...</div>
      </div>
    );
  }

  return token ? (
    <BettingProvider token={token}>
      <BettingDisplay onLogout={handleLogout} />
    </BettingProvider>
  ) : (
    <LoginPage onLogin={handleLogin} />
  );
}

export default App;
