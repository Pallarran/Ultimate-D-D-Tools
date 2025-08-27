/**
 * Damage calculation utilities for D&D combat
 */

/**
 * Parse and calculate average damage from dice notation
 */
export function averageDamage(diceNotation: string): number {
  // Handle simple cases like "1d8+4" or "2d6"
  const match = diceNotation.match(/(\d+)d(\d+)(?:\s*([+-])\s*(\d+))?/);
  if (!match) {
    // If it's just a number, return it
    const num = parseFloat(diceNotation);
    return isNaN(num) ? 0 : num;
  }
  
  const [, count, sides, operator, modifier] = match;
  const diceAverage = parseInt(count) * (parseInt(sides) + 1) / 2;
  const mod = modifier ? parseInt(modifier) : 0;
  
  if (operator === '-') {
    return diceAverage - mod;
  } else {
    return diceAverage + mod;
  }
}

/**
 * Calculate damage with Great Weapon Fighting rerolls
 */
export function averageDamageGWF(diceNotation: string): number {
  const match = diceNotation.match(/(\d+)d(\d+)(?:\s*([+-])\s*(\d+))?/);
  if (!match) {
    return averageDamage(diceNotation);
  }
  
  const [, count, sides, operator, modifier] = match;
  const diceCount = parseInt(count);
  const diceSides = parseInt(sides);
  const mod = modifier ? parseInt(modifier) : 0;
  
  // GWF only applies to 1s and 2s on damage dice
  let expectedValue = 0;
  for (let i = 1; i <= diceSides; i++) {
    if (i <= 2) {
      // Reroll 1s and 2s, take average of new roll
      expectedValue += (diceSides + 1) / 2;
    } else {
      expectedValue += i;
    }
  }
  expectedValue = (expectedValue / diceSides) * diceCount;
  
  if (operator === '-') {
    return expectedValue - mod;
  } else {
    return expectedValue + mod;
  }
}

/**
 * Calculate expected damage per hit
 */
export function expectedDamagePerHit(
  baseDamage: string,
  critDamage: string,
  hitChance: number,
  critChance: number,
  greatWeaponFighting: boolean = false
): number {
  const avgBase = greatWeaponFighting 
    ? averageDamageGWF(baseDamage) 
    : averageDamage(baseDamage);
  const avgCrit = greatWeaponFighting 
    ? averageDamageGWF(critDamage) 
    : averageDamage(critDamage);
  
  const nonCritHitChance = hitChance - critChance;
  return (nonCritHitChance * avgBase) + (critChance * avgCrit);
}

/**
 * Apply Sharpshooter/Great Weapon Master calculation
 */
export function calculateSSGWM(
  baseAttackBonus: number,
  baseDamageHit: string,
  baseDamageCrit: string,
  targetAC: number,
  advantage: 'normal' | 'advantage' | 'disadvantage' = 'normal',
  _featType: 'sharpshooter' | 'gwm' = 'sharpshooter'
): {
  normal: { hitChance: number; dpr: number };
  withFeat: { hitChance: number; dpr: number };
  optimal: 'normal' | 'withFeat';
} {
  // Normal attack
  const normalHitChance = hitProbability(baseAttackBonus, targetAC, advantage);
  const normalCritChance = critProbability(20, advantage);
  const normalDPR = expectedDamagePerHit(
    baseDamageHit, 
    baseDamageCrit, 
    normalHitChance, 
    normalCritChance
  );
  
  // With SS/GWM (-5 to hit, +10 damage)
  const featHitChance = hitProbability(baseAttackBonus - 5, targetAC, advantage);
  const featDamageHit = addToDamage(baseDamageHit, 10);
  const featDamageCrit = addToDamage(baseDamageCrit, 10);
  const featDPR = expectedDamagePerHit(
    featDamageHit, 
    featDamageCrit, 
    featHitChance, 
    normalCritChance
  );
  
  return {
    normal: { hitChance: normalHitChance, dpr: normalDPR },
    withFeat: { hitChance: featHitChance, dpr: featDPR },
    optimal: featDPR > normalDPR ? 'withFeat' : 'normal'
  };
}

/**
 * Add flat damage to a dice notation
 */
function addToDamage(diceNotation: string, bonus: number): string {
  const match = diceNotation.match(/(\d+d\d+)(?:\s*([+-])\s*(\d+))?/);
  if (!match) {
    const num = parseFloat(diceNotation);
    return isNaN(num) ? diceNotation : `${num + bonus}`;
  }
  
  const [, dice, operator, modifier] = match;
  const currentMod = modifier ? parseInt(modifier) : 0;
  const newMod = operator === '-' ? currentMod - bonus : currentMod + bonus;
  
  if (newMod === 0) {
    return dice;
  } else if (newMod > 0) {
    return `${dice}+${newMod}`;
  } else {
    return `${dice}${newMod}`;
  }
}

// Import hitProbability and critProbability from probability module
import { hitProbability, critProbability } from './probability';