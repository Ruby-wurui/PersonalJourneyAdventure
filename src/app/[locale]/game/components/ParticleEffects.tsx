/**
 * Neon Claw Game - Particle Effects Component
 * Requirements: 4.6, 5.3
 * 
 * Creates success explosion particles and glowing trail for grabbed capsules.
 */

'use client';

import { useRef, useMemo, forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DEFAULT_SCENE_CONFIG } from '../types';

/**
 * Particle configuration
 */
export interface ParticleConfig {
    explosionParticleCount: number;
    trailParticleCount: number;
    explosionSpeed: number;
    explosionLifetime: number;
    trailLifetime: number;
    particleSize: number;
}

export const DEFAULT_PARTICLE_CONFIG: ParticleConfig = {
    explosionParticleCount: 50,
    trailParticleCount: 20,
    explosionSpeed: 3,
    explosionLifetime: 1.5,
    trailLifetime: 0.5,
    particleSize: 0.08,
};

/**
 * Ref interface for controlling particle effects externally
 */
export interface ParticleEffectsRef {
    triggerExplosion: (position: THREE.Vector3, color?: number) => void;
    updateTrailPosition: (position: THREE.Vector3 | null) => void;
}

interface ParticleEffectsProps {
    config?: Partial<ParticleConfig>;
}

interface ExplosionParticle {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    life: number;
    maxLife: number;
    color: THREE.Color;
}

interface TrailParticle {
    position: THREE.Vector3;
    life: number;
    maxLife: number;
}

/**
 * ParticleEffects component
 * Manages explosion and trail particle systems
 */
