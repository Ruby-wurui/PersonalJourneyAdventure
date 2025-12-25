/**
 * Neon Claw Game - Claw Machine Enclosure Component
 * Requirements: 9.1, 9.3
 * 
 * Creates the 3D claw machine enclosure with:
 * - Transparent glass walls
 * - Machine base and top rail
 * - Neon light strips (pink/cyan)
 */

'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { DEFAULT_SCENE_CONFIG, DEFAULT_PHYSICS_CONFIG } from '../types';

const { machineBounds } = DEFAULT_PHYSICS_CONFIG;
const { neonColors } = DEFAULT_SCENE_CONFIG;

// Machine dimensions based on physics bounds
const MACHINE_WIDTH = machineBounds.maxX - machineBounds.minX; // 4 units
const MACHINE_HEIGHT = machineBounds.maxY - machineBounds.minY; // 4 units
const MACHINE_DEPTH = machineBounds.maxZ - machineBounds.minZ; // 4 units
const WALL_THICKNESS = 0.05;
const BASE_HEIGHT = 0.3;
const RAIL_HEIGHT = 0.15;
const NEON_STRIP_RADIUS = 0.03;

/**
 * Glass material for transparent walls
 */
function useGlassMaterial() {
    return useMemo(() => new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.15,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        side: THREE.DoubleSide,
    }), []);
}

/**
 * Metal material for base and frame
 */
function useMetalMaterial() {
    return useMemo(() => new THREE.MeshStandardMaterial({
        color: 0x1a1a2e,
        roughness: 0.3,
        metalness: 0.8,
    }), []);
}

/**
 * Neon emissive material
 */
function useNeonMaterial(color: number) {
    return useMemo(() => new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 2,
        roughness: 0.2,
        metalness: 0.5,
    }), [color]);
}

/**
 * Glass wall component
 */
function GlassWall({
    position,
    size
}: {
    position: [number, number, number];
    size: [number, number, number];
}) {
    const glassMaterial = useGlassMaterial();

    return (
        <mesh position={position} material={glassMaterial} receiveShadow>
            <boxGeometry args={size} />
        </mesh>
    );
}

/**
 * Neon strip component - creates glowing tube effect
 */
function NeonStrip({
    start,
    end,
    color,
}: {
    start: [number, number, number];
    end: [number, number, number];
    color: number;
}) {
    const neonMaterial = useNeonMaterial(color);

    // Calculate position and rotation for the strip
    const position: [number, number, number] = [
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2,
        (start[2] + end[2]) / 2,
    ];

    const length = Math.sqrt(
        Math.pow(end[0] - start[0], 2) +
        Math.pow(end[1] - start[1], 2) +
        Math.pow(end[2] - start[2], 2)
    );

    // Determine rotation based on direction
    const direction = new THREE.Vector3(
        end[0] - start[0],
        end[1] - start[1],
        end[2] - start[2]
    ).normalize();

    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

    return (
        <mesh position={position} quaternion={quaternion} material={neonMaterial}>
            <cylinderGeometry args={[NEON_STRIP_RADIUS, NEON_STRIP_RADIUS, length, 8]} />
        </mesh>
    );
}

/**
 * Frame edge component - metal frame pieces
 */
function FrameEdge({
    start,
    end,
}: {
    start: [number, number, number];
    end: [number, number, number];
}) {
    const metalMaterial = useMetalMaterial();

    const position: [number, number, number] = [
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2,
        (start[2] + end[2]) / 2,
    ];

    const length = Math.sqrt(
        Math.pow(end[0] - start[0], 2) +
        Math.pow(end[1] - start[1], 2) +
        Math.pow(end[2] - start[2], 2)
    );

    const direction = new THREE.Vector3(
        end[0] - start[0],
        end[1] - start[1],
        end[2] - start[2]
    ).normalize();

    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

    return (
        <mesh position={position} quaternion={quaternion} material={metalMaterial} castShadow>
            <boxGeometry args={[0.08, length, 0.08]} />
        </mesh>
    );
}

/**
 * Main ClawMachineEnclosure component
 */
