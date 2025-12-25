/**
 * Neon Claw Game - 3D Claw Component
 * Requirements: 4.1, 4.3, 4.4
 * 
 * Creates the 3D claw mesh group with:
 * - Claw base (cylindrical body)
 * - Three finger meshes
 * - Finger open/close animations
 */

'use client';

import { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DEFAULT_SCENE_CONFIG, DEFAULT_CLAW_CONFIG, ClawState, Vector3D } from '../types';

const { neonColors } = DEFAULT_SCENE_CONFIG;

// Claw dimensions
const CLAW_BASE_RADIUS = 0.15;
const CLAW_BASE_HEIGHT = 0.25;
const FINGER_LENGTH = 0.4;
const FINGER_WIDTH = 0.06;
const FINGER_DEPTH = 0.04;
const CABLE_RADIUS = 0.02;
const CABLE_LENGTH = 0.5;

// Animation constants
const FINGER_PIVOT_OFFSET = 0.08; // Distance from base center to finger pivot

export interface ClawRef {
    openClaw: () => void;
    closeClaw: () => void;
    setTargetFingerAngle: (angle: number) => void;
    getFingerAngle: () => number;
    getGroup: () => THREE.Group | null;
}

interface ClawProps {
    position?: [number, number, number];
    clawState?: ClawState;
    isGrabbing?: boolean;
}

/**
 * Metal material for claw body - 明亮版本
 */
function useClawMetalMaterial() {
    return useMemo(() => new THREE.MeshStandardMaterial({
        color: 0xccccdd, // 明亮的银色
        roughness: 0.2,
        metalness: 0.95,
    }), []);
}

/**
 * Neon accent material for claw highlights - 更亮
 */
function useNeonAccentMaterial(color: number) {
    return useMemo(() => new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 3.0, // 增加发光强度
        roughness: 0.1,
        metalness: 0.5,
    }), [color]);
}

/**
 * Cable material - 明亮版本
 */
function useCableMaterial() {
    return useMemo(() => new THREE.MeshStandardMaterial({
        color: 0x888899, // 明亮的灰色
        roughness: 0.4,
        metalness: 0.8,
    }), []);
}

/**
 * Single claw finger component
 */
function ClawFinger({
    rotationY,
    fingerRef,
}: {
    rotationY: number;
    fingerRef: React.RefObject<THREE.Group>;
}) {
    const metalMaterial = useClawMetalMaterial();
    const neonMaterial = useNeonAccentMaterial(neonColors.cyan);

    return (
        <group rotation={[0, rotationY, 0]}>
            {/* Finger pivot point - positioned at edge of base */}
            <group
                ref={fingerRef}
                position={[FINGER_PIVOT_OFFSET, -CLAW_BASE_HEIGHT / 2, 0]}
            >
                {/* Main finger segment */}
                <mesh
                    position={[FINGER_LENGTH / 2, -FINGER_LENGTH / 2, 0]}
                    rotation={[0, 0, -Math.PI / 4]}
                    material={metalMaterial}
                    castShadow
                >
                    <boxGeometry args={[FINGER_WIDTH, FINGER_LENGTH, FINGER_DEPTH]} />
                </mesh>

                {/* Finger tip - curved hook */}
                <mesh
                    position={[FINGER_LENGTH * 0.7, -FINGER_LENGTH * 0.85, 0]}
                    rotation={[0, 0, -Math.PI / 6]}
                    material={metalMaterial}
                    castShadow
                >
                    <boxGeometry args={[FINGER_WIDTH * 0.8, FINGER_LENGTH * 0.3, FINGER_DEPTH]} />
                </mesh>

                {/* Neon accent on finger */}
                <mesh
                    position={[FINGER_LENGTH * 0.3, -FINGER_LENGTH * 0.3, FINGER_DEPTH / 2 + 0.005]}
                    rotation={[0, 0, -Math.PI / 4]}
                    material={neonMaterial}
                >
                    <boxGeometry args={[FINGER_WIDTH * 0.3, FINGER_LENGTH * 0.6, 0.01]} />
                </mesh>
            </group>
        </group>
    );
}

/**
 * Main Claw component with ref for external control
 */
