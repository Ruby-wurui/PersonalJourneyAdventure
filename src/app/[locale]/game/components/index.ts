/**
 * Neon Claw Game - Components Index
 * 
 * Exports all game components for easy importing.
 */

export { ClawMachineScene } from './ClawMachineScene';
export { ClawMachineEnclosure } from './ClawMachineEnclosure';
export { DropZone, DROP_ZONE_BOUNDS } from './DropZone';
export { NeonLighting } from './NeonLighting';
export { Claw } from './Claw';
export type { ClawRef } from './Claw';
export { ClawController } from './ClawController';
export { PhysicsWorld } from './PhysicsWorld';
export { Capsule } from './Capsule';
export { CapsulePool } from './CapsulePool';
export { ClawPhysics } from './ClawPhysics';

// Post-processing effects
export { PostProcessingEffects, DEFAULT_POST_PROCESSING_CONFIG } from './PostProcessingEffects';
export type { PostProcessingEffectsRef, PostProcessingConfig } from './PostProcessingEffects';

// Screen shake effect
export { ScreenShake, DEFAULT_SCREEN_SHAKE_CONFIG } from './ScreenShake';
export type { ScreenShakeRef, ScreenShakeConfig } from './ScreenShake';

// Particle effects
export { ParticleEffects, DEFAULT_PARTICLE_CONFIG } from './ParticleEffects';
export type { ParticleEffectsRef, ParticleConfig } from './ParticleEffects';

// HUD Components
export { HUDOverlay, ScoreDisplay, TimerDisplay, StatusIndicator } from './HUD';
export type { HUDOverlayProps } from './HUD';

// Contextual Prompt
export { ContextualPrompt, AnimatedPrompt, getPromptForPhase } from './ContextualPrompt';
export type { ContextualPromptProps } from './ContextualPrompt';

// Webcam Picture-in-Picture
export { WebcamPiP } from './WebcamPiP';
export type { WebcamPiPProps, HandLandmark } from './WebcamPiP';

// Audio Provider
export { AudioProvider, useAudioContext, AudioInitButton, AudioMuteButton } from './AudioProvider';
