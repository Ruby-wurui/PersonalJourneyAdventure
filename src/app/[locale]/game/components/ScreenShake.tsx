/**
 * Neon Claw Game - Screen Shake Effect Component
 * Requirements: 7.2
 * 
 * Creates camera shake effect on claw-capsule contact and other events.
 */

'use client';

import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Screen shake configuration
 */
export interface ScreenShakeConfig {
    maxIntensity: number;
    decayRate: number;
    frequency: number;
}

export const DEFAULT_SCREEN_SHAKE_CONFIG: ScreenShakeConfig = {
    maxIntensity: 0.05, // 进一步降低最大强度
    decayRate: 50, // 大幅增加衰减速度，晃动几乎瞬间消失
    frequency: 25,
};

/**
 * Ref interface for controlling screen shake externally
 */
export interface ScreenShakeRef {
    shake: (intensity?: number) => void;
}

interface ScreenShakeProps {
    config?: Partial<ScreenShakeConfig>;
}

/**
 * ScreenShake component
 * Applies camera shake effect that decays over time
 */
export const ScreenShake = forwardRef<ScreenShakeRef, ScreenShakeProps>(
    function ScreenShake({ config = {} }, ref) {
        const mergedConfig = { ...DEFAULT_SCREEN_SHAKE_CONFIG, ...config };
        const { camera } = useThree();

        const shakeIntensityRef = useRef(0);
        const originalPositionRef = useRef<THREE.Vector3 | null>(null);
        const timeRef = useRef(0);

        // Expose shake method to parent components
        useImperativeHandle(ref, () => ({
            shake: (intensity = mergedConfig.maxIntensity) => {
                // Store original camera position if not already stored
                if (!originalPositionRef.current) {
                    originalPositionRef.current = camera.position.clone();
                }
                shakeIntensityRef.current = Math.min(intensity, mergedConfig.maxIntensity);
            },
        }));

        useFrame((_, delta) => {
            if (shakeIntensityRef.current > 0.001) {
                timeRef.current += delta;

                // Calculate shake offset using sine waves for smooth motion
                const offsetX = Math.sin(timeRef.current * mergedConfig.frequency) * shakeIntensityRef.current;
                const offsetY = Math.cos(timeRef.current * mergedConfig.frequency * 1.3) * shakeIntensityRef.current;
                const offsetZ = Math.sin(timeRef.current * mergedConfig.frequency * 0.7) * shakeIntensityRef.current * 0.5;

                // Apply shake to camera
                if (originalPositionRef.current) {
                    camera.position.set(
                        originalPositionRef.current.x + offsetX,
                        originalPositionRef.current.y + offsetY,
                        originalPositionRef.current.z + offsetZ
                    );
                }

                // Decay the shake intensity
                shakeIntensityRef.current *= Math.exp(-mergedConfig.decayRate * delta);
            } else if (originalPositionRef.current) {
                // Reset camera to original position when shake is done
                camera.position.copy(originalPositionRef.current);
                shakeIntensityRef.current = 0;
                timeRef.current = 0;
            }
        });

        return null;
    }
);

export default ScreenShake;
