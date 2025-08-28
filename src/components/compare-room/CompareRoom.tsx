import { useState, useMemo } from 'react';
import { useBuildStore } from '../../stores/buildStore';
import { useScenarioStore } from '../../stores/scenarioStore';
import { calculateThreeRoundDPR } from '../../math/combat';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import type { Build } from '../../types';
import './CompareRoom.css';

const CompareRoom = () => {
  const { builds, selectedBuilds, selectBuildForComparison, deselectBuildFromComparison } = useBuildStore();
  const { scenario } = useScenarioStore();
  const [activeTab, setActiveTab] = useState<'dpr' | 'curves' | 'summary'>('dpr');
  
  const selectedBuildData = useMemo(() => {
    return selectedBuilds.map(id => builds.find(b => b.id === id)).filter(Boolean) as Build[];
  }, [selectedBuilds, builds]);

  const dprComparison = useMemo(() => {
    return selectedBuildData.map(build => {
      const primaryProfile = build.profiles[0];
      if (!primaryProfile) return { name: build.name, dpr: 0 };
      
      const result = calculateThreeRoundDPR(build, scenario, primaryProfile);
      return {
        name: `${build.name} (L${build.level})`,
        buildName: build.name,
        level: build.level,
        class: build.class,
        dpr: Number(result.dpr.toFixed(2))
      };
    });
  }, [selectedBuildData, scenario]);

  const levelCurves = useMemo(() => {
    if (selectedBuildData.length === 0) return [];
    
    const levels = Array.from({ length: 20 }, (_, i) => i + 1);
    return levels.map(level => {
      const point: any = { level };
      
      selectedBuildData.forEach(build => {
        // Simulate build at different levels for curve
        const scaledBuild = { ...build, level };
        const primaryProfile = scaledBuild.profiles[0];
        if (primaryProfile) {
          const result = calculateThreeRoundDPR(scaledBuild, scenario, primaryProfile);
          point[build.name] = Number(result.dpr.toFixed(2));
        }
      });
      
      return point;
    });
  }, [selectedBuildData, scenario]);

  const handleBuildSelection = (buildId: string) => {
    if (selectedBuilds.includes(buildId)) {
      deselectBuildFromComparison(buildId);
    } else if (selectedBuilds.length < 3) {
      selectBuildForComparison(buildId);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="compare-tooltip">
          <p className="tooltip-label">{activeTab === 'curves' ? `Level ${label}` : label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="tooltip-item">
              <span 
                className="tooltip-color" 
                style={{ backgroundColor: entry.color }}
              ></span>
              <span>{entry.name}: {entry.value} DPR</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (builds.length === 0) {
    return (
      <div className="compare-room">
        <div className="compare-empty">
          <div className="empty-content">
            <div className="empty-icon">📊</div>
            <h2>No Builds Available</h2>
            <p>Create some builds first to compare them here.</p>
            <a href="#/build" className="create-build-link">Create Your First Build</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="compare-room">
      <div className="compare-header">
        <div className="header-title">
          <h1>Compare Room</h1>
          <p>Side-by-side analysis of up to 3 character builds</p>
        </div>
        
        <div className="comparison-tabs">
          <button
            className={`tab-button ${activeTab === 'dpr' ? 'active' : ''}`}
            onClick={() => setActiveTab('dpr')}
          >
            3-Round DPR
          </button>
          <button
            className={`tab-button ${activeTab === 'curves' ? 'active' : ''}`}
            onClick={() => setActiveTab('curves')}
          >
            Level Curves
          </button>
          <button
            className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
        </div>
      </div>

      <div className="build-selector">
        <h3>Select Builds to Compare (Max 3)</h3>
        <div className="builds-list">
          {builds.map(build => (
            <div
              key={build.id}
              className={`build-option ${selectedBuilds.includes(build.id) ? 'selected' : ''}`}
              onClick={() => handleBuildSelection(build.id)}
            >
              <div className="build-info">
                <div className="build-name">{build.name}</div>
                <div className="build-details">Level {build.level} {build.class}</div>
              </div>
              <div className="selection-indicator">
                {selectedBuilds.includes(build.id) ? '✓' : '+'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedBuildData.length > 0 && (
        <div className="comparison-content">
          {activeTab === 'dpr' && (
            <div className="dpr-comparison">
              <div className="comparison-chart">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={dprComparison} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="var(--text-secondary)"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      stroke="var(--text-secondary)"
                      fontSize={12}
                      label={{ value: 'DPR', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="dpr" 
                      fill="var(--accent-color)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="dpr-analysis">
                <h4>DPR Analysis</h4>
                <div className="analysis-cards">
                  {dprComparison.map((build, index) => (
                    <div key={index} className="analysis-card">
                      <h5>{build.buildName}</h5>
                      <div className="card-stats">
                        <div className="stat">
                          <span className="stat-label">DPR</span>
                          <span className="stat-value">{build.dpr}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Level</span>
                          <span className="stat-value">{build.level}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Class</span>
                          <span className="stat-value">{build.class}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'curves' && (
            <div className="curves-comparison">
              <div className="comparison-chart">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={levelCurves} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                    <XAxis 
                      dataKey="level" 
                      stroke="var(--text-secondary)"
                      fontSize={12}
                      label={{ value: 'Character Level', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis 
                      stroke="var(--text-secondary)"
                      fontSize={12}
                      label={{ value: 'DPR', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    
                    {selectedBuildData.map((build, index) => {
                      const colors = ['var(--accent-color)', 'var(--warning-color)', 'var(--success-color)'];
                      return (
                        <Line
                          key={build.id}
                          type="monotone"
                          dataKey={build.name}
                          stroke={colors[index]}
                          strokeWidth={3}
                          dot={{ r: 4 }}
                          name={build.name}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="curves-insights">
                <h4>Level Progression Insights</h4>
                <div className="insights-list">
                  <div className="insight">
                    <span className="insight-icon">📈</span>
                    <span>Compare power spikes and progression patterns across levels 1-20</span>
                  </div>
                  <div className="insight">
                    <span className="insight-icon">🎯</span>
                    <span>Identify optimal level ranges for each build's effectiveness</span>
                  </div>
                  <div className="insight">
                    <span className="insight-icon">⚖️</span>
                    <span>Evaluate early vs late game performance trade-offs</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="summary-comparison">
              <div className="summary-table">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Build</th>
                      <th>Class</th>
                      <th>Level</th>
                      <th>Current DPR</th>
                      <th>Key Feats</th>
                      <th>Attack Profiles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBuildData.map((build) => {
                      const dprData = dprComparison.find(d => d.buildName === build.name);
                      return (
                        <tr key={build.id}>
                          <td className="build-name">{build.name}</td>
                          <td>{build.class}</td>
                          <td>{build.level}</td>
                          <td className="dpr-value">{dprData?.dpr || 0}</td>
                          <td className="feats-cell">
                            {build.feats.length > 0 ? build.feats.join(', ') : 'None'}
                          </td>
                          <td>{build.profiles.length}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="summary-insights">
                <h4>Comparison Summary</h4>
                {dprComparison.length > 1 && (
                  <div className="competitive-analysis">
                    <div className="winner">
                      <strong>Highest DPR:</strong> {dprComparison.reduce((prev, current) => 
                        (prev.dpr > current.dpr) ? prev : current
                      ).buildName} ({dprComparison.reduce((prev, current) => 
                        (prev.dpr > current.dpr) ? prev : current
                      ).dpr} DPR)
                    </div>
                    <div className="gap">
                      <strong>Performance Gap:</strong> {
                        (Math.max(...dprComparison.map(d => d.dpr)) - 
                         Math.min(...dprComparison.map(d => d.dpr))).toFixed(2)
                      } DPR difference
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedBuildData.length === 0 && (
        <div className="no-selection">
          <p>Select builds above to start comparing them.</p>
        </div>
      )}
    </div>
  );
};

export default CompareRoom;