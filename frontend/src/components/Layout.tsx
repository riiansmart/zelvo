/**
 * Layout.tsx
 * Main layout component that provides the common structure for authenticated pages.
 * Implements a responsive layout with navigation and content area.
 */

import { Outlet, useLocation } from 'react-router-dom'  // Renders child routes & access location
import { Navigation } from './navigation/Navigation'  // Main navigation component
import '../styles/components/Layout.css'  // Layout-specific styles

/**
 * Layout component that wraps authenticated pages.
 * Features:
 * - Full-height screen layout with flex column
 * - Dark theme with cyberpunk styling
 * - Fixed navigation at the top
 * - Flexible content area that grows to fill available space
 * 
 * @returns {JSX.Element} The layout wrapper component
 */
export function Layout() {
  const location = useLocation();
  // Hide the top navigation for the redesigned workspace pages that provide their own navigation
  const hideNav = /^(\/dashboard|\/tasks|\/calendar|\/settings)/.test(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNav && <Navigation />}

      {/* Main content area - grows to fill available space */}
      <main className="flex-1">
        {/* Renders the child route components */}
        <Outlet />
      </main>
    </div>
  );
}

export default Layout