"use client";
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { fetchAPI } from '../../../lib/api';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await fetchAPI('/auth/login', {
        method: 'POST',
        body: { username, password },
      });
      console.log(data);
      onLogin(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex">
      {/* Left Side - Image Placeholder */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 items-center justify-center">
        <div className="text-center space-y-6 px-12">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-8 rounded-full">
              <MessageCircle className="w-24 h-24 text-gray-300" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white">Stay Connected</h2>
          <p className="text-xl text-gray-400">Message your friends and family anytime, anywhere</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
        <div className="w-full max-w-md px-8">
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-4 rounded-full mb-4">
              <MessageCircle className="w-12 h-12 text-gray-300" />
            </div>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to continue to Messenger</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent placeholder-gray-500"
                placeholder="Enter your username"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent placeholder-gray-500"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">
              Forgot password?
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700 text-center">
            <button className="text-gray-300 hover:text-white font-semibold text-sm">
              Create New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}