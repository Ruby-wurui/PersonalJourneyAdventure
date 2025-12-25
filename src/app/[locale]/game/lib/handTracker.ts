/**
 * Neon Claw Game - Hand Tracker with MediaPipe Integration
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7
 * 
 * Implements hand gesture recognition using MediaPipe Hands:
 * - Palm center coordinate extraction (Property 1)
 * - Gesture classification (palm/fist/unknown)
 * - Fist gesture debounce (Property 2)
 * - Fist-to-palm release detection (Property 3)
 */

import { Hands, Results, NormalizedLandmarkList } from '@mediapipe/hands';
import {
    HandTrackerConfig,
    HandTrackingResult,
    GestureType,
    Vector2D,
} from '../types';

// Default configuration for MediaPipe Hands
export const DEFAULT_HAND_TRACKER_CONFIG: HandTrackerConfig = {
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.3,  // Very low for maximum sensitivity
    minTrackingConfidence: 0.2,   // Very low for maximum sensitivity
};

// Debounce threshold for fist gesture (Property 2)
export const FIST_DEBOUNCE_FRAMES = 2;  // Reduced to 2 for faster response

// Landmark indices for gesture detection
const WRIST = 0;
const THUMB_TIP = 4;
const INDEX_TIP = 8;
const MIDDLE_TIP = 12;
const RING_TIP = 16;
const PINKY_TIP = 20;
const INDEX_MCP = 5;
const MIDDLE_MCP = 9;
const RING_MCP = 13;
const PINKY_MCP = 17;

/**
 * Calculates the palm center from hand landmarks.
 * Uses the average of wrist and MCP joints for stability.
 * 
 * @param landmarks - MediaPipe hand landmarks
 * @returns Palm center coordinates (normalized 0-1)
 */
export function extractPalmCenter(landmarks: NormalizedLandmarkList): Vector2D {
    // Use wrist and MCP joints for palm center calculation
    const palmLandmarks = [
        landmarks[WRIST],
        landmarks[INDEX_MCP],
        landmarks[MIDDLE_MCP],
        landmarks[RING_MCP],
        landmarks[PINKY_MCP],
    ];

    const sumX = palmLandmarks.reduce((sum, lm) => sum + lm.x, 0);
    const sumY = palmLandmarks.reduce((sum, lm) => sum + lm.y, 0);

    return {
        x: sumX / palmLandmarks.length,
        y: sumY / palmLandmarks.length,
    };
}

/**
 * Calculates the distance between two landmarks.
 */
