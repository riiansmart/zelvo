/**
 * Layout.tsx
 * Main layout component that provides the common structure for authenticated pages.
 * Implements a responsive layout with navigation and content area.
 */

import { Outlet } from 'react-router-dom'  // Renders child routes
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
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navigation bar */}
      <Navigation />
      
      {/* Main content area - grows to fill available space */}
      <main className="flex-1">
        {/* Renders the child route components */}
        <Outlet />
      </main>
    </div>
  )
}

export default Layout