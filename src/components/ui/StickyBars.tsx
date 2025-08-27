import { useScenarioStore } from '../../stores/scenarioStore';
import './StickyBars.css';

const StickyBars = () => {
  const { scenario, updateScenario } = useScenarioStore();

  return (
    <div className="sticky-bars">
      <div className="scenario-bar">
        <div className="bar-section">
          <label>
            <span>AC:</span>
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
            >
              <option value="0">None</option>
              <option value="2">Half Cover (+2 AC)</option>
              <option value="5">Three-Quarters (+5 AC)</option>
            </select>
          </label>
        </div>
      </div>

      <div className="policy-bar">
        <div className="bar-section">
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
  );
};

export default StickyBars;