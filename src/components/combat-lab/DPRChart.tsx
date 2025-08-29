import { useMemo } from 'react';
import { 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import type { Build, Scenario } from '../../types';
import { calculateDPRvsAC } from '../../math/combat';

interface DPRChartProps {
  build: Build;
  scenario: Scenario;
}

const DPRChart = ({ build, scenario }: DPRChartProps) => {
  const chartData = useMemo(() => {
    // Calculate for primary attack profile
    const primaryProfile = build.profiles[0];
    if (!primaryProfile) return [];

    const dprData = calculateDPRvsAC(build, primaryProfile, [10, 25]);
    
    return dprData.map(point => ({
      ac: point.ac,
      normal: Number(point.normalDPR.toFixed(2)),
      feat: point.featDPR ? Number(point.featDPR.toFixed(2)) : null,
      optimal: point.optimal,
      crossover: point.optimal !== (point.ac === 10 ? dprData[0].optimal : dprData[point.ac - 11]?.optimal),
    }));
  }, [build, scenario]);

  const hasSSGWM = build.feats.includes('Sharpshooter') || build.feats.includes('Great Weapon Master');
  const featName = build.feats.includes('Sharpshooter') ? 'Sharpshooter' : 'Great Weapon Master';
  
  // Find crossover points for toggle windows
  const toggleWindows = useMemo(() => {
    if (!hasSSGWM) return [];
    
    const windows = [];
    let windowStart = null;
    
    for (let i = 0; i < chartData.length; i++) {
      const point = chartData[i];
      const isOptimalFeat = point.optimal === 'feat';
      
      if (isOptimalFeat && windowStart === null) {
        windowStart = point.ac;
      } else if (!isOptimalFeat && windowStart !== null) {
        windows.push({ start: windowStart, end: chartData[i - 1]?.ac || windowStart });
        windowStart = null;
      }
    }
    
    // Close any open window at the end
    if (windowStart !== null) {
      windows.push({ start: windowStart, end: chartData[chartData.length - 1]?.ac || windowStart });
    }
    
    return windows;
  }, [chartData, hasSSGWM]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = chartData.find(d => d.ac === label);
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">AC {label}</p>
          <div className="tooltip-content">
            <div className="tooltip-item normal">
              <span className="tooltip-color"></span>
              <span>Normal: {payload[0]?.value}</span>
            </div>
            {hasSSGWM && payload[1] && (
              <div className="tooltip-item feat">
                <span className="tooltip-color"></span>
                <span>{featName}: {payload[1]?.value}</span>
              </div>
            )}
            {data && (
              <div className="tooltip-optimal">
                Optimal: {data.optimal === 'feat' ? featName : 'Normal'}
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="dpr-chart-empty">
        <p>No attack profiles available for this build.</p>
      </div>
    );
  }

  return (
    <div className="dpr-chart">
      <div className="chart-header">
        <div className="chart-title">
          <h3>DPR vs AC Analysis</h3>
          <p>Damage per round across different Armor Class values</p>
        </div>
        
        {hasSSGWM && toggleWindows.length > 0 && (
          <div className="toggle-windows-info">
            <h4>{featName} Windows</h4>
            <div className="windows-list">
              {toggleWindows.map((window, index) => (
                <div key={index} className="window-range">
                  AC {window.start}{window.end !== window.start ? `-${window.end}` : ''}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
            <XAxis 
              dataKey="ac" 
              stroke="var(--text-secondary)"
              fontSize={12}
              label={{ value: 'Armor Class', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              stroke="var(--text-secondary)"
              fontSize={12}
              label={{ value: 'DPR', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Shaded areas for toggle windows */}
            {hasSSGWM && toggleWindows.map((window, index) => (
              <ReferenceLine 
                key={index}
                x={window.start}
                stroke="transparent"
              />
            ))}
            
            <Line
              type="monotone"
              dataKey="normal"
              stroke="var(--accent-color)"
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--accent-color)" }}
              name="Normal Attack"
            />
            
            {hasSSGWM && (
              <Line
                type="monotone"
                dataKey="feat"
                stroke="var(--warning-color)"
                strokeWidth={3}
                dot={{ r: 4, fill: "var(--warning-color)" }}
                name={featName}
                strokeDasharray="5 5"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-insights">
        <div className="insight-cards">
          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <div className="insight-content">
              <h4>Current AC</h4>
              <p>
                Against AC {scenario.enemy.ac}, 
                {hasSSGWM && chartData.find(d => d.ac === scenario.enemy.ac) ? (
                  <span className="optimal-choice">
                    {' '}{chartData.find(d => d.ac === scenario.enemy.ac)?.optimal === 'feat' ? featName : 'Normal'} is optimal
                  </span>
                ) : (
                  ' dealing optimal damage'
                )}
              </p>
            </div>
          </div>
          
          {hasSSGWM && (
            <div className="insight-card">
              <div className="insight-icon">⚡</div>
              <div className="insight-content">
                <h4>Crossover Points</h4>
                <p>
                  {featName} becomes optimal at specific AC thresholds, 
                  highlighted in the shaded regions above.
                </p>
              </div>
            </div>
          )}
          
          <div className="insight-card">
            <div className="insight-icon">📊</div>
            <div className="insight-content">
              <h4>DPR Range</h4>
              <p>
                DPR varies from {Math.min(...chartData.map(d => d.normal)).toFixed(1)} 
                {' '}to {Math.max(...chartData.map(d => d.normal)).toFixed(1)} 
                {' '}across AC 10-25
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dpr-chart {
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 16px;
          padding: 4px;
        }

        .dpr-chart-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--text-secondary);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
          flex-shrink: 0;
        }

        .chart-title h3 {
          font-size: var(--text-xl);
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
        }

        .chart-title p {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin: 0;
        }

        .toggle-windows-info {
          background: var(--bg-tertiary);
          padding: 1rem;
          border-radius: var(--rounded-lg);
          border: 1px solid var(--border-light);
          min-width: 200px;
        }

        .toggle-windows-info h4 {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.75rem 0;
        }

        .windows-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .window-range {
          background: var(--warning-color);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: var(--rounded);
          font-size: var(--text-xs);
          font-weight: 600;
        }

        .chart-container {
          width: 100%;
          flex: 1;
          background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
          border: 2px solid var(--border-color);
          border-radius: 16px;
          padding: 20px;
          box-shadow: var(--shadow-sm);
          position: relative;
          overflow: hidden;
        }

        .chart-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
        }

        .chart-tooltip {
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
          border-radius: 50%;
        }

        .tooltip-item.normal .tooltip-color {
          background: var(--accent-color);
        }

        .tooltip-item.feat .tooltip-color {
          background: var(--warning-color);
        }

        .tooltip-optimal {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          font-weight: 600;
          margin-top: 0.25rem;
          padding-top: 0.25rem;
          border-top: 1px solid var(--border-light);
        }

        .chart-insights {
          flex-shrink: 0;
        }

        .insight-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

        .optimal-choice {
          font-weight: 600;
          color: var(--warning-color);
        }

      `}</style>
    </div>
  );
};

export default DPRChart;