/**
 * Neon Claw Game - Timer Manager
 * Requirements: 6.1, 6.2
 * 
 * Implements 30-second countdown timer with MM:SS format display.
 * Property 10: Timer Format Display
 */

import { GAME_DURATION_SECONDS } from '../types';

/**
 * Timer Manager Interface
 */
export interface TimerManager {
    /** Start the timer countdown */
    start: () => void;
    /** Stop/pause the timer */
    stop: () => void;
    /** Reset timer to initial duration */
    reset: () => void;
    /** Update timer by delta time (in seconds) */
    update: (delta: number) => void;
    /** Get remaining time in seconds */
    getTimeRemaining: () => number;
    /** Get formatted time string (MM:SS) */
    getFormattedTime: () => string;
    /** Check if timer has expired */
    isExpired: () => boolean;
    /** Check if timer is in warning zone (<=10 seconds) */
    isWarning: () => boolean;
    /** Set callback for timer expiration */
    onExpire: (callback: () => void) => void;
}

/**
 * Timer Manager State
 */
interface TimerManagerState {
    timeRemaining: number;
    isRunning: boolean;
    expireCallback: (() => void) | null;
}

/**
 * Format time in seconds to MM:SS string
 * Requirements: 6.2
 * Property 10: Timer Format Display
 * 
 * @param seconds - Time in seconds (0-30)
 * @returns Formatted string in MM:SS format with zero-padding
 */
export function formatTime(seconds: number): string {
    // Clamp to valid range
    const clampedSeconds = Math.max(0, Math.min(seconds, GAME_DURATION_SECONDS));

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(clampedSeconds / 60);
    const remainingSeconds = Math.floor(clampedSeconds % 60);

    // Zero-pad both values
    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${paddedMinutes}:${paddedSeconds}`;
}

/**
 * Creates a new TimerManager instance
 * 
 * @param initialDuration - Initial duration in seconds (default: 30)
 * @returns TimerManager instance
 */
export function createTimerManager(initialDuration: number = GAME_DURATION_SECONDS): TimerManager {
    const state: TimerManagerState = {
        timeRemaining: initialDuration,
        isRunning: false,
        expireCallback: null,
    };

    return {
        /**
         * Start the timer countdown
         * Requirements: 6.1
         */
        start(): void {
            state.isRunning = true;
        },

        /**
         * Stop/pause the timer
         */
        stop(): void {
            state.isRunning = false;
        },

        /**
         * Reset timer to initial duration
         * Requirements: 6.1
         */
        reset(): void {
            state.timeRemaining = initialDuration;
            state.isRunning = false;
        },

        /**
         * Update timer by delta time
         * 
         * @param delta - Time elapsed in seconds
         */
        update(delta: number): void {
            if (!state.isRunning) return;

            state.timeRemaining = Math.max(0, state.timeRemaining - delta);

            // Trigger expire callback when timer reaches zero
            if (state.timeRemaining <= 0 && state.expireCallback) {
                state.isRunning = false;
                state.expireCallback();
            }
        },

        /**
         * Get remaining time in seconds
         * 
         * @returns Remaining time in seconds
         */
        getTimeRemaining(): number {
            return state.timeRemaining;
        },

        /**
         * Get formatted time string (MM:SS)
         * Requirements: 6.2
         * Property 10: Timer Format Display
         * 
         * @returns Formatted time string
         */
        getFormattedTime(): string {
            return formatTime(state.timeRemaining);
        },

        /**
         * Check if timer has expired
         * 
         * @returns true if time remaining is 0
         */
        isExpired(): boolean {
            return state.timeRemaining <= 0;
        },

        /**
         * Check if timer is in warning zone (<=10 seconds)
         * Requirements: 6.3
         * 
         * @returns true if time remaining is 10 seconds or less
         */
        isWarning(): boolean {
            return state.timeRemaining <= 10 && state.timeRemaining > 0;
        },

        /**
         * Set callback for timer expiration
         * Requirements: 6.4
         * 
         * @param callback - Function to call when timer expires
         */
        onExpire(callback: () => void): void {
            state.expireCallback = callback;
        },
    };
}

/**
 * Default TimerManager instance for singleton usage
 */
export const defaultTimerManager = createTimerManager();

/**
 * Warning threshold in seconds
 */
export const TIMER_WARNING_THRESHOLD = 10;
