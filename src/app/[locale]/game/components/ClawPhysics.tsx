/**
 * Neon Claw Game - Claw Physics Component
 * Requirements: 4.3, 4.4
 * 
 * Handles physics interactions between claw and capsules:
 * - Creates constraint for "magnetic" grab effect
 * - Implements detachment for release/slip animations
 * - Detects scoring when capsule is released in drop zone
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';
import { DEFAULT_PHYSICS_CONFIG, Capsule as CapsuleType } from '../types';
import { DROP_ZONE_BOUNDS } from './DropZone';

const { capsuleRadius } = DEFAULT_PHYSICS_CONFIG;

// Grab detection radius - increased significantly for easier grabbing
const GRAB_DETECTION_RADIUS = capsuleRadius * 6;

interface ClawPhysicsProps {
    onGrabSuccess?: (capsule: CapsuleType) => void;
    onGrabFail?: () => void;
    onRelease?: (capsule: CapsuleType) => void;
    onScore?: (capsule: CapsuleType) => void;
}

/**
 * Claw Physics Controller
 * Manages the physics-based grab and release mechanics
 */
export function ClawPhysics({
    onGrabSuccess,
    onGrabFail,
    onRelease,
    onScore,
}: ClawPhysicsProps) {
    // Refs for tracking state
    const attachedCapsuleRef = useRef<CapsuleType | null>(null);
    const isGrabbingRef = useRef(false);
    const slipAnimationRef = useRef(false);
    const slipProgressRef = useRef(0);

    // Track capsules that were released in drop zone, waiting to land
    const pendingScoringRef = useRef<Set<string>>(new Set());

    // Store state and actions - 直接从 store 获取 clawPosition
    const clawPosition = useGameStore((state) => state.clawPosition);
    const clawState = useGameStore((state) => state.clawState);
    const phase = useGameStore((state) => state.phase);
    const capsules = useGameStore((state) => state.capsules);
    const setGrabbedCapsule = useGameStore((state) => state.setGrabbedCapsule);
    const incrementConsecutiveFailures = useGameStore((state) => state.incrementConsecutiveFailures);
    const resetConsecutiveFailures = useGameStore((state) => state.resetConsecutiveFailures);
    const incrementScore = useGameStore((state) => state.incrementScore);
    const removeCapsule = useGameStore((state) => state.removeCapsule);

    // 使用 ref 存储最新值，避免闭包问题
    const clawPositionRef = useRef(clawPosition);
    const capsulesRef = useRef(capsules);

    useEffect(() => {
        clawPositionRef.current = clawPosition;
    }, [clawPosition]);

    useEffect(() => {
        capsulesRef.current = capsules;
    }, [capsules]);

    /**
     * Check if a position is within the drop zone (including Y check for landing)
     */
    const isInDropZone = useCallback((x: number, z: number): boolean => {
        return (
            x >= DROP_ZONE_BOUNDS.minX &&
            x <= DROP_ZONE_BOUNDS.maxX &&
            z >= DROP_ZONE_BOUNDS.minZ &&
            z <= DROP_ZONE_BOUNDS.maxZ
        );
    }, []);

    /**
     * Check if a capsule has landed in the drop zone (Y position check)
     */
    const hasLandedInDropZone = useCallback((x: number, y: number, z: number): boolean => {
        return (
            isInDropZone(x, z) &&
            y <= DROP_ZONE_BOUNDS.maxY
        );
    }, [isInDropZone]);

    /**
     * Find the nearest capsule to the claw position
     * 使用 XZ 平面距离（因为机械臂在上方）
     */
    const findNearestCapsule = useCallback((): CapsuleType | null => {
        const currentClawPos = clawPositionRef.current;
        const currentCapsules = capsulesRef.current;

        let nearest: CapsuleType | null = null;
        let minDistance = GRAB_DETECTION_RADIUS;

        console.log('[ClawPhysics] Finding nearest capsule, claw at:', {
            x: currentClawPos.x.toFixed(2),
            y: currentClawPos.y.toFixed(2),
            z: currentClawPos.z.toFixed(2),
        });

        for (const capsule of currentCapsules) {
            if (capsule.isGrabbed) continue;

            const dx = capsule.position.x - currentClawPos.x;
            const dz = capsule.position.z - currentClawPos.z;
            // 使用 XZ 平面距离，因为机械臂从上方下降
            const horizontalDistance = Math.sqrt(dx * dx + dz * dz);

            console.log(`[ClawPhysics] Capsule ${capsule.id} at (${capsule.position.x.toFixed(2)}, ${capsule.position.y.toFixed(2)}, ${capsule.position.z.toFixed(2)}), XZ distance: ${horizontalDistance.toFixed(2)}, threshold: ${GRAB_DETECTION_RADIUS.toFixed(2)}`);

            if (horizontalDistance < minDistance) {
                minDistance = horizontalDistance;
                nearest = capsule;
            }
        }

        console.log('[ClawPhysics] Nearest capsule:', nearest?.id || 'none', 'distance:', minDistance.toFixed(2));
        return nearest;
    }, []); // 不需要依赖，因为使用 ref

    /**
     * Attempt to grab a capsule
     */
    const attemptGrab = useCallback(() => {
        if (isGrabbingRef.current || attachedCapsuleRef.current) return;

        const nearestCapsule = findNearestCapsule();
        if (!nearestCapsule) {
            // No capsule in range
            console.log('[ClawPhysics] No capsule in range!');
            if (onGrabFail) onGrabFail();
            return;
        }

        isGrabbingRef.current = true;

        // 100% 成功率用于测试
        const success = true;
        console.log('[ClawPhysics] Grab attempt - success:', success, '(100% for testing)');

        if (success) {
            // Successful grab - attach capsule
            attachedCapsuleRef.current = nearestCapsule;
            setGrabbedCapsule(nearestCapsule);
            resetConsecutiveFailures();

            if (onGrabSuccess) onGrabSuccess(nearestCapsule);
        } else {
            // Failed grab - trigger slip animation
            slipAnimationRef.current = true;
            slipProgressRef.current = 0;
            incrementConsecutiveFailures();

            // Temporarily attach for visual effect
            attachedCapsuleRef.current = nearestCapsule;
            setGrabbedCapsule(nearestCapsule);
        }
    }, [
        findNearestCapsule,
        setGrabbedCapsule,
        resetConsecutiveFailures,
        incrementConsecutiveFailures,
        onGrabSuccess,
        onGrabFail,
    ]);

    /**
     * Release the currently grabbed capsule
     * If released above drop zone, mark for pending scoring
     */
    const releaseCapsule = useCallback(() => {
        if (!attachedCapsuleRef.current) return;

        const releasedCapsule = attachedCapsuleRef.current;
        const currentClawPos = clawPositionRef.current;

        // Check if releasing above drop zone
        const aboveDropZone = isInDropZone(currentClawPos.x, currentClawPos.z);

        attachedCapsuleRef.current = null;
        isGrabbingRef.current = false;
        slipAnimationRef.current = false;
        setGrabbedCapsule(null);

        if (aboveDropZone) {
            // Mark this capsule for pending scoring - will be removed when it lands
            console.log('[ClawPhysics] Capsule released above drop zone, waiting for it to land:', releasedCapsule.id);
            pendingScoringRef.current.add(releasedCapsule.id);
        } else {
            console.log('[ClawPhysics] Capsule released outside drop zone');
        }

        if (onRelease) onRelease(releasedCapsule);
    }, [setGrabbedCapsule, onRelease, isInDropZone]);

    // Handle state transitions
    useEffect(() => {
        if (clawState === 'descending' && phase === 'grabbing') {
            // Reset grabbing state when starting descent
            isGrabbingRef.current = false;
            attachedCapsuleRef.current = null;
        } else if (clawState === 'ascending' && !attachedCapsuleRef.current) {
            // Ascending without capsule - grab failed
            isGrabbingRef.current = false;
        }
    }, [clawState, phase]);

    // Handle grab attempt when claw transitions from descending to ascending (reached bottom)
    // Release is now handled by player pressing space again (triggerRelease in store)
    const prevClawStateRef = useRef(clawState);
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        // Skip the first render to avoid false state transitions
        if (!hasInitializedRef.current) {
            hasInitializedRef.current = true;
            prevClawStateRef.current = clawState;
            return;
        }

        // Detect transition from descending to ascending
        if (prevClawStateRef.current === 'descending' && clawState === 'ascending' && phase === 'grabbing') {
            console.log('[ClawPhysics] Claw reached bottom, attempting grab...');
            attemptGrab();
        }

        // Detect transition to holding state (claw reached top with capsule)
        if (prevClawStateRef.current === 'ascending' && clawState === 'holding') {
            console.log('[ClawPhysics] Claw now holding capsule, waiting for player to release...');
        }

        // Detect manual release (player pressed space while holding)
        if (prevClawStateRef.current === 'holding' && clawState === 'hovering') {
            console.log('[ClawPhysics] Player released capsule');
            if (attachedCapsuleRef.current) {
                releaseCapsule();
            }
        }

        prevClawStateRef.current = clawState;
    }, [clawState, phase, attemptGrab, releaseCapsule]);

    // Handle slip animation during ascent
    useFrame((_, delta) => {
        if (slipAnimationRef.current && attachedCapsuleRef.current) {
            slipProgressRef.current += delta;

            // Slip happens after 0.5-1.5 seconds of ascent
            const slipTime = 0.5 + Math.random() * 1.0;

            if (slipProgressRef.current >= slipTime) {
                // Trigger slip - release capsule
                slipAnimationRef.current = false;
                releaseCapsule();

                if (onGrabFail) onGrabFail();
            }
        }

        // Check if any pending scoring capsules have landed in the drop zone
        if (pendingScoringRef.current.size > 0) {
            const currentCapsules = capsulesRef.current;
            const toRemove: string[] = [];
            const pendingIds = Array.from(pendingScoringRef.current);

            for (const capsuleId of pendingIds) {
                const capsule = currentCapsules.find(c => c.id === capsuleId);
                if (capsule) {
                    // Check if capsule has landed in drop zone
                    if (hasLandedInDropZone(capsule.position.x, capsule.position.y, capsule.position.z)) {
                        console.log('[ClawPhysics] Capsule landed in drop zone - SCORE!', capsuleId);
                        toRemove.push(capsuleId);
                    }
                } else {
                    // Capsule no longer exists, remove from pending
                    toRemove.push(capsuleId);
                }
            }

            // Process scored capsules
            for (const capsuleId of toRemove) {
                pendingScoringRef.current.delete(capsuleId);
                const capsule = currentCapsules.find(c => c.id === capsuleId);
                if (capsule) {
                    incrementScore();
                    removeCapsule(capsuleId);
                    if (onScore) onScore(capsule);
                }
            }
        }
    });

    return null; // This is a logic-only component
}

export default ClawPhysics;
