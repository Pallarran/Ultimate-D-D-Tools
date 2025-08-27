import { describe, it, expect } from 'vitest';
import { 
  averageDamage, 
  averageDamageGWF, 
  expectedDamagePerHit,
  calculateSSGWM 
} from '../../math/damage';

describe('Damage Calculations', () => {
  describe('averageDamage', () => {
    it('should calculate average damage for simple dice', () => {
      expect(averageDamage('1d8')).toBeCloseTo(4.5);
      expect(averageDamage('2d6')).toBeCloseTo(7);
      expect(averageDamage('1d12')).toBeCloseTo(6.5);
    });

    it('should handle modifiers', () => {
      expect(averageDamage('1d8+4')).toBeCloseTo(8.5);
      expect(averageDamage('2d6-1')).toBeCloseTo(6);
      expect(averageDamage('1d4 + 2')).toBeCloseTo(4.5);
    });

    it('should handle flat numbers', () => {
      expect(averageDamage('5')).toBe(5);
      expect(averageDamage('10')).toBe(10);
    });
  });

  describe('averageDamageGWF', () => {
    it('should calculate GWF rerolls correctly', () => {
      // For 1d8, rerolling 1s and 2s:
      // Normal: (1+2+3+4+5+6+7+8)/8 = 4.5
      // GWF: (4.5+4.5+3+4+5+6+7+8)/8 = 5.25
      expect(averageDamageGWF('1d8')).toBeCloseTo(5.25);
      
      // For 1d12: 
      // GWF: (6.5+6.5+3+4+5+6+7+8+9+10+11+12)/12 = 7.33...
      expect(averageDamageGWF('1d12')).toBeCloseTo(7.33, 1);
    });

    it('should handle modifiers with GWF', () => {
      expect(averageDamageGWF('1d8+4')).toBeCloseTo(9.25);
    });

    it('should not affect dice that cannot be rerolled', () => {
      // d4 and smaller dice don't benefit from GWF rerolls as much
      const normal = averageDamage('1d4');
      const gwf = averageDamageGWF('1d4');
      expect(gwf).toBeGreaterThan(normal);
    });
  });

  describe('expectedDamagePerHit', () => {
    it('should calculate expected damage correctly', () => {
      const hitChance = 0.6;
      const critChance = 0.05;
      const baseDamage = '1d8+4'; // 8.5 average
      const critDamage = '2d8+4'; // 13 average
      
      const expected = expectedDamagePerHit(
        baseDamage, 
        critDamage, 
        hitChance, 
        critChance
      );
      
      // (0.55 * 8.5) + (0.05 * 13) = 4.675 + 0.65 = 5.325
      expect(expected).toBeCloseTo(5.325);
    });

    it('should handle GWF rerolls', () => {
      const normal = expectedDamagePerHit('1d8+4', '2d8+4', 0.6, 0.05, false);
      const withGWF = expectedDamagePerHit('1d8+4', '2d8+4', 0.6, 0.05, true);
      
      expect(withGWF).toBeGreaterThan(normal);
    });
  });

  describe('calculateSSGWM', () => {
    it('should calculate Sharpshooter trade-offs', () => {
      const result = calculateSSGWM(
        8, // +8 attack bonus
        '1d8+5', // base damage
        '2d8+5', // crit damage
        16 // target AC
      );
      
      expect(result.normal.hitChance).toBeCloseTo(0.65); // Need 8+ on d20
      expect(result.withFeat.hitChance).toBeCloseTo(0.4); // Need 13+ on d20 with -5 penalty
      expect(result.normal.dpr).toBeGreaterThan(0);
      expect(result.withFeat.dpr).toBeGreaterThan(0);
      expect(['normal', 'withFeat']).toContain(result.optimal);
    });

    it('should favor SS/GWM against low AC', () => {
      const result = calculateSSGWM(
        10, // high attack bonus
        '1d8+5',
        '2d8+5',
        12 // low AC
      );
      
      // Against low AC, the +10 damage should be worth the -5 attack penalty
      expect(result.optimal).toBe('withFeat');
    });

    it('should favor normal attacks against high AC', () => {
      const result = calculateSSGWM(
        5, // low attack bonus
        '1d8+5',
        '2d8+5',
        20 // high AC
      );
      
      // Against high AC with low attack bonus, accuracy is more important
      expect(result.optimal).toBe('normal');
    });
  });
});