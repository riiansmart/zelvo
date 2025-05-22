/**
 * LandingPage.tsx
 * Main landing page component with hero section, cards, and footer.
 */

import React from 'react'
import { Navigation } from '../components/navigation/Navigation'
import '../styles/landing-page.css'

/**
 * LandingPage Component
 * Landing page with navigation, hero section, cards, and footer
 * 
 * @returns {JSX.Element} The landing page component
 */
export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Top Navigation */}
      <Navigation />

      {/* Main Content Area */}
      <main className="landing-container">
                {/* Hero Section */}        <section className="hero-section">          <div className="hero-content">            {/* Left side - Figure/Wireframe */}            <div className="hero-figure">              {/* Wireframe figure will go here */}            </div>                        {/* Right side - Text content */}            <div className="hero-text">              <h1 className="hero-title">                Organize the chaos.<br />                Ship faster. <span style={{ color: '#D3DEA1' }}>Stay in flow.</span>              </h1>              <p className="hero-description">                Taskflow is your cybernetic command center—                built for devs, creatives, and remote teams                who need control without friction.              </p>              <div className="hero-cta">                <button className="cta-button primary">Get Started</button>                <button className="cta-button secondary">Learn More</button>              </div>            </div>          </div>        </section>

        {/* Three Cards Section */}
        <section className="cards-section">
          <div className="cards-container">
            <div className="feature-card"></div>
            <div className="feature-card"></div>
            <div className="feature-card"></div>
          </div>
        </section>

        {/* Footer Section */}
        <section className="footer-section">
          <div className="footer-content">
            <p className="footer-text">
              Works seamlessly with<br />
              tools you already use
            </p>
            <div className="integration-input">
              <input type="text" className="tools-input" placeholder="" />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 