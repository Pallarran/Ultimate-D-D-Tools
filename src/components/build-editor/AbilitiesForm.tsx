import { Build } from '../../types';

interface AbilitiesFormProps {
  build: Build;
  onChange: (updates: Partial<Build>) => void;
}

const AbilitiesForm = ({ build, onChange }: AbilitiesFormProps) => {
  const abilities = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const;

  const handleAbilityChange = (ability: keyof Build['abilities'], value: number) => {
    onChange({
      abilities: {
        ...build.abilities,
        [ability]: value,
      },
    });
  };

  const getModifier = (score: number): string => {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const getPointBuyCost = (scores: Build['abilities']): number => {
    let totalCost = 0;
    Object.values(scores).forEach(score => {
      if (score <= 13) {
        totalCost += Math.max(0, score - 8);
      } else if (score === 14) {
        totalCost += 7;
      } else if (score === 15) {
        totalCost += 9;
      }
    });
    return totalCost;
  };

  const pointBuyCost = getPointBuyCost(build.abilities);
  const isValidPointBuy = pointBuyCost <= 27;

  return (
    <div className="form-section">
      <h2 className="section-title">
        Ability Scores 
        <span className="point-buy-indicator">
          Point Buy: {pointBuyCost}/27 
          {!isValidPointBuy && <span style={{color: 'var(--danger-color)'}}> (Over limit!)</span>}
        </span>
      </h2>
      
      <div className="abilities-grid">
        {abilities.map((ability) => (
          <div key={ability} className="ability-group">
            <label className="ability-label">
              <span className="ability-name">{ability}</span>
              <div className="ability-input-group">
                <input
                  type="number"
                  className="ability-input"
                  value={build.abilities[ability]}
                  onChange={(e) => 
                    handleAbilityChange(ability, parseInt(e.target.value) || 8)
                  }
                  min="3"
                  max="20"
                />
                <span className="ability-modifier">
                  {getModifier(build.abilities[ability])}
                </span>
              </div>
            </label>
          </div>
        ))}
      </div>

      <div className="ability-presets">
        <h3>Quick Presets</h3>
        <div className="preset-buttons">
          <button
            onClick={() => onChange({
              abilities: { STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 8 }
            })}
          >
            Standard Array
          </button>
          <button
            onClick={() => onChange({
              abilities: { STR: 8, DEX: 15, CON: 14, INT: 13, WIS: 12, CHA: 10 }
            })}
          >
            Dex Fighter
          </button>
          <button
            onClick={() => onChange({
              abilities: { STR: 8, DEX: 14, CON: 15, INT: 13, WIS: 12, CHA: 10 }
            })}
          >
            Spellcaster
          </button>
        </div>
      </div>

      <style jsx>{`
        .point-buy-indicator {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-left: 1rem;
        }

        .abilities-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .ability-group {
          background: var(--bg-secondary);
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid var(--border-light);
        }

        .ability-label {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .ability-name {
          font-weight: 600;
          font-size: 1.1rem;
          color: var(--text-primary);
          text-align: center;
        }

        .ability-input-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ability-input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: 0.25rem;
          text-align: center;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .ability-modifier {
          font-weight: 600;
          font-size: 1.1rem;
          color: var(--accent-color);
          min-width: 2.5rem;
          text-align: center;
        }

        .ability-presets {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-light);
        }

        .ability-presets h3 {
          margin: 0 0 1rem 0;
          color: var(--text-primary);
        }

        .preset-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .preset-buttons button {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .preset-buttons button:hover {
          background: var(--bg-hover);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .abilities-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .abilities-grid {
            grid-template-columns: 1fr;
          }
          
          .preset-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default AbilitiesForm;