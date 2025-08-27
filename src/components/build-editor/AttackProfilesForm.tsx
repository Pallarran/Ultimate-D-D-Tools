import { useState } from 'react';
import { Build, AttackProfile, Rider } from '../../types';

interface AttackProfilesFormProps {
  build: Build;
  onChange: (updates: Partial<Build>) => void;
}

const weaponPresets = [
  { name: 'Longsword', damage: '1d8', critDamage: '2d8', type: 'melee' },
  { name: 'Greatsword', damage: '2d6', critDamage: '4d6', type: 'melee' },
  { name: 'Longbow', damage: '1d8', critDamage: '2d8', type: 'ranged' },
  { name: 'Heavy Crossbow', damage: '1d10', critDamage: '2d10', type: 'ranged' },
  { name: 'Rapier', damage: '1d8', critDamage: '2d8', type: 'melee' },
  { name: 'Shortsword', damage: '1d6', critDamage: '2d6', type: 'melee' },
  { name: 'Hand Crossbow', damage: '1d6', critDamage: '2d6', type: 'ranged' },
  { name: 'Dagger', damage: '1d4', critDamage: '2d4', type: 'melee' },
];

const commonRiders = [
  { name: 'Sneak Attack', dice: '1d6', oncePerTurn: true },
  { name: 'Divine Smite', dice: '2d8', oncePerTurn: false },
  { name: 'Hex', dice: '1d6', oncePerTurn: false },
  { name: "Hunter's Mark", dice: '1d6', oncePerTurn: false },
  { name: 'Colossus Slayer', dice: '1d8', oncePerTurn: true },
  { name: 'Fury of the Small', dice: '1', oncePerTurn: true },
];

