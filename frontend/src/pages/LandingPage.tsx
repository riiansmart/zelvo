/**
 * LandingPage.tsx
 * Main landing page component that introduces TaskFlow to new users.
 * Features a modern, responsive design with feature highlights and testimonials.
 */

import { Link } from 'react-router-dom'  // Router link component
// import React from 'react' // Removed unused React import
import { Navigation } from '../components/navigation/Navigation'  // Top navigation bar

/**
 * LandingPage Component
 * Displays the public landing page with:
 * - Welcome message and description
 * - Key features list
 * - User testimonials
 * - Call-to-action button
 * 
 * Uses CSS variables for theming and responsive design
 * 
 * @returns {JSX.Element} The landing page component
 */
export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Top Navigation */}
      <Navigation />

      {/* Main Content Area */}
      <main className="container" style={{ padding: '2rem 0', textAlign: 'center' }}>
        {/* Hero Section */}
        <h1 className="welcome-text">Welcome to TaskFlow</h1>
        <p className="welcome-description" style={{ marginBottom: '2rem' }}>
          Manage your tasks efficiently and stay productive.
        </p>

        {/* Features Section */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 className="welcome-text" style={{ fontSize: '1.5rem' }}>Features</h2>
          <ul style={{ 
            listStyleType: 'disc', 
            listStylePosition: 'inside', 
            maxWidth: '600px', 
            margin: '1rem auto', 
            textAlign: 'left' 
          }}>
            <li>Organize tasks with priority and status filters</li>
            <li>Dark and light mode experience</li>
            <li>Easy search, filter, and pagination</li>
          </ul>
        </section>

        {/* Testimonials Section */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 className="welcome-text" style={{ fontSize: '1.5rem' }}>Testimonials</h2>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            gap: '2rem' 
          }}>
            {/* First Testimonial */}
            <div style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              maxWidth: '300px', 
              boxShadow: 'var(--shadow)' 
            }}>
              <p>"TaskFlow helped me stay on track and boosted productivity!"</p>
              <p style={{ marginTop: '1rem', fontWeight: '600' }}>- Alex</p>
            </div>

            {/* Second Testimonial */}
            <div style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              maxWidth: '300px', 
              boxShadow: 'var(--shadow)' 
            }}>
              <p>"The cyberpunk theme looks awesome and the UI is intuitive."</p>
              <p style={{ marginTop: '1rem', fontWeight: '600' }}>- Jamie</p>
            </div>
          </div>
        </section>

        {/* Call-to-Action Button */}
        <div>
          <Link 
            to="/register" 
            className="filter-button" 
            style={{ padding: '0.7rem 1.5rem', fontWeight: 600 }}
          >
            Get Started
          </Link>
        </div>
      </main>
    </div>
  )
} 