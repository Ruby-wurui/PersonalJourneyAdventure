/**
 * Neon Claw Game - TypeScript Type Definitions
 * Requirements: 1.1, 5.1, 10.1
 */

import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// ============================================
// Enums
// ============================================

export type GamePhase =
    | 'idle'
    | 'calibrating'
    | 'playing'
    | 'grabbing'
    | 'releasing'
    | 'results';

export type ClawState =
    | 'hovering'
    | 'descending'
    | 'ascending'
    | 'holding';

export type ControlMode = 'gesture' | 'default';

export type CapsuleRarity = 'common' | 'rare' | 'epic';

export type GestureType = 'palm' | 'fist' | 'unknown';

// ============================================
// Core Game Interfaces
// ============================================

export interface Vector3D {
    x: number;
    y: number;
    z: number;
}

export interface Vector2D {
    x: number;
    y: number;
}

export interface GameState {
    phase: GamePhase;
    controlMode: ControlMode;
    score: number;
    timeRemaining: number;
    clawPosition: Vector3D;
    clawState: ClawState;
    grabbedCapsule: Capsule | null;
    consecutiveFailures: number;
}

export interface GameStateActions {
    startGame: () => void;
    setControlMode: (mode: ControlMode) => void;
    moveClaw: (targetX: number, targetZ: number) => void;
    triggerGrab: () => void;
    triggerRelease: () => void;
    updateTimer: (delta: number) => void;
    endGame: () => void;
    resetGame: () => void;
}

// ============================================
// Capsule Interfaces
// ============================================

export interface Capsule {
    id: string;
    body: CANNON.Body | null;
    mesh: THREE.Mesh | null;
    rarity: CapsuleRarity;
    position: Vector3D;
    isGrabbed: boolean;
    glowColor: number;
}

export interface CapsuleConfig {
    count: number;
    radius: number;
    rarityDistribution: {
        common: number;
        rare: number;
        epic: number;
    };
}

// ============================================
// Hand Tracking Interfaces
// ============================================

export interface HandTrackerConfig {
    maxNumHands: number;
    modelComplexity: number;
    minDetectionConfidence: number;
    minTrackingConfidence: number;
}

export interface HandTrackingResult {
    detected: boolean;
    gesture: GestureType;
    palmCenter: Vector2D | null;
    confidence: number;
}

export interface HandTracker {
    initialize: (videoElement: HTMLVideoElement) => Promise<void>;
    onResult: (callback: (result: HandTrackingResult) => void) => void;
    start: () => void;
    stop: () => void;
}

// ============================================
// Claw Controller Interfaces
// ============================================

export interface ClawConfig {
    maxSpeed: number;
    lerpFactor: number;
    deadzone: number;
    descentSpeed: number;
    ascentSpeed: number;
    clawOpenAngle: number;
    clawCloseAngle: number;
}

export interface ClawController {
    setTargetPosition: (x: number, z: number) => void;
    descend: () => void;
    ascend: () => void;
    openClaw: () => void;
    closeClaw: () => void;
    getPosition: () => Vector3D;
    getState: () => ClawState;
    getMesh: () => THREE.Group;
}

// ============================================
// Loot Table Interfaces
// ============================================

export interface LootTableConfig {
    baseSuccessRate: number;
    pityThreshold: number;
    pityBonus: number;
}

export interface LootTable {
    calculateSuccess: (consecutiveFailures: number) => boolean;
    getSuccessRate: (consecutiveFailures: number) => number;
}

// ============================================
// Physics Interfaces
// ============================================

export interface PhysicsConfig {
    gravity: Vector3D;
    capsuleCount: number;
    capsuleRadius: number;
    machineBounds: MachineBounds;
}

export interface MachineBounds {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
}

export interface PhysicsManager {
    initialize: (config: PhysicsConfig) => void;
    update: (delta: number) => void;
    getCapsules: () => Capsule[];
    attachCapsuleToClaw: (capsule: Capsule) => void;
    detachCapsule: () => void;
    getWorld: () => CANNON.World;
}

// ============================================
// Scene Interfaces
// ============================================

export interface SceneConfig {
    backgroundColor: number;
    neonColors: {
        pink: number;
        cyan: number;
    };
    bloomStrength: number;
    glitchIntensity: number;
}

export interface SceneManager {
    initialize: (canvas: HTMLCanvasElement) => void;
    addMesh: (mesh: THREE.Object3D) => void;
    removeMesh: (mesh: THREE.Object3D) => void;
    updateLighting: (clawPosition: THREE.Vector3) => void;
    triggerScreenShake: (intensity: number) => void;
    triggerGlitchEffect: () => void;
    render: () => void;
}

// ============================================
// Audio Interfaces
// ============================================

export interface AudioManager {
    playBGM: () => void;
    stopBGM: () => void;
    playServoSound: () => void;
    playGrabSound: () => void;
    playSuccessSound: () => void;
    playFailSound: () => void;
    playCollisionSound: () => void;
    setVolume: (volume: number) => void;
}

// ============================================
// Session Interfaces
// ============================================

export interface GameSession {
    id: string;
    startTime: number;
    endTime: number | null;
    score: number;
    capsulesCaught: Capsule[];
    controlMode: ControlMode;
}

// ============================================
// Serialization Interfaces
// ============================================

export interface SerializedCapsule {
    id: string;
    x: number;
    y: number;
    z: number;
    rarity: string;
}

export interface SerializedGameState {
    version: string;
    timestamp: number;
    score: number;
    timeRemaining: number;
    capsules: SerializedCapsule[];
    clawPosition: Vector3D;
}

// ============================================
// UI/HUD Interfaces
// ============================================

export interface HUDState {
    score: number;
    timeRemaining: number;
    handDetected: boolean;
    currentPrompt: string;
}

export interface ContextualPrompts {
    idle: string;
    calibrating: string;
    playing: string;
    grabbing: string;
    releasing: string;
    results: string;
}

// ============================================
// Constants
// ============================================

export const DEFAULT_CLAW_CONFIG: ClawConfig = {
    maxSpeed: 8,
    lerpFactor: 0.5,  // Increased from 0.1 for faster response
    deadzone: 0.01,   // Reduced deadzone for more sensitivity
    descentSpeed: 3,
    ascentSpeed: 2,
    clawOpenAngle: Math.PI / 6,
    clawCloseAngle: 0,
};

export const DEFAULT_LOOT_TABLE_CONFIG: LootTableConfig = {
    baseSuccessRate: 0.3,
    pityThreshold: 5,
    pityBonus: 0.1,
};

export const DEFAULT_PHYSICS_CONFIG: PhysicsConfig = {
    gravity: { x: 0, y: -9.82, z: 0 },
    capsuleCount: 15,
    capsuleRadius: 0.3,
    machineBounds: {
        minX: -2,
        maxX: 2,
        minY: 0,
        maxY: 4,
        minZ: -2,
        maxZ: 2,
    },
};

export const DEFAULT_SCENE_CONFIG: SceneConfig = {
    backgroundColor: 0x4a4a6a, // Light purple-gray background
    neonColors: {
        pink: 0xff00ff,
        cyan: 0x00ffff,
    },
    bloomStrength: 1.5,
    glitchIntensity: 0.3,
};

export const GAME_DURATION_SECONDS = 180;

export const CONTEXTUAL_PROMPTS: ContextualPrompts = {
    idle: 'Select a mode to start',
    calibrating: 'Raise your hand to calibrate',
    playing: 'Open palm to move, fist to grab',
    grabbing: 'Hold steady...',
    releasing: 'Release over the drop zone!',
    results: 'Game Over!',
};
