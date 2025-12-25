/**
 * Neon Claw Game - Zustand Store
 * Requirements: 1.1
 * 
 * Central state management for the game using Zustand.
 * Implements all game state actions including startGame, moveClaw, triggerGrab, etc.
 */

import { create } from 'zustand';
import {
    GameState,
    GameStateActions,
    ControlMode,
    GamePhase,
    ClawState,
    Capsule,
    Vector3D,
    GAME_DURATION_SECONDS,
    DEFAULT_PHYSICS_CONFIG,
    DEFAULT_CLAW_CONFIG,
} from '../types';

// Initial claw position (centered, at top)
const INITIAL_CLAW_POSITION: Vector3D = {
    x: 0,
    y: DEFAULT_PHYSICS_CONFIG.machineBounds.maxY - 0.5,
    z: 0,
};

// Initial game state
const initialGameState: GameState = {
    phase: 'idle',
    controlMode: 'default',
    score: 0,
    timeRemaining: GAME_DURATION_SECONDS,
    clawPosition: { ...INITIAL_CLAW_POSITION },
    clawState: 'hovering',
    grabbedCapsule: null,
    consecutiveFailures: 0,
};

// Extended store interface with internal helpers
interface GameStore extends GameState, GameStateActions {
    // Internal state
    capsules: Capsule[];
    isHandDetected: boolean;

    // Internal actions
    setCapsules: (capsules: Capsule[]) => void;
    setHandDetected: (detected: boolean) => void;
    setClawState: (state: ClawState) => void;
    setPhase: (phase: GamePhase) => void;
    setGrabbedCapsule: (capsule: Capsule | null) => void;
    incrementScore: () => void;
    incrementConsecutiveFailures: () => void;
    resetConsecutiveFailures: () => void;
    updateClawPosition: (position: Partial<Vector3D>) => void;
    updateCapsulePosition: (id: string, position: Vector3D) => void;
    removeCapsule: (id: string) => void;
}

/**
 * Clamps a value between min and max bounds
 */
function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Applies linear interpolation between current and target values
 */
function lerp(current: number, target: number, factor: number): number {
    return current + (target - current) * factor;
}