export const ParticleEffects = forwardRef<ParticleEffectsRef, ParticleEffectsProps>(
    function ParticleEffects({ config = {} }, ref) {
        const mergedConfig = { ...DEFAULT_PARTICLE_CONFIG, ...config };

        const explosionParticlesRef = useRef<ExplosionParticle[]>([]);
        const trailParticlesRef = useRef<TrailParticle[]>([]);
        const trailPositionRef = useRef<THREE.Vector3 | null>(null);

        const [, forceUpdate] = useState(0);

        // Create geometry for particles
        const explosionGeometry = useMemo(() => {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(mergedConfig.explosionParticleCount * 3);
            const colors = new Float32Array(mergedConfig.explosionParticleCount * 3);
            const sizes = new Float32Array(mergedConfig.explosionParticleCount);

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            return geometry;
        }, [mergedConfig.explosionParticleCount]);

        const trailGeometry = useMemo(() => {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(mergedConfig.trailParticleCount * 3);
            const sizes = new Float32Array(mergedConfig.trailParticleCount);

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            return geometry;
        }, [mergedConfig.trailParticleCount]);

        // Particle material with additive blending for glow effect
        const explosionMaterial = useMemo(() => {
            return new THREE.PointsMaterial({
                size: mergedConfig.particleSize,
                vertexColors: true,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: true,
            });
        }, [mergedConfig.particleSize]);

        const trailMaterial = useMemo(() => {
            return new THREE.PointsMaterial({
                size: mergedConfig.particleSize * 0.7,
                color: DEFAULT_SCENE_CONFIG.neonColors.cyan,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: true,
                opacity: 0.8,
            });
        }, [mergedConfig.particleSize]);

        // Trigger explosion at position
        const triggerExplosion = useCallback((position: THREE.Vector3, color?: number) => {
            const particleColor = new THREE.Color(color ?? DEFAULT_SCENE_CONFIG.neonColors.pink);
            const particles: ExplosionParticle[] = [];

            for (let i = 0; i < mergedConfig.explosionParticleCount; i++) {
                // Random direction on sphere
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const speed = mergedConfig.explosionSpeed * (0.5 + Math.random() * 0.5);

                const velocity = new THREE.Vector3(
                    Math.sin(phi) * Math.cos(theta) * speed,
                    Math.sin(phi) * Math.sin(theta) * speed,
                    Math.cos(phi) * speed
                );

                // Vary color slightly
                const variedColor = particleColor.clone();
                variedColor.offsetHSL(0, 0, (Math.random() - 0.5) * 0.2);

                particles.push({
                    position: position.clone(),
                    velocity,
                    life: mergedConfig.explosionLifetime,
                    maxLife: mergedConfig.explosionLifetime,
                    color: variedColor,
                });
            }

            explosionParticlesRef.current = particles;
            forceUpdate(n => n + 1);
        }, [mergedConfig.explosionParticleCount, mergedConfig.explosionSpeed, mergedConfig.explosionLifetime]);

        // Update trail position (null to disable trail)
        const updateTrailPosition = useCallback((position: THREE.Vector3 | null) => {
            trailPositionRef.current = position;

            if (position && trailParticlesRef.current.length < mergedConfig.trailParticleCount) {
                // Add new trail particle
                trailParticlesRef.current.push({
                    position: position.clone().add(new THREE.Vector3(
                        (Math.random() - 0.5) * 0.1,
                        (Math.random() - 0.5) * 0.1,
                        (Math.random() - 0.5) * 0.1
                    )),
                    life: mergedConfig.trailLifetime,
                    maxLife: mergedConfig.trailLifetime,
                });
            }
        }, [mergedConfig.trailParticleCount, mergedConfig.trailLifetime]);

        // Expose methods to parent components
        useImperativeHandle(ref, () => ({
            triggerExplosion,
            updateTrailPosition,
        }));

        // Update particles each frame
        useFrame((_, delta) => {
            // Update explosion particles
            const explosionPositions = explosionGeometry.attributes.position.array as Float32Array;
            const explosionColors = explosionGeometry.attributes.color.array as Float32Array;
            const explosionSizes = explosionGeometry.attributes.size.array as Float32Array;

            explosionParticlesRef.current = explosionParticlesRef.current.filter((particle, i) => {
                particle.life -= delta;
                if (particle.life <= 0) return false;

                // Apply gravity and update position
                particle.velocity.y -= 2 * delta;
                particle.position.add(particle.velocity.clone().multiplyScalar(delta));

                const lifeRatio = particle.life / particle.maxLife;

                // Update buffer attributes
                explosionPositions[i * 3] = particle.position.x;
                explosionPositions[i * 3 + 1] = particle.position.y;
                explosionPositions[i * 3 + 2] = particle.position.z;

                explosionColors[i * 3] = particle.color.r;
                explosionColors[i * 3 + 1] = particle.color.g;
                explosionColors[i * 3 + 2] = particle.color.b;

                explosionSizes[i] = mergedConfig.particleSize * lifeRatio;

                return true;
            });

            // Clear remaining positions
            for (let i = explosionParticlesRef.current.length; i < mergedConfig.explosionParticleCount; i++) {
                explosionPositions[i * 3] = 0;
                explosionPositions[i * 3 + 1] = -100;
                explosionPositions[i * 3 + 2] = 0;
                explosionSizes[i] = 0;
            }

            explosionGeometry.attributes.position.needsUpdate = true;
            explosionGeometry.attributes.color.needsUpdate = true;
            explosionGeometry.attributes.size.needsUpdate = true;

            // Update trail particles
            const trailPositions = trailGeometry.attributes.position.array as Float32Array;
            const trailSizes = trailGeometry.attributes.size.array as Float32Array;

            // Add new trail particle if tracking position
            if (trailPositionRef.current) {
                trailParticlesRef.current.push({
                    position: trailPositionRef.current.clone().add(new THREE.Vector3(
                        (Math.random() - 0.5) * 0.05,
                        (Math.random() - 0.5) * 0.05,
                        (Math.random() - 0.5) * 0.05
                    )),
                    life: mergedConfig.trailLifetime,
                    maxLife: mergedConfig.trailLifetime,
                });

                // Limit trail particles
                if (trailParticlesRef.current.length > mergedConfig.trailParticleCount) {
                    trailParticlesRef.current.shift();
                }
            }

            trailParticlesRef.current = trailParticlesRef.current.filter((particle, i) => {
                particle.life -= delta;
                if (particle.life <= 0) return false;

                const lifeRatio = particle.life / particle.maxLife;

                trailPositions[i * 3] = particle.position.x;
                trailPositions[i * 3 + 1] = particle.position.y;
                trailPositions[i * 3 + 2] = particle.position.z;

                trailSizes[i] = mergedConfig.particleSize * 0.7 * lifeRatio;

                return true;
            });

            // Clear remaining trail positions
            for (let i = trailParticlesRef.current.length; i < mergedConfig.trailParticleCount; i++) {
                trailPositions[i * 3] = 0;
                trailPositions[i * 3 + 1] = -100;
                trailPositions[i * 3 + 2] = 0;
                trailSizes[i] = 0;
            }

            trailGeometry.attributes.position.needsUpdate = true;
            trailGeometry.attributes.size.needsUpdate = true;
        });

        return (
            <>
                {/* Explosion particles */}
                <points geometry={explosionGeometry} material={explosionMaterial} />

                {/* Trail particles */}
                <points geometry={trailGeometry} material={trailMaterial} />
            </>
        );
    }
);

export default ParticleEffects;
