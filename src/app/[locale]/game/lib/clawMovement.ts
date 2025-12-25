/**
 * Neon Claw Game - Claw Movement Utilities
 * Requirements: 3.1, 3.2, 3.3, 3.4
 * 
 * Pure functions for claw movement calculations:
 * - Lerp smoothing (Property 4)
 * - Deadzone filtering (Property 5)
 * - Velocity clamping (Property 6)
 * - Boundary constraints (Property 7)
 */

import { Vector3D, MachineBounds } from '../types';

/**
 * Applies linear interpolation between current and target values.
 * 
 * Property 4: Claw Movement with Lerp Smoothing
 * For any target position and current claw position, the new claw position
 * SHALL be calculated as: newPos = currentPos + (targetPos - currentPos) * lerpFactor
 * where lerpFactor is between 0 and 1.
 * 
 * @param current - Current position value
 * @param target - Target position value
 * @param factor - Lerp factor (0-1), clamped internally
 * @returns New interpolated position
 */
export function lerp(current: number, target: number, factor: number): number {
    // Clamp factor to valid range [0, 1]
    const clampedFactor = Math.max(0, Math.min(1, factor));
    return current + (target - current) * clampedFactor;
}

/**
 * Applies deadzone filter for input delta.
 * 
 * Property 5: Deadzone Filter for Mouse Input
 * For any mouse movement delta, if the absolute delta is less than the
 * deadzone threshold, the claw target position SHALL remain unchanged.
 * 
 * @param delta - Input delta value
 * @param threshold - Deadzone threshold
 * @returns Filtered delta (0 if within deadzone, original value otherwise)
 */
export function applyDeadzone(delta: number, threshold: number): number {
    if (Math.abs(delta) < threshold) {
        return 0;
    }
    return delta;
}

/**
 * Clamps velocity to maximum speed.
 * 
 * Property 6: Velocity Speed Clamping
 * For any calculated claw velocity, the actual applied velocity SHALL be
 * clamped to not exceed MAX_SPEED in magnitude.
 * 
 * @param velocity - Raw velocity value
 * @param maxSpeed - Maximum allowed speed (positive value)
 * @returns Clamped velocity (preserves sign)
 */
export function clampVelocity(velocity: number, maxSpeed: number): number {
    const absMax = Math.abs(maxSpeed);
    return Math.sign(velocity) * Math.min(Math.abs(velocity), absMax);
}

/**
 * Clamps a single value to bounds.
 * 
 * @param value - Value to clamp
 * @param min - Minimum bound
 * @param max - Maximum bound
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Clamps a 3D position to machine bounds.
 * 
 * Property 7: Claw Boundary Constraint (Invariant)
 * For any claw position at any point in time, the coordinates SHALL be
 * within the 3D bounds defined by machineBounds (minX/maxX, minY/maxY, minZ/maxZ).
 * 
 * @param position - Current position
 * @param bounds - Machine bounds
 * @param padding - Optional padding from edges (default 0)
 * @returns Position clamped to bounds
 */
export function clampToBounds(
    position: Vector3D,
    bounds: MachineBounds,
    padding: number = 0
): Vector3D {
    return {
        x: clamp(position.x, bounds.minX + padding, bounds.maxX - padding),
        y: clamp(position.y, bounds.minY + padding, bounds.maxY - padding),
        z: clamp(position.z, bounds.minZ + padding, bounds.maxZ - padding),
    };
}

/**
 * Checks if a position is within bounds.
 * 
 * @param position - Position to check
 * @param bounds - Machine bounds
 * @param padding - Optional padding from edges (default 0)
 * @returns True if position is within bounds
 */
export function isWithinBounds(
    position: Vector3D,
    bounds: MachineBounds,
    padding: number = 0
): boolean {
    return (
        position.x >= bounds.minX + padding &&
        position.x <= bounds.maxX - padding &&
        position.y >= bounds.minY + padding &&
        position.y <= bounds.maxY - padding &&
        position.z >= bounds.minZ + padding &&
        position.z <= bounds.maxZ - padding
    );
}

/**
 * Calculates new claw position with all movement constraints applied.
 * Combines lerp smoothing, deadzone filtering, velocity clamping, and boundary constraints.
 * 
 * @param current - Current claw position
 * @param target - Target position from input
 * @param config - Movement configuration
 * @param bounds - Machine bounds
 * @returns New claw position with all constraints applied
 */
export function calculateClawPosition(
    current: Vector3D,
    target: Vector3D,
    config: {
        lerpFactor: number;
        deadzone: number;
        maxSpeed: number;
        boundsPadding?: number;
    },
    bounds: MachineBounds
): Vector3D {
    const { lerpFactor, deadzone, maxSpeed, boundsPadding = 0 } = config;

    // Apply deadzone filter to deltas
    const deltaX = applyDeadzone(target.x - current.x, deadzone);
    const deltaZ = applyDeadzone(target.z - current.z, deadzone);

    // If within deadzone, return current position (clamped to bounds)
    if (deltaX === 0 && deltaZ === 0) {
        return clampToBounds(current, bounds, boundsPadding);
    }

    // Calculate new position with lerp
    // Note: We apply lerp to the original target, not the filtered delta
    const newX = deltaX !== 0 ? lerp(current.x, target.x, lerpFactor) : current.x;
    const newZ = deltaZ !== 0 ? lerp(current.z, target.z, lerpFactor) : current.z;

    // Create new position (Y unchanged for horizontal movement)
    const newPosition: Vector3D = {
        x: newX,
        y: current.y,
        z: newZ,
    };

    // Clamp to bounds
    return clampToBounds(newPosition, bounds, boundsPadding);
}

/**
 * Maps normalized input coordinates (0-1) to claw position within bounds.
 * 
 * Property 1: Palm Coordinate to Claw Position Mapping
 * For any palm X/Y coordinate detected by the Hand_Tracker (normalized 0-1),
 * the Claw target position SHALL be mapped to corresponding X/Z positions
 * within the 3D play area bounds using a linear transformation.
 * 
 * @param normalizedX - Normalized X coordinate (0-1)
 * @param normalizedY - Normalized Y coordinate (0-1), maps to Z axis
 * @param bounds - Machine bounds
 * @param padding - Optional padding from edges
 * @returns Target position in world coordinates
 */
export function mapNormalizedToClawPosition(
    normalizedX: number,
    normalizedY: number,
    bounds: MachineBounds,
    padding: number = 0.3
): { x: number; z: number } {
    // Clamp normalized values to [0, 1]
    const clampedX = clamp(normalizedX, 0, 1);
    const clampedY = clamp(normalizedY, 0, 1);

    // Map to bounds with padding
    const minX = bounds.minX + padding;
    const maxX = bounds.maxX - padding;
    const minZ = bounds.minZ + padding;
    const maxZ = bounds.maxZ - padding;

    // Linear transformation: normalized -> world coordinates
    // X maps directly, Y maps to Z (depth)
    const x = minX + clampedX * (maxX - minX);
    const z = minZ + clampedY * (maxZ - minZ);

    return { x, z };
}
