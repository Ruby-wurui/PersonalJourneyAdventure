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
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
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
import { BorderFlash, BorderFlashRef } from './BorderFlash';
import { useGameStore } from '../store/gameStore';
import * as THREE from 'three';

interface ClawMachineSceneProps {
    className?: string;
    onGrabComplete?: (success: boolean) => void;
    onAscentComplete?: () => void;
    onCapsuleCollide?: (capsuleId: string) => void;
    enablePostProcessing?: boolean;
    borderFlashRef?: MutableRefObject<BorderFlashRef | null>;
    particleEffectsRef?: MutableRefObject<ParticleEffectsRef | null>;
}

/**
 * Loading fallback component for Suspense
 * 使用 HTML overlay 显示霓虹加载动画
 */
function SceneLoader() {
    return (
        <>
            {/* 基础环境光，避免完全黑屏 */}
            <ambientLight intensity={0.1} />

            {/* HTML overlay with neon loading spinner */}
            <Html fullscreen>
                <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f]">
                    <div className="text-center">
                        {/* Neon loading spinner */}
                        <div className="relative w-24 h-24 mx-auto mb-6">
                            <div
                                className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"
                                style={{
                                    boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
                                }}
                            />
                            <div
                                className="absolute inset-0 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin"
                                style={{
                                    boxShadow: '0 0 30px rgba(0, 255, 255, 0.8)',
                                    animationDuration: '1s',
                                }}
                            />
                            <div
                                className="absolute inset-2 border-4 border-transparent border-t-pink-500 rounded-full animate-spin"
                                style={{
                                    boxShadow: '0 0 30px rgba(255, 0, 255, 0.8)',
                                    animationDuration: '1.5s',
                                    animationDirection: 'reverse',
                                }}
                            />
                        </div>

                        {/* Loading text with neon effect */}
                        <h2
                            className="text-3xl font-bold mb-2 tracking-wider animate-pulse"
                            style={{
                                background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
                            }}
                        >
                            LOADING
                        </h2>
                        <p className="text-cyan-400 text-sm tracking-widest opacity-70">
                            Initializing 3D Scene...
                        </p>

                        {/* Loading bar */}
                        <div className="mt-6 w-64 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
                            <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 animate-pulse"
                                style={{
                                    width: '100%',
                                    boxShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Html>
        </>
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
    borderFlashRef,
}: {
    onGrabComplete?: (success: boolean) => void;
    onAscentComplete?: () => void;
    onCapsuleCollide?: (capsuleId: string) => void;
    screenShakeRef: MutableRefObject<ScreenShakeRef | null>;
    particleEffectsRef: MutableRefObject<ParticleEffectsRef | null>;
    borderFlashRef?: MutableRefObject<BorderFlashRef | null>;
}) {
    // Handle capsule collision with screen shake
    const handleCapsuleCollide = (capsuleId: string) => {
        // 只在游戏进行中才触发屏幕晃动，避免开局晃动
        const phase = useGameStore.getState().phase;
        if (phase === 'playing' || phase === 'grabbing' || phase === 'releasing') {
            screenShakeRef.current?.shake(0.03); // 进一步降低晃动强度
        }
        onCapsuleCollide?.(capsuleId);
    };

    // Handle grab complete with particle effects
    const handleGrabComplete = (success: boolean) => {
        if (success) {
            // Could trigger success particles here if we had position
        }
        onGrabComplete?.(success);
    };

    // Handle scoring with coordinated effects (Requirement 9.7, 5.3)
    const handleScore = (capsule: any) => {
        console.log('[ClawMachineScene] Score event - triggering effects');

        // Trigger particle explosion at capsule position
        if (particleEffectsRef?.current && capsule.position) {
            const position = new THREE.Vector3(
                capsule.position.x,
                capsule.position.y,
                capsule.position.z
            );
            particleEffectsRef.current.triggerExplosion(position, 0x00ff00); // Green explosion
        }

        // Trigger border flash simultaneously
        if (borderFlashRef?.current) {
            borderFlashRef.current.flash('green');
        }
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
                onScore={handleScore}
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
    borderFlashRef,
    particleEffectsRef: externalParticleEffectsRef,
}: ClawMachineSceneProps) {
    const postProcessingRef = useRef<any>(null);
    const screenShakeRef = useRef<any>(null);
    const internalParticleEffectsRef = useRef<any>(null);

    // Use external ref if provided, otherwise use internal ref
    const particleEffectsRef = externalParticleEffectsRef || internalParticleEffectsRef;

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
                        borderFlashRef={borderFlashRef}
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
