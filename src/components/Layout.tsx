import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const navigationItems = [
    { path: '/library', label: 'Library', icon: '📚' },
    { path: '/build', label: 'Build Editor', icon: '⚔️' },
    { path: '/combat', label: 'Combat Lab', icon: '⚡' },
    { path: '/compare', label: 'Compare Room', icon: '📊' },
    { path: '/pillars', label: 'Pillar Scorecards', icon: '🎯' },
    { path: '/leveling', label: 'Leveling Planner', icon: '📈' },
    { path: '/party', label: 'Party & Day Planner', icon: '👥' },
    { path: '/optimizer', label: 'Optimize & Analyze', icon: '🔬' },
  ];

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <Link to="/">Ultimate D&D Tools</Link>
          </h1>
          <nav className="main-nav">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${
                  location.pathname.startsWith(item.path) ? 'active' : ''
                }`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="app-main">
        <div className="main-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;