// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import "../styles/auth.css";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { ErrorMessage } from '../components/ui/CommonComponents';
import axios from 'axios';
import loginImg from '../assets/loginImg.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState<{ email: string; password: string }>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const apiResponse = await loginUser(form);
      
      if (apiResponse && apiResponse.status === 'success' && apiResponse.data && apiResponse.data.token) {
        const jwtData = apiResponse.data;
        const user = jwtData.user || {
          id: 0,
          name: form.email.split('@')[0],
          email: form.email,
        };
        
        login(jwtData.token, user);
        navigate('/dashboard');
      } else {
        let detailedError = 'Login failed: Invalid response from server.';
        if (!apiResponse) {
          detailedError = 'Login failed: No response from server.';
        } else if (apiResponse.status !== 'success') {
          detailedError = `Login failed: Server responded with status '${apiResponse.status}'. Message: ${apiResponse.message || 'No specific message.'}`;
        } else if (!apiResponse.data) {
          detailedError = 'Login failed: Response data missing from server success response.';
        } else if (!apiResponse.data.token) {
          detailedError = 'Login failed: Token missing from server success response data.';
        }
        setError(detailedError);
      }
    } catch (err) {
      let errorMessage = 'Login failed: Server error or invalid credentials.';
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data as { message?: string };
        errorMessage = errorData?.message || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isCurrentPath = (path: string) => location.pathname === path || (path === '/login' && location.pathname === '/');

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Back to Home button */}
      <Link
        to="/"
        className="absolute top-4 right-4 flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label="Back to Home"
      >
        <i className="fas fa-arrow-left" aria-hidden="true"></i>
        <span className="hidden sm:inline">Back</span>
      </Link>

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Left Hero Section */}
        <aside className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white flex-col items-center justify-center p-10 relative overflow-hidden">
          {/* Hero Content */}
          <div className="text-center z-10 mb-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to Zelvo</h1>
            <p className="text-lg text-blue-100 mb-6 max-w-md">
              Streamline your task and project management.
            </p>
          </div>

          {/* Subtle Background Image */}
          <div className="absolute inset-0 flex items-center justify-center opacity-15">
            <img 
              src={loginImg} 
              alt="Login illustration" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Background decorative elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl"></div>
        </aside>

        {/* Right Form Section */}
        <main className="flex-1 flex items-center justify-center bg-gray-50 py-10 px-4">
          <div className="w-full max-w-md">
            {/* Mobile Hero Image */}
            <div className="lg:hidden mb-8 flex justify-center">
              <div className="w-48 h-36 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={loginImg} 
                  alt="Login illustration" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
              Sign in to Zelvo
            </h2>
            <p className="text-base md:text-lg text-gray-600 text-center mb-10">
              Start managing your tasks efficiently
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Email address"
                />
              </div>

              <div className="space-y-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>

              {error && <ErrorMessage message={error} />}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75"
              >
                {isLoading ? (
                  <span>
                    <i className="fas fa-spinner fa-spin mr-2" aria-hidden="true"></i>Processing...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { window.location.href = 'http://localhost:8081/oauth2/authorization/github' }}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                <i className="fab fa-github text-gray-800 text-sm" aria-hidden="true"></i>
                GitHub
              </button>

              <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Register now
                </Link>
              </p>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}