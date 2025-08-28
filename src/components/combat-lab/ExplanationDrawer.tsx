import { useState } from 'react';
import type { Build, Scenario } from '../../types';

interface ExplanationDrawerProps {
  activeTab: 'dpr' | 'chart' | 'ttk';
  build: Build;
  scenario: Scenario;
  onClose: () => void;
}

const ExplanationDrawer = ({ activeTab, build, scenario, onClose }: ExplanationDrawerProps) => {
  const [expandedSection, setExpandedSection] = useState<string>('');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  const dprExplanations = [
    {
      id: 'basics',
      title: 'DPR Calculation Basics',
      content: `DPR (Damage Per Round) is calculated as: Hit Chance × Average Damage per Hit.

For each attack:
• Hit Chance = P(roll + attack bonus ≥ target AC)
• Damage = Base Damage + Ability Modifier + Situational Bonuses
• Critical hits deal additional dice damage

With ${scenario.advantage} rolls against AC ${scenario.enemy.ac}.`
    },
    {
      id: 'advantage',
      title: 'Advantage/Disadvantage Math',
      content: `${scenario.advantage === 'advantage' ? 'Advantage' : scenario.advantage === 'disadvantage' ? 'Disadvantage' : 'Normal'} rolls:

${scenario.advantage === 'advantage' ? 
  '• Roll two d20s, take the higher\n• Significantly increases hit chance, especially against mid-range ACs\n• Also increases critical hit chance to ~9.75%' :
  scenario.advantage === 'disadvantage' ?
  '• Roll two d20s, take the lower\n• Dramatically reduces hit chance\n• Critical hit chance drops to ~0.25%' :
  '• Single d20 roll\n• Standard 5% critical hit chance\n• Linear probability distribution'
}`
    },
    {
      id: 'feats',
      title: 'Feat Interactions',
      content: `Active feats: ${build.feats.join(', ') || 'None'}

${build.feats.includes('Sharpshooter') ? 
  '• Sharpshooter: -5 to hit, +10 damage. Optimal when hit chance remains >65%.' : ''}
${build.feats.includes('Great Weapon Master') ?
  '• Great Weapon Master: -5 to hit, +10 damage. Best with high attack bonus.' : ''}
${build.feats.includes('Elven Accuracy') ?
  '• Elven Accuracy: Roll 3d20 on advantage, take highest. ~14.26% crit chance.' : ''}
${build.feats.includes('Polearm Master') ?
  '• Polearm Master: Bonus action attack with polearms. Additional damage source.' : ''}`
    }
  ];

  const chartExplanations = [
    {
      id: 'crossover',
      title: 'SS/GWM Crossover Points',
      content: `The "toggle window" shows where Sharpshooter/GWM becomes optimal.

Key factors:
• Attack bonus vs target AC
• Base damage vs feat bonus damage
• Critical hit interactions

Against AC ${scenario.enemy.ac}:
${build.feats.includes('Sharpshooter') || build.feats.includes('Great Weapon Master') ?
  'The feat is currently optimal when expected damage increase from +10 damage exceeds the loss from reduced hit chance.' :
  'No SS/GWM feat detected - consider adding one for optimization against higher ACs.'}`
    },
    {
      id: 'ac-scaling',
      title: 'AC Scaling Patterns',
      content: `DPR decreases as enemy AC increases due to:

• Linear hit chance reduction (5% per AC point)
• Exponential impact on total damage output
• Critical hits become relatively more important

Typical AC ranges:
• AC 10-13: Low-armor enemies, beasts
• AC 14-16: Medium armor, most humanoids  
• AC 17-19: Heavy armor, constructs
• AC 20+: Legendary creatures, magical protection`
    },
    {
      id: 'optimization',
      title: 'Optimization Insights',
      content: `Current build optimization suggestions:

Attack Bonus: ${build.proficiency + Math.max(build.abilities.STR, build.abilities.DEX)}
• Higher attack bonus shifts SS/GWM windows down
• Consider ability score increases vs feats

Damage Sources:
• Base weapon damage
• Ability modifier (${Math.max(Math.floor((build.abilities.STR - 10) / 2), Math.floor((build.abilities.DEX - 10) / 2))})
• Fighting style bonuses
• Magic weapon bonuses`
    }
  ];

  const ttkExplanations = [
    {
      id: 'methodology',
      title: 'TTK Calculation Method',
      content: `Time-to-Kill is calculated using probability distributions:

Expected Rounds = Target HP / Average DPR

Confidence intervals account for:
• Damage variance from dice rolls
• Critical hit probability spikes
• Miss chances creating longer tails

The 95% confidence bound means there's only a 5% chance the fight takes longer.`
    },
    {
      id: 'practical',
      title: 'Practical Applications',
      content: `TTK analysis helps with:

• Resource allocation (spell slots, abilities)
• Initiative importance assessment
• Party role optimization
• Encounter difficulty estimation

Key insights:
• Low HP enemies favor consistent damage
• High HP enemies favor burst/nova strategies
• Mid-range targets show greatest optimization impact`
    },
    {
      id: 'limitations',
      title: 'Model Limitations',
      content: `This model assumes:

• Static target (doesn't move or take cover)
• No healing or temporary HP
• Consistent resource availability
• No legendary actions or reactions

Real combat involves:
• Positioning and movement
• Environmental factors
• Dynamic threat assessment
• Resource management decisions`
    }
  ];

  const getActiveExplanations = () => {
    switch (activeTab) {
      case 'dpr': return dprExplanations;
      case 'chart': return chartExplanations;
      case 'ttk': return ttkExplanations;
      default: return [];
    }
  };

  const explanations = getActiveExplanations();

  return (
    <div className="explanation-drawer">
      <div className="drawer-header">
        <h3>
          {activeTab === 'dpr' && '🔢 3-Round DPR Explained'}
          {activeTab === 'chart' && '📈 DPR vs AC Chart Explained'}
          {activeTab === 'ttk' && '⏱️ Time-to-Kill Explained'}
        </h3>
        <button className="close-button" onClick={onClose}>✕</button>
      </div>

      <div className="drawer-content">
        <div className="explanation-intro">
          <p>
            {activeTab === 'dpr' && 'Understanding how 3-round DPR is calculated and what factors influence your damage output.'}
            {activeTab === 'chart' && 'Learn about DPR scaling, crossover points, and how to read the optimization windows.'}
            {activeTab === 'ttk' && 'Explore time-to-kill analysis methodology and how to interpret the results for tactical decisions.'}
          </p>
        </div>

        <div className="explanation-sections">
          {explanations.map((explanation) => (
            <div key={explanation.id} className="explanation-section">
              <button
                className={`section-header ${expandedSection === explanation.id ? 'expanded' : ''}`}
                onClick={() => toggleSection(explanation.id)}
              >
                <span className="section-title">{explanation.title}</span>
                <span className="expand-icon">▼</span>
              </button>
              
              {expandedSection === explanation.id && (
                <div className="section-content">
                  <pre className="explanation-text">{explanation.content}</pre>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="build-context">
          <h4>Current Build Context</h4>
          <div className="context-info">
            <div className="context-item">
              <strong>Build:</strong> {build.name} (Level {build.level} {build.class})
            </div>
            <div className="context-item">
              <strong>Attack Bonus:</strong> +{build.proficiency + Math.max(build.abilities.STR, build.abilities.DEX)}
            </div>
            <div className="context-item">
              <strong>Active Feats:</strong> {build.feats.join(', ') || 'None'}
            </div>
            <div className="context-item">
              <strong>Scenario:</strong> AC {scenario.enemy.ac}, {scenario.advantage} rolls
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .explanation-drawer {
          position: fixed;
          right: 0;
          top: 0;
          bottom: 0;
          width: 400px;
          background: var(--bg-primary);
          border-left: 2px solid var(--border-color);
          box-shadow: var(--shadow-2xl);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-secondary);
          flex-shrink: 0;
        }

        .drawer-header h3 {
          font-size: var(--text-lg);
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.25rem;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: var(--rounded);
          transition: var(--transition);
        }

        .close-button:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .drawer-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .explanation-intro p {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
          background: var(--bg-tertiary);
          padding: 1rem;
          border-radius: var(--rounded-lg);
          border-left: 3px solid var(--accent-color);
        }

        .explanation-sections {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .explanation-section {
          border: 1px solid var(--border-color);
          border-radius: var(--rounded-lg);
          overflow: hidden;
        }

        .section-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: var(--bg-secondary);
          border: none;
          cursor: pointer;
          transition: var(--transition);
        }

        .section-header:hover {
          background: var(--bg-hover);
        }

        .section-header.expanded {
          background: var(--bg-tertiary);
        }

        .section-title {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-primary);
        }

        .expand-icon {
          font-size: 0.75rem;
          color: var(--text-secondary);
          transition: var(--transition);
          transform-origin: center;
        }

        .section-header.expanded .expand-icon {
          transform: rotate(180deg);
        }

        .section-content {
          padding: 1rem;
          background: var(--bg-primary);
          border-top: 1px solid var(--border-light);
        }

        .explanation-text {
          font-family: inherit;
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .build-context {
          background: var(--bg-secondary);
          padding: 1rem;
          border-radius: var(--rounded-lg);
          border: 1px solid var(--border-color);
        }

        .build-context h4 {
          font-size: var(--text-base);
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.75rem 0;
        }

        .context-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .context-item {
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .context-item strong {
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .explanation-drawer {
            width: 100vw;
            left: 0;
          }
        }

        @media (max-width: 640px) {
          .drawer-content {
            padding: 1rem;
          }
          
          .drawer-header {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ExplanationDrawer;