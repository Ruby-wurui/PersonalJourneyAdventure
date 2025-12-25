/**
 * Neon Claw Game - 3D Claw Component
 * Requirements: 4.1, 4.3, 4.4, 9.8
 * 
 * Creates the 3D claw mesh group with:
 * - Claw base (cylindrical body)
 * - Three finger meshes
 * - Finger open/close animations
 * - Ground shadow projection with neon glow
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

// Shadow constants
const SHADOW_BASE_RADIUS = 0.4; // Base radius when claw is at ground level
const SHADOW_MIN_RADIUS = 0.3;  // Minimum shadow radius
const SHADOW_MAX_RADIUS = 0.8;  // Maximum shadow radius
const SHADOW_HEIGHT_SCALE = 0.15; // How much shadow grows per unit of height
const GROUND_Y = 0; // Ground plane Y position

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
 * Ground shadow material with neon glow edges
 * Creates a radial gradient from transparent center to glowing edges
 */
function useShadowMaterial() {
    return useMemo(() => {
        // Create a canvas texture for the radial gradient
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d')!;

        // Create radial gradient from center to edge
        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)'); // Transparent center
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.15)'); // Semi-transparent middle
        gradient.addColorStop(0.85, 'rgba(0, 0, 0, 0.3)'); // Darker edge
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0.4)'); // Cyan glow at edge

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);

        const texture = new THREE.CanvasTexture(canvas);

        return new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide,
            depthWrite: false, // Prevent z-fighting with ground
            blending: THREE.AdditiveBlending, // Additive blending for glow effect
        });
    }, []);
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
    const shadowRef = useRef<THREE.Mesh>(null);
    const finger1Ref = useRef<THREE.Group>(null);
    const finger2Ref = useRef<THREE.Group>(null);
    const finger3Ref = useRef<THREE.Group>(null);

    // Current and target finger angles for animation
    const fingerAngleRef = useRef(DEFAULT_CLAW_CONFIG.clawOpenAngle);
    const targetFingerAngleRef = useRef(DEFAULT_CLAW_CONFIG.clawOpenAngle);

    const metalMaterial = useClawMetalMaterial();
    const neonMaterial = useNeonAccentMaterial(neonColors.pink);
    const cableMaterial = useCableMaterial();
    const shadowMaterial = useShadowMaterial();

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

        // Update ground shadow position and scale based on claw height
        // Property 15: Ground Shadow Position Tracking
        // For any claw position (x, y, z), the ground shadow SHALL be positioned at (x, 0, z)
        if (shadowRef.current && groupRef.current) {
            const clawWorldPos = new THREE.Vector3();
            groupRef.current.getWorldPosition(clawWorldPos);

            // Position shadow at ground level (y=0) directly below claw
            shadowRef.current.position.set(clawWorldPos.x, GROUND_Y + 0.01, clawWorldPos.z);

            // Scale shadow based on height - larger when higher
            const height = Math.max(0, clawWorldPos.y);
            const scaleFactor = SHADOW_BASE_RADIUS + (height * SHADOW_HEIGHT_SCALE);
            const clampedScale = THREE.MathUtils.clamp(
                scaleFactor,
                SHADOW_MIN_RADIUS,
                SHADOW_MAX_RADIUS
            );
            shadowRef.current.scale.set(clampedScale, clampedScale, 1);

            // Fade shadow opacity based on height (more transparent when higher)
            const maxHeight = 4; // Approximate max claw height
            const opacityFactor = 1 - Math.min(height / maxHeight, 0.5);
            if (shadowRef.current.material instanceof THREE.Material) {
                (shadowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.8 * opacityFactor;
            }
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
        <>
            {/* Ground shadow projection - positioned at y=0 */}
            <mesh
                ref={shadowRef}
                position={[position[0], GROUND_Y + 0.01, position[2]]}
                rotation={[-Math.PI / 2, 0, 0]}
                material={shadowMaterial}
                renderOrder={-1}
            >
                <circleGeometry args={[1, 32]} />
            </mesh>

            {/* Main claw group */}
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
        </>
    );
});

export default Claw;
