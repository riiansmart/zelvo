/**
 * App.tsx
 * Main routing component of the TaskFlow application.
 * Handles all route definitions and authentication-based route protection.
 * 
 * Key Features:
 * - Route-based code splitting for optimized loading
 * - Authentication state-based route protection
 * - OAuth integration for social login
 * - Centralized layout management for authenticated routes
 * 
 * Route Categories:
 * 1. Public Routes:
 *    - Landing page (/)
 *    - Login (/login)
 *    - Register (/register)
 * 2. OAuth Routes:
 *    - OAuth callback (/oauth/redirect)
 * 3. Protected Routes:
 *    - Dashboard (/dashboard)
 *    - Profile (/profile)
 *    - 404 fallback (*)
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { OAuthRedirectPage } from './pages/OAuthRedirectPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import { Layout } from './components/Layout';
import { TaskFlowDashboard } from './components/TaskFlowDashboard';

/**
 * Main application component that defines the routing structure.
 * Implements route protection based on user authentication status.
 * 
 * Authentication Flow:
 * - Unauthenticated users are redirected to login
 * - Authenticated users on auth pages are redirected to dashboard
 * - Protected routes are wrapped in Layout component for consistent UI
 * 
 * Route Protection:
 * - Public routes: Always accessible
 * - Auth routes: Redirect to dashboard if authenticated
 * - Protected routes: Redirect to login if not authenticated
 * 
 * @returns {JSX.Element} The main application component with routing
 */
function App() {
  // Get current authentication state from context
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes - Always Accessible 
          Landing page serves as the main entry point and marketing page */}
      <Route path="/" element={<LandingPage />} />

      {/* Authentication Routes - Redirect to dashboard if already logged in 
          Prevents authenticated users from accessing login/register pages */}
      <Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/register"
        element={!user ? <RegisterPage /> : <Navigate to="/dashboard" replace />}
      />

      {/* OAuth Callback Route - Handles authentication redirect 
          Processes OAuth provider responses and establishes user session */}
      <Route path="/oauth/redirect" element={<OAuthRedirectPage />} />

      {/* Protected Routes - Require Authentication 
          Layout component provides common structure for authenticated pages */}
      <Route
        element={user ? <Layout /> : <Navigate to="/login" replace />}
      >
        {/* Dashboard - Main application interface 
            Central hub for task management and visualization */}
        <Route path="/dashboard" element={<TaskFlowDashboard />} />
        
        {/* Profile - User settings and information 
            Handles user preferences and account management */}
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* 404 - Catch all route for unmatched paths 
            Provides user-friendly error page for invalid routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;