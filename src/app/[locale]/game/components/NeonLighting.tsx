/**
 * Neon Claw Game - Neon Lighting Component
 * Requirements: 9.1, 9.3
 * 
 * Sets up the cyberpunk neon lighting with pink and cyan accent colors.
 * Includes ambient light, point lights for neon glow, and spotlight for claw.
 */

'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DEFAULT_SCENE_CONFIG } from '../types';
import { useClawPosition } from '../store/gameStore';

/**
 * NeonLighting component
 * Creates the cyberpunk atmosphere with dynamic neon lights
 */
export function NeonLighting() {
    const spotlightRef = useRef<THREE.SpotLight>(null);
    const clawPosition = useClawPosition();

    // Update spotlight to follow claw position
    useFrame(() => {
        if (spotlightRef.current) {
            spotlightRef.current.target.position.set(
                clawPosition.x,
                clawPosition.y - 2,
                clawPosition.z
            );
            spotlightRef.current.target.updateMatrixWorld();
        }
    });

    const { neonColors } = DEFAULT_SCENE_CONFIG;

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
                position={[-3, 3, 2]}
                color={neonColors.pink}
                intensity={4}
                distance={15}
                decay={1.5}
            />

            {/* Cyan neon point light - right side */}
            <pointLight
                position={[3, 3, 2]}
                color={neonColors.cyan}
                intensity={4}
                distance={15}
                decay={1.5}
            />

            {/* Additional pink accent - back left */}
            <pointLight
                position={[-2, 1, -2]}
                color={neonColors.pink}
                intensity={3}
                distance={10}
                decay={1.5}
            />

            {/* Additional cyan accent - back right */}
            <pointLight
                position={[2, 1, -2]}
                color={neonColors.cyan}
                intensity={3}
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
