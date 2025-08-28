import { useState, useEffect } from 'react';
import { useBuildStore } from '../../stores/buildStore';
import { useScenarioStore } from '../../stores/scenarioStore';
import DPRChart from './DPRChart';
import ThreeRoundDPR from './ThreeRoundDPR';
import TTKAnalysis from './TTKAnalysis';
import './CombatLab.css';

const CombatLab = () => {
  const { currentBuild, builds } = useBuildStore();
  const { scenario, updateScenario } = useScenarioStore();
  const [selectedBuildId, setSelectedBuildId] = useState<string>('');

  // Use current build from editor or first available build
  const activeBuild = currentBuild || (builds.length > 0 ? builds[0] : null);

  useEffect(() => {
    if (activeBuild && !selectedBuildId) {
      setSelectedBuildId(activeBuild.id);
    }
  }, [activeBuild, selectedBuildId]);

  const handleBuildChange = (buildId: string) => {
    setSelectedBuildId(buildId);
  };

  if (!activeBuild) {
    return (
      <div className="combat-lab">
        <div className="no-builds-message">
          <div className="message-content">
            <h2>No Builds Available</h2>
            <p>Create a build in the Build Editor to start analyzing combat performance.</p>
            <a href="#/build" className="create-build-link">
              Create Your First Build
            </a>
          </div>
        </div>
      </div>
    );
  }

  const selectedBuild = builds.find(b => b.id === selectedBuildId) || activeBuild;

  return (
    <div className="combat-lab">
      <div className="combat-lab-content">
        <div className="scenario-configuration">
          <div className="config-section">
            <h3>🎯 Combat Scenario</h3>
            <div className="config-group">
              <label>
                <span>Target AC:</span>
                <input
                  type="number"
                  value={scenario.enemy.ac}
                  onChange={(e) =>
                    updateScenario({
                      enemy: { ...scenario.enemy, ac: parseInt(e.target.value) || 16 },
                    })
                  }
                  min="1"
                  max="30"
                  className="config-input"
                />
              </label>
              
              <label>
                <span>Roll Type:</span>
                <select
                  value={scenario.advantage}
                  onChange={(e) =>
                    updateScenario({
                      advantage: e.target.value as 'normal' | 'advantage' | 'disadvantage',
                    })
                  }
                  className="config-select"
                >
                  <option value="normal">Normal</option>
                  <option value="advantage">Advantage</option>
                  <option value="disadvantage">Disadvantage</option>
                </select>
              </label>

              <label>
                <span>Cover:</span>
                <select
                  value={scenario.cover}
                  onChange={(e) =>
                    updateScenario({ cover: parseInt(e.target.value) || 0 })
                  }
                  className="config-select"
                >
                  <option value="0">None</option>
                  <option value="2">Half (+2 AC)</option>
                  <option value="5">3/4 Cover (+5 AC)</option>
                </select>
              </label>

              <label>
                <span>SS/GWM Policy:</span>
                <select
                  value={scenario.policies.ss}
                  onChange={(e) =>
                    updateScenario({
                      policies: {
                        ...scenario.policies,
                        ss: e.target.value as 'auto' | 'always' | 'off',
                      },
                    })
                  }
                  className="config-select"
                >
                  <option value="auto">Auto-Optimize</option>
                  <option value="always">Always On</option>
                  <option value="off">Always Off</option>
                </select>
              </label>
            </div>
          </div>

          <div className="config-section">
            <h3>📊 Analyzing Build</h3>
            <div className="config-group">
              <label>
                <span>Character Build:</span>
                <select
                  value={selectedBuildId}
                  onChange={(e) => handleBuildChange(e.target.value)}
                  className="build-select"
                >
                  {builds.map((build) => (
                    <option key={build.id} value={build.id}>
                      {build.name} (L{build.level} {build.class})
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="analysis-results">
          <div className="results-grid">
            <div className="result-section">
              <h3>⚡ 3-Round DPR</h3>
              <div className="result-content">
                <ThreeRoundDPR 
                  build={selectedBuild} 
                  scenario={scenario} 
                />
              </div>
            </div>
            
            <div className="result-section">
              <h3>📈 DPR vs AC Chart</h3>
              <div className="result-content">
                <DPRChart 
                  build={selectedBuild} 
                  scenario={scenario} 
                />
              </div>
            </div>
            
            <div className="result-section">
              <h3>⏱️ Time to Kill</h3>
              <div className="result-content">
                <TTKAnalysis 
                  build={selectedBuild} 
                  scenario={scenario} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombatLab;