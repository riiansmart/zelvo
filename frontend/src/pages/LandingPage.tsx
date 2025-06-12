/**
 * LandingPage.tsx
 * Main landing page component with hero section, cards, and footer.
 */

import React from "react";
import { Navigation } from "../components/navigation/Navigation";
import figureImage from "../assets/figure.png";
import figmaLogo from "../assets/Figma Logo Full Color.png";
import githubLogo from "../assets/GitHub_Logo_White.png";
import githubcatLogo from "../assets/github-mark-white.png";

import "../styles/landing-page.css";

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
        <div className="main-content">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-figure">
              <img
                src={figureImage}
                alt="Taskflow wireframe figure"
                className="hero-figure-img"
              />
            </div>
            <div className="hero-content">
              {/* Right side - Text content */}
              <div className="hero-text">
                <h2 className="hero-title">
                  Organize the chaos.
                  <br />
                  Ship faster. <span style={{ color: "#e79a0a" }}>Stay in flow.</span>
                </h2>
                <p className="hero-description">
                  Taskflow is your cybernetic command center—built for devs,
                  creatives, and remote teams who need control without friction.
                </p>
                <div className="hero-cta">
                  <button className="cta-button primary">Get Started</button>
                  <button className="cta-button secondary">Learn More</button>
                </div>
              </div>
            </div>
          </section>

          {/* Three Cards Section */}
          <section className="cards-section">
            <div className="cards-container">
              <div className="feature-card">
                <p className="feature-card-text">
                  Taskflow is your cybernetic command center—built for devs,
                  creatives, and remote teams who need control without friction.
                </p>
              </div>
              <div className="feature-card">
                <p className="feature-card-text">
                  Our task management tool helps you stay focused, get things
                  done, and achieve your goals.
                </p>
              </div>
              <div className="feature-card">
                <p className="feature-card-text">
                  We're a team of developers, designers, and remote teams who need control without friction.
                </p>
              </div>
            </div>
          </section>

          {/* Footer Section */}
          <section className="footer-section">
            <div className="footer-content" style={{ alignItems: "center" }}>
              <p
                className="footer-text"
                style={{ textAlign: "center", marginBottom: "1.2rem" }}
              >
                Works seamlessly with tools you already use
              </p>
              <div className="footer-logos">
                <img src={figmaLogo} alt="Figma Logo" className="partner-logo" />
                <img
                  src={githubLogo}
                  alt="GitHub Logo"
                  className="partner-logo"
                />
                <img
                  src={githubcatLogo}
                  alt="GitHub Cat Logo"
                  className="partner-logo"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
