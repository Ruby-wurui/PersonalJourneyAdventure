/**
 * Game Library Exports
 */

export {
    serializeGameState,
    serializeToJSON,
    deserializeFromJSON,
    deserializeCapsules,
    deserializeGameState,
    gameStateToJSON,
    jsonToGameState,
} from './serialization';

export {
    LootTableManager,
    createLootTable,
    defaultLootTable,
} from './lootTable';

export {
    lerp,
    applyDeadzone,
    clampVelocity,
    clamp,
    clampToBounds,
    isWithinBounds,
    calculateClawPosition,
    mapNormalizedToClawPosition,
} from './clawMovement';

export {
    HandTrackerManager,
    createHandTracker,
    extractPalmCenter,
    classifyGesture,
    createDebounceState,
    updateDebounceState,
    detectReleaseTransition,
    DEFAULT_HAND_TRACKER_CONFIG,
    FIST_DEBOUNCE_FRAMES,
} from './handTracker';

export type {
    GestureDebounceState,
    HandTrackingCallback,
} from './handTracker';

export {
    createScoreManager,
    checkDropZoneCollision,
    defaultScoreManager,
} from './scoreManager';

export type {
    ScoreManager,
} from './scoreManager';

export {
    createTimerManager,
    formatTime,
    defaultTimerManager,
    TIMER_WARNING_THRESHOLD,
} from './timerManager';

export type {
    TimerManager,
} from './timerManager';

export {
    GameStateMachine,
    createGameStateMachine,
    getContextualPrompt,
    validateContextualPrompts,
} from './gameStateMachine';

export type {
    GameStateMachineState,
    GameStateMachineCallbacks,
    GameStateMachineConfig,
} from './gameStateMachine';

export {
    AudioManagerImpl,
    createAudioManager,
    getAudioManager,
    resetAudioManager,
} from './audioManager';

export type {
    AudioManagerConfig,
    AudioManagerState,
} from './audioManager';