export const useGameStore = create<GameStore>((set, get) => ({
    // Initial state
    ...initialGameState,
    capsules: [],
    isHandDetected: false,

    // Game lifecycle actions
    startGame: () => {
        const { controlMode } = get();
        set({
            phase: controlMode === 'gesture' ? 'calibrating' : 'playing',
            score: 0,
            timeRemaining: GAME_DURATION_SECONDS,
            clawPosition: { ...INITIAL_CLAW_POSITION },
            clawState: 'hovering',
            grabbedCapsule: null,
            consecutiveFailures: 0,
        });
    },

    setControlMode: (mode: ControlMode) => {
        set({ controlMode: mode });
    },

    moveClaw: (targetX: number, targetZ: number) => {
        const state = get();

        // Debug log
        console.log('[gameStore] moveClaw called:', { targetX, targetZ, phase: state.phase, clawState: state.clawState });

        // Allow movement when:
        // 1. Playing phase and hovering (normal movement)
        // 2. Holding state (moving with grabbed capsule)
        const canMove =
            (state.phase === 'playing' && state.clawState === 'hovering') ||
            state.clawState === 'holding';

        if (!canMove) {
            console.log('[gameStore] moveClaw blocked - phase:', state.phase, 'clawState:', state.clawState);
            return;
        }

        const { machineBounds } = DEFAULT_PHYSICS_CONFIG;
        const { lerpFactor } = DEFAULT_CLAW_CONFIG;

        // Clamp target to machine bounds
        const clampedX = clamp(targetX, machineBounds.minX, machineBounds.maxX);
        const clampedZ = clamp(targetZ, machineBounds.minZ, machineBounds.maxZ);

        // Apply lerp smoothing
        const newX = lerp(state.clawPosition.x, clampedX, lerpFactor);
        const newZ = lerp(state.clawPosition.z, clampedZ, lerpFactor);

        console.log('[gameStore] moveClaw updating position:', { newX, newZ });

        set({
            clawPosition: {
                ...state.clawPosition,
                x: newX,
                z: newZ,
            },
        });
    },

    triggerGrab: () => {
        const state = get();

        // Only allow grab when playing and hovering
        if (state.phase !== 'playing' || state.clawState !== 'hovering') {
            return;
        }

        set({
            phase: 'grabbing',
            clawState: 'descending',
        });
    },

    triggerRelease: () => {
        const state = get();

        // Allow release when holding a capsule (clawState is 'holding')
        if (state.clawState !== 'holding' || !state.grabbedCapsule) {
            console.log('[gameStore] triggerRelease blocked - clawState:', state.clawState, 'grabbedCapsule:', state.grabbedCapsule?.id);
            return;
        }

        console.log('[gameStore] triggerRelease - releasing capsule');
        // Set phase back to 'playing' so player can grab again
        set({
            phase: 'playing',
            clawState: 'hovering',
            grabbedCapsule: null,
        });
    },

    updateTimer: (delta: number) => {
        const state = get();

        // Only update timer during active gameplay
        if (state.phase !== 'playing' && state.phase !== 'grabbing' && state.phase !== 'releasing') {
            return;
        }

        const newTime = Math.max(0, state.timeRemaining - delta);

        set({ timeRemaining: newTime });

        // End game when timer reaches zero
        if (newTime <= 0) {
            get().endGame();
        }
    },

    endGame: () => {
        set({
            phase: 'results',
            clawState: 'hovering',
            grabbedCapsule: null,
        });
    },

    resetGame: () => {
        set({
            ...initialGameState,
            capsules: get().capsules, // Preserve capsules for respawn
        });
    },

    // Internal actions
    setCapsules: (capsules: Capsule[]) => {
        set({ capsules });
    },

    setHandDetected: (detected: boolean) => {
        const state = get();
        set({ isHandDetected: detected });

        // Transition from calibrating to playing when hand is detected
        if (detected && state.phase === 'calibrating') {
            set({ phase: 'playing' });
        }
    },

    setClawState: (clawState: ClawState) => {
        set({ clawState });
    },

    setPhase: (phase: GamePhase) => {
        set({ phase });
    },

    setGrabbedCapsule: (capsule: Capsule | null) => {
        set({ grabbedCapsule: capsule });
    },

    incrementScore: () => {
        set((state) => ({ score: state.score + 1 }));
    },

    incrementConsecutiveFailures: () => {
        set((state) => ({ consecutiveFailures: state.consecutiveFailures + 1 }));
    },

    resetConsecutiveFailures: () => {
        set({ consecutiveFailures: 0 });
    },

    updateClawPosition: (position: Partial<Vector3D>) => {
        set((state) => ({
            clawPosition: {
                ...state.clawPosition,
                ...position,
            },
        }));
    },

    updateCapsulePosition: (id: string, position: Vector3D) => {
        set((state) => ({
            capsules: state.capsules.map((c) =>
                c.id === id ? { ...c, position } : c
            ),
        }));
    },

    removeCapsule: (id: string) => {
        console.log('[gameStore] Removing capsule:', id);
        set((state) => ({
            capsules: state.capsules.filter((c) => c.id !== id),
        }));
    },
}));

// Selector hooks for optimized re-renders
export const useGamePhase = () => useGameStore((state) => state.phase);
export const useGameScore = () => useGameStore((state) => state.score);
export const useTimeRemaining = () => useGameStore((state) => state.timeRemaining);
export const useClawPosition = () => useGameStore((state) => state.clawPosition);
export const useClawState = () => useGameStore((state) => state.clawState);
export const useControlMode = () => useGameStore((state) => state.controlMode);
export const useIsHandDetected = () => useGameStore((state) => state.isHandDetected);
export const useGrabbedCapsule = () => useGameStore((state) => state.grabbedCapsule);
export const useConsecutiveFailures = () => useGameStore((state) => state.consecutiveFailures);
