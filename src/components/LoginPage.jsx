import { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (!password) {
      setError('Please enter a password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in cookie
        document.cookie = `auth_token=${data.token}; path=/; max-age=86400`; // 24 hours

        // Store user details in localStorage
        if (data.user) {
          localStorage.setItem('username', data.user.username || username);
          localStorage.setItem('userRole', data.user.role || 'cashinTeller');
          if (data.user.tellerNo) {
            localStorage.setItem('tellerNo', data.user.tellerNo);
          }
          if (data.user._id) {
            localStorage.setItem('userId', data.user._id);
          }
        }

        onLogin(data.token);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060714]">
      <div className="bg-[#333333] p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <svg
            className="w-16 h-16 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-6">Login</h1>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-[#181818] border border-gray-600 rounded text-white focus:outline-none focus:border-white"
              placeholder="Enter username"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#181818] border border-gray-600 rounded text-white focus:outline-none focus:border-white"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : (
              'LOGIN'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