export function ClawMachineEnclosure() {
    const metalMaterial = useMetalMaterial();

    // Corner positions for frame
    const halfW = MACHINE_WIDTH / 2;
    const halfD = MACHINE_DEPTH / 2;
    const baseY = BASE_HEIGHT / 2;
    const topY = MACHINE_HEIGHT + BASE_HEIGHT;

    return (
        <group>
            {/* Machine Base */}
            <mesh
                position={[0, baseY, 0]}
                material={metalMaterial}
                receiveShadow
                castShadow
            >
                <boxGeometry args={[MACHINE_WIDTH + 0.4, BASE_HEIGHT, MACHINE_DEPTH + 0.4]} />
            </mesh>

            {/* Top Rail */}
            <mesh
                position={[0, topY + RAIL_HEIGHT / 2, 0]}
                material={metalMaterial}
                castShadow
            >
                <boxGeometry args={[MACHINE_WIDTH + 0.2, RAIL_HEIGHT, MACHINE_DEPTH + 0.2]} />
            </mesh>

            {/* Glass Walls - Front (facing camera, more transparent) */}
            <GlassWall
                position={[0, MACHINE_HEIGHT / 2 + BASE_HEIGHT, halfD + WALL_THICKNESS / 2]}
                size={[MACHINE_WIDTH, MACHINE_HEIGHT, WALL_THICKNESS]}
            />

            {/* Glass Walls - Back */}
            <GlassWall
                position={[0, MACHINE_HEIGHT / 2 + BASE_HEIGHT, -halfD - WALL_THICKNESS / 2]}
                size={[MACHINE_WIDTH, MACHINE_HEIGHT, WALL_THICKNESS]}
            />

            {/* Glass Walls - Left */}
            <GlassWall
                position={[-halfW - WALL_THICKNESS / 2, MACHINE_HEIGHT / 2 + BASE_HEIGHT, 0]}
                size={[WALL_THICKNESS, MACHINE_HEIGHT, MACHINE_DEPTH]}
            />

            {/* Glass Walls - Right */}
            <GlassWall
                position={[halfW + WALL_THICKNESS / 2, MACHINE_HEIGHT / 2 + BASE_HEIGHT, 0]}
                size={[WALL_THICKNESS, MACHINE_HEIGHT, MACHINE_DEPTH]}
            />

            {/* Vertical Frame Edges */}
            <FrameEdge start={[-halfW, BASE_HEIGHT, -halfD]} end={[-halfW, topY, -halfD]} />
            <FrameEdge start={[halfW, BASE_HEIGHT, -halfD]} end={[halfW, topY, -halfD]} />
            <FrameEdge start={[-halfW, BASE_HEIGHT, halfD]} end={[-halfW, topY, halfD]} />
            <FrameEdge start={[halfW, BASE_HEIGHT, halfD]} end={[halfW, topY, halfD]} />

            {/* Neon Strips - Bottom edges (Pink) */}
            <NeonStrip
                start={[-halfW, BASE_HEIGHT + 0.05, halfD]}
                end={[halfW, BASE_HEIGHT + 0.05, halfD]}
                color={neonColors.pink}
            />
            <NeonStrip
                start={[-halfW, BASE_HEIGHT + 0.05, -halfD]}
                end={[halfW, BASE_HEIGHT + 0.05, -halfD]}
                color={neonColors.pink}
            />

            {/* Neon Strips - Top edges (Cyan) */}
            <NeonStrip
                start={[-halfW, topY - 0.05, halfD]}
                end={[halfW, topY - 0.05, halfD]}
                color={neonColors.cyan}
            />
            <NeonStrip
                start={[-halfW, topY - 0.05, -halfD]}
                end={[halfW, topY - 0.05, -halfD]}
                color={neonColors.cyan}
            />

            {/* Neon Strips - Vertical corners (alternating colors) */}
            <NeonStrip
                start={[-halfW - 0.05, BASE_HEIGHT, halfD + 0.05]}
                end={[-halfW - 0.05, topY, halfD + 0.05]}
                color={neonColors.pink}
            />
            <NeonStrip
                start={[halfW + 0.05, BASE_HEIGHT, halfD + 0.05]}
                end={[halfW + 0.05, topY, halfD + 0.05]}
                color={neonColors.cyan}
            />
            <NeonStrip
                start={[-halfW - 0.05, BASE_HEIGHT, -halfD - 0.05]}
                end={[-halfW - 0.05, topY, -halfD - 0.05]}
                color={neonColors.cyan}
            />
            <NeonStrip
                start={[halfW + 0.05, BASE_HEIGHT, -halfD - 0.05]}
                end={[halfW + 0.05, topY, -halfD - 0.05]}
                color={neonColors.pink}
            />

            {/* Floor inside machine */}
            <mesh
                position={[0, BASE_HEIGHT + 0.01, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                receiveShadow
            >
                <planeGeometry args={[MACHINE_WIDTH - 0.1, MACHINE_DEPTH - 0.1]} />
                <meshStandardMaterial
                    color={0x0a0a15}
                    roughness={0.8}
                    metalness={0.2}
                />
            </mesh>
        </group>
    );
}

export default ClawMachineEnclosure;
