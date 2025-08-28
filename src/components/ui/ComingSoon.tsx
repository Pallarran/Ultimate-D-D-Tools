interface ComingSoonProps {
  title: string;
  description: string;
  features?: string[];
  icon?: string;
}

const ComingSoon = ({ title, description, features, icon = "🚧" }: ComingSoonProps) => {
  return (
    <div className="coming-soon">
      <div className="coming-soon-content">
        <div className="coming-soon-icon">{icon}</div>
        <h1 className="coming-soon-title">{title}</h1>
        <p className="coming-soon-description">{description}</p>
        
        {features && features.length > 0 && (
          <div className="coming-soon-features">
            <h3>Planned Features:</h3>
            <ul>
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="coming-soon-status">
          <span className="status-badge">In Development</span>
          <p className="status-text">This feature is actively being developed and will be available soon!</p>
        </div>
      </div>

      <style>{`
        .coming-soon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1200px;
          height: calc(100vh - 80px);
          padding: 32px;
          margin: 0;
        }

        .coming-soon-content {
          text-align: center;
          width: 600px;
          height: 400px;
          background: var(--bg-secondary);
          padding: 48px 32px;
          border-radius: 16px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
        }

        .coming-soon-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .coming-soon-title {
          font-size: var(--text-4xl);
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
          background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .coming-soon-description {
          font-size: var(--text-lg);
          color: var(--text-secondary);
          margin: 0 0 2rem 0;
          line-height: 1.6;
        }

        .coming-soon-features {
          text-align: left;
          margin: 2rem 0;
          padding: 1.5rem;
          background: var(--bg-tertiary);
          border-radius: var(--rounded-xl);
          border: 1px solid var(--border-light);
        }

        .coming-soon-features h3 {
          margin: 0 0 1rem 0;
          color: var(--text-primary);
          font-size: var(--text-lg);
          font-weight: 600;
        }

        .coming-soon-features ul {
          margin: 0;
          padding-left: 1.5rem;
        }

        .coming-soon-features li {
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          font-size: var(--text-base);
        }

        .coming-soon-status {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-light);
        }

        .status-badge {
          display: inline-block;
          background: var(--warning-color);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: var(--rounded-lg);
          font-size: var(--text-sm);
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .status-text {
          color: var(--text-secondary);
          font-size: var(--text-sm);
          margin: 0;
        }

        @media (max-width: 768px) {
          .coming-soon {
            min-height: 50vh;
            padding: 1rem;
          }

          .coming-soon-content {
            padding: 2rem 1rem;
          }

          .coming-soon-title {
            font-size: var(--text-3xl);
          }

          .coming-soon-description {
            font-size: var(--text-base);
          }

          .coming-soon-icon {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;