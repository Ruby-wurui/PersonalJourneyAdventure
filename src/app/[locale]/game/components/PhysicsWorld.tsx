/**
 * Neon Claw Game - Physics World Component
 * Requirements: 7.1
 * 
 * Sets up the Cannon.js physics world with @react-three/cannon:
 * - Configures gravity and collision detection
 * - Creates wall boundary bodies
 */

'use client';

import { ReactNode } from 'react';
import { Physics, usePlane, useBox } from '@react-three/cannon';
import { DEFAULT_PHYSICS_CONFIG } from '../types';

const { machineBounds, gravity } = DEFAULT_PHYSICS_CONFIG;

// Machine dimensions
const MACHINE_WIDTH = machineBounds.maxX - machineBounds.minX;
const MACHINE_DEPTH = machineBounds.maxZ - machineBounds.minZ;
const MACHINE_HEIGHT = machineBounds.maxY - machineBounds.minY;
const BASE_HEIGHT = 0.3;
const WALL_THICKNESS = 0.2;

interface PhysicsWorldProps {
    children: ReactNode;
    isPaused?: boolean;
}

/**
 * Floor plane - bottom of the machine
 */
function Floor() {
    usePlane(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, BASE_HEIGHT, 0],
        type: 'Static',
        material: {
            friction: 0.5,
            restitution: 0.3,
        },
    }));

    return null; // Visual floor is rendered by ClawMachineEnclosure
}

/**
 * Wall boundary - invisible physics collider
 */
function Wall({
    position,
    size,
}: {
    position: [number, number, number];
    size: [number, number, number];
}) {
    useBox(() => ({
        position,
        args: size,
        type: 'Static',
        material: {
            friction: 0.3,
            restitution: 0.5,
        },
    }));

    return null; // Walls are invisible physics boundaries
}

/**
 * All boundary walls for the claw machine
 */
function MachineBoundaries() {
    const centerY = BASE_HEIGHT + MACHINE_HEIGHT / 2;
    const halfWidth = MACHINE_WIDTH / 2;
    const halfDepth = MACHINE_DEPTH / 2;

    return (
        <>
            {/* Floor */}
            <Floor />

            {/* Front wall */}
            <Wall
                position={[0, centerY, halfDepth + WALL_THICKNESS / 2]}
                size={[MACHINE_WIDTH + WALL_THICKNESS * 2, MACHINE_HEIGHT, WALL_THICKNESS]}
            />

            {/* Back wall */}
            <Wall
                position={[0, centerY, -halfDepth - WALL_THICKNESS / 2]}
                size={[MACHINE_WIDTH + WALL_THICKNESS * 2, MACHINE_HEIGHT, WALL_THICKNESS]}
            />

            {/* Left wall */}
            <Wall
                position={[-halfWidth - WALL_THICKNESS / 2, centerY, 0]}
                size={[WALL_THICKNESS, MACHINE_HEIGHT, MACHINE_DEPTH]}
            />

            {/* Right wall */}
            <Wall
                position={[halfWidth + WALL_THICKNESS / 2, centerY, 0]}
                size={[WALL_THICKNESS, MACHINE_HEIGHT, MACHINE_DEPTH]}
            />
        </>
    );
}

/**
 * Main PhysicsWorld component
 * Wraps children with Cannon.js physics context
 */
export function PhysicsWorld({ children, isPaused = false }: PhysicsWorldProps) {
    return (
        <Physics
            gravity={[gravity.x, gravity.y, gravity.z]}
            allowSleep={true}
            isPaused={isPaused}
        >
            <MachineBoundaries />
            {children}
        </Physics>
    );
}

export default PhysicsWorld;
