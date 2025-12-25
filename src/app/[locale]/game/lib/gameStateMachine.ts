/**
 * Neon Claw Game - Game State Machine
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.4, 6.5, 8.4
 * 
 * Implements state transitions and integrates all game managers:
 * - ClawController integration
 * - LootTable for grab probability
 * - ScoreManager for scoring
 * - TimerManager for countdown
 * 
 * State Flow: idle → calibrating → playing → grabbing → releasing → results
 */

import {
    GamePhase,
    ControlMode,
    ClawState,
    Capsule,
    Vector3D,
    GAME_DURATION_SECONDS,
    CONTEXTUAL_PROMPTS,
    ContextualPrompts,
} from '../types';
import { LootTableManager, createLootTable } from './lootTable';
import { ScoreManager, createScoreManager } from './scoreManager';
import { TimerManager, createTimerManager } from './timerManager';

/**
 * Valid state transitions map
 * Defines which transitions are allowed from each state
 */
const VALID_TRANSITIONS: Record<GamePhase, GamePhase[]> = {
    idle: ['calibrating', 'playing'],
    calibrating: ['playing', 'idle'],
    playing: ['grabbing', 'results', 'idle'],
    grabbing: ['releasing', 'playing', 'results'],
    releasing: ['playing', 'results'],
    results: ['idle'],
};

/**
 * Game State Machine State
 */
export interface GameStateMachineState {
    phase: GamePhase;
    controlMode: ControlMode;
    score: number;
    timeRemaining: number;
    clawPosition: Vector3D;
    clawState: ClawState;
    grabbedCapsule: Capsule | null;
    consecutiveFailures: number;
    isHandDetected: boolean;
    currentPrompt: string;
}

/**
 * Game State Machine Event Callbacks
 */
export interface GameStateMachineCallbacks {
    onPhaseChange?: (phase: GamePhase, previousPhase: GamePhase) => void;
    onScoreChange?: (score: number) => void;
    onTimerUpdate?: (timeRemaining: number) => void;
    onTimerExpire?: () => void;
    onGrabResult?: (success: boolean) => void;
    onPromptChange?: (prompt: string) => void;
}

/**
 * Game State Machine Configuration
 */
export interface GameStateMachineConfig {
    gameDuration?: number;
    lootTableConfig?: {
        baseSuccessRate?: number;
        pityThreshold?: number;
        pityBonus?: number;
    };
    initialClawPosition?: Vector3D;
}

/**
 * Default initial claw position
 */
const DEFAULT_CLAW_POSITION: Vector3D = {
    x: 0,
    y: 3.5,
    z: 0,
};


/**
 * GameStateMachine Class
 * 
 * Central controller for game state transitions and manager integration.
 * Implements the state machine pattern for game flow control.
 */
export class GameStateMachine {
    private state: GameStateMachineState;
    private callbacks: GameStateMachineCallbacks;
    private lootTable: LootTableManager;
    private scoreManager: ScoreManager;
    private timerManager: TimerManager;
    private prompts: ContextualPrompts;

    constructor(
        config: GameStateMachineConfig = {},
        callbacks: GameStateMachineCallbacks = {}
    ) {
        const {
            gameDuration = GAME_DURATION_SECONDS,
            lootTableConfig = {},
            initialClawPosition = DEFAULT_CLAW_POSITION,
        } = config;

        // Initialize managers
        this.lootTable = createLootTable(lootTableConfig);
        this.scoreManager = createScoreManager();
        this.timerManager = createTimerManager(gameDuration);
        this.callbacks = callbacks;
        this.prompts = { ...CONTEXTUAL_PROMPTS };

        // Initialize state
        this.state = {
            phase: 'idle',
            controlMode: 'default',
            score: 0,
            timeRemaining: gameDuration,
            clawPosition: { ...initialClawPosition },
            clawState: 'hovering',
            grabbedCapsule: null,
            consecutiveFailures: 0,
            isHandDetected: false,
            currentPrompt: this.prompts.idle,
        };

        // Set up timer expiration callback
        this.timerManager.onExpire(() => {
            this.handleTimerExpire();
        });
    }

    // ============================================
    // State Getters
    // ============================================

    getState(): GameStateMachineState {
        return { ...this.state };
    }

    getPhase(): GamePhase {
        return this.state.phase;
    }

    getScore(): number {
        return this.state.score;
    }

    getTimeRemaining(): number {
        return this.state.timeRemaining;
    }

    getClawPosition(): Vector3D {
        return { ...this.state.clawPosition };
    }

    getClawState(): ClawState {
        return this.state.clawState;
    }

