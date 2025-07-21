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
import { Rocket, CheckCircle, User, Calendar, BarChart3, Target, Clock, Filter, Search, Zap } from "lucide-react";
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

        {/* About Section */}
        <section className="zelvo-about" id="about">
          <div className="about-container">
            <div className="about-content">
              <div className="about-text">
                <h2 className="about-title">
                  About <span className="gradient-text">Zelvo</span>
                </h2>
                <p className="about-subtitle">
                  Revolutionizing the way teams collaborate and individuals achieve their goals through intelligent task management and seamless workflow automation.
                </p>
                <p className="about-description">
                  Born from the frustration of scattered tools and fragmented workflows, Zelvo represents a new paradigm in productivity software. We believe that managing tasks shouldn't be a task itself. Our platform combines the simplicity of modern design with the power of advanced automation, creating an experience that feels natural and empowering.
                </p>
                
                <div className="about-stats">
                  <div className="stat-item">
                    <div className="stat-number">10K+</div>
                    <div className="stat-label">Active Users</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">50K+</div>
                    <div className="stat-label">Tasks Completed</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">99.9%</div>
                    <div className="stat-label">Uptime</div>
                  </div>
                </div>
              </div>

              <div className="about-features">
                <div className="feature-highlight">
                  <div className="feature-icon">
                    <Rocket size={32} />
                  </div>
                  <h3 className="feature-title">Lightning Fast</h3>
                  <p className="feature-desc">Built with performance in mind, every interaction is optimized for speed and responsiveness.</p>
                </div>
                
                <div className="feature-highlight">
                  <div className="feature-icon">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="feature-title">Intuitive Design</h3>
                  <p className="feature-desc">Clean, modern interface that feels familiar from day one, reducing the learning curve to zero.</p>
                </div>
                
                <div className="feature-highlight">
                  <div className="feature-icon">
                    <User size={32} />
                  </div>
                  <h3 className="feature-title">User Focused</h3>
                  <p className="feature-desc">Seamless collaboration tools that keep you aligned and projects moving forward.</p>
                </div>
              </div>
            </div>

            <div className="about-visual">
              <div className="visual-container">
                <div className="floating-card card-1">
                  <div className="card-icon">📊</div>
                  <div className="card-text">Analytics</div>
                </div>
                <div className="floating-card card-2">
                  <div className="card-icon">⚡</div>
                  <div className="card-text">Automation</div>
                </div>
                <div className="floating-card card-3">
                  <div className="card-icon">🎯</div>
                  <div className="card-text">Focus Mode</div>
                </div>
                <div className="floating-card card-4">
                  <div className="card-icon">🔄</div>
                  <div className="card-text">Sync</div>
                </div>
                <div className="about-main-visual">
                  <div className="visual-content">
                    <h4>The Future of Work</h4>
                    <p>Where productivity meets simplicity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="zelvo-features" id="features">
          <div className="features-container">
            <div className="features-header">
              <h2 className="features-title">
                Powerful <span className="gradient-text">Features</span> for Your Productivity
              </h2>
              <p className="features-subtitle">
                Everything you need to organize, track, and complete your tasks efficiently
              </p>
            </div>

            <div className="features-grid">
              {/* Task Management Feature */}
              <div className="zelvo-feature-card" id="task-management">
                <div className="feature-card-header">
                  <div className="feature-icon-large">
                    <Target size={40} />
                  </div>
                  <h3 className="feature-card-title">Task Management</h3>
                </div>
                <p className="feature-card-description">
                  Create, organize, and track your tasks with intuitive controls. Set priorities, due dates, and categories to keep everything organized.
                </p>
                <div className="feature-details">
                  <div className="feature-detail-item">
                    <CheckCircle size={16} />
                    <span>Smart task creation with templates</span>
                  </div>
                  <div className="feature-detail-item">
                    <CheckCircle size={16} />
                    <span>Priority levels and due date tracking</span>
                  </div>
                  <div className="feature-detail-item">
                    <CheckCircle size={16} />
                    <span>Category organization system</span>
                  </div>
                  <div className="feature-detail-item">
                    <CheckCircle size={16} />
                    <span>Bulk operations for efficiency</span>
                  </div>
                </div>
              </div>

              {/* Smart Analytics Feature */}
              <div className="zelvo-feature-card" id="smart-analytics">
                <div className="feature-card-header">
                  <div className="feature-icon-large">
                    <BarChart3 size={40} />
                  </div>
                  <h3 className="feature-card-title">Smart Analytics</h3>
                </div>
                <p className="feature-card-description">
                  Gain insights into your productivity patterns with detailed analytics and progress tracking.
                </p>
                <div className="feature-details">
                  <div className="feature-detail-item">
                    <CheckCircle size={16} />
                    <span>Progress visualization and charts</span>
                  </div>
                  <div className="feature-detail-item">
                    <CheckCircle size={16} />
                    <span>Productivity trend analysis</span>
                  </div>
                  <div className="feature-detail-item">
                    <CheckCircle size={16} />
                    <span>Completion rate tracking</span>
                  </div>
                  <div className="feature-detail-item">
                    <CheckCircle size={16} />
                    <span>Performance insights</span>
                  </div>
                </div>
              </div>

              {/* Personal Dashboard Feature */}
              <div className="zelvo-feature-card" id="personal-dashboard">
                <div className="feature-card-header">
                  <div className="feature-icon-large">
                    <Calendar size={40} />
                  </div>
                  <h3 className="feature-card-title">Personal Dashboard</h3>
                </div>
                <p className="feature-card-description">
                  Your central command center with real-time overview of tasks, upcoming deadlines, and productivity metrics.
                </p>
                <div className="feature-details">
                  <div className="feature-detail-item">
                    <CheckCircle size={16} />
                    <span>Real-time task overview</span>
                  </div>
                  <div className="feature-detail-item">
                    <CheckCircle size={16} />
                    <span>Calendar integration</span>
                  </div>
                  <div className="feature-detail-item">
                    <CheckCircle size={16} />
                    <span>Real-time task updates</span>
                  </div>
                  <div className="feature-detail-item">
                    <CheckCircle size={16} />
                    <span>Customizable widgets</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Features Row */}
            <div className="additional-features">
              <h3 className="additional-features-title">More Powerful Tools</h3>
              <div className="additional-features-grid">
                <div className="mini-feature">
                  <div className="mini-feature-icon">
                    <Search size={24} />
                  </div>
                  <h4>Smart Search</h4>
                  <p>Find tasks instantly with intelligent search and filters</p>
                </div>
                <div className="mini-feature">
                  <div className="mini-feature-icon">
                    <Clock size={24} />
                  </div>
                  <h4>Time Tracking</h4>
                  <p>Monitor time spent on tasks and optimize your workflow</p>
                </div>
                <div className="mini-feature">
                  <div className="mini-feature-icon">
                    <Filter size={24} />
                  </div>
                  <h4>Advanced Filtering</h4>
                  <p>Filter tasks by status, priority, date, and more</p>
                </div>
                <div className="mini-feature">
                  <div className="mini-feature-icon">
                    <Zap size={24} />
                  </div>
                  <h4>Real-time Sync</h4>
                  <p>Instant updates and synchronization across your workspace</p>
                </div>
              </div>
            </div>
          </div>
        </section>
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

