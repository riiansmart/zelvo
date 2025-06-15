/**
 * RegisterPage.tsx
 * User registration page that handles new account creation.
 * Features a responsive form with validation and error handling.
 */

import React, { useState } from 'react';
import "../styles/auth.css";
import { Navigation } from '../components/navigation/Navigation';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { RegisterRequest } from '../types/Auth';
import { ErrorMessage } from '../components/ui/CommonComponents';

/**
 * RegisterPage Component
 * Handles new user registration with:
 * - Form for user details (name, email, password)
 * - Input validation
 * - Error handling
 * - Loading states
 * - Navigation between auth pages
 * 
 * @returns {JSX.Element} The registration page component
 */
export default function RegisterPage() {
  // Router hooks for navigation
  const navigate = useNavigate();
  const location = useLocation();

  // Form state management
  const [form, setForm] = useState<RegisterRequest>({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles form input changes
   * Updates form state with new values
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Handles form submission for user registration
   * - Prevents default form submission
   * - Validates and submits user details
   * - Handles success/error states
   * - Navigates to login on success
   * 
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await registerUser(form);
      // Redirect to login page with success indicator
      navigate('/login?registered=true');
    } catch (err) {
      // Handle various error types and extract message
      let errorMessage = 'Registration failed. Please try again.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Checks if the current path matches the given path
   * Used for tab highlighting in navigation
   * @param {string} path - Path to check against
   * @returns {boolean} Whether the current path matches
   */
  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <div className="auth-page">
      <Navigation />
      <main className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="logo">TaskFlow</h1>
            <p className="description hero-message">Create an account to manage your tasks.</p>
          </div>
            
          <div className="auth-tabs">
            <Link 
              to="/login" 
              className={`auth-tab ${isCurrentPath('/login') ? 'active' : ''}`}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className={`auth-tab ${isCurrentPath('/register') ? 'active' : ''}`}
            >
              Register
            </Link>
          </div>
            
          <form onSubmit={handleSubmit}>
            <div className="form-group">
               <span className="input-icon"><i className="fas fa-user"></i></span>
              <input
                className="auth-input"
                name="name"
                placeholder="Full Name (e.g., John Doe)"
                value={form.name}
                onChange={handleChange}
                required
                aria-label="Full Name"
              />
            </div>
              
            <div className="form-group">
              <span className="input-icon"><i className="fas fa-envelope"></i></span>
              <input
                className="auth-input"
                name="email"
                type="email"
                placeholder="Email (e.g., john.doe@example.com)"
                value={form.email}
                onChange={handleChange}
                required
                aria-label="Email Address"
              />
            </div>
              
            <div className="form-group">
              <span className="input-icon"><i className="fas fa-lock"></i></span>
              <input
                className="auth-input"
                name="password"
                type="password"
                placeholder="Password (min 6 characters)"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                aria-label="Password"
              />
            </div>
              
            {error && <ErrorMessage message={error} />}
              
            <button 
              type="submit" 
              className="auth-button cta-button primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Processing...
                </>
              ) : (
                'Register'
              )}
            </button>
              
            <div className="back-home-container">
              <Link to="/" className="back-home-link">Back to Home</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}