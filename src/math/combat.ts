/**
 * Combat simulation and calculation utilities
 */

import type { Build, Scenario, AttackProfile } from '../types';
import { hitProbability, critProbability } from './probability';
import { expectedDamagePerHit, calculateSSGWM } from './damage';

/**
 * Calculate 3-round DPR for a build
 */
export function calculateThreeRoundDPR(
  build: Build,
  scenario: Scenario,
  profile: AttackProfile
): {
  dpr: number;
  critRate: number;
  riderUsage: number;
  explanation: string;
} {
  // TODO: Implement full 3-round DPR calculation
  // For now, return basic single-round calculation
  
  const attackBonus = calculateAttackBonus(build, profile);
  const hitChance = hitProbability(attackBonus, scenario.enemy.ac, scenario.advantage);
  const critChance = critProbability(profile.critRange, scenario.advantage);
  
  const dpr = expectedDamagePerHit(
    profile.damageHit,
    profile.damageCrit,
    hitChance,
    critChance
  );
  
  return {
    dpr,
    critRate: critChance,
    riderUsage: 0.5, // Placeholder
    explanation: `Basic DPR calculation for ${profile.name}`
  };
}

/**
 * Calculate DPR vs AC across a range
 */
export function calculateDPRvsAC(
  build: Build,
  profile: AttackProfile,
  acRange: [number, number] = [10, 25]
): Array<{
  ac: number;
  normalDPR: number;
  featDPR?: number;
  optimal: 'normal' | 'feat';
}> {
  const results = [];
  const attackBonus = calculateAttackBonus(build, profile);
  
  for (let ac = acRange[0]; ac <= acRange[1]; ac++) {
    const hitChance = hitProbability(attackBonus, ac);
    const critChance = critProbability(profile.critRange);
    
    const normalDPR = expectedDamagePerHit(
      profile.damageHit,
      profile.damageCrit,
      hitChance,
      critChance
    );
    
    let featDPR;
    let optimal: 'normal' | 'feat' = 'normal';
    
    // Check if build has SS/GWM
    if (build.feats.includes('Sharpshooter') || build.feats.includes('Great Weapon Master')) {
      const featType = build.feats.includes('Sharpshooter') ? 'sharpshooter' : 'gwm';
      const ssGwmResult = calculateSSGWM(
        attackBonus,
        profile.damageHit,
        profile.damageCrit,
        ac,
        'normal',
        featType
      );
      
      featDPR = ssGwmResult.withFeat.dpr;
      optimal = ssGwmResult.optimal === 'withFeat' ? 'feat' : 'normal';
    }
    
    results.push({
      ac,
      normalDPR,
      featDPR,
      optimal
    });
  }
  
  return results;
}

/**
 * Calculate attack bonus for a build and profile
 */
function calculateAttackBonus(build: Build, profile: AttackProfile): number {
  // Basic calculation - would be more complex in full implementation
  let bonus = build.proficiency;
  
  // Add ability modifier based on attack type
  if (profile.type === 'weapon') {
    // Assume DEX for ranged, STR for melee (simplified)
    bonus += Math.max(build.abilities.STR, build.abilities.DEX);
  }
  
  // Add fighting style bonus
  if (build.features.fightingStyle === 'Archery' && profile.type === 'weapon') {
    bonus += 2;
  }
  
  return bonus;
}

/**
 * Calculate time to kill for a target HP pool
 */
export function calculateTimeToKill(
  dpr: number,
  targetHP: number
): {
  expectedRounds: number;
  probability95: number;
  probability99: number;
} {
  const expectedRounds = targetHP / dpr;
  
  // Simplified probability calculations
  // In full implementation, would use proper probability distributions
  return {
    expectedRounds,
    probability95: expectedRounds * 1.5,
    probability99: expectedRounds * 2.0
  };
}