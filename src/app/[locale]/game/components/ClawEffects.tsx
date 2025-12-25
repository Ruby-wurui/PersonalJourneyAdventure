/**
 * Neon Claw Game - Claw Effects Component
 * 
 * Creates visual effects for the claw:
 * - Electric pulse effects when moving
 * - Particle trails when grabbing/closing
 * - Energy glow when holding capsule
 */

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { DEFAULT_SCENE_CONFIG } from '../types';

const { neonColors } = DEFAULT_SCENE_CONFIG;

interface ClawEffectsProps {
    clawPosition: [number, number, number];
}

/**
 * Electric pulse ring effect
 */
function ElectricPulse({ position, color, intensity }: {
    position: [number, number, number];
    color: number;
    intensity: number;
}) {
    const ringRef = useRef<THREE.Mesh>(null);
    const pulsePhase = useRef(0);

    useFrame((_, delta) => {
        if (!ringRef.current) return;

        pulsePhase.current += delta * 3;
        const scale = 1 + Math.sin(pulsePhase.current) * 0.3;
        const opacity = 0.3 + Math.sin(pulsePhase.current) * 0.2;

        ringRef.current.scale.set(scale, scale, scale);
        (ringRef.current.material as THREE.MeshStandardMaterial).opacity = opacity * intensity;
    });

    return (
        <mesh ref={ringRef} position={position} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.2, 0.02, 8, 32]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={2}
                transparent
                opacity={0.5}
            />
        </mesh>
    );
}

/**
 * Particle trail system
 */
function ParticleTrail({ position, active }: {
    position: [number, number, number];
    active: boolean;
}) {
    const particlesRef = useRef<THREE.Points>(null);
    const particleCount = 30;

    const { positions, velocities, lifetimes } = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const lifetimes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;

            velocities[i * 3] = (Math.random() - 0.5) * 0.5;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

            lifetimes[i] = Math.random();
        }

        return { positions, velocities, lifetimes };
    }, []);

    useFrame((_, delta) => {
        if (!particlesRef.current || !active) return;

        const posAttr = particlesRef.current.geometry.attributes.position;

        for (let i = 0; i < particleCount; i++) {
            lifetimes[i] -= delta * 2;

            if (lifetimes[i] <= 0) {
                // Reset particle
                positions[i * 3] = position[0];
                positions[i * 3 + 1] = position[1];
                positions[i * 3 + 2] = position[2];
                lifetimes[i] = 1;
            } else {
                // Update position
                positions[i * 3] += velocities[i * 3] * delta;
                positions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
                positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;
            }
        }

        posAttr.needsUpdate = true;
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color={neonColors.cyan}
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

/**
 * Energy field when holding capsule
 */
function EnergyField({ position, active }: {
    position: [number, number, number];
    active: boolean;
}) {
    const fieldRef = useRef<THREE.Mesh>(null);
    const rotationPhase = useRef(0);

    useFrame((_, delta) => {
        if (!fieldRef.current || !active) return;

        rotationPhase.current += delta * 2;
        fieldRef.current.rotation.y = rotationPhase.current;

        const pulse = Math.sin(rotationPhase.current * 3) * 0.5 + 0.5;
        (fieldRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1 + pulse;
    });

    if (!active) return null;

    return (
        <mesh ref={fieldRef} position={position}>
            <octahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial
                color={neonColors.pink}
                emissive={neonColors.pink}
                emissiveIntensity={1.5}
                transparent
                opacity={0.3}
                wireframe
            />
        </mesh>
    );
}

/**
 * Lightning bolts between claw fingers
 */
function LightningBolt({ start, end, active }: {
    start: [number, number, number];
    end: [number, number, number];
    active: boolean;
}) {
    const lineRef = useRef<THREE.Line>(null);
    const updatePhase = useRef(0);

    useFrame((_, delta) => {
        if (!lineRef.current || !active) return;

        updatePhase.current += delta * 10;

        if (updatePhase.current > 0.1) {
            updatePhase.current = 0;

            // Create jagged lightning path
            const segments = 5;
            const points: THREE.Vector3[] = [];
            const startVec = new THREE.Vector3(...start);
            const endVec = new THREE.Vector3(...end);

            points.push(startVec.clone());

            for (let i = 1; i < segments; i++) {
                const t = i / segments;
                const point = startVec.clone().lerp(endVec, t);
                point.x += (Math.random() - 0.5) * 0.1;
                point.y += (Math.random() - 0.5) * 0.1;
                point.z += (Math.random() - 0.5) * 0.1;
                points.push(point);
            }

            points.push(endVec.clone());

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            lineRef.current.geometry.dispose();
            lineRef.current.geometry = geometry;
        }
    });

    if (!active) return null;

    const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    return (
        <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
            color: neonColors.cyan,
            transparent: true,
            opacity: 0.7,
        }))} ref={lineRef} />
    );
}

/**
 * Main ClawEffects component
 */
export function ClawEffects({ clawPosition }: ClawEffectsProps) {
    const clawState = useGameStore((state) => state.clawState);
    const phase = useGameStore((state) => state.phase);
    const grabbedCapsule = useGameStore((state) => state.grabbedCapsule);
    const prevPosition = useRef(clawPosition);
    const isMoving = useRef(false);

    useFrame(() => {
        const [x, y, z] = clawPosition;
        const [px, py, pz] = prevPosition.current;
        const distance = Math.sqrt((x - px) ** 2 + (y - py) ** 2 + (z - pz) ** 2);

        isMoving.current = distance > 0.01;
        prevPosition.current = clawPosition;
    });

    const showPulse = phase === 'playing' && (clawState === 'hovering' || clawState === 'holding');
    const showParticles = clawState === 'descending' || clawState === 'ascending';
    const showEnergyField = clawState === 'holding' && grabbedCapsule !== null;
    const showLightning = clawState === 'descending' || (clawState === 'holding' && isMoving.current);

    // Calculate finger positions for lightning (approximate)
    const fingerPositions: [number, number, number][] = [
        [clawPosition[0] + 0.15, clawPosition[1] - 0.3, clawPosition[2]],
        [clawPosition[0] - 0.075, clawPosition[1] - 0.3, clawPosition[2] + 0.13],
        [clawPosition[0] - 0.075, clawPosition[1] - 0.3, clawPosition[2] - 0.13],
    ];

    const centerBottom: [number, number, number] = [
        clawPosition[0],
        clawPosition[1] - 0.4,
        clawPosition[2],
    ];

    return (
        <group>
            {/* Electric pulse rings */}
            {showPulse && (
                <>
                    <ElectricPulse
                        position={clawPosition}
                        color={neonColors.cyan}
                        intensity={isMoving.current ? 1 : 0.3}
                    />
                    <ElectricPulse
                        position={[clawPosition[0], clawPosition[1] - 0.15, clawPosition[2]]}
                        color={neonColors.pink}
                        intensity={isMoving.current ? 0.8 : 0.2}
                    />
                </>
            )}

            {/* Particle trails */}
            <ParticleTrail position={clawPosition} active={showParticles} />

            {/* Energy field when holding */}
            <EnergyField
                position={[clawPosition[0], clawPosition[1] - 0.5, clawPosition[2]]}
                active={showEnergyField}
            />

            {/* Lightning between fingers */}
            {showLightning && (
                <>
                    <LightningBolt start={fingerPositions[0]} end={centerBottom} active />
                    <LightningBolt start={fingerPositions[1]} end={centerBottom} active />
                    <LightningBolt start={fingerPositions[2]} end={centerBottom} active />
                </>
            )}
        </group>
    );
}

export default ClawEffects;