const AttackProfilesForm = ({ build, onChange }: AttackProfilesFormProps) => {
  const [editingProfile, setEditingProfile] = useState<string | null>(null);

  const generateProfileId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };

  const addProfile = (preset?: typeof weaponPresets[0]) => {
    const abilityMod = preset?.type === 'ranged' ? 'DEX' : 'STR';
    const newProfile: AttackProfile = {
      id: generateProfileId(),
      name: preset?.name || 'New Attack',
      type: 'weapon',
      attackBonusFormula: `PB + ${abilityMod}`,
      damageHit: preset ? `${preset.damage}+${abilityMod}` : '1d8+STR',
      damageCrit: preset ? `${preset.critDamage}+${abilityMod}` : '2d8+STR',
      critRange: 20,
      riders: [],
    };

    onChange({
      profiles: [...(build.profiles || []), newProfile],
    });
  };

  const updateProfile = (profileId: string, updates: Partial<AttackProfile>) => {
    const updatedProfiles = (build.profiles || []).map(profile =>
      profile.id === profileId ? { ...profile, ...updates } : profile
    );
    onChange({ profiles: updatedProfiles });
  };

  const removeProfile = (profileId: string) => {
    const updatedProfiles = (build.profiles || []).filter(
      profile => profile.id !== profileId
    );
    onChange({ profiles: updatedProfiles });
  };

  const addRider = (profileId: string, rider: Rider) => {
    const profile = build.profiles?.find(p => p.id === profileId);
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      riders: [...profile.riders, rider],
    };

    updateProfile(profileId, updatedProfile);
  };

  const removeRider = (profileId: string, riderIndex: number) => {
    const profile = build.profiles?.find(p => p.id === profileId);
    if (!profile) return;

    const updatedRiders = profile.riders.filter((_, index) => index !== riderIndex);
    updateProfile(profileId, { riders: updatedRiders });
  };

  return (
    <div className="form-section">
      <h2 className="section-title">
        Attack Profiles
        <span className="profile-count">({build.profiles?.length || 0} profiles)</span>
      </h2>

      <div className="add-profile-section">
        <h3>Add New Profile</h3>
        <div className="weapon-presets">
          <button onClick={() => addProfile()} className="add-custom">
            + Custom Attack
          </button>
          {weaponPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => addProfile(preset)}
              className="weapon-preset"
            >
              + {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="profiles-list">
        {(build.profiles || []).map((profile) => (
          <div key={profile.id} className="profile-card">
            <div className="profile-header">
              <h4>{profile.name}</h4>
              <div className="profile-actions">
                <button
                  onClick={() => setEditingProfile(
                    editingProfile === profile.id ? null : profile.id
                  )}
                  className="edit-button"
                >
                  {editingProfile === profile.id ? 'Done' : 'Edit'}
                </button>
                <button
                  onClick={() => removeProfile(profile.id)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            </div>

            {editingProfile === profile.id && (
              <div className="profile-editor">
                <div className="editor-grid">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => updateProfile(profile.id, { name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Type</label>
                    <select
                      value={profile.type}
                      onChange={(e) => updateProfile(profile.id, { 
                        type: e.target.value as AttackProfile['type'] 
                      })}
                    >
                      <option value="weapon">Weapon</option>
                      <option value="cantrip">Cantrip</option>
                      <option value="spell">Spell</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Attack Bonus Formula</label>
                    <input
                      type="text"
                      value={profile.attackBonusFormula}
                      onChange={(e) => updateProfile(profile.id, { 
                        attackBonusFormula: e.target.value 
                      })}
                      placeholder="PB + STR"
                    />
                  </div>

                  <div className="form-group">
                    <label>Hit Damage</label>
                    <input
                      type="text"
                      value={profile.damageHit}
                      onChange={(e) => updateProfile(profile.id, { 
                        damageHit: e.target.value 
                      })}
                      placeholder="1d8+STR"
                    />
                  </div>

                  <div className="form-group">
                    <label>Crit Damage</label>
                    <input
                      type="text"
                      value={profile.damageCrit}
                      onChange={(e) => updateProfile(profile.id, { 
                        damageCrit: e.target.value 
                      })}
                      placeholder="2d8+STR"
                    />
                  </div>

                  <div className="form-group">
                    <label>Crit Range</label>
                    <select
                      value={profile.critRange}
                      onChange={(e) => updateProfile(profile.id, { 
                        critRange: parseInt(e.target.value) 
                      })}
                    >
                      <option value="20">20</option>
                      <option value="19">19-20 (Champion)</option>
                      <option value="18">18-20 (Champion 15+)</option>
                    </select>
                  </div>
                </div>

                <div className="riders-section">
                  <h5>Damage Riders</h5>
                  <div className="riders-list">
                    {profile.riders.map((rider, index) => (
                      <div key={index} className="rider-item">
                        <span>{rider.name}: {rider.dice}</span>
                        <span className={`rider-type ${rider.oncePerTurn ? 'once-per-turn' : 'per-hit'}`}>
                          {rider.oncePerTurn ? 'Once/Turn' : 'Per Hit'}
                        </span>
                        <button
                          onClick={() => removeRider(profile.id, index)}
                          className="remove-rider"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="add-riders">
                    <h6>Add Common Riders:</h6>
                    <div className="rider-presets">
                      {commonRiders.map((rider) => (
                        <button
                          key={rider.name}
                          onClick={() => addRider(profile.id, rider)}
                          className="rider-preset"
                        >
                          + {rider.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="profile-summary">
              <div className="summary-item">
                <span>Attack:</span> <code>{profile.attackBonusFormula}</code>
              </div>
              <div className="summary-item">
                <span>Damage:</span> <code>{profile.damageHit}</code>
              </div>
              <div className="summary-item">
                <span>Crit:</span> <code>{profile.damageCrit}</code>
              </div>
              {profile.riders.length > 0 && (
                <div className="summary-item">
                  <span>Riders:</span> 
                  {profile.riders.map(r => r.name).join(', ')}
                </div>
              )}
            </div>
          </div>
        ))}

        {(!build.profiles || build.profiles.length === 0) && (
          <div className="empty-state">
            <p>No attack profiles yet. Add one using the buttons above.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .profile-count {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-left: 1rem;
        }

        .add-profile-section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: var(--bg-secondary);
          border-radius: 0.5rem;
          border: 1px solid var(--border-light);
        }

        .add-profile-section h3 {
          margin: 0 0 1rem 0;
          color: var(--text-primary);
        }

        .weapon-presets {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .add-custom,
        .weapon-preset {
          padding: 0.5rem 1rem;
          background: var(--accent-color);
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }

        .weapon-preset {
          background: var(--bg-primary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
        }

        .weapon-preset:hover {
          background: var(--bg-hover);
          border-color: var(--accent-color);
        }

        .profile-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }

        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid var(--border-light);
        }

        .profile-header h4 {
          margin: 0;
          color: var(--text-primary);
        }

        .profile-actions {
          display: flex;
          gap: 0.5rem;
        }

        .edit-button {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          padding: 0.25rem 0.75rem;
          font-size: 0.875rem;
        }

        .remove-button {
          background: var(--danger-color);
          padding: 0.25rem 0.75rem;
          font-size: 0.875rem;
        }

        .profile-editor {
          padding: 1rem;
          border-bottom: 1px solid var(--border-light);
        }

        .editor-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .form-group input,
        .form-group select {
          padding: 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }

        .riders-section h5,
        .riders-section h6 {
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
        }

        .riders-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .rider-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem;
          background: var(--bg-secondary);
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }

        .rider-type {
          font-size: 0.75rem;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
        }

        .rider-type.once-per-turn {
          background: var(--warning-color);
          color: white;
        }

        .rider-type.per-hit {
          background: var(--success-color);
          color: white;
        }

        .remove-rider {
          background: var(--danger-color);
          color: white;
          border: none;
          border-radius: 50%;
          width: 1.5rem;
          height: 1.5rem;
          font-size: 1rem;
          padding: 0;
        }

        .rider-presets {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .rider-preset {
          background: var(--bg-primary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
        }

        .rider-preset:hover {
          background: var(--bg-hover);
        }

        .profile-summary {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .summary-item {
          display: flex;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .summary-item span:first-child {
          font-weight: 500;
          color: var(--text-primary);
          min-width: 4rem;
        }

        .summary-item code {
          background: var(--bg-secondary);
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.8rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .editor-grid {
            grid-template-columns: 1fr;
          }
          
          .profile-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default AttackProfilesForm;