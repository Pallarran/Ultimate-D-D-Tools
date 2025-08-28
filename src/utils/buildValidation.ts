import type { Build } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  id: string;
  field: string;
  message: string;
  severity: 'error';
}

export interface ValidationWarning {
  id: string;
  field: string;
  message: string;
  severity: 'warning';
}

/**
 * Comprehensive build validation system
 */
export function validateBuild(build: Build): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Basic info validation
  validateBasicInfo(build, errors, warnings);
  
  // Ability score validation
  validateAbilityScores(build, errors, warnings);
  
  // Feat validation and conflicts
  validateFeats(build, errors, warnings);
  
  // Class feature validation
  validateClassFeatures(build, errors, warnings);
  
  // Attack profile validation
  validateAttackProfiles(build, errors, warnings);

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

function validateBasicInfo(build: Build, errors: ValidationError[], warnings: ValidationWarning[]) {
  // Level validation
  if (build.level < 1 || build.level > 20) {
    errors.push({
      id: 'invalid-level',
      field: 'level',
      message: 'Character level must be between 1 and 20',
      severity: 'error'
    });
  }

  // Proficiency bonus validation
  const expectedPB = Math.ceil(build.level / 4) + 1;
  if (build.proficiency !== expectedPB) {
    warnings.push({
      id: 'incorrect-proficiency',
      field: 'proficiency',
      message: `Proficiency bonus should be ${expectedPB} for level ${build.level}`,
      severity: 'warning'
    });
  }

  // Name validation
  if (!build.name || build.name.trim().length === 0) {
    errors.push({
      id: 'empty-name',
      field: 'name',
      message: 'Build must have a name',
      severity: 'error'
    });
  }
}

function validateAbilityScores(build: Build, errors: ValidationError[], warnings: ValidationWarning[]) {
  const { abilities } = build;
  const scores = Object.values(abilities);
  
  // Check for valid ability score range
  scores.forEach((score, index) => {
    const abilityName = Object.keys(abilities)[index];
    if (score < 3 || score > 20) {
      errors.push({
        id: `invalid-${abilityName.toLowerCase()}`,
        field: 'abilities',
        message: `${abilityName} score must be between 3 and 20`,
        severity: 'error'
      });
    }
  });

  // Point buy validation (optional warning)
  const pointBuyTotal = calculatePointBuyCost(abilities);
  if (pointBuyTotal > 27) {
    warnings.push({
      id: 'point-buy-exceeded',
      field: 'abilities',
      message: `Ability scores cost ${pointBuyTotal} points (standard point buy is 27)`,
      severity: 'warning'
    });
  }

  // Check for dump stats that might be problematic
  if (abilities.CON < 10) {
    warnings.push({
      id: 'low-constitution',
      field: 'abilities',
      message: 'Low Constitution may result in poor survivability',
      severity: 'warning'
    });
  }
}

function validateFeats(build: Build, errors: ValidationError[], warnings: ValidationWarning[]) {
  const { feats } = build;

  // Check for feat conflicts
  const fightingStyleFeats = ['Great Weapon Fighting', 'Dueling', 'Archery', 'Defense', 'Protection'];
  const selectedFightingStyles = feats.filter(feat => fightingStyleFeats.includes(feat));
  
  if (selectedFightingStyles.length > 1 && !build.features.fightingStyle) {
    errors.push({
      id: 'multiple-fighting-styles',
      field: 'feats',
      message: 'Cannot have multiple fighting styles from feats without class feature',
      severity: 'error'
    });
  }

  // Check for incompatible weapon feats
  if (feats.includes('Sharpshooter') && feats.includes('Great Weapon Master')) {
    warnings.push({
      id: 'conflicting-weapon-feats',
      field: 'feats',
      message: 'Sharpshooter and Great Weapon Master target different weapon types',
      severity: 'warning'
    });
  }

  // Elven Accuracy without advantage sources
  if (feats.includes('Elven Accuracy')) {
    const hasAdvantageSource = feats.some(feat => 
      ['Sharpshooter', 'Great Weapon Master', 'Reckless Attack'].includes(feat)
    );
    if (!hasAdvantageSource && build.class !== 'Barbarian') {
      warnings.push({
        id: 'elven-accuracy-no-advantage',
        field: 'feats',
        message: 'Elven Accuracy is most effective with reliable advantage sources',
        severity: 'warning'
      });
    }
  }

  // Polearm Master validation
  if (feats.includes('Polearm Master')) {
    const hasPolearmProfile = build.profiles.some(profile => 
      profile.name.toLowerCase().includes('glaive') ||
      profile.name.toLowerCase().includes('halberd') ||
      profile.name.toLowerCase().includes('pike') ||
      profile.name.toLowerCase().includes('quarterstaff') ||
      profile.name.toLowerCase().includes('spear')
    );
    
    if (!hasPolearmProfile) {
      warnings.push({
        id: 'polearm-master-no-weapon',
        field: 'feats',
        message: 'Polearm Master requires a compatible polearm weapon',
        severity: 'warning'
      });
    }
  }

  // Crossbow Expert validation
  if (feats.includes('Crossbow Expert')) {
    const hasCrossbowProfile = build.profiles.some(profile =>
      profile.name.toLowerCase().includes('crossbow')
    );
    
    if (!hasCrossbowProfile) {
      warnings.push({
        id: 'crossbow-expert-no-weapon',
        field: 'feats',
        message: 'Crossbow Expert is most effective with crossbow weapons',
        severity: 'warning'
      });
    }
  }
}

