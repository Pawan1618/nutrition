import { expect, test, describe } from 'vitest';
import { calculateLevel, calculateNextLevelXP } from '../utils/xp';

describe('XP Utilities', () => {
    describe('calculateLevel', () => {
        test('should start at level 1 with 0 XP', () => {
            expect(calculateLevel(0)).toBe(1);
        });

        test('should be level 1 at 99 XP', () => {
            expect(calculateLevel(99)).toBe(1);
        });

        test('should reach level 2 at 100 XP', () => {
            expect(calculateLevel(100)).toBe(2);
        });

        test('should reach level 3 at 400 XP', () => {
            expect(calculateLevel(400)).toBe(3);
        });

        test('should handle high XP values correctly', () => {
            expect(calculateLevel(10000)).toBe(11); // sqrt(100) + 1 = 11
        });
    });

    describe('calculateNextLevelXP', () => {
        test('should calculate XP for level 1 correctly', () => {
            expect(calculateNextLevelXP(1)).toBe(100);
        });

        test('should calculate XP for level 2 correctly', () => {
            expect(calculateNextLevelXP(2)).toBe(400);
        });

        test('should calculate XP for level 10 correctly', () => {
            expect(calculateNextLevelXP(10)).toBe(10000);
        });
    });
});