    getControlMode(): ControlMode {
        return this.state.controlMode;
    }

    getCurrentPrompt(): string {
        return this.state.currentPrompt;
    }

    getConsecutiveFailures(): number {
        return this.state.consecutiveFailures;
    }

    isHandDetected(): boolean {
        return this.state.isHandDetected;
    }

    // ============================================
    // State Transition Methods
    // ============================================

    /**
     * Check if a transition is valid
     */
    private isValidTransition(from: GamePhase, to: GamePhase): boolean {
        return VALID_TRANSITIONS[from]?.includes(to) ?? false;
    }

    /**
     * Transition to a new phase
     * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
     */
    private transitionTo(newPhase: GamePhase): boolean {
        const previousPhase = this.state.phase;

        if (!this.isValidTransition(previousPhase, newPhase)) {
            console.warn(
                `Invalid state transition: ${previousPhase} → ${newPhase}`
            );
            return false;
        }

        this.state.phase = newPhase;
        this.updatePrompt(newPhase);

        // Notify callback
        this.callbacks.onPhaseChange?.(newPhase, previousPhase);

        return true;
    }

    /**
     * Update the contextual prompt based on current phase
     * Requirements: 8.4
     * Property 11: Contextual Prompts for Game States
     */
    private updatePrompt(phase: GamePhase): void {
        const newPrompt = this.prompts[phase];
        if (newPrompt !== this.state.currentPrompt) {
            this.state.currentPrompt = newPrompt;
            this.callbacks.onPromptChange?.(newPrompt);
        }
    }

    // ============================================
    // Game Lifecycle Methods
    // ============================================

    /**
     * Set control mode before starting game
     * Requirements: 1.2, 1.5
     */
    setControlMode(mode: ControlMode): void {
        if (this.state.phase !== 'idle') {
            console.warn('Cannot change control mode while game is active');
            return;
        }
        this.state.controlMode = mode;
    }

    /**
     * Start the game
     * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
     */
    startGame(): void {
        if (this.state.phase !== 'idle') {
            console.warn('Game already started');
            return;
        }

        // Reset managers
        this.scoreManager.resetScore();
        this.timerManager.reset();

        // Reset state
        this.state.score = 0;
        this.state.timeRemaining = this.timerManager.getTimeRemaining();
        this.state.consecutiveFailures = 0;
        this.state.grabbedCapsule = null;
        this.state.clawState = 'hovering';

        // Transition based on control mode
        if (this.state.controlMode === 'gesture') {
            // Gesture mode: go to calibrating first
            this.transitionTo('calibrating');
        } else {
            // Default mode: go directly to playing
            this.transitionTo('playing');
            this.timerManager.start();
        }
    }

    /**
     * Handle hand detection status change
     * Requirements: 1.3
     */
    setHandDetected(detected: boolean): void {
        this.state.isHandDetected = detected;

        // Transition from calibrating to playing when hand is detected
        if (detected && this.state.phase === 'calibrating') {
            this.transitionTo('playing');
            this.timerManager.start();
        }
    }

    /**
     * Handle webcam permission denied
     * Requirements: 1.4
     */
    handleWebcamDenied(): void {
        if (this.state.phase === 'calibrating') {
            // Fall back to default mode
            this.state.controlMode = 'default';
            this.transitionTo('playing');
            this.timerManager.start();
        }
    }

    /**
     * End the game
     * Requirements: 6.4, 6.5
     */
    endGame(): void {
        this.timerManager.stop();
        this.state.clawState = 'hovering';
        this.state.grabbedCapsule = null;
        this.transitionTo('results');
    }

    /**
     * Handle timer expiration
     * Requirements: 6.4
     */
    private handleTimerExpire(): void {
        this.callbacks.onTimerExpire?.();
        this.endGame();
    }

    /**
     * Reset game to idle state
     */
    resetGame(): void {
        this.timerManager.stop();
        this.timerManager.reset();
        this.scoreManager.resetScore();

        this.state = {
            ...this.state,
            phase: 'idle',
            score: 0,
            timeRemaining: this.timerManager.getTimeRemaining(),
            clawState: 'hovering',
            grabbedCapsule: null,
            consecutiveFailures: 0,
            isHandDetected: false,
            currentPrompt: this.prompts.idle,
        };

        this.callbacks.onPhaseChange?.('idle', 'results');
    }

    // ============================================
    // Claw Control Methods
    // ============================================

    /**
     * Update claw position
     */
    updateClawPosition(position: Partial<Vector3D>): void {
        this.state.clawPosition = {
            ...this.state.clawPosition,
            ...position,
        };
    }