function validateClassFeatures(build: Build, errors: ValidationError[], warnings: ValidationWarning[]) {
  const { class: className, level, features } = build;

  // Extra Attack validation
  const shouldHaveExtraAttack = (
    ['Fighter', 'Paladin', 'Ranger', 'Barbarian'].includes(className) && level >= 5
  ) || (className === 'Fighter' && level >= 11);

  const expectedExtraAttacks = className === 'Fighter' ? 
    Math.min(3, Math.floor((level - 1) / 4)) : 
    (level >= 5 ? 1 : 0);

  if (features.extraAttack !== expectedExtraAttacks) {
    warnings.push({
      id: 'incorrect-extra-attack',
      field: 'features',
      message: `${className} level ${level} should have ${expectedExtraAttacks} extra attack(s)`,
      severity: 'warning'
    });
  }

  // Action Surge validation
  if (className === 'Fighter') {
    const expectedActionSurge = level >= 2 ? (level >= 17 ? 2 : 1) : 0;
    if (features.actionSurge !== expectedActionSurge) {
      warnings.push({
        id: 'incorrect-action-surge',
        field: 'features',
        message: `Fighter level ${level} should have ${expectedActionSurge} action surge use(s)`,
        severity: 'warning'
      });
    }
  } else if (features.actionSurge > 0) {
    errors.push({
      id: 'invalid-action-surge',
      field: 'features',
      message: 'Only Fighters get Action Surge',
      severity: 'error'
    });
  }

  // Sneak Attack validation
  if (className === 'Rogue') {
    const expectedSneakAttack = Math.ceil(level / 2);
    if (features.sneakAttackDice !== expectedSneakAttack) {
      warnings.push({
        id: 'incorrect-sneak-attack',
        field: 'features',
        message: `Rogue level ${level} should have ${expectedSneakAttack}d6 Sneak Attack`,
        severity: 'warning'
      });
    }
  } else if (features.sneakAttackDice > 0) {
    // Allow for multiclassing
    warnings.push({
      id: 'sneak-attack-no-rogue',
      field: 'features',
      message: 'Sneak Attack typically requires Rogue levels',
      severity: 'warning'
    });
  }

  // Hexblade Curse validation
  if (features.hexbladeCurse && !(className === 'Warlock' && build.subclass === 'The Hexblade')) {
    warnings.push({
      id: 'hexblade-curse-no-hexblade',
      field: 'features',
      message: 'Hexblade\'s Curse requires Hexblade Warlock subclass',
      severity: 'warning'
    });
  }
}

function validateAttackProfiles(build: Build, errors: ValidationError[], warnings: ValidationWarning[]) {
  const { profiles } = build;

  if (profiles.length === 0) {
    warnings.push({
      id: 'no-attack-profiles',
      field: 'profiles',
      message: 'Build has no attack profiles defined',
      severity: 'warning'
    });
    return;
  }

  profiles.forEach((profile, index) => {
    // Name validation
    if (!profile.name || profile.name.trim().length === 0) {
      errors.push({
        id: `profile-${index}-no-name`,
        field: 'profiles',
        message: `Attack profile ${index + 1} must have a name`,
        severity: 'error'
      });
    }

    // Damage formula validation
    if (!profile.damageHit || profile.damageHit.trim().length === 0) {
      errors.push({
        id: `profile-${index}-no-damage`,
        field: 'profiles',
        message: `${profile.name || `Profile ${index + 1}`} must have damage formula`,
        severity: 'error'
      });
    }

    // Crit range validation
    if (profile.critRange < 19 || profile.critRange > 20) {
      warnings.push({
        id: `profile-${index}-unusual-crit`,
        field: 'profiles',
        message: `${profile.name || `Profile ${index + 1}`} has unusual critical hit range`,
        severity: 'warning'
      });
    }

    // Check for ability score dependencies
    if (profile.damageHit.includes('STR') && build.abilities.STR < 13) {
      warnings.push({
        id: `profile-${index}-low-str`,
        field: 'profiles',
        message: `${profile.name || `Profile ${index + 1}`} uses STR but STR is low`,
        severity: 'warning'
      });
    }

    if (profile.damageHit.includes('DEX') && build.abilities.DEX < 13) {
      warnings.push({
        id: `profile-${index}-low-dex`,
        field: 'profiles',
        message: `${profile.name || `Profile ${index + 1}`} uses DEX but DEX is low`,
        severity: 'warning'
      });
    }
  });
}

/**
 * Calculate point buy cost for ability scores
 */
function calculatePointBuyCost(abilities: Build['abilities']): number {
  const costs: Record<number, number> = {
    8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
  };
  
  return Object.values(abilities).reduce((total, score) => {
    return total + (costs[score] || Math.max(0, (score - 13) * 2 + 5));
  }, 0);
}

/**
 * Get validation summary for display
 */
export function getValidationSummary(validation: ValidationResult): string {
  if (validation.isValid && validation.warnings.length === 0) {
    return 'Build is valid with no issues';
  }
  
  const parts = [];
  if (validation.errors.length > 0) {
    parts.push(`${validation.errors.length} error${validation.errors.length === 1 ? '' : 's'}`);
  }
  if (validation.warnings.length > 0) {
    parts.push(`${validation.warnings.length} warning${validation.warnings.length === 1 ? '' : 's'}`);
  }
  
  return parts.join(', ');
}