export const Claw = forwardRef<ClawRef, ClawProps>(function Claw(
    { position = [0, 0, 0], clawState = 'hovering', isGrabbing = false },
    ref
) {
    const groupRef = useRef<THREE.Group>(null);
    const finger1Ref = useRef<THREE.Group>(null);
    const finger2Ref = useRef<THREE.Group>(null);
    const finger3Ref = useRef<THREE.Group>(null);

    // Current and target finger angles for animation
    const fingerAngleRef = useRef(DEFAULT_CLAW_CONFIG.clawOpenAngle);
    const targetFingerAngleRef = useRef(DEFAULT_CLAW_CONFIG.clawOpenAngle);

    const metalMaterial = useClawMetalMaterial();
    const neonMaterial = useNeonAccentMaterial(neonColors.pink);
    const cableMaterial = useCableMaterial();

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
        openClaw: () => {
            targetFingerAngleRef.current = DEFAULT_CLAW_CONFIG.clawOpenAngle;
        },
        closeClaw: () => {
            targetFingerAngleRef.current = DEFAULT_CLAW_CONFIG.clawCloseAngle;
        },
        setTargetFingerAngle: (angle: number) => {
            targetFingerAngleRef.current = angle;
        },
        getFingerAngle: () => fingerAngleRef.current,
        getGroup: () => groupRef.current,
    }));

    // Animate finger open/close
    useFrame((_, delta) => {
        const lerpSpeed = 5; // Animation speed
        const currentAngle = fingerAngleRef.current;
        const targetAngle = targetFingerAngleRef.current;

        // Lerp towards target angle
        if (Math.abs(currentAngle - targetAngle) > 0.001) {
            const newAngle = THREE.MathUtils.lerp(
                currentAngle,
                targetAngle,
                Math.min(1, lerpSpeed * delta)
            );
            fingerAngleRef.current = newAngle;

            // Apply rotation to all fingers
            const fingers = [finger1Ref, finger2Ref, finger3Ref];
            fingers.forEach((fingerRef) => {
                if (fingerRef.current) {
                    fingerRef.current.rotation.z = -newAngle;
                }
            });
        }
    });

    // Auto-control based on clawState/isGrabbing
    useFrame(() => {
        if (isGrabbing || clawState === 'holding') {
            targetFingerAngleRef.current = DEFAULT_CLAW_CONFIG.clawCloseAngle;
        } else if (clawState === 'hovering') {
            targetFingerAngleRef.current = DEFAULT_CLAW_CONFIG.clawOpenAngle;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Cable/rope going up */}
            <mesh
                position={[0, CLAW_BASE_HEIGHT / 2 + CABLE_LENGTH / 2, 0]}
                material={cableMaterial}
            >
                <cylinderGeometry args={[CABLE_RADIUS, CABLE_RADIUS, CABLE_LENGTH, 8]} />
            </mesh>

            {/* Main claw base - cylindrical body */}
            <mesh material={metalMaterial} castShadow>
                <cylinderGeometry args={[CLAW_BASE_RADIUS, CLAW_BASE_RADIUS * 1.2, CLAW_BASE_HEIGHT, 16]} />
            </mesh>

            {/* Neon ring around base */}
            <mesh position={[0, 0, 0]} material={neonMaterial}>
                <torusGeometry args={[CLAW_BASE_RADIUS * 1.1, 0.015, 8, 32]} />
            </mesh>

            {/* Bottom cap with neon accent */}
            <mesh
                position={[0, -CLAW_BASE_HEIGHT / 2, 0]}
                rotation={[Math.PI / 2, 0, 0]}
                material={metalMaterial}
                castShadow
            >
                <circleGeometry args={[CLAW_BASE_RADIUS * 1.2, 16]} />
            </mesh>

            {/* Three fingers arranged 120 degrees apart */}
            <ClawFinger rotationY={0} fingerRef={finger1Ref} />
            <ClawFinger rotationY={(2 * Math.PI) / 3} fingerRef={finger2Ref} />
            <ClawFinger rotationY={(4 * Math.PI) / 3} fingerRef={finger3Ref} />

            {/* Center indicator light */}
            <mesh position={[0, -CLAW_BASE_HEIGHT / 2 - 0.02, 0]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial
                    color={isGrabbing ? neonColors.pink : neonColors.cyan}
                    emissive={isGrabbing ? neonColors.pink : neonColors.cyan}
                    emissiveIntensity={2}
                />
            </mesh>
        </group>
    );
});

export default Claw;
