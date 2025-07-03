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
import heroScreenshot from "../assets/zelvo_dashboard_light.png";
import backgroundImage from "../assets/Zelvo_LandingPage_Background.png";
import heroBlurImage from "../assets/Zelvo_HeroImage_Blur.png";

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
      {/* Background Image */}
      <img 
        src={backgroundImage} 
        alt="Background" 
        className="landing-page-background"
      />
      
      {/* Top Navigation */}
      <Navigation />

      {/* Main Content Area */}
      <main className="landing-container">
        <div className="main-content">
          {/* Hero Section (Figma-aligned) */}
          <section className="zelvo-hero" id="home">
            {/* Hero Text Content - Centered */}
            <div className="zelvo-hero-text">
              <h1 className="zelvo-hero-title">
                Boost Your <span className="gradient-text">Productivity</span>,
                <br />
                Simplify Your Life
              </h1>
              <p className="zelvo-hero-subtitle">
                We're here to simplify the intricacies of your life, providing a user-friendly platform that not only manages your tasks effortlessly but also enhances your overall efficiency.
              </p>
              <div className="zelvo-hero-buttons">
                <Link to="/register" className="zelvo-btn-primary">Get Started</Link>
                <button className="zelvo-btn-outline" type="button">Preview Platform</button>
              </div>
            </div>

            {/* Dashboard Image - Below Text */}
            <div className="zelvo-hero-image">
              <img src={heroScreenshot} alt="Zelvo dashboard preview" />
              <img 
                src={heroBlurImage} 
                alt="Hero blur overlay" 
                className="zelvo-hero-blur-overlay"
              />
            </div>
          </section>
        </div>
      </main>

      
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

