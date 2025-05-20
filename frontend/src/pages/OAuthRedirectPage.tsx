/**
 * OAuthRedirectPage.tsx
 * Handles OAuth authentication callback and user session setup.
 * This component processes the OAuth redirect, extracts the token,
 * fetches user data, and establishes the user session.
 */

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getCurrentUser } from '../services/userService'; // Assuming you have a service to fetch user details

/**
 * OAuthRedirectPage Component
 * Processes OAuth authentication callback with:
 * - Token extraction from URL
 * - User data fetching
 * - Session establishment
 * - Error handling
 * - Loading states
 * 
 * Flow:
 * 1. Extract token from URL params
 * 2. Validate token presence
 * 3. Fetch user details
 * 4. Establish session
 * 5. Redirect to dashboard
 * 
 * @returns {JSX.Element} The OAuth redirect handler component
 */
export function OAuthRedirectPage() {
  // Router hooks for navigation and URL parsing
  const navigate = useNavigate();
  const location = useLocation();
  
  // Authentication context for login
  const { login } = useAuth();

  // Component state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Extract URL parameters
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const errorParam = params.get('error');

    // Handle OAuth error from provider
    if (errorParam) {
      console.error("OAuth Error:", errorParam);
      setError(`Authentication failed: ${errorParam}`);
      setIsLoading(false);
      return;
    }

    // Validate token presence
    if (!token) {
      console.error("OAuth Error: Token not found in redirect URL");
      setError('Authentication failed: Token missing.');
      setIsLoading(false);
      return;
    }

    console.log("Received token:", token);

    /**
     * Fetches user data and establishes session
     * - Stores token in localStorage
     * - Fetches current user data
     * - Updates auth context
     * - Redirects to dashboard
     */
    const fetchUserAndLogin = async () => {
      try {
        // Store token and fetch user data
        localStorage.setItem('token', token);
        const userResponse = await getCurrentUser(); // userResponse is of type User
        console.log("Fetched user data:", userResponse);

        if (userResponse) { // Check if userResponse itself is truthy
          // Establish session and redirect
          login(token, userResponse); // Pass userResponse directly
          console.log("Login successful via OAuth, navigating to dashboard...");
          navigate('/dashboard');
        } else {
          throw new Error('Failed to fetch user details after OAuth login.');
        }

      } catch (err) {
        // Handle various error types
        let errorMessage = 'Failed to retrieve user details after login. Please try logging in again.';
        if (err instanceof Error) {
          errorMessage = err.message;
          console.error("Error fetching user data after OAuth:", err);
        } else {
          console.error("Unknown error fetching user data after OAuth:", err);
        }
        setError(errorMessage);
        localStorage.removeItem('token'); // Clean up on error
      } finally {
        setIsLoading(false);
      }
    };

    // Start the authentication process
    fetchUserAndLogin();

  }, [location, navigate, login]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      {/* Loading State */}
      {isLoading && <p>Processing authentication...</p>}

      {/* Error State */}
      {error && (
        <div style={{ color: 'red' }}>
          <h2>Authentication Failed</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/login')}>Return to Login</button>
        </div>
      )}
    </div>
  );
} 