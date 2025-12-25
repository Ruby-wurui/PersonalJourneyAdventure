/**
 * Neon Claw Game - Default Controls Hook
 * Requirements: 1.5, 3.2
 * 
 * Implements mouse and keyboard controls for default mode:
 * - Mouse X/Y position tracking with deadzone filter (Property 5)
 * - Keyboard controls (WASD/arrows for movement, space for grab)
 */

import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { DEFAULT_CLAW_CONFIG, DEFAULT_PHYSICS_CONFIG } from '../types';
import { applyDeadzone, clamp } from '../lib/clawMovement';

const { machineBounds } = DEFAULT_PHYSICS_CONFIG;
const { deadzone } = DEFAULT_CLAW_CONFIG;

// Keyboard movement speed (units per second)
const KEYBOARD_MOVE_SPEED = 3;

// Mouse sensitivity for mapping screen position to claw position
const MOUSE_SENSITIVITY = 1.0;

export interface UseDefaultControlsOptions {
    /** Whether controls are enabled */
    enabled: boolean;
    /** Container element for mouse tracking (defaults to window) */
    containerRef?: React.RefObject<HTMLElement>;
}

export interface UseDefaultControlsResult {
    /** Current target X position from input */
    targetX: number;
    /** Current target Z position from input */
    targetZ: number;
    /** Whether keyboard is currently being used */
    isUsingKeyboard: boolean;
}

/**
 * Maps normalized screen coordinates (0-1) to claw position within bounds.
 * 
 * Property 5: Deadzone Filter for Mouse Input
 * For any mouse movement delta, if the absolute delta is less than the
 * deadzone threshold, the claw target position SHALL remain unchanged.
 */
function mapMouseToClawPosition(
    normalizedX: number,
    normalizedY: number,
    padding: number = 0.3
): { x: number; z: number } {
    // Map normalized coordinates to machine bounds
    const minX = machineBounds.minX + padding;
    const maxX = machineBounds.maxX - padding;
    const minZ = machineBounds.minZ + padding;
    const maxZ = machineBounds.maxZ - padding;

    // Center the mapping (0.5 normalized = center of bounds)
    // X: left-right maps to claw X
    // Y: top-bottom maps to claw Z (depth)
    const x = minX + normalizedX * (maxX - minX);
    const z = minZ + normalizedY * (maxZ - minZ);

    return { x, z };
}

/**
 * Hook for handling mouse and keyboard controls in default mode.
 * 
 * Requirements:
 * - 1.5: Initialize mouse/keyboard controls immediately in default mode
 * - 3.2: Mouse X-position with deadzone filter
 */