    /**
     * Set claw state
     */
    setClawState(clawState: ClawState): void {
        this.state.clawState = clawState;
    }

    /**
     * Trigger grab action
     */
    triggerGrab(): void {
        if (this.state.phase !== 'playing' || this.state.clawState !== 'hovering') {
            return;
        }

        this.transitionTo('grabbing');
        this.state.clawState = 'descending';
    }

    /**
     * Handle grab attempt result (called when claw contacts capsule)
     */
    handleGrabAttempt(capsule: Capsule): boolean {
        const success = this.lootTable.calculateSuccess(this.state.consecutiveFailures);

        if (success) {
            this.state.grabbedCapsule = capsule;
            this.state.clawState = 'holding';
            this.state.consecutiveFailures = 0;
        } else {
            this.state.consecutiveFailures++;
        }

        this.callbacks.onGrabResult?.(success);
        return success;
    }

    /**
     * Complete grab sequence (claw finished ascending)
     */
    completeGrab(): void {
        if (this.state.grabbedCapsule) {
            this.state.clawState = 'holding';
        } else {
            this.state.clawState = 'hovering';
            this.transitionTo('playing');
        }
    }

    /**
     * Trigger release action
     */
    triggerRelease(): void {
        if (this.state.clawState !== 'holding' || !this.state.grabbedCapsule) {
            return;
        }

        this.transitionTo('releasing');
        this.state.clawState = 'hovering';
        this.state.grabbedCapsule = null;
    }

    /**
     * Complete release sequence
     */
    completeRelease(): void {
        this.transitionTo('playing');
    }

    // ============================================
    // Scoring Methods
    // ============================================

    /**
     * Handle capsule entering drop zone
     * Requirements: 5.1, 5.2
     */
    handleDropZoneEntry(): void {
        this.scoreManager.incrementScore();
        this.state.score = this.scoreManager.getScore();
        this.callbacks.onScoreChange?.(this.state.score);
    }

    // ============================================
    // Timer Methods
    // ============================================

    /**
     * Update timer (call each frame)
     */
    updateTimer(delta: number): void {
        if (
            this.state.phase !== 'playing' &&
            this.state.phase !== 'grabbing' &&
            this.state.phase !== 'releasing'
        ) {
            return;
        }

        this.timerManager.update(delta);
        this.state.timeRemaining = this.timerManager.getTimeRemaining();
        this.callbacks.onTimerUpdate?.(this.state.timeRemaining);
    }

    /**
     * Check if timer is in warning zone
     */
    isTimerWarning(): boolean {
        return this.timerManager.isWarning();
    }

    /**
     * Get formatted time string
     */
    getFormattedTime(): string {
        return this.timerManager.getFormattedTime();
    }

    // ============================================
    // Manager Access
    // ============================================

    getLootTable(): LootTableManager {
        return this.lootTable;
    }

    getScoreManager(): ScoreManager {
        return this.scoreManager;
    }

    getTimerManager(): TimerManager {
        return this.timerManager;
    }

    // ============================================
    // Prompt Customization
    // ============================================

    /**
     * Set custom prompts
     * Requirements: 8.4
     */
    setPrompts(prompts: Partial<ContextualPrompts>): void {
        this.prompts = {
            ...this.prompts,
            ...prompts,
        };
        // Update current prompt if phase matches
        this.updatePrompt(this.state.phase);
    }

    /**
     * Get prompt for a specific phase
     * Property 11: Contextual Prompts for Game States
     */
    getPromptForPhase(phase: GamePhase): string {
        return this.prompts[phase];
    }
}

/**
 * Create a new GameStateMachine instance
 */
export function createGameStateMachine(
    config?: GameStateMachineConfig,
    callbacks?: GameStateMachineCallbacks
): GameStateMachine {
    return new GameStateMachine(config, callbacks);
}

/**
 * Get contextual prompt for a game phase
 * Property 11: Contextual Prompts for Game States
 * For any game state, there SHALL exist a corresponding non-empty prompt message.
 * 
 * @param phase - The game phase
 * @returns The prompt message for that phase
 */
export function getContextualPrompt(phase: GamePhase): string {
    return CONTEXTUAL_PROMPTS[phase];
}

/**
 * Check if all phases have non-empty prompts
 * Property 11 validation helper
 */
export function validateContextualPrompts(prompts: ContextualPrompts): boolean {
    const phases: GamePhase[] = ['idle', 'calibrating', 'playing', 'grabbing', 'releasing', 'results'];
    return phases.every(phase => {
        const prompt = prompts[phase];
        return typeof prompt === 'string' && prompt.length > 0;
    });
}
