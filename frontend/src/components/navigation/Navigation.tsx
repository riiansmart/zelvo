/**
 * Navigation.tsx
 * Main navigation component that provides the top navigation bar for the application.
 * Handles user navigation, authentication state, and theme toggling.
 */

import { Link, useLocation, useNavigate } from "react-router-dom"; // Router utilities
import { useAuth } from "../../hooks/useAuth"; // Authentication context
import { useTheme } from "../../context/ThemeContext"; // Theme context
import "../../styles/components/Navigation.css"; // Navigation styles
import React, { useState, useRef, useEffect } from "react";
import { Menu } from 'lucide-react';

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
  const { toggleTheme } = useTheme();

  // Access authentication context for user state and logout
  const { user, logout } = useAuth();

  // Router hooks for navigation and location awareness
  const location = useLocation();
  const navigate = useNavigate();

  // Check if current page is login or register
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  // Dropdown state and ref
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Handles user logout action
   * - Calls logout function from auth context
   * - Redirects to login page
   */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="taskflow-nav">
      <div className="taskflow-header">
        <Link to="/" className="taskflow-logo">
          <div className="logo-container">
            <div className="main-title">
              <span className="letter">T</span>
              <span className="letter">A</span>
              <span className="letter">S</span>
              <span className="letter">K</span>
              <span className="letter">F</span>
              <span className="letter">L</span>
              <span className="letter">O</span>
              <span className="letter">W</span>
              <div className="subtitle-overlay">
                {" "}
                <span className="subtitle-letter">E</span>{" "}
                <span className="subtitle-letter">N</span>{" "}
                <span className="subtitle-letter">G</span>{" "}
                <span className="subtitle-letter">I</span>{" "}
                <span className="subtitle-letter">N</span>{" "}
                <span className="subtitle-letter">E</span>{" "}
                <span className="subtitle-letter">E</span>{" "}
                <span className="subtitle-letter">R</span>{" "}
                <span className="subtitle-letter">E</span>{" "}
                <span className="subtitle-letter">D</span>{" "}
                <span className="subtitle-space"> </span>{" "}
                <span className="subtitle-letter">F</span>{" "}
                <span className="subtitle-letter">O</span>{" "}
                <span className="subtitle-letter">R</span>{" "}
                <span className="subtitle-space"> </span>{" "}
                <span className="subtitle-letter">C</span>{" "}
                <span className="subtitle-letter">H</span>{" "}
                <span className="subtitle-letter">A</span>{" "}
                <span className="subtitle-letter">O</span>{" "}
                <span className="subtitle-letter">S</span>{" "}
                <span className="subtitle-letter">.</span>{" "}
                <span className="subtitle-space"> </span>{" "}
                <span className="subtitle-letter">D</span>{" "}
                <span className="subtitle-letter">E</span>{" "}
                <span className="subtitle-letter">S</span>{" "}
                <span className="subtitle-letter">I</span>{" "}
                <span className="subtitle-letter">G</span>{" "}
                <span className="subtitle-letter">N</span>{" "}
                <span className="subtitle-letter">E</span>{" "}
                <span className="subtitle-letter">D</span>{" "}
                <span className="subtitle-space"> </span>{" "}
                <span className="subtitle-letter">F</span>{" "}
                <span className="subtitle-letter">O</span>{" "}
                <span className="subtitle-letter">R</span>{" "}
                <span className="subtitle-space"> </span>{" "}
                <span className="subtitle-letter">C</span>{" "}
                <span className="subtitle-letter">O</span>{" "}
                <span className="subtitle-letter">N</span>{" "}
                <span className="subtitle-letter">T</span>{" "}
                <span className="subtitle-letter">R</span>{" "}
                <span className="subtitle-letter">O</span>{" "}
                <span className="subtitle-letter">L</span>{" "}
                <span className="subtitle-letter">.</span>{" "}
              </div>
            </div>
          </div>
        </Link>

        {/* Login dropdown for unauthenticated users */}
        {!user && (
          <div className="auth-controls" ref={dropdownRef}>
            <button
              className="login-link dropdown-trigger"
              onClick={() => setDropdownOpen((open) => !open)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <Menu size={24} />
            </button>
            {dropdownOpen && (
              <div className="login-dropdown">
                <Link to="/login" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Hidden user controls for authenticated users - only show on dashboard */}
        {user && location.pathname === "/dashboard" && (
          <div className="user-controls">
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
            <button onClick={handleLogout} className="nav-link logout-button">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
