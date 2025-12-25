/**
 * Game State Serialization/Deserialization
 * Requirements: 10.1, 10.2, 10.3
 * 
 * Provides functions to serialize game state to JSON and deserialize back,
 * enabling game progress to be saved and restored.
 */

import {
    GameState,
    SerializedGameState,
    SerializedCapsule,
    Capsule,
    Vector3D,
    CapsuleRarity,
    GamePhase,
    ClawState,
    ControlMode,
    GAME_DURATION_SECONDS,
} from '../types';

const SERIALIZATION_VERSION = '1.0.0';

/**
 * Validates that a value is a valid CapsuleRarity
 */
function isValidRarity(rarity: string): rarity is CapsuleRarity {
    return rarity === 'common' || rarity === 'rare' || rarity === 'epic';
}

/**
 * Validates that a value is a valid GamePhase
 */
function isValidGamePhase(phase: string): phase is GamePhase {
    return ['idle', 'calibrating', 'playing', 'grabbing', 'releasing', 'results'].includes(phase);
}

/**
 * Validates that a value is a valid ClawState
 */
function isValidClawState(state: string): state is ClawState {
    return ['hovering', 'descending', 'ascending', 'holding'].includes(state);
}

/**
 * Validates that a value is a valid ControlMode
 */
function isValidControlMode(mode: string): mode is ControlMode {
    return mode === 'gesture' || mode === 'default';
}

/**
 * Validates a Vector3D object
 */
function isValidVector3D(obj: unknown): obj is Vector3D {
    if (typeof obj !== 'object' || obj === null) return false;
    const v = obj as Record<string, unknown>;
    return (
        typeof v.x === 'number' &&
        typeof v.y === 'number' &&
        typeof v.z === 'number' &&
        isFinite(v.x) &&
        isFinite(v.y) &&
        isFinite(v.z)
    );
}

/**
 * Validates a SerializedCapsule object
 */
function isValidSerializedCapsule(obj: unknown): obj is SerializedCapsule {
    if (typeof obj !== 'object' || obj === null) return false;
    const c = obj as Record<string, unknown>;
    return (
        typeof c.id === 'string' &&
        typeof c.x === 'number' &&
        typeof c.y === 'number' &&
        typeof c.z === 'number' &&
        typeof c.rarity === 'string' &&
        isValidRarity(c.rarity) &&
        isFinite(c.x) &&
        isFinite(c.y) &&
        isFinite(c.z)
    );
}

/**
 * Serializes the current game state to a SerializedGameState object.
 * 
 * @param gameState - The current game state to serialize
 * @param capsules - Array of capsules in the game
 * @returns SerializedGameState object ready for JSON conversion
 */
export function serializeGameState(
    gameState: GameState,
    capsules: Capsule[]
): SerializedGameState {
    const serializedCapsules: SerializedCapsule[] = capsules.map((capsule) => ({
        id: capsule.id,
        x: capsule.position.x,
        y: capsule.position.y,
        z: capsule.position.z,
        rarity: capsule.rarity,
    }));

    return {
        version: SERIALIZATION_VERSION,
        timestamp: Date.now(),
        score: gameState.score,
        timeRemaining: gameState.timeRemaining,
        capsules: serializedCapsules,
        clawPosition: {
            x: gameState.clawPosition.x,
            y: gameState.clawPosition.y,
            z: gameState.clawPosition.z,
        },
    };
}

/**
 * Converts a SerializedGameState to a JSON string.
 * 
 * @param serializedState - The serialized game state
 * @returns JSON string representation
 */
export function serializeToJSON(serializedState: SerializedGameState): string {
    return JSON.stringify(serializedState);
}

/**
 * Parses a JSON string into a SerializedGameState object.
 * Validates the structure and throws an error if invalid.
 * 
 * @param json - JSON string to parse
 * @returns Parsed and validated SerializedGameState
 * @throws Error if JSON is invalid or structure doesn't match
 */
