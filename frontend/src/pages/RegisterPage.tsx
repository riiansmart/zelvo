/**
 * RegisterPage.tsx
 * Redesigned registration page aligned with Figma wireframe.
 * Features two-column layout with hero section and form.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { RegisterRequest } from '../types/Auth';
import { ErrorMessage } from '../components/ui/CommonComponents';
import registerImg from '../assets/registerImg.png';
import { useTheme } from '../context/ThemeContext';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isLightMode } = useTheme();

  const [form, setForm] = useState<RegisterForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const payload: RegisterRequest = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
      };

      console.log('Register payload:', payload);
      await registerUser(payload);
      navigate('/login?registered=true');
    } catch (err) {
      let errorMessage = 'Registration failed. Please try again.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        errorMessage = axiosErr.response?.data?.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundColor: isLightMode ? '#f9fafb' : '#0a0a0f',
        color: isLightMode ? '#111827' : '#ffffff'
      }}
    >
      {/* Main Container - removed max width constraint for better large screen utilization */}
      <div className="flex min-h-screen">
        {/* Left Hero Section - Better proportions for large screens */}
        <div 
          className="flex w-1/2 lg:w-3/5 relative overflow-hidden"
          style={{
            background: isLightMode 
              ? 'linear-gradient(135deg, #3a74d3 0%, #3730a3 100%)'
              : 'linear-gradient(135deg, #141420 0%, #0a0a0f 100%)'
          }}
        >
          <div className="flex flex-col justify-center items-center px-8 lg:px-16 xl:px-24 py-20 relative z-10 text-center w-full">
            {/* Branding */}
            <div className="mb-12">
              <h1 
                className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4"
                style={{ color: isLightMode ? '#ffffff' : '#ff3a4c' }}
              >
                Zelvo
              </h1>
              <p 
                className="text-lg lg:text-xl xl:text-2xl max-w-lg"
                style={{ color: isLightMode ? '#e0e7ff' : '#9b9ba7' }}
              >
                Effortless Task and Project Management in One Smart Platform.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-6 lg:space-y-8">
              <div className="flex items-center gap-4 lg:gap-6">
                <div 
                  className="w-6 h-6 lg:w-7 lg:h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: isLightMode ? '#ffffff' : '#ff3a4c' }}
                >
                  <svg 
                    className="w-4 h-4 lg:w-5 lg:h-5" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    style={{ color: isLightMode ? '#3a74d3' : '#ffffff' }}
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span 
                  className="text-lg lg:text-xl font-medium"
                  style={{ color: isLightMode ? '#ffffff' : '#ffffff' }}
                >
                  Streamlined Task Control
                </span>
              </div>
              <div className="flex items-center gap-4 lg:gap-6">
                <div 
                  className="w-6 h-6 lg:w-7 lg:h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: isLightMode ? '#ffffff' : '#ff3a4c' }}
                >
                  <svg 
                    className="w-4 h-4 lg:w-5 lg:h-5" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    style={{ color: isLightMode ? '#3a74d3' : '#ffffff' }}
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span 
                  className="text-lg lg:text-xl font-medium"
                  style={{ color: isLightMode ? '#ffffff' : '#ffffff' }}
                >
                  User-friendly Interface
                </span>
              </div>
              <div className="flex items-center gap-4 lg:gap-6">
                <div 
                  className="w-6 h-6 lg:w-7 lg:h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: isLightMode ? '#ffffff' : '#ff3a4c' }}
                >
                  <svg 
                    className="w-4 h-4 lg:w-5 lg:h-5" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    style={{ color: isLightMode ? '#3a74d3' : '#ffffff' }}
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span 
                  className="text-lg lg:text-xl font-medium"
                  style={{ color: isLightMode ? '#ffffff' : '#ffffff' }}
                >
                  Powerful Integrations
                </span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="absolute right-8 lg:right-12 xl:right-16 top-1/2 transform -translate-y-1/2 w-80 lg:w-96 xl:w-[28rem] h-80 lg:h-96 xl:h-[28rem] opacity-20">
            <img 
              src={registerImg} 
              alt="Task management visualization" 
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* Right Form Section - Better proportions */}
        <div 
          className="w-1/2 lg:w-2/5 flex items-center justify-center px-8 lg:px-12 xl:px-16 py-12 relative"
          style={{
            backgroundColor: isLightMode ? '#ffffff' : '#141420'
          }}
        >
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-6 right-6 flex items-center gap-2 transition-colors group"
            style={{
              color: isLightMode ? '#6b7280' : '#9b9ba7'
            }}
            aria-label="Go back to landing page"
          >
            <svg 
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{
                color: isLightMode ? '#3a74d3' : '#ff3a4c'
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span 
              className="text-sm font-medium"
              style={{
                color: isLightMode ? '#3a74d3' : '#ff3a4c'
              }}
            >
              Back
            </span>
          </button>

          <div className="w-full max-w-lg">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 
                className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-3"
                style={{ color: isLightMode ? '#111827' : '#ffffff' }}
              >
                Create your account
              </h2>
              <p 
                className="text-lg"
                style={{ color: isLightMode ? '#6b7280' : '#9b9ba7' }}
              >
                Start managing your tasks efficiently
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label 
                    htmlFor="firstName" 
                    className="block text-sm font-medium mb-1"
                    style={{ color: isLightMode ? '#374151' : '#e0e0e0' }}
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{
                      border: isLightMode ? '1px solid #d1d5db' : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: isLightMode ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
                      color: isLightMode ? '#111827' : '#ffffff'
                    }}
                  />
                </div>
                <div>
                  <label 
                    htmlFor="lastName" 
                    className="block text-sm font-medium mb-1"
                    style={{ color: isLightMode ? '#374151' : '#e0e0e0' }}
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{
                      border: isLightMode ? '1px solid #d1d5db' : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: isLightMode ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
                      color: isLightMode ? '#111827' : '#ffffff'
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium mb-1"
                  style={{ color: isLightMode ? '#374151' : '#e0e0e0' }}
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{
                    border: isLightMode ? '1px solid #d1d5db' : '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: isLightMode ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
                    color: isLightMode ? '#111827' : '#ffffff'
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium mb-1"
                  style={{ color: isLightMode ? '#374151' : '#e0e0e0' }}
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  minLength={6}
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{
                    border: isLightMode ? '1px solid #d1d5db' : '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: isLightMode ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
                    color: isLightMode ? '#111827' : '#ffffff'
                  }}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-sm font-medium mb-1"
                  style={{ color: isLightMode ? '#374151' : '#e0e0e0' }}
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  minLength={6}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{
                    border: isLightMode ? '1px solid #d1d5db' : '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: isLightMode ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
                    color: isLightMode ? '#111827' : '#ffffff'
                  }}
                />
              </div>

              {/* Error Message */}
              {error && <ErrorMessage message={error} />}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
                style={{
                  backgroundColor: isLightMode ? '#3a74d3' : '#ff3a4c',
                  color: '#ffffff'
                }}
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
                  'Sign Up'
                )}
              </button>

              {/* Social Login Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div 
                    className="w-full border-t"
                    style={{ borderColor: isLightMode ? '#d1d5db' : 'rgba(255, 255, 255, 0.1)' }}
                  />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span 
                    className="px-2"
                    style={{
                      backgroundColor: isLightMode ? '#f9fafb' : '#141420',
                      color: isLightMode ? '#6b7280' : '#9b9ba7'
                    }}
                  >
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login Button */}
              <button
                type="button"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  border: isLightMode ? '1px solid #d1d5db' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: isLightMode ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
                  color: isLightMode ? '#374151' : '#e0e0e0'
                }}
                onClick={() => { window.location.href = 'http://localhost:8081/oauth2/authorization/github' }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">GitHub</span>
              </button>

              {/* Login Link */}
              <p 
                className="text-center text-sm"
                style={{ color: isLightMode ? '#6b7280' : '#9b9ba7' }}
              >
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-medium"
                  style={{ color: isLightMode ? '#3a74d3' : '#ff3a4c' }}
                >
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}