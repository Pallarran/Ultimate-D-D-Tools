import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Build, Scenario } from '../../types';
import { calculateThreeRoundDPR } from '../../math/combat';
import { calculateTimeToKill } from '../../math/combat';

interface TTKAnalysisProps {
  build: Build;
  scenario: Scenario;
}

const TTKAnalysis = ({ build, scenario }: TTKAnalysisProps) => {
  const dprData = useMemo(() => {
    return build.profiles.map(profile => {
      const result = calculateThreeRoundDPR(build, scenario, profile);
      return {
        profile,
        dpr: result.dpr
      };
    });
  }, [build, scenario]);

  const totalDPR = dprData.reduce((sum, data) => sum + data.dpr, 0);

  const ttkData = useMemo(() => {
    if (totalDPR === 0) return [];

    const hpTargets = [25, 50, 75, 100, 150, 200, 300, 500];
    
    return hpTargets.map(hp => {
      const ttk = calculateTimeToKill(totalDPR, hp);
      return {
        hp,
        expectedRounds: Number(ttk.expectedRounds.toFixed(1)),
        probability95: Number(ttk.probability95.toFixed(1)),
        probability99: Number(ttk.probability99.toFixed(1)),
        killChance1Round: totalDPR >= hp ? 1 : totalDPR / hp,
        killChance3Rounds: Math.min(1, (totalDPR * 3) / hp)
      };
    });
  }, [totalDPR]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = ttkData.find(d => d.hp === label);
      return (
        <div className="ttk-tooltip">
          <p className="tooltip-label">{label} HP Target</p>
          <div className="tooltip-content">
            <div className="tooltip-item">
              <span className="tooltip-color expected"></span>
              <span>Expected: {payload[0]?.value} rounds</span>
            </div>
            <div className="tooltip-item">
              <span className="tooltip-color p95"></span>
              <span>95% chance: {payload[1]?.value} rounds</span>
            </div>
            <div className="tooltip-item">
              <span className="tooltip-color p99"></span>
              <span>99% chance: {payload[2]?.value} rounds</span>
            </div>
            {data && (
              <div className="tooltip-extra">
                <div>1-Round Kill: {(data.killChance1Round * 100).toFixed(0)}%</div>
                <div>3-Round Kill: {(data.killChance3Rounds * 100).toFixed(0)}%</div>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (totalDPR === 0) {
    return (
      <div className="ttk-analysis-empty">
        <p>No attack profiles available for TTK analysis.</p>
      </div>
    );
  }

  return (
    <div className="ttk-analysis">
      <div className="ttk-header">
        <div className="ttk-title">
          <h3>Time-to-Kill Analysis</h3>
          <p>Expected rounds to defeat targets of various HP values</p>
        </div>
        
        <div className="ttk-summary">
          <div className="summary-stat">
            <span className="stat-label">Total DPR</span>
            <span className="stat-value">{totalDPR.toFixed(2)}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Scenario AC</span>
            <span className="stat-value">{scenario.enemy.ac}</span>
          </div>
        </div>
      </div>

      <div className="ttk-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={ttkData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
            <XAxis 
              dataKey="hp" 
              stroke="var(--text-secondary)"
              fontSize={12}
              label={{ value: 'Target HP', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              stroke="var(--text-secondary)"
              fontSize={12}
              label={{ value: 'Rounds', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Bar
              dataKey="expectedRounds"
              fill="var(--accent-color)"
              name="Expected Rounds"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="probability95"
              fill="var(--warning-color)"
              name="95% Confidence"
              radius={[2, 2, 0, 0]}
              opacity={0.7}
            />
            <Bar
              dataKey="probability99"
              fill="var(--error-color, #ef4444)"
              name="99% Confidence"
              radius={[2, 2, 0, 0]}
              opacity={0.5}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="ttk-insights">
        <div className="insight-cards">
          <div className="insight-card">
            <div className="insight-icon">⚡</div>
            <div className="insight-content">
              <h4>Quick Kills</h4>
              <p>
                Can one-round kill targets up to {Math.floor(totalDPR)} HP.
                Three-round guarantee against {Math.floor(totalDPR * 3)} HP targets.
              </p>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <div className="insight-content">
              <h4>Efficiency Sweet Spot</h4>
              <p>
                Most efficient against 75-150 HP targets, requiring 
                {' '}{ttkData.find(d => d.hp === 100)?.expectedRounds || 'N/A'} rounds on average.
              </p>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">🛡️</div>
            <div className="insight-content">
              <h4>High HP Targets</h4>
              <p>
                Against 300+ HP bosses, expect {ttkData.find(d => d.hp === 300)?.expectedRounds || 'N/A'} rounds.
                Consider burst damage or debuff strategies.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="ttk-table">
        <h4>Detailed Breakdown</h4>
        <div className="table-container">
          <table className="ttk-data-table">
            <thead>
              <tr>
                <th>Target HP</th>
                <th>Expected Rounds</th>
                <th>95% Confidence</th>
                <th>1-Round Kill %</th>
                <th>3-Round Kill %</th>
              </tr>
            </thead>
            <tbody>
              {ttkData.map((data) => (
                <tr key={data.hp}>
                  <td>{data.hp}</td>
                  <td>{data.expectedRounds}</td>
                  <td>{data.probability95}</td>
                  <td>{(data.killChance1Round * 100).toFixed(0)}%</td>
                  <td>{(data.killChance3Rounds * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .ttk-analysis {
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 1.5rem;
          overflow-y: auto;
          padding: 0.5rem;
        }

        .ttk-analysis-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--text-secondary);
        }

        .ttk-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
          flex-shrink: 0;
        }

        .ttk-title h3 {
          font-size: var(--text-xl);
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
        }

        .ttk-title p {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin: 0;
        }

        .ttk-summary {
          display: flex;
          gap: 2rem;
          background: var(--bg-secondary);
          padding: 1rem;
          border-radius: var(--rounded-lg);
          border: 1px solid var(--border-color);
        }

        .summary-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .stat-label {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: var(--text-lg);
          font-weight: 800;
          color: var(--accent-color);
        }

        .ttk-chart {
          width: 100%;
          height: 100%;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 16px;
        }

        .ttk-tooltip {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--rounded);
          padding: 0.75rem;
          box-shadow: var(--shadow-lg);
        }

        .tooltip-label {
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
        }

        .tooltip-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .tooltip-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: var(--text-sm);
        }

        .tooltip-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        .tooltip-color.expected {
          background: var(--accent-color);
        }

        .tooltip-color.p95 {
          background: var(--warning-color);
        }

        .tooltip-color.p99 {
          background: var(--error-color, #ef4444);
        }

        .tooltip-extra {
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border-light);
          font-size: var(--text-xs);
          color: var(--text-secondary);
        }

        .ttk-insights {
          flex-shrink: 0;
        }

        .insight-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .insight-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--rounded-lg);
          padding: 1rem;
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .insight-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .insight-content h4 {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
        }

        .insight-content p {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.4;
        }

        .ttk-table {
          flex-shrink: 0;
        }

        .ttk-table h4 {
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
        }

        .table-container {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--rounded-lg);
          overflow: hidden;
        }

        .ttk-data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .ttk-data-table th,
        .ttk-data-table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid var(--border-light);
        }

        .ttk-data-table th {
          background: var(--bg-tertiary);
          font-weight: 600;
          color: var(--text-primary);
          font-size: var(--text-sm);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ttk-data-table td {
          font-size: var(--text-sm);
          color: var(--text-primary);
        }

        .ttk-data-table tr:last-child td {
          border-bottom: none;
        }

        .ttk-data-table tr:hover {
          background: var(--bg-hover);
        }

      `}</style>
    </div>
  );
};

export default TTKAnalysis;