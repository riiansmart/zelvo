/**
 * Navigation.tsx
 * Main navigation component that provides the top navigation bar for the application.
 * Handles user navigation, authentication state, and theme toggling.
 */

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import "../../styles/components/Navigation.css";
import React from "react";
import { Sun, Package, ChevronDown } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

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
  const { toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NAV_ITEMS: NavItem[] = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Features", href: "#features", hasDropdown: true },
    { label: "Testimonial", href: "#testimonial" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <nav className="zelvo-nav">
      <div className="zelvo-header">
        {/* Brand */}
        <Link to="/" className="zelvo-brand" aria-label="Zelvo home">
          <Package size={32} className="zelvo-brand-icon" />
          <span className="zelvo-brand-text">Zelvo</span>
        </Link>

        {/* Primary Nav Links */}
        <ul className="zelvo-nav-links" role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <a href={item.href} className={`zelvo-nav-link ${item.hasDropdown ? 'has-dropdown' : ''}`}>
                {item.label}
                {item.hasDropdown && <ChevronDown size={12} className="nav-dropdown-arrow" />}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="zelvo-actions">
          {!user ? (
            <>
              <Link to="/login" className="zelvo-login">
                Login
              </Link>
              <Link to="/register" className="zelvo-signup-btn">
                Sign Up
              </Link>
            </>
          ) : (
            <button className="zelvo-login" onClick={handleLogout}>
              Logout
            </button>
          )}

          <button
            className="zelvo-theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <Sun size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
