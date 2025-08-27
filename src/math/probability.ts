/**
 * Core probability calculations for D&D combat
 */

/**
 * Calculate probability of hitting with a d20 roll
 */
export function hitProbability(
  attackBonus: number, 
  targetAC: number, 
  advantage: 'normal' | 'advantage' | 'disadvantage' = 'normal'
): number {
  const targetRoll = targetAC - attackBonus;
  
  // Natural 20 always hits, natural 1 always misses
  let baseChance;
  if (targetRoll <= 1) {
    // Always hit except on natural 1 (95%)
    baseChance = 0.95;
  } else if (targetRoll >= 20) {
    // Only hit on natural 20 (5%)
    baseChance = 0.05;
  } else {
    // Normal calculation
    baseChance = (21 - targetRoll) / 20;
  }
  
  switch (advantage) {
    case 'advantage':
      return 1 - Math.pow(1 - baseChance, 2);
    case 'disadvantage':
      return Math.pow(baseChance, 2);
    default:
      return baseChance;
  }
}

/**
 * Calculate probability of critical hit
 */
export function critProbability(
  critRange: number = 20,
  advantage: 'normal' | 'advantage' | 'disadvantage' = 'normal'
): number {
  const baseCritChance = (21 - critRange) / 20;
  
  switch (advantage) {
    case 'advantage':
      return 1 - Math.pow(1 - baseCritChance, 2);
    case 'disadvantage':
      return Math.pow(baseCritChance, 2);
    default:
      return baseCritChance;
  }
}

/**
 * Calculate probability with Elven Accuracy (triple advantage for certain builds)
 */
export function elvenAccuracyProbability(
  attackBonus: number,
  targetAC: number,
  type: 'hit' | 'crit',
  critRange: number = 20
): number {
  const targetRoll = targetAC - attackBonus;
  const baseTarget = Math.max(1, Math.min(20, targetRoll));
  
  if (type === 'hit') {
    const missChance = (baseTarget - 1) / 20;
    return 1 - Math.pow(missChance, 3);
  } else {
    const baseCritChance = (21 - critRange) / 20;
    return 1 - Math.pow(1 - baseCritChance, 3);
  }
}

/**
 * Calculate probability with modifier dice (Bless, Bane, etc.)
 */
export function hitProbabilityWithModifier(
  attackBonus: number,
  targetAC: number,
  modifierDice: string = '1d4', // e.g., "1d4" for Bless
  modifierType: 'bonus' | 'penalty' = 'bonus',
  advantage: 'normal' | 'advantage' | 'disadvantage' = 'normal'
): number {
  // For now, use average modifier value
  // TODO: Implement full probability distribution
  const [count, sides] = modifierDice.split('d').map(Number);
  const avgModifier = (count * (sides + 1)) / 2;
  const adjustedBonus = modifierType === 'bonus' 
    ? attackBonus + avgModifier 
    : attackBonus - avgModifier;
  
  return hitProbability(adjustedBonus, targetAC, advantage);
}

/**
 * Calculate once-per-turn allocation probability
 * Used for abilities like Sneak Attack, Hex, etc.
 */
export function oncePerTurnAllocation(
  attacks: Array<{
    hitChance: number;
    critChance: number;
  }>
): {
  firstHitIsCrit: number;
  atLeastOneHit: number;
  atLeastOneCrit: number;
} {
  if (attacks.length === 0) {
    return { firstHitIsCrit: 0, atLeastOneHit: 0, atLeastOneCrit: 0 };
  }
  
  // Probability that first hit is a crit (for optimal rider placement)
  const firstHitIsCrit = attacks[0].critChance;
  
  // Probability of at least one hit
  const allMiss = attacks.reduce((acc, attack) => acc * (1 - attack.hitChance), 1);
  const atLeastOneHit = 1 - allMiss;
  
  // Probability of at least one crit
  const allNonCrit = attacks.reduce((acc, attack) => acc * (1 - attack.critChance), 1);
  const atLeastOneCrit = 1 - allNonCrit;
  
  return {
    firstHitIsCrit,
    atLeastOneHit,
    atLeastOneCrit
  };
}