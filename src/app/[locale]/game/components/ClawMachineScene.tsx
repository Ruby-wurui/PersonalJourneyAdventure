/**
 * Neon Claw Game - 3D Claw Machine Scene
 * Requirements: 9.1, 7.1, 7.2, 9.2
 * 
 * Base Three.js scene with React-Three-Fiber.
 * Sets up Canvas component with camera, lighting, and dark background with neon accent colors.
 * Integrates physics world, capsule pool, and post-processing effects.
 */

'use client';

import { Suspense, useRef, MutableRefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { DEFAULT_SCENE_CONFIG } from '../types';
import { ClawMachineEnclosure } from './ClawMachineEnclosure';
import { DropZone } from './DropZone';
import { NeonLighting } from './NeonLighting';
import { ClawController } from './ClawController';
import { PhysicsWorld } from './PhysicsWorld';
import { CapsulePool } from './CapsulePool';
import { ClawPhysics } from './ClawPhysics';
import { PostProcessingEffects, PostProcessingEffectsRef } from './PostProcessingEffects';
import { ScreenShake, ScreenShakeRef } from './ScreenShake';
import { ParticleEffects, ParticleEffectsRef } from './ParticleEffects';

interface ClawMachineSceneProps {
    className?: string;
    onGrabComplete?: (success: boolean) => void;
    onAscentComplete?: () => void;
    onCapsuleCollide?: (capsuleId: string) => void;
    enablePostProcessing?: boolean;
}

/**
 * Loading fallback component for Suspense
 */
function SceneLoader() {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={DEFAULT_SCENE_CONFIG.neonColors.cyan} wireframe />
        </mesh>
    );
}

/**
 * Main 3D scene content wrapped in physics
 */
function SceneContent({
    onGrabComplete,
    onAscentComplete,
    onCapsuleCollide,
    screenShakeRef,
    particleEffectsRef,
}: {
    onGrabComplete?: (success: boolean) => void;
    onAscentComplete?: () => void;
    onCapsuleCollide?: (capsuleId: string) => void;
    screenShakeRef: MutableRefObject<ScreenShakeRef | null>;
    particleEffectsRef: MutableRefObject<ParticleEffectsRef | null>;
}) {
    // Handle capsule collision with screen shake
    const handleCapsuleCollide = (capsuleId: string) => {
        // Trigger screen shake on collision
        screenShakeRef.current?.shake(0.1);
        onCapsuleCollide?.(capsuleId);
    };

    // Handle grab complete with particle effects
    const handleGrabComplete = (success: boolean) => {
        if (success) {
            // Could trigger success particles here if we had position
        }
        onGrabComplete?.(success);
    };

    return (
        <PhysicsWorld>
            {/* Screen shake effect */}
            <ScreenShake ref={screenShakeRef as MutableRefObject<ScreenShakeRef>} />

            {/* Particle effects */}
            <ParticleEffects ref={particleEffectsRef as MutableRefObject<ParticleEffectsRef>} />

            {/* Neon lighting setup */}
            <NeonLighting />

            {/* Claw machine enclosure */}
            <ClawMachineEnclosure />

            {/* Drop zone */}
            <DropZone />

            {/* Capsule pool with physics bodies */}
            <CapsulePool onCapsuleCollide={handleCapsuleCollide} />

            {/* Claw controller with movement and animations */}
            <ClawController
                onGrabComplete={handleGrabComplete}
                onAscentComplete={onAscentComplete}
            />

            {/* Claw physics for grab detection */}
            <ClawPhysics
                onGrabSuccess={(capsule) => {
                    console.log('[ClawPhysics] Grab success:', capsule.id);
                }}
                onGrabFail={() => {
                    console.log('[ClawPhysics] Grab failed');
                }}
                onScore={(capsule) => {
                    console.log('[ClawPhysics] SCORE! Capsule:', capsule.id);
                }}
            />
        </PhysicsWorld>
    );
}

/**
 * Main ClawMachineScene component
 * Sets up the React-Three-Fiber Canvas with camera, controls, and scene content
 */
export function ClawMachineScene({
    className,
    onGrabComplete,
    onAscentComplete,
    onCapsuleCollide,
    enablePostProcessing = true,
}: ClawMachineSceneProps) {
    const postProcessingRef = useRef<any>(null);
    const screenShakeRef = useRef<any>(null);
    const particleEffectsRef = useRef<any>(null);

    return (
        <div className={`w-full h-full ${className || ''}`}>
            <Canvas
                shadows
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: 'high-performance',
                }}
                style={{ background: `#${DEFAULT_SCENE_CONFIG.backgroundColor.toString(16).padStart(6, '0')}` }}
            >
                {/* Camera setup - positioned to view the claw machine from front */}
                <PerspectiveCamera
                    makeDefault
                    position={[0, 3, 8]}
                    fov={50}
                    near={0.1}
                    far={100}
                />

                {/* Orbit controls for development/debugging */}
                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={5}
                    maxDistance={15}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2.2}
                    target={[0, 1.5, 0]}
                />

                {/* Scene content with suspense fallback */}
                <Suspense fallback={<SceneLoader />}>
                    <SceneContent
                        onGrabComplete={onGrabComplete}
                        onAscentComplete={onAscentComplete}
                        onCapsuleCollide={onCapsuleCollide}
                        screenShakeRef={screenShakeRef}
                        particleEffectsRef={particleEffectsRef}
                    />
                </Suspense>

                {/* Post-processing effects for cyberpunk aesthetic */}
                {enablePostProcessing && (
                    <PostProcessingEffects ref={postProcessingRef as MutableRefObject<PostProcessingEffectsRef>} />
                )}
            </Canvas>
        </div>
    );
}

export default ClawMachineScene;
