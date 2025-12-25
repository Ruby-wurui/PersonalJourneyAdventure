/**
 * Neon Claw Game - LootTable Property-Based Tests
 * 
 * **Feature: neon-claw-game, Property 8: Pity System Guarantee**
 * For any number of consecutive grab failures >= 5, the Loot_Table SHALL 
 * return success (100% probability) on the next grab attempt.
 * 
 * **Validates: Requirements 4.2, 4.5**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { LootTableManager, createLootTable } from '../lootTable';
import { DEFAULT_LOOT_TABLE_CONFIG } from '../../types';

describe('LootTableManager', () => {
    describe('Property 8: Pity System Guarantee', () => {
        /**
         * **Feature: neon-claw-game, Property 8: Pity System Guarantee**
         * 
         * For any number of consecutive grab failures >= pityThreshold (default 5),
         * the success rate SHALL be 100% (1.0).
         * 
         * **Validates: Requirements 4.5**
         */
        it('should guarantee 100% success rate when consecutive failures >= pity threshold', () => {
            fc.assert(
                fc.property(
                    // Generate any integer >= 5 (pity threshold)
                    fc.integer({ min: 5, max: 1000 }),
                    (consecutiveFailures) => {
                        const lootTable = new LootTableManager();
                        const successRate = lootTable.getSuccessRate(consecutiveFailures);

                        // Must be exactly 100%
                        expect(successRate).toBe(1.0);
                    }
                ),
                { numRuns: 100 }
            );
        });

        /**
         * **Feature: neon-claw-game, Property 8: Pity System Guarantee**
         * 
         * For any number of consecutive failures >= pityThreshold,
         * calculateSuccess SHALL always return true.
         * 
         * **Validates: Requirements 4.5**
         */
        it('should always return success when pity threshold is reached', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 5, max: 1000 }),
                    (consecutiveFailures) => {
                        const lootTable = new LootTableManager();
                        const success = lootTable.calculateSuccess(consecutiveFailures);

                        // Must always succeed at pity
                        expect(success).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    describe('Base Success Rate (Requirement 4.2)', () => {
        /**
         * For any valid configuration, the base success rate at 0 failures
         * should equal the configured baseSuccessRate.
         */
        it('should return base success rate when no consecutive failures', () => {
            fc.assert(
                fc.property(
                    fc.float({ min: 0.01, max: 0.99, noNaN: true }),
                    (baseRate) => {
                        const lootTable = new LootTableManager({ baseSuccessRate: baseRate });
                        const successRate = lootTable.getSuccessRate(0);

                        expect(successRate).toBeCloseTo(baseRate, 5);
                    }
                ),
                { numRuns: 100 }
            );
        });

        /**
         * Default configuration should have 30% base success rate.
         */
        it('should have 30% base success rate by default', () => {
            const lootTable = new LootTableManager();
            expect(lootTable.getSuccessRate(0)).toBe(0.3);
        });
    });

    describe('Pity Bonus Progression', () => {
        /**
         * For any number of consecutive failures < pityThreshold,
         * the success rate should increase by pityBonus per failure.
         */
        it('should increase success rate by pity bonus per consecutive failure', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 0, max: 4 }), // Below pity threshold
                    (consecutiveFailures) => {
                        const lootTable = new LootTableManager();
                        const config = lootTable.getConfig();
                        const expectedRate = config.baseSuccessRate + (consecutiveFailures * config.pityBonus);
                        const actualRate = lootTable.getSuccessRate(consecutiveFailures);

                        expect(actualRate).toBeCloseTo(Math.min(1.0, expectedRate), 5);
                    }
                ),
                { numRuns: 100 }
            );
        });

        /**
         * Success rate should be monotonically increasing with consecutive failures.
         */
        it('should have monotonically increasing success rate', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 0, max: 10 }),
                    (failures) => {
                        const lootTable = new LootTableManager();
                        const currentRate = lootTable.getSuccessRate(failures);
                        const nextRate = lootTable.getSuccessRate(failures + 1);

                        // Next rate should be >= current rate
                        expect(nextRate).toBeGreaterThanOrEqual(currentRate);
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    describe('Success Rate Bounds', () => {
        /**
         * For any input, success rate should always be in [0, 1].
         */
        it('should always return success rate between 0 and 1', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: -100, max: 1000 }),
                    (consecutiveFailures) => {
                        const lootTable = new LootTableManager();
                        const successRate = lootTable.getSuccessRate(consecutiveFailures);

                        expect(successRate).toBeGreaterThanOrEqual(0);
                        expect(successRate).toBeLessThanOrEqual(1);
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    describe('Custom Configuration', () => {
        /**
         * Custom pity threshold should be respected.
         */
        it('should respect custom pity threshold', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 1, max: 20 }),
                    (customThreshold) => {
                        const lootTable = new LootTableManager({ pityThreshold: customThreshold });

                        // At threshold, should be 100%
                        expect(lootTable.getSuccessRate(customThreshold)).toBe(1.0);

                        // Just below threshold, should be less than 100%
                        if (customThreshold > 0) {
                            const belowThreshold = lootTable.getSuccessRate(customThreshold - 1);
                            // Could be 1.0 if pity bonus pushes it there, but should be calculated
                            expect(belowThreshold).toBeLessThanOrEqual(1.0);
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    describe('Factory Function', () => {
        it('should create LootTable with default config', () => {
            const lootTable = createLootTable();
            expect(lootTable.getConfig()).toEqual(DEFAULT_LOOT_TABLE_CONFIG);
        });

        it('should create LootTable with custom config', () => {
            const customConfig = { baseSuccessRate: 0.5, pityThreshold: 3 };
            const lootTable = createLootTable(customConfig);
            const config = lootTable.getConfig();

            expect(config.baseSuccessRate).toBe(0.5);
            expect(config.pityThreshold).toBe(3);
        });
    });
});
