import { Build } from '../../types';

interface BasicInfoFormProps {
  build: Build;
  onChange: (updates: Partial<Build>) => void;
}

const classes = [
  'Artificer', 'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter',
  'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
];

const subclassesByClass: Record<string, string[]> = {
  Fighter: ['Champion', 'Battle Master', 'Eldritch Knight', 'Psi Warrior', 'Rune Knight'],
  Wizard: ['School of Abjuration', 'School of Conjuration', 'School of Divination', 'School of Enchantment', 'School of Evocation', 'School of Illusion', 'School of Necromancy', 'School of Transmutation'],
  Rogue: ['Thief', 'Assassin', 'Arcane Trickster', 'Mastermind', 'Scout', 'Swashbuckler'],
  Ranger: ['Beast Master', 'Hunter', 'Gloom Stalker', 'Horizon Walker', 'Monster Slayer'],
  Paladin: ['Devotion', 'Ancients', 'Vengeance', 'Conquest', 'Redemption', 'Glory'],
  Barbarian: ['Path of the Berserker', 'Path of the Totem Warrior', 'Path of the Storm Herald', 'Path of the Zealot'],
  Bard: ['College of Lore', 'College of Valor', 'College of Glamour', 'College of Whispers', 'College of Swords', 'College of Eloquence'],
  Cleric: ['Life', 'Light', 'Nature', 'Tempest', 'Trickery', 'War', 'Death', 'Forge', 'Grave'],
  Druid: ['Circle of the Land', 'Circle of the Moon', 'Circle of Dreams', 'Circle of the Shepherd', 'Circle of Spores'],
  Monk: ['Way of the Open Hand', 'Way of Shadow', 'Way of the Four Elements', 'Way of the Drunken Master', 'Way of the Kensei'],
  Sorcerer: ['Draconic Bloodline', 'Wild Magic', 'Storm Sorcery', 'Divine Soul', 'Shadow Magic', 'Aberrant Mind'],
  Warlock: ['The Fiend', 'The Archfey', 'The Great Old One', 'The Celestial', 'The Hexblade', 'The Fathomless'],
  Artificer: ['Alchemist', 'Armorer', 'Battle Smith', 'Artillerist']
};

const BasicInfoForm = ({ build, onChange }: BasicInfoFormProps) => {
  const availableSubclasses = subclassesByClass[build.class] || [];

  const handleInputChange = (field: keyof Build, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="form-section">
      <h2 className="section-title">Basic Information</h2>
      
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Build Name</label>
          <input
            type="text"
            className="form-input"
            value={build.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter build name"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Level</label>
          <input
            type="number"
            className="form-input"
            value={build.level}
            onChange={(e) => handleInputChange('level', parseInt(e.target.value) || 1)}
            min="1"
            max="20"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Class</label>
          <select
            className="form-select"
            value={build.class}
            onChange={(e) => {
              const newClass = e.target.value;
              const newSubclass = subclassesByClass[newClass]?.[0] || '';
              onChange({ 
                class: newClass, 
                subclass: newSubclass,
                proficiency: Math.ceil(build.level / 4) + 1 // Update proficiency bonus
              });
            }}
          >
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Subclass</label>
          <select
            className="form-select"
            value={build.subclass}
            onChange={(e) => handleInputChange('subclass', e.target.value)}
          >
            {availableSubclasses.map((subclass) => (
              <option key={subclass} value={subclass}>
                {subclass}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Proficiency Bonus</label>
          <input
            type="number"
            className="form-input"
            value={build.proficiency}
            onChange={(e) => handleInputChange('proficiency', parseInt(e.target.value) || 2)}
            min="2"
            max="6"
          />
          <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
            Usually {Math.ceil(build.level / 4) + 1} at level {build.level}
          </small>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;