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
  const { scenario } = useScenarioStore();
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