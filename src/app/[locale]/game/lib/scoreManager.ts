/**
 * Neon Claw Game - Score Manager
 * Requirements: 5.1, 5.2
 * 
 * Implements drop zone collision detection and score increment logic.
 * Property 9: Score Increment on Drop Zone Entry
 */

import { Vector3D } from '../types';
import { DROP_ZONE_BOUNDS } from '../components/DropZone';

/**
 * Score Manager Interface
 */
export interface ScoreManager {
    /** Check if a position is within the drop zone */
    isInDropZone: (position: Vector3D) => boolean;
    /** Get the current score */
    getScore: () => number;
    /** Increment score by 1 when capsule enters drop zone */
    incrementScore: () => void;
    /** Reset score to 0 */
    resetScore: () => void;
    /** Get count of capsules that entered drop zone */
    getCapsuleCount: () => number;
}

/**
 * Score Manager State
 */
interface ScoreManagerState {
    score: number;
    capsuleCount: number;
}

/**
 * Creates a new ScoreManager instance
 * 
 * @returns ScoreManager instance
 */
export function createScoreManager(): ScoreManager {
    const state: ScoreManagerState = {
        score: 0,
        capsuleCount: 0,
    };

    return {
        /**
         * Check if a position is within the drop zone bounds
         * Requirements: 5.1
         * 
         * @param position - The 3D position to check
         * @returns true if position is within drop zone
         */
        isInDropZone(position: Vector3D): boolean {
            return (
                position.x >= DROP_ZONE_BOUNDS.minX &&
                position.x <= DROP_ZONE_BOUNDS.maxX &&
                position.y >= DROP_ZONE_BOUNDS.minY &&
                position.y <= DROP_ZONE_BOUNDS.maxY &&
                position.z >= DROP_ZONE_BOUNDS.minZ &&
                position.z <= DROP_ZONE_BOUNDS.maxZ
            );
        },

        /**
         * Get the current score
         * 
         * @returns Current score value
         */
        getScore(): number {
            return state.score;
        },

        /**
         * Increment score by 1
         * Requirements: 5.2
         * Property 9: Score SHALL increase by exactly 1 for each capsule
         */
        incrementScore(): void {
            state.score += 1;
            state.capsuleCount += 1;
        },

        /**
         * Reset score to 0
         */
        resetScore(): void {
            state.score = 0;
            state.capsuleCount = 0;
        },

        /**
         * Get count of capsules that entered drop zone
         * Property 9: Total score SHALL equal count of capsules
         * 
         * @returns Number of capsules that entered drop zone
         */
        getCapsuleCount(): number {
            return state.capsuleCount;
        },
    };
}

/**
 * Check if a capsule position is within the drop zone
 * Standalone utility function for use in components
 * 
 * @param position - The 3D position to check
 * @returns true if position is within drop zone
 */
export function checkDropZoneCollision(position: Vector3D): boolean {
    return (
        position.x >= DROP_ZONE_BOUNDS.minX &&
        position.x <= DROP_ZONE_BOUNDS.maxX &&
        position.y >= DROP_ZONE_BOUNDS.minY &&
        position.y <= DROP_ZONE_BOUNDS.maxY &&
        position.z >= DROP_ZONE_BOUNDS.minZ &&
        position.z <= DROP_ZONE_BOUNDS.maxZ
    );
}

/**
 * Default ScoreManager instance for singleton usage
 */
export const defaultScoreManager = createScoreManager();
