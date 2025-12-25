/**
 * Neon Claw Game - Post-Processing Effects Component
 * Requirements: 9.1, 9.2, 7.2
 * 
 * Implements post-processing effects for the cyberpunk aesthetic.
 * Currently uses simple fog-based effects due to @react-three/postprocessing compatibility issues.
 */

'use client';

import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { DEFAULT_SCENE_CONFIG } from '../types';

/**
 * Post-processing effects configuration
 */
export interface PostProcessingConfig {
    bloomIntensity: number;
    bloomThreshold: number;
    bloomSmoothing: number;
    bloomRadius: number;
    noiseOpacity: number;
    vignetteOffset: number;
    vignetteDarkness: number;
}

export const DEFAULT_POST_PROCESSING_CONFIG: PostProcessingConfig = {
    bloomIntensity: DEFAULT_SCENE_CONFIG.bloomStrength,
    bloomThreshold: 0.2,
    bloomSmoothing: 0.9,
    bloomRadius: 0.8,
    noiseOpacity: 0.02,
    vignetteOffset: 0.3,
    vignetteDarkness: 0.9,
};

/**
 * Ref interface for controlling effects externally
 */
export interface PostProcessingEffectsRef {
    triggerGlitch: (duration?: number) => void;
    setBloomIntensity: (intensity: number) => void;
}

interface PostProcessingEffectsProps {
    config?: Partial<PostProcessingConfig>;
}

/**
 * Simple glow effect using fog - fallback for when @react-three/postprocessing has issues
 */
function SimpleGlowEffect({ intensity = 1.5 }: { intensity?: number }) {
    const { scene } = useThree();

    useEffect(() => {
        // Add ambient atmosphere with fog
        scene.fog = new THREE.FogExp2(0x000011, 0.015 / intensity);

        return () => {
            scene.fog = null;
        };
    }, [scene, intensity]);

    return null;
}

/**
 * PostProcessingEffects component
 * Uses simple fog-based effects for cyberpunk atmosphere
 * 
 * Note: @react-three/postprocessing@3.0.4 has compatibility issues with the current setup
 * (accessing scene.children.length before scene is ready). Using simple fallback instead.
 */
export const PostProcessingEffects = forwardRef<PostProcessingEffectsRef, PostProcessingEffectsProps>(
    function PostProcessingEffects({ config = {} }, ref) {
        const mergedConfig = { ...DEFAULT_POST_PROCESSING_CONFIG, ...config };
        const glitchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
        const [bloomIntensity, setBloomIntensityState] = useState(mergedConfig.bloomIntensity);

        // Expose methods to parent components (glitch is a no-op in simple mode)
        useImperativeHandle(ref, () => ({
            triggerGlitch: (_duration = 300) => {
                // Glitch effect not available in simple mode
                // Could add a visual flash here if desired
            },
            setBloomIntensity: (intensity: number) => {
                setBloomIntensityState(intensity);
            },
        }));

        // Cleanup
        useEffect(() => {
            return () => {
                if (glitchTimeoutRef.current) {
                    clearTimeout(glitchTimeoutRef.current);
                }
            };
        }, []);

        return <SimpleGlowEffect intensity={bloomIntensity} />;
    }
);

export default PostProcessingEffects;