export function useDefaultControls({
    enabled,
    containerRef,
}: UseDefaultControlsOptions): UseDefaultControlsResult {
    // Track current target position
    const targetXRef = useRef(0);
    const targetZRef = useRef(0);
    const isUsingKeyboardRef = useRef(false);

    // Track last mouse position for deadzone calculation
    const lastMouseXRef = useRef(0.5);
    const lastMouseYRef = useRef(0.5);

    // Track pressed keys for continuous movement
    const pressedKeysRef = useRef<Set<string>>(new Set());

    // Animation frame ID for keyboard movement
    const animationFrameRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);

    // Get store actions
    const moveClaw = useGameStore((state) => state.moveClaw);
    const triggerGrab = useGameStore((state) => state.triggerGrab);
    const triggerRelease = useGameStore((state) => state.triggerRelease);
    const phase = useGameStore((state) => state.phase);
    const clawState = useGameStore((state) => state.clawState);

    /**
     * Handle mouse movement
     * Maps screen position to claw position with deadzone filter
     */
    const handleMouseMove = useCallback((event: MouseEvent) => {
        // Allow movement when hovering OR holding
        if (!enabled || phase !== 'playing' || (clawState !== 'hovering' && clawState !== 'holding')) return;

        // Get container dimensions
        const container = containerRef?.current || document.body;
        const rect = container.getBoundingClientRect();

        // Calculate normalized position (0-1)
        const normalizedX = clamp((event.clientX - rect.left) / rect.width, 0, 1);
        const normalizedY = clamp((event.clientY - rect.top) / rect.height, 0, 1);

        // Apply deadzone filter (Property 5)
        const deltaX = applyDeadzone(normalizedX - lastMouseXRef.current, deadzone);
        const deltaY = applyDeadzone(normalizedY - lastMouseYRef.current, deadzone);

        // Only update if movement exceeds deadzone
        if (deltaX !== 0 || deltaY !== 0) {
            lastMouseXRef.current = normalizedX;
            lastMouseYRef.current = normalizedY;

            // Map to claw position
            const { x, z } = mapMouseToClawPosition(normalizedX, normalizedY);
            targetXRef.current = x;
            targetZRef.current = z;

            // Update store
            moveClaw(x, z);
            isUsingKeyboardRef.current = false;
        }
    }, [enabled, phase, clawState, containerRef, moveClaw]);

    /**
     * Handle mouse click for grab action
     */
    const handleMouseClick = useCallback((event: MouseEvent) => {
        if (!enabled || phase !== 'playing' || clawState !== 'hovering') return;

        // Left click triggers grab
        if (event.button === 0) {
            triggerGrab();
        }
    }, [enabled, phase, clawState, triggerGrab]);

    /**
     * Handle keyboard key down
     */
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!enabled) return;

        const key = event.key.toLowerCase();

        // Movement keys
        if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
            event.preventDefault();
            pressedKeysRef.current.add(key);
            isUsingKeyboardRef.current = true;
        }

        // Space for grab or release
        if (key === ' ') {
            event.preventDefault();

            if (phase === 'playing' && clawState === 'hovering') {
                // Start grab
                triggerGrab();
            } else if (clawState === 'holding') {
                // Release capsule
                triggerRelease();
            }
        }
    }, [enabled, phase, clawState, triggerGrab, triggerRelease]);

    /**
     * Handle keyboard key up
     */
    const handleKeyUp = useCallback((event: KeyboardEvent) => {
        const key = event.key.toLowerCase();
        pressedKeysRef.current.delete(key);
    }, []);

    /**
     * Keyboard movement update loop
     * Runs continuously while keys are pressed
     */
    const updateKeyboardMovement = useCallback((currentTime: number) => {
        // Allow movement when hovering OR holding
        if (!enabled || phase !== 'playing' || (clawState !== 'hovering' && clawState !== 'holding')) {
            animationFrameRef.current = requestAnimationFrame(updateKeyboardMovement);
            return;
        }

        // Calculate delta time
        const deltaTime = lastTimeRef.current ? (currentTime - lastTimeRef.current) / 1000 : 0;
        lastTimeRef.current = currentTime;

        const keys = pressedKeysRef.current;
        let dx = 0;
        let dz = 0;

        // WASD and Arrow keys
        if (keys.has('w') || keys.has('arrowup')) dz -= 1;
        if (keys.has('s') || keys.has('arrowdown')) dz += 1;
        if (keys.has('a') || keys.has('arrowleft')) dx -= 1;
        if (keys.has('d') || keys.has('arrowright')) dx += 1;

        // Normalize diagonal movement
        if (dx !== 0 && dz !== 0) {
            const magnitude = Math.sqrt(dx * dx + dz * dz);
            dx /= magnitude;
            dz /= magnitude;
        }

        // Apply movement if any keys are pressed
        if (dx !== 0 || dz !== 0) {
            const moveAmount = KEYBOARD_MOVE_SPEED * deltaTime;

            // Calculate new position
            const padding = 0.3;
            const newX = clamp(
                targetXRef.current + dx * moveAmount,
                machineBounds.minX + padding,
                machineBounds.maxX - padding
            );
            const newZ = clamp(
                targetZRef.current + dz * moveAmount,
                machineBounds.minZ + padding,
                machineBounds.maxZ - padding
            );

            targetXRef.current = newX;
            targetZRef.current = newZ;

            // Update store
            moveClaw(newX, newZ);
        }

        animationFrameRef.current = requestAnimationFrame(updateKeyboardMovement);
    }, [enabled, phase, clawState, moveClaw]);

    // Set up event listeners
    useEffect(() => {
        if (!enabled) return;

        const container = containerRef?.current || window;

        // Mouse events
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleMouseClick);

        // Keyboard events
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Start keyboard movement loop
        lastTimeRef.current = 0;
        animationFrameRef.current = requestAnimationFrame(updateKeyboardMovement);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleMouseClick);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [enabled, containerRef, handleMouseMove, handleMouseClick, handleKeyDown, handleKeyUp, updateKeyboardMovement]);

    // Reset position when disabled
    useEffect(() => {
        if (!enabled) {
            targetXRef.current = 0;
            targetZRef.current = 0;
            pressedKeysRef.current.clear();
        }
    }, [enabled]);

    return {
        targetX: targetXRef.current,
        targetZ: targetZRef.current,
        isUsingKeyboard: isUsingKeyboardRef.current,
    };
}

export default useDefaultControls;
