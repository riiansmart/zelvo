/**
 * Navigation.tsx
 * Main navigation component that provides the top navigation bar for the application.
 * Handles user navigation, authentication state, and theme toggling.
 */

import { Link, useLocation, useNavigate } from 'react-router-dom'  // Router utilities
import { useAuth } from '../../hooks/useAuth'                      // Authentication context
import { useTheme } from '../../context/ThemeContext'              // Theme context
import Diamond3D from '../Diamond3D'                               // Logo component
import '../../styles/components/Navigation.css'                    // Navigation styles

/**
 * Navigation component that displays the top navigation bar.
 * Features:
 * - Responsive navigation with logo and user controls
 * - Conditional rendering based on authentication state
 * - Theme toggle functionality
 * - Dynamic navigation links
 * 
 * @returns {JSX.Element} The navigation component
 */
export function Navigation() {
  // Access theme context for toggling dark/light mode
  const { toggleTheme } = useTheme()
  
  // Access authentication context for user state and logout
  const { user, logout } = useAuth()
  
  // Router hooks for navigation and location awareness
  const location = useLocation()
  const navigate = useNavigate()
  
  // Check if current page is login or register
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  /**
   * Handles user logout action
   * - Calls logout function from auth context
   * - Redirects to login page
   */
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="main-nav">
      {/* Main Navigation Container */}
      <div className="top-nav">
        {/* Logo and Brand Section */}
        <div className="logo-wrapper">
          <Link to="/" className="flex items-center">
            <Diamond3D />
            <span className="logo">TaskFlow</span>
          </Link>
        </div>

        {/* User Controls Section */}
        <div className="user-section">
          {/* Home link always visible */}
          <Link to="/" className="nav-link">Home</Link>
          
          {/* Conditional Navigation Links */}
          {user ? (
            <>
              {/* Authenticated User Links */}
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
            </>
          ) : (
            /* Non-authenticated User Links - Hidden on auth pages */
            !isAuthPage && (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            )
          )}
          
          {/* Theme Toggle Button */}
          <button
            type="button"
            aria-label="Toggle theme"
            className="theme-toggle"
            onClick={toggleTheme}
          />
        </div>
      </div>
    </nav>
  )
}

export default Navigation 