/**
 * Neon Claw Game - Drop Zone Component
 * Requirements: 5.1
 * 
 * Creates the drop zone mesh positioned at corner of machine.
 * Includes glowing indicator for target area.
 */

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DEFAULT_SCENE_CONFIG, DEFAULT_PHYSICS_CONFIG } from '../types';

const { machineBounds } = DEFAULT_PHYSICS_CONFIG;
const { neonColors } = DEFAULT_SCENE_CONFIG;

// Drop zone configuration
const DROP_ZONE_SIZE = 0.8;
const DROP_ZONE_HEIGHT = 0.1;
const BASE_HEIGHT = 0.3;

// Position at front-right corner of machine
const DROP_ZONE_POSITION: [number, number, number] = [
    machineBounds.maxX - DROP_ZONE_SIZE / 2 - 0.2,
    BASE_HEIGHT + DROP_ZONE_HEIGHT / 2,
    machineBounds.maxZ - DROP_ZONE_SIZE / 2 - 0.2,
];

/**
 * Animated glow ring component
 */
function GlowRing({
    radius,
    color,
    pulseSpeed = 1
}: {
    radius: number;
    color: number;
    pulseSpeed?: number;
}) {
    const ringRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);

    useFrame((state) => {
        if (materialRef.current) {
            // Pulsing glow effect
            const pulse = Math.sin(state.clock.elapsedTime * pulseSpeed * 2) * 0.5 + 1;
            materialRef.current.emissiveIntensity = pulse * 1.5;
        }

        if (ringRef.current) {
            // Slow rotation
            ringRef.current.rotation.z += 0.005;
        }
    });

    return (
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius - 0.05, radius, 32]} />
            <meshStandardMaterial
                ref={materialRef}
                color={color}
                emissive={color}
                emissiveIntensity={1.5}
                transparent
                opacity={0.8}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

/**
 * Animated arrow indicator pointing down
 */
function DropArrow({ color }: { color: number }) {
    const arrowRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (arrowRef.current) {
            // Bobbing animation
            arrowRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        }
    });

    const arrowMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.9,
    }), [color]);

    return (
        <group ref={arrowRef} position={[0, 0.5, 0]}>
            {/* Arrow body */}
            <mesh material={arrowMaterial}>
                <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
            </mesh>
            {/* Arrow head */}
            <mesh position={[0, -0.2, 0]} material={arrowMaterial}>
                <coneGeometry args={[0.12, 0.15, 8]} />
            </mesh>
        </group>
    );
}

/**
 * Particle effect for drop zone
 */
function DropZoneParticles({ color }: { color: number }) {
    const particlesRef = useRef<THREE.Points>(null);

    const { positions, velocities } = useMemo(() => {
        const count = 20;
        const positions = new Float32Array(count * 3);
        const velocities: number[] = [];

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const radius = DROP_ZONE_SIZE / 2 * 0.8;
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = Math.sin(angle) * radius;
            velocities.push(Math.random() * 0.5 + 0.5);
        }

        return { positions, velocities };
    }, []);

    useFrame((state) => {
        if (particlesRef.current) {
            const positionAttribute = particlesRef.current.geometry.getAttribute('position');
            const array = positionAttribute.array as Float32Array;

            for (let i = 0; i < array.length / 3; i++) {
                // Animate particles upward
                array[i * 3 + 1] += velocities[i] * 0.02;

                // Reset when too high
                if (array[i * 3 + 1] > 0.5) {
                    array[i * 3 + 1] = 0;
                }
            }

            positionAttribute.needsUpdate = true;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                color={color}
                size={0.05}
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}

/**
 * Main DropZone component
 */
export function DropZone() {
    const baseRef = useRef<THREE.Mesh>(null);

    // Pulsing glow for the base
    useFrame((state) => {
        if (baseRef.current) {
            const material = baseRef.current.material as THREE.MeshStandardMaterial;
            const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
            material.emissiveIntensity = pulse;
        }
    });

    return (
        <group position={DROP_ZONE_POSITION}>
            {/* Drop zone base platform */}
            <mesh ref={baseRef} receiveShadow>
                <boxGeometry args={[DROP_ZONE_SIZE, DROP_ZONE_HEIGHT, DROP_ZONE_SIZE]} />
                <meshStandardMaterial
                    color={0x1a1a2e}
                    emissive={neonColors.cyan}
                    emissiveIntensity={0.5}
                    roughness={0.3}
                    metalness={0.7}
                />
            </mesh>

            {/* Inner glow ring */}
            <group position={[0, DROP_ZONE_HEIGHT / 2 + 0.01, 0]}>
                <GlowRing radius={DROP_ZONE_SIZE / 2 - 0.1} color={neonColors.cyan} pulseSpeed={1} />
            </group>

            {/* Outer glow ring */}
            <group position={[0, DROP_ZONE_HEIGHT / 2 + 0.02, 0]}>
                <GlowRing radius={DROP_ZONE_SIZE / 2} color={neonColors.pink} pulseSpeed={1.5} />
            </group>

            {/* Drop arrow indicator */}
            <DropArrow color={neonColors.cyan} />

            {/* Particle effects */}
            <group position={[0, DROP_ZONE_HEIGHT / 2 + 0.05, 0]}>
                <DropZoneParticles color={neonColors.cyan} />
            </group>

            {/* Point light for local glow */}
            <pointLight
                position={[0, 0.3, 0]}
                color={neonColors.cyan}
                intensity={0.5}
                distance={2}
                decay={2}
            />
        </group>
    );
}

// Export drop zone position for collision detection
export const DROP_ZONE_BOUNDS = {
    minX: DROP_ZONE_POSITION[0] - DROP_ZONE_SIZE / 2,
    maxX: DROP_ZONE_POSITION[0] + DROP_ZONE_SIZE / 2,
    minY: DROP_ZONE_POSITION[1] - DROP_ZONE_HEIGHT / 2,
    maxY: DROP_ZONE_POSITION[1] + DROP_ZONE_HEIGHT / 2 + 1, // Extended height for detection
    minZ: DROP_ZONE_POSITION[2] - DROP_ZONE_SIZE / 2,
    maxZ: DROP_ZONE_POSITION[2] + DROP_ZONE_SIZE / 2,
};

export default DropZone;
