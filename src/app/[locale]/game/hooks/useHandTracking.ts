/**
 * Neon Claw Game - Hand Tracking Hook
 * Requirements: 2.4, 3.1
 * 
 * React hook that integrates MediaPipe hand tracking with the game store.
 * Maps palm coordinates to 3D claw position with lerp smoothing.
 * 
 * Property 1: Palm Coordinate to Claw Position Mapping
 * Property 4: Claw Movement with Lerp Smoothing
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import {
    HandTrackerManager,
    createHandTracker,
    mapNormalizedToClawPosition,
    lerp,
} from '../lib';
import {
    HandTrackingResult,
    DEFAULT_PHYSICS_CONFIG,
    DEFAULT_CLAW_CONFIG,
} from '../types';

export interface UseHandTrackingOptions {
    /** Enable/disable hand tracking */
    enabled?: boolean;
    /** Lerp factor for position smoothing (0-1) */
    lerpFactor?: number;
    /** Padding from machine bounds */
    boundsPadding?: number;
}

export interface UseHandTrackingResult {
    /** Whether hand tracking is initialized */
    isInitialized: boolean;
    /** Whether a hand is currently detected */
    isHandDetected: boolean;
    /** Current gesture type */
    currentGesture: 'palm' | 'fist' | 'unknown';
    /** Detection confidence (0-1) */
    confidence: number;
    /** Initialize hand tracking with video element */
    initialize: (videoElement: HTMLVideoElement) => Promise<void>;
    /** Start hand tracking */
    start: () => void;
    /** Stop hand tracking */
    stop: () => void;
    /** Dispose of hand tracker resources */
    dispose: () => void;
}

/**
 * Hook for integrating hand tracking with the game.
 * 
 * Maps palm X coordinate to claw X-axis position.
 * Maps palm Y coordinate to claw Z-axis (depth) position.
 * Applies lerp smoothing for smooth movement.
 */
export function useHandTracking(
    options: UseHandTrackingOptions = {}
): UseHandTrackingResult {
    const {
        enabled = true,
        lerpFactor = DEFAULT_CLAW_CONFIG.lerpFactor,
        boundsPadding = 0.3,
    } = options;

    const trackerRef = useRef<HandTrackerManager | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isHandDetected, setIsHandDetected] = useState(false);
    const [currentGesture, setCurrentGesture] = useState<'palm' | 'fist' | 'unknown'>('unknown');
    const [confidence, setConfidence] = useState(0);

    // Smoothed position for lerp
    const smoothedPositionRef = useRef<{ x: number; z: number } | null>(null);

    // Store options in ref to always have latest values in callback
    const optionsRef = useRef({ enabled, lerpFactor, boundsPadding });
    optionsRef.current = { enabled, lerpFactor, boundsPadding };

    // Game store actions
    const moveClaw = useGameStore((state) => state.moveClaw);
    const triggerGrab = useGameStore((state) => state.triggerGrab);
    const triggerRelease = useGameStore((state) => state.triggerRelease);
    const setHandDetected = useGameStore((state) => state.setHandDetected);
    const phase = useGameStore((state) => state.phase);
    const controlMode = useGameStore((state) => state.controlMode);

    /**
     * Handles hand tracking results.
     * Maps palm coordinates to claw position with lerp smoothing.
     * Uses refs to always access latest state values.
     */
    const handleTrackingResult = useCallback(
        (result: HandTrackingResult & { triggerGrab?: boolean; triggerRelease?: boolean }) => {
            // Update detection state
            setIsHandDetected(result.detected);
            setCurrentGesture(result.gesture);
            setConfidence(result.confidence);
            setHandDetected(result.detected);

            // Get current values from store (real-time, not from closure)
            const currentControlMode = useGameStore.getState().controlMode;
            const currentPhase = useGameStore.getState().phase;
            const { enabled: currentEnabled, lerpFactor: currentLerpFactor, boundsPadding: currentBoundsPadding } = optionsRef.current;

            // Only log when hand is detected (to avoid console spam)
            if (result.detected) {
                console.log('[useHandTracking] Hand detected:', {
                    gesture: result.gesture,
                    palmCenter: result.palmCenter,
                    currentPhase,
                });
            }

            // Only process if in gesture mode and enabled
            if (currentControlMode !== 'gesture' || !currentEnabled) {
                return;
            }

            // Handle grab trigger (from debounce logic)
            if (result.triggerGrab && currentPhase === 'playing') {
                console.log('[useHandTracking] Triggering grab');
                triggerGrab();
            }

            // Handle release trigger (from fist-to-palm transition)
            if (result.triggerRelease && currentPhase === 'grabbing') {
                console.log('[useHandTracking] Triggering release');
                triggerRelease();
            }

            // Map palm position to claw position
            if (result.detected && result.palmCenter && currentPhase === 'playing') {
                // Map normalized palm coordinates to claw position
                // Note: Palm X maps to claw X, Palm Y maps to claw Z (depth)
                const targetPosition = mapNormalizedToClawPosition(
                    // Mirror X axis (webcam is mirrored)
                    1 - result.palmCenter.x,
                    result.palmCenter.y,
                    DEFAULT_PHYSICS_CONFIG.machineBounds,
                    currentBoundsPadding
                );

                // Apply lerp smoothing with higher factor for faster response
                const fastLerpFactor = Math.min(currentLerpFactor * 2, 0.8);

                if (smoothedPositionRef.current === null) {
                    // Initialize smoothed position
                    smoothedPositionRef.current = targetPosition;
                } else {
                    // Apply lerp for smooth movement
                    smoothedPositionRef.current = {
                        x: lerp(smoothedPositionRef.current.x, targetPosition.x, fastLerpFactor),
                        z: lerp(smoothedPositionRef.current.z, targetPosition.z, fastLerpFactor),
                    };
                }

                // Update claw position
                moveClaw(smoothedPositionRef.current.x, smoothedPositionRef.current.z);
            }
        },
        [moveClaw, triggerGrab, triggerRelease, setHandDetected]
    );

    /**
     * Initialize hand tracking with video element.
     */
    const initialize = useCallback(async (videoElement: HTMLVideoElement) => {
        if (trackerRef.current) {
            trackerRef.current.dispose();
        }

        const tracker = createHandTracker();
        trackerRef.current = tracker;

        tracker.onResult(handleTrackingResult);
        await tracker.initialize(videoElement);
        setIsInitialized(true);

        // Start tracking immediately after initialization
        tracker.start();
    }, [handleTrackingResult]);

    /**
     * Start hand tracking.
     */
    const start = useCallback(() => {
        console.log('[useHandTracking] start() called, trackerRef:', !!trackerRef.current);
        if (trackerRef.current) {
            trackerRef.current.start();
        }
    }, []);

    /**
     * Stop hand tracking.
     */
    const stop = useCallback(() => {
        if (trackerRef.current) {
            trackerRef.current.stop();
        }
    }, []);

    /**
     * Dispose of hand tracker resources.
     */
    const dispose = useCallback(() => {
        if (trackerRef.current) {
            trackerRef.current.dispose();
            trackerRef.current = null;
        }
        setIsInitialized(false);
        smoothedPositionRef.current = null;
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            dispose();
        };
    }, [dispose]);

    // Reset smoothed position when game restarts
    useEffect(() => {
        if (phase === 'idle' || phase === 'calibrating') {
            smoothedPositionRef.current = null;
        }
    }, [phase]);

    return {
        isInitialized,
        isHandDetected,
        currentGesture,
        confidence,
        initialize,
        start,
        stop,
        dispose,
    };
}

export default useHandTracking;
