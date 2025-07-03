/**
 * RegisterPage.tsx
 * Redesigned registration page aligned with new Figma wireframe.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { RegisterRequest } from '../types/Auth';
import { ErrorMessage } from '../components/ui/CommonComponents';

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
        <aside className="hidden lg:flex lg:w-1/2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white items-center justify-center p-10">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-2 text-center">Zelvo</h1>
            <p className="text-lg text-indigo-100 mb-8 text-center">
              Effortless Task and Project Management in One Smart Platform.
            </p>

            <ul className="space-y-4 text-white">
              <li className="flex items-center">
                <i className="fas fa-check-circle text-xl mr-3" aria-hidden="true"></i>
                <span>Streamlined Task Control</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-check-circle text-xl mr-3" aria-hidden="true"></i>
                <span>User-friendly Interface</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-check-circle text-xl mr-3" aria-hidden="true"></i>
                <span>Powerful Integrations</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Right Form Section */}
        <main className="flex-1 flex items-center justify-center bg-gray-50 py-10 px-4">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">
              Create your account
            </h2>
            <p className="text-sm text-gray-600 text-center mb-8">
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

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 shadow-sm bg-white hover:bg-gray-50 transition-colors"
                >
                  <i className="fab fa-google text-red-500" aria-hidden="true"></i>
                  <span className="text-sm font-medium text-gray-700">Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 shadow-sm bg-white hover:bg-gray-50 transition-colors"
                >
                  <i className="fab fa-github text-gray-800" aria-hidden="true"></i>
                  <span className="text-sm font-medium text-gray-700">GitHub</span>
                </button>
              </div>

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