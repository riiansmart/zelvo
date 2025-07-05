/**
 * RegisterPage.tsx
 * Redesigned registration page aligned with new Figma wireframe.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { RegisterRequest } from '../types/Auth';
import { ErrorMessage } from '../components/ui/CommonComponents';
import registerImg from '../assets/registerImg.png';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();

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
            <p className="text-lg text-blue-100 mb-6 max-w-md mx-auto">
              Join thousands of users who streamline their workflow with our intuitive task management platform.
            </p>
          </div>

          {/* Feature highlights - Centered with consistent width */}
          <div className="flex flex-col items-center gap-6 z-10 w-full max-w-md mx-auto relative">
            <div className="absolute left-1/2 -translate-x-[150px] flex flex-col gap-[24px]">
              <i className="fas fa-check-circle text-green-400 text-3xl" aria-hidden="true"></i>
              <i className="fas fa-check-circle text-green-400 text-3xl" aria-hidden="true"></i>
              <i className="fas fa-check-circle text-green-400 text-3xl" aria-hidden="true"></i>
            </div>
            
            <div className="flex flex-col gap-[24px] items-center pl-8 pt-1">
              <div className="h-8 flex items-center">
                <span className="text-lg font-medium text-blue-100">Streamlined Task Control</span>
              </div>
              <div className="h-8 flex items-center">
                <span className="text-lg font-medium text-blue-100">Intuitive Interface</span>
              </div>
              <div className="h-8 flex items-center">
                <span className="text-lg font-medium text-blue-100">Powerful Integrations</span>
              </div>
            </div>
          </div>

          {/* Subtle Background Image */}
          <div className="absolute inset-0 flex items-center justify-center opacity-15">
            <img 
              src={registerImg} 
              alt="Task management visualization" 
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
                  src={registerImg} 
                  alt="Task management visualization" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-base md:text-lg text-gray-600 text-center mb-10">
              Start managing your tasks efficiently
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="First Name"
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Last Name"
                />
              </div>

              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Email Address"
              />

              <input
                name="password"
                type="password"
                placeholder="Password"
                minLength={6}
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Password"
              />

              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                minLength={6}
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Confirm Password"
              />

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
                  'Sign Up'
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="px-4 text-sm text-gray-500">Or continue with</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>

              {/* Social Button */}
              <button
                type="button"
                onClick={() => { window.location.href = 'http://localhost:8081/oauth2/authorization/github' }}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-3 py-2 shadow-sm bg-white hover:bg-gray-50 transition-colors"
              >
                <i className="fab fa-github text-gray-800 text-sm" aria-hidden="true"></i>
                <span className="text-xs font-medium text-gray-700">GitHub</span>
              </button>

              {/* Already have account */}
              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 font-medium">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}