import { describe, it, expect } from 'vitest';
import { 
  hitProbability, 
  critProbability, 
  elvenAccuracyProbability,
  hitProbabilityWithModifier,
  oncePerTurnAllocation 
} from '../../math/probability';

describe('Probability Calculations', () => {
  describe('hitProbability', () => {
    it('should calculate basic hit probability correctly', () => {
      // Need 11+ to hit AC 16 with +5 attack bonus
      expect(hitProbability(5, 16)).toBeCloseTo(0.5); // 50%
      
      // Always hit on natural 20
      expect(hitProbability(-10, 30)).toBeCloseTo(0.05); // 5%
      
      // Always miss on natural 1
      expect(hitProbability(30, 10)).toBeCloseTo(0.95); // 95%
    });

    it('should handle advantage correctly', () => {
      // With advantage, probability should be higher
      const normal = hitProbability(5, 16, 'normal');
      const advantage = hitProbability(5, 16, 'advantage');
      const disadvantage = hitProbability(5, 16, 'disadvantage');
      
      expect(advantage).toBeGreaterThan(normal);
      expect(disadvantage).toBeLessThan(normal);
      
      // Advantage: 1 - (1 - 0.5)^2 = 0.75
      expect(advantage).toBeCloseTo(0.75);
      
      // Disadvantage: 0.5^2 = 0.25
      expect(disadvantage).toBeCloseTo(0.25);
    });
  });

  describe('critProbability', () => {
    it('should calculate crit probability with different crit ranges', () => {
      // Standard crit range (20)
      expect(critProbability(20)).toBeCloseTo(0.05); // 5%
      
      // Expanded crit range (19-20)
      expect(critProbability(19)).toBeCloseTo(0.10); // 10%
      
      // Champion fighter (18-20)
      expect(critProbability(18)).toBeCloseTo(0.15); // 15%
    });

    it('should handle advantage with crits', () => {
      const normal = critProbability(20, 'normal');
      const advantage = critProbability(20, 'advantage');
      
      expect(advantage).toBeGreaterThan(normal);
      // 1 - (1 - 0.05)^2 = 1 - 0.9025 = 0.0975
      expect(advantage).toBeCloseTo(0.0975);
    });
  });

  describe('elvenAccuracyProbability', () => {
    it('should calculate triple advantage hit probability', () => {
      const normal = hitProbability(5, 16, 'normal');
      const advantage = hitProbability(5, 16, 'advantage');
      const elvenAdvantage = elvenAccuracyProbability(5, 16, 'hit');
      
      expect(elvenAdvantage).toBeGreaterThan(advantage);
      expect(elvenAdvantage).toBeGreaterThan(normal);
      
      // 1 - (0.5)^3 = 0.875
      expect(elvenAdvantage).toBeCloseTo(0.875);
    });

    it('should calculate triple advantage crit probability', () => {
      const normal = critProbability(20, 'normal');
      const advantage = critProbability(20, 'advantage');
      const elvenAdvantage = elvenAccuracyProbability(5, 16, 'crit', 20);
      
      expect(elvenAdvantage).toBeGreaterThan(advantage);
      expect(elvenAdvantage).toBeGreaterThan(normal);
    });
  });

  describe('hitProbabilityWithModifier', () => {
    it('should apply Bless bonus correctly', () => {
      const normal = hitProbability(5, 16);
      const withBless = hitProbabilityWithModifier(5, 16, '1d4', 'bonus');
      
      expect(withBless).toBeGreaterThan(normal);
    });

    it('should apply Bane penalty correctly', () => {
      const normal = hitProbability(5, 16);
      const withBane = hitProbabilityWithModifier(5, 16, '1d4', 'penalty');
      
      expect(withBane).toBeLessThan(normal);
    });
  });

  describe('oncePerTurnAllocation', () => {
    it('should calculate allocation probabilities for multiple attacks', () => {
      const attacks = [
        { hitChance: 0.6, critChance: 0.05 },
        { hitChance: 0.6, critChance: 0.05 }
      ];
      
      const result = oncePerTurnAllocation(attacks);
      
      expect(result.firstHitIsCrit).toBe(0.05);
      expect(result.atLeastOneHit).toBeCloseTo(0.84); // 1 - 0.4 * 0.4
      expect(result.atLeastOneCrit).toBeCloseTo(0.0975); // 1 - 0.95 * 0.95
    });

    it('should handle empty attack array', () => {
      const result = oncePerTurnAllocation([]);
      
      expect(result.firstHitIsCrit).toBe(0);
      expect(result.atLeastOneHit).toBe(0);
      expect(result.atLeastOneCrit).toBe(0);
    });
  });
});