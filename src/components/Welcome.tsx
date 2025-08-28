import { Link } from 'react-router-dom';

const Welcome = () => {
  const features = [
    {
      title: "Build Library",
      icon: "📚",
      description: "Organize and manage your D&D character builds with search, filtering, and export capabilities.",
      path: "/library",
      status: "available"
    },
    {
      title: "Build Editor",
      icon: "⚔️",
      description: "Create and optimize D&D 5e characters with point-buy calculator, feat selection, and attack profiles.",
      path: "/build",
      status: "available"
    },
    {
      title: "Combat Lab",
      icon: "⚡",
      description: "Analyze DPR, time-to-kill, and combat performance with detailed charts and explanations.",
      path: "/combat",
      status: "available"
    },
    {
      title: "Compare Room",
      icon: "📊",
      description: "Compare up to 3 builds side-by-side with DPR analysis, level curves, and comprehensive metrics.",
      path: "/compare",
      status: "available"
    },
    {
      title: "Pillar Scorecards",
      icon: "🎯",
      description: "Evaluate non-combat performance in social, exploration, and utility situations.",
      path: "/pillars",
      status: "coming-soon"
    },
    {
      title: "Leveling Planner",
      icon: "📈",
      description: "Plan character progression across levels 1-20 with power spike analysis.",
      path: "/leveling",
      status: "coming-soon"
    },
    {
      title: "Party & Day Planner",
      icon: "👥",
      description: "Optimize party composition and plan adventuring days with resource management.",
      path: "/party",
      status: "coming-soon"
    },
    {
      title: "Optimize & Analyze",
      icon: "🔬",
      description: "Advanced optimization algorithms and statistical analysis for character builds.",
      path: "/optimizer",
      status: "coming-soon"
    }
  ];

  return (
    <div className="welcome-container">
      <div className="welcome-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-main">Ultimate D&D Tools</span>
            <span className="title-sub">D&D 5e Character Optimization Lab</span>
          </h1>
          <p className="hero-description">
            The most comprehensive suite of tools for optimizing D&D 5e characters. 
            From build creation to combat analysis, make data-driven decisions for your adventures.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">4</span>
              <span className="stat-label">Tools Available</span>
            </div>
            <div className="stat">
              <span className="stat-number">4</span>
              <span className="stat-label">Coming Soon</span>
            </div>
            <div className="stat">
              <span className="stat-number">∞</span>
              <span className="stat-label">Possibilities</span>
            </div>
          </div>
        </div>
      </div>

      <div className="welcome-features">
        <div className="features-header">
          <h2>Explore Our Tools</h2>
          <p>Each tool is designed to help you make informed decisions about your character builds and gameplay strategies.</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.path} className={`feature-card ${feature.status}`}>
              <Link to={feature.path} className="feature-link">
                <div className="feature-layout">
                  <div className="feature-icon">{feature.icon}</div>
                  <div className="feature-content">
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                    <div className="feature-status">
                      {feature.status === 'available' ? (
                        <span className="status-badge available">Available Now</span>
                      ) : (
                        <span className="status-badge coming-soon">Coming Soon</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="welcome-cta">
        <h2>Ready to Optimize?</h2>
        <p>Start building your perfect D&D character today</p>
        <Link to="/build" className="cta-button">
          <span className="button-icon">⚔️</span>
          Start Building
        </Link>
      </div>

      <style>{`
        .welcome-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding-top: var(--header-height);
        }

        .welcome-hero {
          background: linear-gradient(135deg, 
            var(--bg-primary) 0%, 
            var(--bg-secondary) 50%, 
            var(--bg-tertiary) 100%);
          padding: 1.5rem;
          text-align: center;
          border-bottom: 1px solid var(--border-light);
          flex-shrink: 0;
        }

        .hero-content {
          max-width: 100%;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .hero-title {
          margin: 0 0 2rem 0;
        }

        .title-main {
          display: block;
          font-size: var(--text-4xl);
          font-weight: 800;
          background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .title-sub {
          display: block;
          font-size: var(--text-base);
          font-weight: 500;
          color: var(--text-secondary);
        }

        .hero-description {
          font-size: var(--text-lg);
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0 0 1.5rem 0;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 1.5rem;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: var(--text-2xl);
          font-weight: 800;
          color: var(--accent-color);
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          font-weight: 500;
        }

        .welcome-features {
          flex: 1;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .features-header {
          text-align: center;
          margin-bottom: 1.5rem;
          flex-shrink: 0;
        }

        .features-header h2 {
          font-size: var(--text-2xl);
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
        }

        .features-header p {
          font-size: var(--text-base);
          color: var(--text-secondary);
          margin: 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          flex: 1;
          overflow-y: auto;
          padding: 0 1rem;
        }

        .feature-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--rounded-xl);
          overflow: hidden;
          transition: var(--transition);
          position: relative;
        }

        .feature-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-xl);
          border-color: var(--border-strong);
        }

        .feature-card.available:hover {
          border-color: var(--success-color);
        }

        .feature-link {
          display: block;
          padding: 1.25rem;
          text-decoration: none;
          color: inherit;
          height: 100%;
        }

        .feature-layout {
          display: flex;
          gap: 1rem;
          height: 100%;
          align-items: flex-start;
        }

        .feature-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
          margin-top: 0.25rem;
        }

        .feature-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }

        .feature-title {
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
        }

        .feature-description {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.4;
          margin: 0 0 1rem 0;
          flex: 1;
        }

        .feature-status {
          margin-top: auto;
          align-self: flex-start;
        }

        .status-badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          border-radius: var(--rounded-full);
          font-size: var(--text-xs);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-badge.available {
          background: var(--success-color);
          color: white;
        }

        .status-badge.coming-soon {
          background: var(--warning-color);
          color: white;
        }

        .welcome-cta {
          background: var(--bg-tertiary);
          padding: 1rem 1.5rem;
          text-align: center;
          border-top: 1px solid var(--border-light);
          flex-shrink: 0;
        }

        .welcome-cta h2 {
          font-size: var(--text-xl);
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
        }

        .welcome-cta p {
          font-size: var(--text-base);
          color: var(--text-secondary);
          margin: 0 0 1rem 0;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
          color: white;
          text-decoration: none;
          border-radius: var(--rounded-lg);
          font-size: var(--text-base);
          font-weight: 600;
          transition: var(--transition);
          box-shadow: var(--shadow-lg);
        }

        .cta-button:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-xl);
          filter: brightness(1.05);
        }

        .button-icon {
          font-size: 1rem;
        }

        @media (max-width: 1200px) {
          .features-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 900px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .welcome-hero {
            padding: 1rem;
          }

          .hero-content {
            padding: 0 1rem;
          }

          .title-main {
            font-size: var(--text-3xl);
          }

          .hero-description {
            font-size: var(--text-base);
          }

          .hero-stats {
            gap: 1.5rem;
          }

          .welcome-features {
            padding: 1rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
            padding: 0;
          }

          .welcome-cta {
            padding: 1rem;
          }
        }

        @media (max-width: 640px) {
          .hero-stats {
            gap: 1rem;
          }

          .stat {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }

          .stat-number {
            font-size: var(--text-lg);
            margin-bottom: 0;
          }

          .stat-label {
            font-size: var(--text-xs);
          }
        }
      `}</style>
    </div>
  );
};

export default Welcome;