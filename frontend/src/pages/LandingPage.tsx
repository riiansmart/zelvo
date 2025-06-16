/**
 * LandingPage.tsx
 * Main landing page component with hero section, cards, and footer.
 */

import React from "react";
import { Link } from "react-router-dom";
import { Navigation } from "../components/navigation/Navigation";
import figureImage from "../assets/figure.png";
import figmaLogo from "../assets/Figma Logo Full Color.png";
import githubLogo from "../assets/GitHub_Logo_White.png";
import githubcatLogo from "../assets/github-mark-white.png";
import { Rocket, CheckCircle, UsersRound } from "lucide-react";

import "../styles/landing-page.css";

// -------------------------
// FAQ data & helper types
// -------------------------
type FaqItem = {
  q: string;
  a: string;
};

const FAQ_CONTENT: FaqItem[] = [
  {
    q: "Is Taskflow really free?",
    a: "Yes! All core features are free during beta. Paid plans with team-level permissions arrive later, but there will always be a generous free tier."
  },
  {
    q: "Does it replace Jira or Trello?",
    a: "Taskflow focuses on dev-centric workflow, but you can keep Jira/Trello if you like—our two-way sync means issues stay in lock-step." 
  },
  {
    q: "Will my data be secure?",
    a: "Absolutely. All traffic is encrypted via TLS 1.3 and data is stored with AES-256 at rest. You own your data & can export anytime." 
  },
  {
    q: "Do you have desktop / mobile apps?",
    a: "Yes. macOS, Windows, and Linux apps ship alongside the web app. iOS & Android are in public TestFlight/Play beta." 
  }
];

// Dummy testimonials data
const TESTIMONIALS = [
  {
    quote:
      "Taskflow cut our stand-up time in half and replaced three different tools.",
    name: "Samira K.",
    role: "Engineering Manager"
  },
  {
    quote: "The cyberpunk UI makes project management… actually fun 🤘.",
    name: "Alex P.",
    role: "Full-Stack Developer"
  },
  {
    quote: "We shipped our MVP two weeks faster after moving to Taskflow.",
    name: "Jamie L.",
    role: "Startup Founder"
  }
];

