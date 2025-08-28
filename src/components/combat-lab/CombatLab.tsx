import { useState, useEffect } from 'react';
import { useBuildStore } from '../../stores/buildStore';
import { useScenarioStore } from '../../stores/scenarioStore';
import DPRChart from './DPRChart';
import ThreeRoundDPR from './ThreeRoundDPR';
import TTKAnalysis from './TTKAnalysis';
import ExplanationDrawer from './ExplanationDrawer';
import './CombatLab.css';

const CombatLab = () => {
  const { currentBuild, builds } = useBuildStore();
  const { scenario, updateScenario } = useScenarioStore();
  const [selectedBuildId, setSelectedBuildId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'dpr' | 'chart' | 'ttk'>('dpr');
  const [showExplanation, setShowExplanation] = useState(false);

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
        <div className="combat-header">
          <div className="build-selector">
            <label htmlFor="build-select">Analyzing Build:</label>
            <select
              id="build-select"
              value={selectedBuildId}
              onChange={(e) => handleBuildChange(e.target.value)}
              className="build-select"
            >
              {builds.map((build) => (
                <option key={build.id} value={build.id}>
                  {build.name} (Level {build.level} {build.class})
                </option>
              ))}
            </select>
          </div>

          <div className="analysis-tabs">
            <button
              className={`tab-button ${activeTab === 'dpr' ? 'active' : ''}`}
              onClick={() => setActiveTab('dpr')}
            >
              3-Round DPR
            </button>
            <button
              className={`tab-button ${activeTab === 'chart' ? 'active' : ''}`}
              onClick={() => setActiveTab('chart')}
            >
              DPR vs AC
            </button>
            <button
              className={`tab-button ${activeTab === 'ttk' ? 'active' : ''}`}
              onClick={() => setActiveTab('ttk')}
            >
              Time to Kill
            </button>
          </div>

          <button
            className={`explanation-toggle ${showExplanation ? 'active' : ''}`}
            onClick={() => setShowExplanation(!showExplanation)}
            title="Show/Hide Explanations"
          >
            🔍 Explain
          </button>
        </div>

        <div className="scenario-configuration">
          <div className="config-section">
            <h3>Scenario Settings</h3>
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
                <span>Advantage:</span>
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
                  <option value="2">Half Cover (+2 AC)</option>
                  <option value="5">Three-Quarters (+5 AC)</option>
                </select>
              </label>
            </div>
          </div>

          <div className="config-section">
            <h3>Combat Policies</h3>
            <div className="config-group">
              <label>
                <span>SS/GWM:</span>
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
                  <option value="auto">Auto</option>
                  <option value="always">Always On</option>
                  <option value="off">Off</option>
                </select>
              </label>

              <label>
                <span>Action Surge Round:</span>
                <input
                  type="number"
                  value={scenario.policies.actionSurgeRound}
                  onChange={(e) =>
                    updateScenario({
                      policies: {
                        ...scenario.policies,
                        actionSurgeRound: parseInt(e.target.value) || 1,
                      },
                    })
                  }
                  min="1"
                  max="3"
                  className="config-input"
                />
              </label>

              <label>
                <span>Smite Policy:</span>
                <select
                  value={scenario.policies.smite}
                  onChange={(e) =>
                    updateScenario({
                      policies: {
                        ...scenario.policies,
                        smite: e.target.value as 'never' | 'firstHit' | 'critOnly' | 'threshold',
                      },
                    })
                  }
                  className="config-select"
                >
                  <option value="never">Never</option>
                  <option value="firstHit">First Hit</option>
                  <option value="critOnly">Crit Only</option>
                  <option value="threshold">Threshold</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="analysis-content">
          {activeTab === 'dpr' && (
            <ThreeRoundDPR 
              build={selectedBuild} 
              scenario={scenario}
            />
          )}
          
          {activeTab === 'chart' && (
            <DPRChart 
              build={selectedBuild}
              scenario={scenario}
            />
          )}
          
          {activeTab === 'ttk' && (
            <TTKAnalysis 
              build={selectedBuild}
              scenario={scenario}
            />
          )}
        </div>

        {showExplanation && (
          <ExplanationDrawer
            activeTab={activeTab}
            build={selectedBuild}
            scenario={scenario}
            onClose={() => setShowExplanation(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CombatLab;