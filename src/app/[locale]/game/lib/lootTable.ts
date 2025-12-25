/**
 * Neon Claw Game - Loot Table with Pity System
 * Requirements: 4.2, 4.5
 * 
 * Implements probability-controlled grab mechanics with a pity system
 * that guarantees success after consecutive failures.
 */

import { LootTableConfig, LootTable, DEFAULT_LOOT_TABLE_CONFIG } from '../types';

/**
 * LootTableManager implements the probability system for grab success.
 * 
 * Key features:
 * - Base success rate (default 30%)
 * - Pity bonus that increases success rate per consecutive failure
 * - Guaranteed success (100%) after reaching pity threshold (default 5 fails)
 * 
 * **Feature: neon-claw-game, Property 8: Pity System Guarantee**
 * For any number of consecutive grab failures >= 5, the Loot_Table SHALL 
 * return success (100% probability) on the next grab attempt.
 */
export class LootTableManager implements LootTable {
    private config: LootTableConfig;

    constructor(config: Partial<LootTableConfig> = {}) {
        this.config = {
            ...DEFAULT_LOOT_TABLE_CONFIG,
            ...config,
        };
    }

    /**
     * Calculate the success rate based on consecutive failures.
     * 
     * Formula:
     * - If consecutiveFailures >= pityThreshold: return 1.0 (100%)
     * - Otherwise: baseSuccessRate + (consecutiveFailures * pityBonus)
     * - Result is clamped to [0, 1]
     * 
     * @param consecutiveFailures - Number of consecutive failed grab attempts
     * @returns Success rate as a decimal between 0 and 1
     */
    getSuccessRate(consecutiveFailures: number): number {
        // Ensure non-negative failures
        const failures = Math.max(0, consecutiveFailures);

        // Pity guarantee: 100% success after threshold
        if (failures >= this.config.pityThreshold) {
            return 1.0;
        }

        // Calculate rate with pity bonus
        const rate = this.config.baseSuccessRate + (failures * this.config.pityBonus);

        // Clamp to valid probability range [0, 1]
        return Math.min(1.0, Math.max(0, rate));
    }

    /**
     * Determine if a grab attempt succeeds based on probability.
     * 
     * Uses the calculated success rate to make a random determination.
     * When pity threshold is reached, always returns true.
     * 
     * @param consecutiveFailures - Number of consecutive failed grab attempts
     * @returns true if grab succeeds, false otherwise
     */
    calculateSuccess(consecutiveFailures: number): boolean {
        const successRate = this.getSuccessRate(consecutiveFailures);

        // Pity guarantee - always succeed at 100%
        if (successRate >= 1.0) {
            return true;
        }

        // Random roll against success rate
        return Math.random() < successRate;
    }

    /**
     * Get the current configuration.
     * Useful for debugging and testing.
     */
    getConfig(): LootTableConfig {
        return { ...this.config };
    }

    /**
     * Update configuration at runtime.
     * @param newConfig - Partial configuration to merge
     */
    updateConfig(newConfig: Partial<LootTableConfig>): void {
        this.config = {
            ...this.config,
            ...newConfig,
        };
    }
}

/**
 * Create a default LootTable instance with standard configuration.
 * - 30% base success rate
 * - 10% bonus per consecutive failure
 * - 100% guaranteed after 5 failures
 */
export function createLootTable(config?: Partial<LootTableConfig>): LootTableManager {
    return new LootTableManager(config);
}

/**
 * Default singleton instance for convenience.
 */
export const defaultLootTable = new LootTableManager();