function landmarkDistance(
    lm1: { x: number; y: number },
    lm2: { x: number; y: number }
): number {
    const dx = lm1.x - lm2.x;
    const dy = lm1.y - lm2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Classifies the hand gesture based on finger positions.
 * 
 * Palm: All fingers extended (tips far from palm)
 * Fist: All fingers curled (tips close to palm)
 * Unknown: Ambiguous gesture
 * 
 * @param landmarks - MediaPipe hand landmarks
 * @returns Classified gesture type
 */
export function classifyGesture(landmarks: NormalizedLandmarkList): GestureType {
    const palmCenter = extractPalmCenter(landmarks);

    // Calculate distances from fingertips to palm center
    const indexDist = landmarkDistance(landmarks[INDEX_TIP], palmCenter);
    const middleDist = landmarkDistance(landmarks[MIDDLE_TIP], palmCenter);
    const ringDist = landmarkDistance(landmarks[RING_TIP], palmCenter);
    const pinkyDist = landmarkDistance(landmarks[PINKY_TIP], palmCenter);

    // Also check MCP to fingertip distances for better curl detection
    const indexCurl = landmarkDistance(landmarks[INDEX_TIP], landmarks[INDEX_MCP]);
    const middleCurl = landmarkDistance(landmarks[MIDDLE_TIP], landmarks[MIDDLE_MCP]);
    const ringCurl = landmarkDistance(landmarks[RING_TIP], landmarks[RING_MCP]);
    const pinkyCurl = landmarkDistance(landmarks[PINKY_TIP], landmarks[PINKY_MCP]);

    // Thresholds for gesture classification (normalized coordinates)
    const EXTENDED_THRESHOLD = 0.12;  // Finger is extended if tip is far from palm
    const CURL_LENGTH_THRESHOLD = 0.12; // Finger curl length threshold (increased for easier fist detection)

    // Count extended and curled fingers (excluding thumb for more reliable detection)
    const fingerDistances = [indexDist, middleDist, ringDist, pinkyDist];
    const fingerCurls = [indexCurl, middleCurl, ringCurl, pinkyCurl];

    const extendedCount = fingerDistances.filter(d => d > EXTENDED_THRESHOLD).length;
    const curledCount = fingerCurls.filter(d => d < CURL_LENGTH_THRESHOLD).length;

    // Calculate average distance for adaptive thresholding
    const avgDistance = fingerDistances.reduce((sum, d) => sum + d, 0) / fingerDistances.length;
    const avgCurl = fingerCurls.reduce((sum, d) => sum + d, 0) / fingerCurls.length;

    // Debug logging (can be removed in production)
    console.log('[Gesture Detection]', {
        extendedCount,
        curledCount,
        avgDistance: avgDistance.toFixed(3),
        avgCurl: avgCurl.toFixed(3),
        distances: fingerDistances.map(d => d.toFixed(3)),
        curls: fingerCurls.map(d => d.toFixed(3)),
    });

    // Fist: At least 2 fingers curled OR average curl is small OR average distance is very low
    // Check fist FIRST to prioritize grab action
    if (curledCount >= 2 || avgCurl < 0.11 || avgDistance < 0.11) {
        console.log('[Gesture] ✊ FIST detected');
        return 'fist';
    }

    // Palm: At least 2 fingers extended OR average distance is high
    if (extendedCount >= 2 || avgDistance > 0.13) {
        console.log('[Gesture] ✋ PALM detected');
        return 'palm';
    }

    console.log('[Gesture] ❓ UNKNOWN');
    return 'unknown';
}

/**
 * Gesture debounce state tracker.
 * Implements Property 2: Fist Gesture Debounce
 */
export interface GestureDebounceState {
    consecutiveFistFrames: number;
    lastGesture: GestureType;
    grabTriggered: boolean;
}

/**
 * Creates initial debounce state.
 */
export function createDebounceState(): GestureDebounceState {
    return {
        consecutiveFistFrames: 0,
        lastGesture: 'unknown',
        grabTriggered: false,
    };
}

/**
 * Updates debounce state and determines if grab should trigger.
 * 
 * Property 2: Fist Gesture Debounce
 * For any sequence of gesture detection frames, the grab action SHALL trigger
 * if and only if at least 5 consecutive frames detect a fist gesture.
 * 
 * @param state - Current debounce state
 * @param gesture - Current detected gesture
 * @param threshold - Number of consecutive frames required (default 5)
 * @returns Updated state and whether grab should trigger
 */
export function updateDebounceState(
    state: GestureDebounceState,
    gesture: GestureType,
    threshold: number = FIST_DEBOUNCE_FRAMES
): { state: GestureDebounceState; shouldTriggerGrab: boolean } {
    const newState = { ...state };
    let shouldTriggerGrab = false;

    if (gesture === 'fist') {
        newState.consecutiveFistFrames++;

        // Trigger grab only once when threshold is reached
        if (newState.consecutiveFistFrames >= threshold && !state.grabTriggered) {
            shouldTriggerGrab = true;
            newState.grabTriggered = true;
        }
    } else {
        // Reset fist counter when not detecting fist
        newState.consecutiveFistFrames = 0;
        newState.grabTriggered = false;
    }

    newState.lastGesture = gesture;
    return { state: newState, shouldTriggerGrab };
}

/**
 * Detects fist-to-palm transition for release action.
 * 
 * Property 3: Fist-to-Palm Release Trigger
 * For any gesture state transition from fist to palm, the release action
 * SHALL be triggered exactly once.
 * 
 * @param previousGesture - Previous frame's gesture
 * @param currentGesture - Current frame's gesture
 * @returns True if release should trigger
 */
export function detectReleaseTransition(
    previousGesture: GestureType,
    currentGesture: GestureType
): boolean {
    return previousGesture === 'fist' && currentGesture === 'palm';
}

/**
 * Result callback type for hand tracking.
 */
export type HandTrackingCallback = (result: HandTrackingResult) => void;

/**
 * HandTracker class - Main interface for hand gesture recognition.
 * Wraps MediaPipe Hands with gesture classification and debouncing.
 */
export class HandTrackerManager {
    private hands: Hands | null = null;
    private videoElement: HTMLVideoElement | null = null;
    private callback: HandTrackingCallback | null = null;
    private debounceState: GestureDebounceState;
    private isRunning: boolean = false;
    private animationFrameId: number | null = null;
    private config: HandTrackerConfig;

    constructor(config: Partial<HandTrackerConfig> = {}) {
        this.config = { ...DEFAULT_HAND_TRACKER_CONFIG, ...config };
        this.debounceState = createDebounceState();
    }

    /**
     * Initializes MediaPipe Hands with the provided video element.
     * Requirements: 2.1, 2.7
     */
    async initialize(videoElement: HTMLVideoElement): Promise<void> {
        console.log('[HandTracker] Initializing with video element:', videoElement);
        console.log('[HandTracker] Video readyState:', videoElement.readyState);
        console.log('[HandTracker] Video dimensions:', videoElement.videoWidth, 'x', videoElement.videoHeight);

        this.videoElement = videoElement;

        // Create MediaPipe Hands instance
        this.hands = new Hands({
            locateFile: (file) => {
                const url = `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                console.log('[HandTracker] Loading MediaPipe file:', url);
                return url;
            },
        });

        // Configure MediaPipe Hands
        this.hands.setOptions({
            maxNumHands: this.config.maxNumHands,
            modelComplexity: this.config.modelComplexity as 0 | 1,
            minDetectionConfidence: this.config.minDetectionConfidence,
            minTrackingConfidence: this.config.minTrackingConfidence,
        });

        // Set up results handler
        this.hands.onResults((results) => this.handleResults(results));

        // Wait for model to load
        console.log('[HandTracker] Waiting for MediaPipe model to load...');
        await this.hands.initialize();
        console.log('[HandTracker] MediaPipe model loaded successfully');
    }

    /**
     * Registers a callback for hand tracking results.
     */
    onResult(callback: HandTrackingCallback): void {
        this.callback = callback;
    }

    /**
     * Starts the hand tracking loop.
     */
    start(): void {
        console.log('[HandTracker] start() called', {
            isRunning: this.isRunning,
            hasHands: !!this.hands,
            hasVideo: !!this.videoElement,
            videoReady: this.videoElement?.readyState,
        });

        if (this.isRunning || !this.hands || !this.videoElement) {
            console.warn('[HandTracker] Cannot start - conditions not met');
            return;
        }

        this.isRunning = true;
        console.log('[HandTracker] Starting frame processing loop');
        this.processFrame();
    }

    /**
     * Stops the hand tracking loop.
     */
    stop(): void {
        this.isRunning = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Resets the debounce state.
     */
    resetDebounce(): void {
        this.debounceState = createDebounceState();
    }

    /**
     * Gets the current debounce state (for testing/debugging).
     */
    getDebounceState(): GestureDebounceState {
        return { ...this.debounceState };
    }

    /**
     * Processes a single video frame.
     */
    private async processFrame(): Promise<void> {
        if (!this.isRunning || !this.hands || !this.videoElement) {
            console.warn('[HandTracker] processFrame stopped - conditions not met');
            return;
        }

        try {
            // Check if video is ready
            if (this.videoElement.readyState < 2) {
                console.log('[HandTracker] Video not ready, waiting...');
                this.animationFrameId = requestAnimationFrame(() => this.processFrame());
                return;
            }

            await this.hands.send({ image: this.videoElement });
        } catch (error) {
            console.error('[HandTracker] Hand tracking error:', error);
        }

        // Schedule next frame
        this.animationFrameId = requestAnimationFrame(() => this.processFrame());
    }

    /**
     * Handles MediaPipe results and invokes callback.
     */
    private handleResults(results: Results): void {
        if (!this.callback) {
            console.warn('[HandTracker] No callback registered');
            return;
        }

        // No hands detected
        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            this.callback({
                detected: false,
                gesture: 'unknown',
                palmCenter: null,
                confidence: 0,
            });
            return;
        }

        // Process first detected hand
        const landmarks = results.multiHandLandmarks[0];
        const palmCenter = extractPalmCenter(landmarks);
        const gesture = classifyGesture(landmarks);

        // Detect release transition BEFORE updating debounce state
        // Use the CURRENT debounceState.lastGesture (from previous frame)
        const previousGesture = this.debounceState.lastGesture;
        const shouldTriggerRelease = detectReleaseTransition(previousGesture, gesture);

        // Debug log for release detection
        console.log('[HandTracker] Gesture transition check:', {
            previousGesture,
            currentGesture: gesture,
            shouldTriggerRelease,
        });

        if (shouldTriggerRelease) {
            console.log('[HandTracker] 🎯 RELEASE TRANSITION DETECTED!');
        }

        // Update debounce state AFTER checking release transition
        const { state: newDebounceState, shouldTriggerGrab } = updateDebounceState(
            this.debounceState,
            gesture
        );

        this.debounceState = newDebounceState;

        // Calculate confidence from detection scores
        const confidence = results.multiHandedness?.[0]?.score ?? 0.5;

        // Debug log
        console.log('[HandTracker] Hand detected:', {
            palmCenter,
            gesture,
            confidence,
            shouldTriggerGrab,
            shouldTriggerRelease,
        });

        this.callback({
            detected: true,
            gesture,
            palmCenter,
            confidence,
            // Extended result with action triggers
            ...(shouldTriggerGrab && { triggerGrab: true }),
            ...(shouldTriggerRelease && { triggerRelease: true }),
        } as HandTrackingResult & { triggerGrab?: boolean; triggerRelease?: boolean });
    }

    /**
     * Cleans up resources.
     */
    dispose(): void {
        this.stop();
        if (this.hands) {
            this.hands.close();
            this.hands = null;
        }
        this.videoElement = null;
        this.callback = null;
    }
}

/**
 * Factory function to create a HandTracker instance.
 */
export function createHandTracker(
    config: Partial<HandTrackerConfig> = {}
): HandTrackerManager {
    return new HandTrackerManager(config);
}