export function deserializeFromJSON(json: string): SerializedGameState {
    let parsed: unknown;

    try {
        parsed = JSON.parse(json);
    } catch {
        throw new Error('Invalid JSON: Unable to parse game state');
    }

    if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Invalid game state: Expected an object');
    }

    const obj = parsed as Record<string, unknown>;

    // Validate required fields
    if (typeof obj.version !== 'string') {
        throw new Error('Invalid game state: Missing or invalid version');
    }

    if (typeof obj.timestamp !== 'number' || !isFinite(obj.timestamp)) {
        throw new Error('Invalid game state: Missing or invalid timestamp');
    }

    if (typeof obj.score !== 'number' || !isFinite(obj.score) || obj.score < 0) {
        throw new Error('Invalid game state: Missing or invalid score');
    }

    if (
        typeof obj.timeRemaining !== 'number' ||
        !isFinite(obj.timeRemaining) ||
        obj.timeRemaining < 0 ||
        obj.timeRemaining > GAME_DURATION_SECONDS
    ) {
        throw new Error('Invalid game state: Missing or invalid timeRemaining');
    }

    if (!isValidVector3D(obj.clawPosition)) {
        throw new Error('Invalid game state: Missing or invalid clawPosition');
    }

    if (!Array.isArray(obj.capsules)) {
        throw new Error('Invalid game state: Missing or invalid capsules array');
    }

    // Validate each capsule
    for (let i = 0; i < obj.capsules.length; i++) {
        if (!isValidSerializedCapsule(obj.capsules[i])) {
            throw new Error(`Invalid game state: Invalid capsule at index ${i}`);
        }
    }

    return {
        version: obj.version,
        timestamp: obj.timestamp,
        score: obj.score,
        timeRemaining: obj.timeRemaining,
        capsules: obj.capsules as SerializedCapsule[],
        clawPosition: obj.clawPosition as Vector3D,
    };
}

/**
 * Restores capsule data from serialized state.
 * Note: Physics bodies and meshes must be recreated separately.
 * 
 * @param serializedCapsules - Array of serialized capsule data
 * @returns Array of Capsule objects (without physics bodies or meshes)
 */
export function deserializeCapsules(
    serializedCapsules: SerializedCapsule[]
): Capsule[] {
    return serializedCapsules.map((sc) => {
        const rarity = isValidRarity(sc.rarity) ? sc.rarity : 'common';

        // Determine glow color based on rarity
        const glowColors: Record<CapsuleRarity, number> = {
            common: 0x00ff00,  // Green
            rare: 0x0088ff,    // Blue
            epic: 0xff00ff,    // Purple/Pink
        };

        return {
            id: sc.id,
            body: null,  // Must be recreated by physics system
            mesh: null,  // Must be recreated by rendering system
            rarity,
            position: { x: sc.x, y: sc.y, z: sc.z },
            isGrabbed: false,
            glowColor: glowColors[rarity],
        };
    });
}

/**
 * Creates a partial GameState from serialized data.
 * Some fields like grabbedCapsule must be restored separately.
 * 
 * @param serializedState - The serialized game state
 * @returns Partial game state that can be merged with defaults
 */
export function deserializeGameState(
    serializedState: SerializedGameState
): Partial<GameState> {
    return {
        score: serializedState.score,
        timeRemaining: serializedState.timeRemaining,
        clawPosition: { ...serializedState.clawPosition },
        // These fields need to be set based on game context:
        // phase, controlMode, clawState, grabbedCapsule, consecutiveFailures
    };
}

/**
 * Convenience function to serialize game state directly to JSON string.
 * 
 * @param gameState - The current game state
 * @param capsules - Array of capsules in the game
 * @returns JSON string of serialized game state
 */
export function gameStateToJSON(
    gameState: GameState,
    capsules: Capsule[]
): string {
    const serialized = serializeGameState(gameState, capsules);
    return serializeToJSON(serialized);
}

/**
 * Convenience function to deserialize JSON directly to game state components.
 * 
 * @param json - JSON string to parse
 * @returns Object containing partial game state and capsules
 */
export function jsonToGameState(json: string): {
    gameState: Partial<GameState>;
    capsules: Capsule[];
} {
    const serialized = deserializeFromJSON(json);
    return {
        gameState: deserializeGameState(serialized),
        capsules: deserializeCapsules(serialized.capsules),
    };
}
