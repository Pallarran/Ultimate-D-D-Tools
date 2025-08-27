/**
 * Non-combat pillar scoring calculations
 */

import { Build } from '../types';

export interface PillarScores {
  social: number;
  exploration: number;
  control: number;
  mobility: number;
  survivability: number;
}

export interface PillarWeights {
  social: number;
  exploration: number;
  control: number;
  mobility: number;
  survivability: number;
}

/**
 * Calculate social pillar score based on skills and abilities
 */
export function calculateSocialScore(build: Build): number {
  let score = 0;
  
  // Base charisma modifier
  const chaMod = Math.floor((build.abilities.CHA - 10) / 2);
  score += Math.max(0, chaMod) * 10;
  
  // Proficiency in social skills (simplified)
  // In full implementation, would check actual skill proficiencies
  if (build.tags.includes('persuasion')) score += 20;
  if (build.tags.includes('deception')) score += 20;
  if (build.tags.includes('intimidation')) score += 20;
  
  // Class features that help with social encounters
  if (build.class === 'Bard') score += 30;
  if (build.class === 'Warlock') score += 20;
  if (build.subclass === 'College of Eloquence') score += 40;
  
  return Math.min(100, score);
}

/**
 * Calculate exploration pillar score
 */
export function calculateExplorationScore(build: Build): number {
  let score = 0;
  
  // Movement and travel
  if (build.tags.includes('fly')) score += 25;
  if (build.tags.includes('climb')) score += 15;
  if (build.tags.includes('swim')) score += 10;
  
  // Stealth and perception
  const dexMod = Math.floor((build.abilities.DEX - 10) / 2);
  const wisMod = Math.floor((build.abilities.WIS - 10) / 2);
  score += Math.max(0, dexMod) * 5;
  score += Math.max(0, wisMod) * 5;
  
  // Utility spells and abilities
  if (build.tags.includes('ritual-caster')) score += 20;
  if (build.tags.includes('telepathy')) score += 15;
  
  // Survival and navigation
  if (build.class === 'Ranger') score += 25;
  if (build.class === 'Druid') score += 20;
  
  return Math.min(100, score);
}

/**
 * Calculate control pillar score
 */
export function calculateControlScore(build: Build): number {
  let score = 0;
  
  // Spellcasting ability for control spells
  const spellMod = getSpellcastingModifier(build);
  if (spellMod > 0) {
    score += spellMod * 8;
    
    // Bonus for classes with good control options
    if (build.class === 'Wizard') score += 30;
    if (build.class === 'Sorcerer') score += 25;
    if (build.class === 'Warlock') score += 20;
    if (build.subclass === 'School of Enchantment') score += 20;
  }
  
  // Non-magical control options
  if (build.feats.includes('Sentinel')) score += 15;
  if (build.feats.includes('Polearm Master')) score += 10;
  
  return Math.min(100, score);
}

/**
 * Calculate mobility pillar score
 */
export function calculateMobilityScore(build: Build): number {
  let score = 30; // Base movement
  
  // Enhanced movement
  if (build.tags.includes('fly')) score += 30;
  if (build.tags.includes('teleport')) score += 25;
  if (build.feats.includes('Mobile')) score += 20;
  
  // Class features
  if (build.class === 'Monk') score += 25;
  if (build.class === 'Rogue') score += 15;
  
  // High dexterity helps with initiative and AC
  const dexMod = Math.floor((build.abilities.DEX - 10) / 2);
  score += Math.max(0, dexMod) * 3;
  
  return Math.min(100, score);
}

/**
 * Calculate survivability score (effective HP)
 */
export function calculateSurvivabilityScore(build: Build): number {
  // Base HP (simplified - would use actual HP calculation)
  const conMod = Math.floor((build.abilities.CON - 10) / 2);
  const baseHP = build.level * (8 + conMod); // Assume d8 hit die
  
  // AC calculation (simplified)
  const dexMod = Math.floor((build.abilities.DEX - 10) / 2);
  let ac = 10 + dexMod;
  
  // Armor improvements (simplified)
  if (build.tags.includes('heavy-armor')) ac = 18;
  else if (build.tags.includes('medium-armor')) ac = 14 + Math.min(2, dexMod);
  
  // Defensive features
  let effectiveHP = baseHP;
  
  // Resistance roughly doubles effective HP against those damage types
  if (build.tags.includes('resistance')) effectiveHP *= 1.3;
  
  // Shield spell and similar
  if (build.tags.includes('shield-spell')) ac += 2; // Average AC bonus
  
  // Convert to 0-100 score
  // High AC and HP both contribute to survivability
  const hpScore = Math.min(50, baseHP / 2);
  const acScore = Math.min(50, (ac - 10) * 3);
  
  return hpScore + acScore;
}

/**
 * Calculate all pillar scores for a build
 */
export function calculateAllPillarScores(build: Build): PillarScores {
  return {
    social: calculateSocialScore(build),
    exploration: calculateExplorationScore(build),
    control: calculateControlScore(build),
    mobility: calculateMobilityScore(build),
    survivability: calculateSurvivabilityScore(build)
  };
}

/**
 * Calculate weighted pillar score
 */
export function calculateWeightedPillarScore(
  scores: PillarScores,
  weights: PillarWeights
): number {
  const totalWeight = weights.social + weights.exploration + weights.control + 
                     weights.mobility + weights.survivability;
  
  if (totalWeight === 0) return 0;
  
  return (
    (scores.social * weights.social) +
    (scores.exploration * weights.exploration) +
    (scores.control * weights.control) +
    (scores.mobility * weights.mobility) +
    (scores.survivability * weights.survivability)
  ) / totalWeight;
}

/**
 * Get the primary spellcasting modifier for a build
 */
function getSpellcastingModifier(build: Build): number {
  switch (build.class) {
    case 'Wizard':
    case 'Eldritch Knight':
    case 'Arcane Trickster':
      return Math.floor((build.abilities.INT - 10) / 2);
    case 'Cleric':
    case 'Druid':
    case 'Ranger':
      return Math.floor((build.abilities.WIS - 10) / 2);
    case 'Bard':
    case 'Sorcerer':
    case 'Warlock':
    case 'Paladin':
      return Math.floor((build.abilities.CHA - 10) / 2);
    default:
      return 0;
  }
}