// Pricing tiers
const PLANS = [
  { name: "Free Beta", price: "$0", perks: ["Unlimited tasks", "2 teammates", "Community support"] },
  { name: "Pro", price: "$9", perks: ["Unlimited teammates", "Advanced integrations", "Priority support"] },
  { name: "Enterprise", price: "Contact", perks: ["SSO / SCIM", "Custom SLA", "Dedicated manager"] }
];

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
                  <Link to="/register" className="cta-button primary">Get Started</Link>
                  <button className="cta-button secondary">Learn More</button>
                </div>
              </div>
            </div>
          </section>

          {/* Three Cards Section – deeper feature blurbs */}
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

          {/* Benefits Grid Section */}
          <section className="benefits-section">
            <h3 className="benefits-title">Why Taskflow?</h3>
            <ul className="benefits-grid" role="list">
              <li className="benefit-card">
                <Rocket className="benefit-icon" aria-hidden="true" />
                <h4 className="benefit-heading">Ship Faster</h4>
                <p className="benefit-text">Automate busy-work and keep your team in flow.</p>
              </li>
              <li className="benefit-card">
                <CheckCircle className="benefit-icon" aria-hidden="true" />
                <h4 className="benefit-heading">Stay Aligned</h4>
                <p className="benefit-text">Real-time sync with GitHub, Figma, and Slack.</p>
              </li>
              <li className="benefit-card">
                <UsersRound className="benefit-icon" aria-hidden="true" />
                <h4 className="benefit-heading">Scale Collaboration</h4>
                <p className="benefit-text">From solo maker to enterprise—permissions that grow.</p>
              </li>
            </ul>
          </section>

          {/* Integrations Section */}
          <section className="integrations-section">
            <div className="integrations-content" style={{ alignItems: "center" }}>
              <p className="integrations-text" style={{ textAlign: "center", marginBottom: "1.2rem" }}>
                Works seamlessly with tools you already use
              </p>
              <div className="integrations-logos">
                <img src={figmaLogo} alt="Figma Logo" className="partner-logo" />
                <img src={githubLogo} alt="GitHub Logo" className="partner-logo" />
                <img src={githubcatLogo} alt="GitHub Cat Logo" className="partner-logo" />
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="testimonials-section">
            <h3 className="testimonials-title">Loved by teams worldwide</h3>
            <ul className="testimonials-slider" role="list" aria-live="polite">
              {TESTIMONIALS.map((t, idx) => (
                <li key={idx} className="testimonial-card">
                  <p className="testimonial-quote">“{t.quote}”</p>
                  <p className="testimonial-author">{t.name} · {t.role}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Pricing Section */}
          <section className="pricing-section">
            <h3 className="pricing-title">Simple, transparent pricing</h3>
            <div className="pricing-grid">
              {PLANS.map((plan) => (
                <div key={plan.name} className={`pricing-card ${plan.name === 'Free Beta' ? 'highlight' : ''}`}>
                  <h4 className="plan-name">{plan.name}</h4>
                  <p className="plan-price">{plan.price}<span className="plan-price-period">/mo</span></p>
                  <ul className="plan-perks">
                    {plan.perks.map((perk) => (
                      <li key={perk} className="perk-item">{perk}</li>
                    ))}
                  </ul>
                  <button className="plan-cta">{plan.name === 'Free Beta' ? 'Get Started' : 'Join Waitlist'}</button>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section – answers last-minute questions */}
          <section className="faq-section">
            <h3 className="faq-title">Frequently Asked Questions</h3>

            <ul className="faq-list" role="list">
              {FAQ_CONTENT.map((item, idx) => (
                <li key={item.q} className="faq-item">
                  <AccordionItem item={item} defaultOpen={idx === 0} />
                </li>
              ))}
            </ul>
          </section>

          {/* Site Footer */}
          <footer className="site-footer" role="contentinfo">
            <div className="footer-inner">
              <div className="footer-brand">
                <span className="brand-name">TASKFLOW</span>
                <p className="brand-tag">Engineered for chaos. Designed for control.</p>
              </div>

              <nav className="footer-nav" aria-label="Footer Navigation">
                <ul className="footer-links" role="list">
                  <li><Link to="/" className="footer-link">Home</Link></li>
                  <li><Link to="/register" className="footer-link">Sign&nbsp;Up</Link></li>
                  <li><a href="https://github.com" target="_blank" rel="noreferrer" className="footer-link">GitHub</a></li>
                  <li><a href="#" className="footer-link">Privacy</a></li>
                  <li><a href="#" className="footer-link">Terms</a></li>
                </ul>
              </nav>

              <div className="footer-copy">
                © {new Date().getFullYear()} Taskflow. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </main>

      {/* Sticky CTA Banner */}
      <StickyCta />
    </div>
  );
}

// -------------------------
// Accordion Item component
// -------------------------

interface AccordionProps {
  item: FaqItem;
  defaultOpen?: boolean;
}

const AccordionItem: React.FC<AccordionProps> = ({ item, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const [maxHeight, setMaxHeight] = React.useState<string>(defaultOpen ? 'none' : '0px');

  const contentRef = React.useRef<HTMLDivElement>(null);

  const buttonId = React.useId();
  const panelId = `panel-${buttonId}`;

  React.useEffect(() => {
    if (!contentRef.current) return;
    if (isOpen) {
      const scrollH = contentRef.current.scrollHeight;
      setMaxHeight(scrollH + 'px');
    } else {
      setMaxHeight('0px');
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        id={buttonId}
        className="faq-question"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
      >
        <span>{item.q}</span>
        <svg
          className={`faq-arrow ${isOpen ? 'open' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        ref={contentRef}
        className={`faq-answer ${isOpen ? 'open' : ''}`}
        style={{ maxHeight }}
      >
        {item.a}
      </div>
    </>
  );
};

// Sticky CTA component
const StickyCta: React.FC = () => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      if (docHeight <= 0) return;
      setVisible(scrolled / docHeight > 0.7);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="sticky-cta" role="complementary">
      <span className="sticky-text">Ready to organize the chaos?</span>
      <Link to="/register" className="sticky-button">Get Started</Link>
    </div>
  );
};
