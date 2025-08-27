import { useState } from 'react';
import type { Build } from '../../types';

interface FeatsFormProps {
  build: Build;
  onChange: (updates: Partial<Build>) => void;
}

const availableFeats = [
  // Combat Feats
  { name: 'Sharpshooter', category: 'Combat', description: '-5 attack, +10 damage with ranged weapons' },
  { name: 'Great Weapon Master', category: 'Combat', description: '-5 attack, +10 damage with heavy weapons' },
  { name: 'Polearm Master', category: 'Combat', description: 'Bonus action attack and opportunity attacks' },
  { name: 'Crossbow Expert', category: 'Combat', description: 'No loading, ignore close range disadvantage' },
  { name: 'Sentinel', category: 'Combat', description: 'Stop movement on opportunity attacks' },
  { name: 'Lucky', category: 'Combat', description: 'Reroll 3 dice per long rest' },
  { name: 'Elven Accuracy', category: 'Combat', description: 'Roll 3d20 with advantage (Dex/Int/Wis/Cha)' },
  
  // Defense Feats
  { name: 'Heavy Armor Master', category: 'Defense', description: 'Reduce physical damage by 3' },
  { name: 'Shield Master', category: 'Defense', description: 'Shield bash and evasion bonuses' },
  { name: 'Tough', category: 'Defense', description: '+2 HP per level' },
  { name: 'Resilient', category: 'Defense', description: 'Proficiency in chosen save' },
  
  // Utility Feats
  { name: 'Alert', category: 'Utility', description: '+5 initiative, no surprise' },
  { name: 'Mobile', category: 'Utility', description: '+10 speed, avoid opportunity attacks' },
  { name: 'Observant', category: 'Utility', description: '+5 passive Perception and Investigation' },
  { name: 'Ritual Caster', category: 'Utility', description: 'Learn ritual spells' },
  { name: 'Magic Initiate', category: 'Utility', description: '2 cantrips and 1 1st-level spell' },
  
  // Fighting Style Feats
  { name: 'Fighting Initiate', category: 'Fighting Style', description: 'Learn a fighting style' },
];

const fightingStyles = [
  { name: 'Archery', description: '+2 to ranged weapon attacks' },
  { name: 'Dueling', description: '+2 damage with one-handed weapons' },
  { name: 'Great Weapon Fighting', description: 'Reroll 1s and 2s on damage dice' },
  { name: 'Defense', description: '+1 AC while wearing armor' },
  { name: 'Protection', description: 'Use reaction to impose disadvantage' },
  { name: 'Two-Weapon Fighting', description: 'Add ability modifier to off-hand damage' },
];

const FeatsForm = ({ build, onChange }: FeatsFormProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', 'Combat', 'Defense', 'Utility', 'Fighting Style'];

  const filteredFeats = selectedCategory === 'All' 
    ? availableFeats 
    : availableFeats.filter(feat => feat.category === selectedCategory);

  const handleFeatToggle = (featName: string) => {
    const currentFeats = build.feats || [];
    const updatedFeats = currentFeats.includes(featName)
      ? currentFeats.filter(f => f !== featName)
      : [...currentFeats, featName];
    
    onChange({ feats: updatedFeats });
  };

  const handleFightingStyleChange = (style: string) => {
    onChange({
      features: {
        ...build.features,
        fightingStyle: style === build.features.fightingStyle ? undefined : style,
      },
    });
  };

  return (
    <div className="form-section">
      <h2 className="section-title">
        Feats & Fighting Style
        <span className="feat-count">({build.feats?.length || 0} feats selected)</span>
      </h2>

      {/* Fighting Style Section */}
      <div className="fighting-style-section">
        <h3>Fighting Style</h3>
        <p className="section-description">
          Choose a fighting style (typically gained at Fighter 1, Ranger 2, or Paladin 2)
        </p>
        <div className="fighting-style-grid">
          {fightingStyles.map((style) => (
            <div
              key={style.name}
              className={`fighting-style-option ${
                build.features.fightingStyle === style.name ? 'selected' : ''
              }`}
              onClick={() => handleFightingStyleChange(style.name)}
            >
              <div className="style-name">{style.name}</div>
              <div className="style-description">{style.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feats Section */}
      <div className="feats-section">
        <h3>Feats</h3>
        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="feats-grid">
          {filteredFeats.map((feat) => (
            <div
              key={feat.name}
              className={`feat-option ${
                build.feats?.includes(feat.name) ? 'selected' : ''
              }`}
              onClick={() => handleFeatToggle(feat.name)}
            >
              <div className="feat-header">
                <div className="feat-name">{feat.name}</div>
                <div className="feat-category">{feat.category}</div>
              </div>
              <div className="feat-description">{feat.description}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .feat-count {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-left: 1rem;
        }

        .fighting-style-section,
        .feats-section {
          margin-bottom: 2rem;
        }

        .fighting-style-section h3,
        .feats-section h3 {
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
        }

        .section-description {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin: 0 0 1rem 0;
        }

        .fighting-style-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .fighting-style-option {
          padding: 1rem;
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          background: var(--bg-primary);
        }

        .fighting-style-option:hover {
          border-color: var(--accent-color);
          background: var(--bg-hover);
        }

        .fighting-style-option.selected {
          border-color: var(--accent-color);
          background: rgba(var(--accent-rgb), 0.1);
        }

        .style-name {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .style-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .category-filters {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .category-filter {
          padding: 0.5rem 1rem;
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }

        .category-filter:hover {
          background: var(--bg-hover);
          transform: translateY(-1px);
        }

        .category-filter.active {
          background: var(--accent-color);
          color: white;
          border-color: var(--accent-color);
        }

        .feats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1rem;
        }

        .feat-option {
          padding: 1rem;
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          background: var(--bg-primary);
        }

        .feat-option:hover {
          border-color: var(--accent-color);
          background: var(--bg-hover);
        }

        .feat-option.selected {
          border-color: var(--success-color);
          background: rgba(25, 135, 84, 0.1);
        }

        .feat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .feat-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .feat-category {
          font-size: 0.75rem;
          color: var(--text-secondary);
          background: var(--bg-secondary);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
        }

        .feat-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .fighting-style-grid,
          .feats-grid {
            grid-template-columns: 1fr;
          }
          
          .category-filters {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default FeatsForm;