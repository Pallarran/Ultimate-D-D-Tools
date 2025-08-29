import { useMemo } from 'react';
import type { Build, Scenario } from '../../types';
import { calculateThreeRoundDPR } from '../../math/combat';

interface ThreeRoundDPRProps {
  build: Build;
  scenario: Scenario;
}

const ThreeRoundDPR = ({ build, scenario }: ThreeRoundDPRProps) => {
  const dprResults = useMemo(() => {
    return build.profiles.map(profile => {
      const result = calculateThreeRoundDPR(build, scenario, profile);
      return {
        profile,
        ...result
      };
    });
  }, [build, scenario]);

  const totalDPR = dprResults.reduce((sum, result) => sum + result.dpr, 0);
  const averageCritRate = dprResults.length > 0 
    ? dprResults.reduce((sum, result) => sum + result.critRate, 0) / dprResults.length 
    : 0;

  return (
    <div className="three-round-dpr">
      <div className="dpr-summary">
        <div className="summary-cards">
          <div className="summary-card primary">
            <div className="card-icon">⚔️</div>
            <div className="card-content">
              <h3>Total 3-Round DPR</h3>
              <div className="card-value">{totalDPR.toFixed(2)}</div>
              <div className="card-subtitle">Damage per round</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon">🎯</div>
            <div className="card-content">
              <h3>Critical Hit Rate</h3>
              <div className="card-value">{(averageCritRate * 100).toFixed(1)}%</div>
              <div className="card-subtitle">Average across attacks</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon">⚡</div>
            <div className="card-content">
              <h3>Enemy AC</h3>
              <div className="card-value">{scenario.enemy.ac}</div>
              <div className="card-subtitle">
                {scenario.cover > 0 && `+${scenario.cover} cover`}
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon">🎲</div>
            <div className="card-content">
              <h3>Advantage</h3>
              <div className="card-value">
                {scenario.advantage.charAt(0).toUpperCase() + scenario.advantage.slice(1)}
              </div>
              <div className="card-subtitle">Roll condition</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dpr-breakdown">
        <h3>Attack Profile Breakdown</h3>
        <div className="breakdown-table">
          <div className="table-header">
            <div className="header-cell">Attack</div>
            <div className="header-cell">DPR</div>
            <div className="header-cell">Crit Rate</div>
            <div className="header-cell">Rider Usage</div>
          </div>
          
          {dprResults.map((result, index) => (
            <div key={index} className="table-row">
              <div className="table-cell attack-name">
                <div className="attack-title">{result.profile.name}</div>
                <div className="attack-type">{result.profile.type}</div>
              </div>
              <div className="table-cell dpr-value">
                {result.dpr.toFixed(2)}
              </div>
              <div className="table-cell crit-rate">
                {(result.critRate * 100).toFixed(1)}%
              </div>
              <div className="table-cell rider-usage">
                {(result.riderUsage * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="scenario-info">
        <h4>Current Scenario</h4>
        <div className="scenario-details">
          <div className="detail-item">
            <span className="detail-label">SS/GWM Policy:</span>
            <span className="detail-value">{scenario.policies.ss}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Action Surge:</span>
            <span className="detail-value">Round {scenario.policies.actionSurgeRound}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Smite Policy:</span>
            <span className="detail-value">{scenario.policies.smite}</span>
          </div>
        </div>
      </div>

      <style>{`
        .three-round-dpr {
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: 100%;
          overflow-y: auto;
          padding: 8px;
        }

        .dpr-summary {
          flex-shrink: 0;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .summary-card {
          background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
          border: 2px solid var(--border-color);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .summary-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
        }

        .summary-card:hover {
          border-color: var(--border-strong);
          box-shadow: var(--shadow-md);
        }

        .summary-card.primary {
          background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.1), rgba(var(--accent-rgb), 0.05));
          border-color: rgba(var(--accent-rgb), 0.3);
        }

        .card-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .card-content h3 {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-secondary);
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .card-value {
          font-size: var(--text-2xl);
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .card-subtitle {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        .dpr-breakdown {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .dpr-breakdown h3 {
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
        }

        .breakdown-table {
          background: var(--bg-primary);
          border: 2px solid var(--border-color);
          border-radius: 16px;
          overflow: hidden;
          width: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-sm);
        }

        .table-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 1rem;
          padding: 16px 20px;
          background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
          border-bottom: 2px solid var(--border-color);
        }

        .header-cell {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 1rem;
          padding: 1rem;
          border-bottom: 1px solid var(--border-light);
          align-items: center;
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-cell {
          font-size: var(--text-sm);
          color: var(--text-primary);
        }

        .attack-name {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .attack-title {
          font-weight: 600;
        }

        .attack-type {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          text-transform: capitalize;
        }

        .dpr-value {
          font-weight: 700;
          color: var(--accent-color);
        }

        .scenario-info {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-light);
          border-radius: var(--rounded-lg);
          padding: 1rem;
          flex-shrink: 0;
        }

        .scenario-info h4 {
          font-size: var(--text-base);
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.75rem 0;
        }

        .scenario-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.75rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
        }

        .detail-label {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          font-weight: 500;
        }

        .detail-value {
          font-size: var(--text-sm);
          color: var(--text-primary);
          font-weight: 600;
          text-transform: capitalize;
        }

      `}</style>
    </div>
  );
};

export default ThreeRoundDPR;