/**
 * Neon Claw Game - Claw Controller Component
 * Requirements: 3.1, 3.2, 3.3, 3.4, 4.1
 * 
 * Manages claw movement with:
 * - Velocity-based movement with speed clamping
 * - Lerp smoothing for position updates
 * - 3D boundary constraints
 * - Descent/ascent animations for grab sequence
 */

'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Claw, ClawRef } from './Claw';
import { ClawEffects } from './ClawEffects';
import { useGameStore } from '../store/gameStore';
import {
    DEFAULT_CLAW_CONFIG,
    DEFAULT_PHYSICS_CONFIG,
    Vector3D,
} from '../types';
import {
    lerp,
    applyDeadzone,
    clampVelocity,
    clamp,
} from '../lib/clawMovement';

const { machineBounds } = DEFAULT_PHYSICS_CONFIG;
const {
    maxSpeed,
    lerpFactor,
    deadzone,
    descentSpeed,
    ascentSpeed,
} = DEFAULT_CLAW_CONFIG;

// Vertical positions
const TOP_Y = machineBounds.maxY - 0.5; // Resting position at top
const BOTTOM_Y = machineBounds.minY; // Lowest descent point - at ground level
const BASE_HEIGHT = 0.3; // Machine base height
const BOUNDS_PADDING = 0.3; // Padding from machine walls

interface ClawControllerProps {
    targetX?: number;
    targetZ?: number;
    onGrabComplete?: (success: boolean) => void;
    onAscentComplete?: () => void;
}

/**
 * Main ClawController component
 * Integrates Claw mesh with movement logic and animations
 */
export function ClawController({
    targetX: externalTargetX,
    targetZ: externalTargetZ,
    onGrabComplete,
    onAscentComplete,
}: ClawControllerProps) {
    const clawRef = useRef<ClawRef>(null);
    const groupRef = useRef<THREE.Group>(null);

    // Position tracking refs
    const currentPositionRef = useRef<Vector3D>({ x: 0, y: TOP_Y, z: 0 });
    const targetPositionRef = useRef<Vector3D>({ x: 0, y: TOP_Y, z: 0 });
    const velocityRef = useRef<Vector3D>({ x: 0, y: 0, z: 0 });

    // Animation state refs
    const isDescendingRef = useRef(false);
    const isAscendingRef = useRef(false);
    const hasReachedBottomRef = useRef(false);

    // Get store state and actions
    const clawPosition = useGameStore((state) => state.clawPosition);
    const clawState = useGameStore((state) => state.clawState);
    const setClawState = useGameStore((state) => state.setClawState);
    const setPhase = useGameStore((state) => state.setPhase);
    const updateClawPosition = useGameStore((state) => state.updateClawPosition);

    // Sync target position from external props or store
    useEffect(() => {
        if (externalTargetX !== undefined) {
            targetPositionRef.current.x = externalTargetX;
        }
        if (externalTargetZ !== undefined) {
            targetPositionRef.current.z = externalTargetZ;
        }
    }, [externalTargetX, externalTargetZ]);

    // Sync with store position for X/Z
    useEffect(() => {
        targetPositionRef.current.x = clawPosition.x;
        targetPositionRef.current.z = clawPosition.z;
    }, [clawPosition.x, clawPosition.z]);

    // Handle state transitions for descent/ascent
    useEffect(() => {
        if (clawState === 'descending') {
            isDescendingRef.current = true;
            isAscendingRef.current = false;
            hasReachedBottomRef.current = false;
            // Close claw when descending
            clawRef.current?.closeClaw();
        } else if (clawState === 'ascending') {
            isDescendingRef.current = false;
            isAscendingRef.current = true;
        } else if (clawState === 'hovering') {
            isDescendingRef.current = false;
            isAscendingRef.current = false;
            // Open claw when hovering
            clawRef.current?.openClaw();
        } else if (clawState === 'holding') {
            // Keep claw closed when holding
            clawRef.current?.closeClaw();
        }
    }, [clawState]);

    // Main animation frame
    useFrame((_, delta) => {
        if (!groupRef.current) return;

        const current = currentPositionRef.current;
        const target = targetPositionRef.current;

        // Sync current position from target (which comes from store)
        // This ensures hand tracking position is used
        current.x = lerp(current.x, target.x, lerpFactor);
        current.z = lerp(current.z, target.z, lerpFactor);

        // Clamp to bounds
        current.x = clamp(current.x, machineBounds.minX + BOUNDS_PADDING, machineBounds.maxX - BOUNDS_PADDING);
        current.z = clamp(current.z, machineBounds.minZ + BOUNDS_PADDING, machineBounds.maxZ - BOUNDS_PADDING);

        // Handle descent animation
        if (isDescendingRef.current) {
            const newY = current.y - descentSpeed * delta;

            if (newY <= BOTTOM_Y + BASE_HEIGHT) {
                // Reached bottom
                current.y = BOTTOM_Y + BASE_HEIGHT;
                hasReachedBottomRef.current = true;
                isDescendingRef.current = false;

                // Trigger grab completion callback
                if (onGrabComplete) {
                    onGrabComplete(true); // Success determined by loot table elsewhere
                }

                // Transition to ascending
                isAscendingRef.current = true;
                setClawState('ascending');
            } else {
                current.y = newY;
            }
        }

        // Handle ascent animation
        if (isAscendingRef.current) {
            const newY = current.y + ascentSpeed * delta;

            if (newY >= TOP_Y) {
                // Reached top
                current.y = TOP_Y;
                isAscendingRef.current = false;

                // Trigger ascent completion callback
                if (onAscentComplete) {
                    onAscentComplete();
                }

                // Check if we have a grabbed capsule - if so, enter holding state
                const grabbedCapsule = useGameStore.getState().grabbedCapsule;
                if (grabbedCapsule) {
                    // Enter holding state - player can move and release
                    setClawState('holding');
                    setPhase('playing');
                    console.log('[ClawController] Entered holding state with capsule:', grabbedCapsule.id);
                } else {
                    // No capsule grabbed - return to hovering
                    setClawState('hovering');
                    setPhase('playing');
                }
            } else {
                current.y = newY;
            }
        }

        // Ensure Y stays at top when hovering or holding
        if ((clawState === 'hovering' || clawState === 'holding') && !isDescendingRef.current && !isAscendingRef.current) {
            current.y = lerp(current.y, TOP_Y, lerpFactor * 2);
        }

        // Update Three.js group position
        groupRef.current.position.set(current.x, current.y, current.z);

        // Sync Y position back to store so grabbed capsules can follow
        if (current.y !== clawPosition.y) {
            updateClawPosition({ y: current.y });
        }
    });

    return (
        <group ref={groupRef} position={[0, TOP_Y, 0]}>
            <Claw
                ref={clawRef}
                clawState={clawState}
                isGrabbing={clawState === 'descending' || clawState === 'holding'}
            />
            {/* Add claw effects */}
            <ClawEffects
                clawPosition={[
                    currentPositionRef.current.x,
                    currentPositionRef.current.y,
                    currentPositionRef.current.z
                ]}
            />
        </group>
    );
}

export default ClawController;
