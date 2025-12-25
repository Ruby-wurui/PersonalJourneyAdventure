/**
 * Neon Claw Game - Neon Lighting Component
 * Requirements: 9.1, 9.3, 9.5, 9.6, 9.7
 * 
 * Sets up the cyberpunk neon lighting with pink and cyan accent colors.
 * Includes ambient light, point lights for neon glow, and spotlight for claw.
 * Implements state-based lighting:
 * - Breathing animation for idle/calibrating states
 * - Yellow/red tension lighting for grabbing states
 * - Dynamic color transitions based on game state
 */

'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DEFAULT_SCENE_CONFIG } from '../types';
import { useClawPosition, useGamePhase, useClawState } from '../store/gameStore';

/**
 * NeonLighting component
 * Creates the cyberpunk atmosphere with dynamic neon lights
 * Implements state-based lighting effects:
 * - Breathing animation for idle/calibrating
 * - Tension colors (yellow/red) for grabbing
 */
export function NeonLighting() {
    const spotlightRef = useRef<THREE.SpotLight>(null);
    const pinkLight1Ref = useRef<THREE.PointLight>(null);
    const cyanLight1Ref = useRef<THREE.PointLight>(null);
    const pinkLight2Ref = useRef<THREE.PointLight>(null);
    const cyanLight2Ref = useRef<THREE.PointLight>(null);

    const clawPosition = useClawPosition();
    const phase = useGamePhase();
    const clawState = useClawState();

    const { neonColors } = DEFAULT_SCENE_CONFIG;

    // Base intensities for neon lights
    const baseIntensity = 4;
    const accentIntensity = 3;

    // Update spotlight and apply state-based lighting effects
    useFrame(({ clock }) => {
        // Update spotlight to follow claw position
        if (spotlightRef.current) {
            spotlightRef.current.target.position.set(
                clawPosition.x,
                clawPosition.y - 2,
                clawPosition.z
            );
            spotlightRef.current.target.updateMatrixWorld();
        }

        // Determine lighting mode based on game state
        const isIdle = phase === 'idle' || phase === 'calibrating';
        const isGrabbing = clawState === 'descending' || phase === 'grabbing';

        // Breathing animation for idle/calibrating states (Requirement 9.5)
        if (isIdle) {
            // Soft pulsing using sine wave
            const breathingFactor = Math.sin(clock.getElapsedTime() * 1.5) * 0.3 + 1.0;

            if (pinkLight1Ref.current) {
                pinkLight1Ref.current.intensity = baseIntensity * breathingFactor;
            }
            if (cyanLight1Ref.current) {
                cyanLight1Ref.current.intensity = baseIntensity * breathingFactor;
            }
            if (pinkLight2Ref.current) {
                pinkLight2Ref.current.intensity = accentIntensity * breathingFactor;
            }
            if (cyanLight2Ref.current) {
                cyanLight2Ref.current.intensity = accentIntensity * breathingFactor;
            }
        }
        // Grabbing state lighting - yellow/red tension (Requirement 9.6)
        else if (isGrabbing) {
            // Transition to yellow/red colors with increased intensity
            const yellowColor = new THREE.Color(0xffff00); // Yellow
            const redColor = new THREE.Color(0xff0000); // Red

            // Lerp factor for smooth transition
            const lerpFactor = 0.1;

            if (pinkLight1Ref.current) {
                pinkLight1Ref.current.color.lerp(redColor, lerpFactor);
                pinkLight1Ref.current.intensity = baseIntensity * 1.5;
            }
            if (cyanLight1Ref.current) {
                cyanLight1Ref.current.color.lerp(yellowColor, lerpFactor);
                cyanLight1Ref.current.intensity = baseIntensity * 1.5;
            }
            if (pinkLight2Ref.current) {
                pinkLight2Ref.current.color.lerp(redColor, lerpFactor);
                pinkLight2Ref.current.intensity = accentIntensity * 1.5;
            }
            if (cyanLight2Ref.current) {
                cyanLight2Ref.current.color.lerp(yellowColor, lerpFactor);
                cyanLight2Ref.current.intensity = accentIntensity * 1.5;
            }
        }
        // Normal playing state - restore original colors
        else {
            const targetPinkColor = new THREE.Color(neonColors.pink);
            const targetCyanColor = new THREE.Color(neonColors.cyan);
            const lerpFactor = 0.05;

            if (pinkLight1Ref.current) {
                pinkLight1Ref.current.color.lerp(targetPinkColor, lerpFactor);
                pinkLight1Ref.current.intensity = baseIntensity;
            }
            if (cyanLight1Ref.current) {
                cyanLight1Ref.current.color.lerp(targetCyanColor, lerpFactor);
                cyanLight1Ref.current.intensity = baseIntensity;
            }
            if (pinkLight2Ref.current) {
                pinkLight2Ref.current.color.lerp(targetPinkColor, lerpFactor);
                pinkLight2Ref.current.intensity = accentIntensity;
            }
            if (cyanLight2Ref.current) {
                cyanLight2Ref.current.color.lerp(targetCyanColor, lerpFactor);
                cyanLight2Ref.current.intensity = accentIntensity;
            }
        }
    });

    return (
        <>
            {/* Very bright ambient light for maximum visibility */}
            <ambientLight intensity={1.5} color={0xffffff} />

            {/* Main directional light for overall illumination */}
            <directionalLight
                position={[5, 10, 5]}
                intensity={2}
                color={0xffffff}
                castShadow
            />

            {/* Secondary directional light from opposite side */}
            <directionalLight
                position={[-5, 8, 3]}
                intensity={1.5}
                color={0xffffff}
            />

            {/* Pink neon point light - left side */}
            <pointLight
                ref={pinkLight1Ref}
                position={[-3, 3, 2]}
                color={neonColors.pink}
                intensity={baseIntensity}
                distance={15}
                decay={1.5}
            />

            {/* Cyan neon point light - right side */}
            <pointLight
                ref={cyanLight1Ref}
                position={[3, 3, 2]}
                color={neonColors.cyan}
                intensity={baseIntensity}
                distance={15}
                decay={1.5}
            />

            {/* Additional pink accent - back left */}
            <pointLight
                ref={pinkLight2Ref}
                position={[-2, 1, -2]}
                color={neonColors.pink}
                intensity={accentIntensity}
                distance={10}
                decay={1.5}
            />

            {/* Additional cyan accent - back right */}
            <pointLight
                ref={cyanLight2Ref}
                position={[2, 1, -2]}
                color={neonColors.cyan}
                intensity={accentIntensity}
                distance={10}
                decay={1.5}
            />

            {/* Spotlight following the claw */}
            <spotLight
                ref={spotlightRef}
                position={[0, 6, 0]}
                angle={Math.PI / 4}
                penumbra={0.3}
                intensity={4}
                color={0xffffff}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />

            {/* Bottom fill light for prize pool visibility */}
            <pointLight
                position={[0, 1, 0]}
                color={0xffffff}
                intensity={3}
                distance={8}
                decay={1.5}
            />

            {/* Front fill light */}
            <pointLight
                position={[0, 3, 5]}
                color={0xffffff}
                intensity={2}
                distance={10}
                decay={1.5}
            />

            {/* Top fill light */}
            <pointLight
                position={[0, 5, 0]}
                color={0xffffff}
                intensity={2}
                distance={10}
                decay={1.5}
            />
        </>
    );
}

export default NeonLighting;
