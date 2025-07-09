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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container - removed max width constraint for better large screen utilization */}
      <div className="flex min-h-screen">
        {/* Left Hero Section - Better proportions for large screens */}
        <div className="flex w-1/2 lg:w-3/5 relative overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${loginImg})` }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center px-8 lg:px-16 xl:px-24 py-20 text-center text-white w-full">
            <div className="max-w-lg">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6">
                Welcome to Zelvo
              </h1>
              <p className="text-lg lg:text-xl xl:text-2xl text-gray-100">
                Streamline your task and project management.
              </p>
            </div>
          </div>
        </div>

        {/* Right Form Section - Better proportions */}
        <div className="w-1/2 lg:w-2/5 flex items-center justify-center px-8 lg:px-12 xl:px-16 py-12 relative">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-6 right-6 flex items-center gap-2 text-gray-600 hover:text-[#3a74d3] transition-colors group"
            aria-label="Go back to landing page"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="w-full max-w-lg">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3">
                Sign in to Zelvo
              </h2>
              <p className="text-gray-600 text-lg">
                Start managing your tasks efficiently
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3a74d3] focus:border-transparent"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3a74d3] focus:border-transparent"
                />
              </div>

              {/* Remember me and Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 text-[#3a74d3] border-gray-300 rounded focus:ring-[#3a74d3]"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-[#3a74d3] font-medium hover:text-[#2d5cb8]"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Error Message */}
              {error && <ErrorMessage message={error} />}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#3a74d3] hover:bg-[#2d5cb8] text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3a74d3] disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>

              {/* Social Login Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Social Login Button */}
              <button
                type="button"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={() => { window.location.href = 'http://localhost:8081/oauth2/authorization/github' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">GitHub</span>
              </button>

              {/* Register Link */}
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#3a74d3] font-medium hover:text-[#2d5cb8]">
                  Register now
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}