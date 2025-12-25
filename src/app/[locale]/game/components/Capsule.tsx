/**
 * Neon Claw Game - Capsule Component
 * Requirements: 7.1, 7.3, 4.3, 4.4
 * 
 * Creates spherical capsule physics bodies with:
 * - Random positions within machine bounds
 * - Physics body synced with Three.js mesh
 * - Different rarity visuals (common/rare/epic)
 * - Support for being grabbed and following claw position
 */

'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { CapsuleRarity, DEFAULT_PHYSICS_CONFIG, DEFAULT_SCENE_CONFIG, Vector3D } from '../types';
import { useGameStore } from '../store/gameStore';

// 球体纹理图片列表
const CAPSULE_TEXTURES = [
    '/game/assets/imgs/生成特定图片.png',
    '/game/assets/imgs/生成特定图片 (1).png',
    '/game/assets/imgs/生成特定图片 (2).png',
    '/game/assets/imgs/生成特定图片 (3).png',
    '/game/assets/imgs/生成特定图片 (4).png',
    '/game/assets/imgs/生成特定彩虹渐变色图片 (1).png',
    '/game/assets/imgs/生成特定彩虹渐变色图片 (2).png',
    '/game/assets/imgs/生成特定彩虹渐变色图片 (3).png',
    '/game/assets/imgs/生成特定彩虹渐变色图片 (4).png',
    '/game/assets/imgs/生成特定彩虹渐变色图片 (5).png',
    '/game/assets/imgs/生成特定彩虹渐变色图片 (6).png',
    '/game/assets/imgs/生成特定彩虹渐变色图片 (7).png',
    '/game/assets/imgs/生成特定彩虹渐变色图片 (8).png',
    '/game/assets/imgs/生成特定彩虹渐变色图片 (9).png',
];

const { capsuleRadius } = DEFAULT_PHYSICS_CONFIG;
const { neonColors } = DEFAULT_SCENE_CONFIG;

// 高亮颜色 - 绿色表示可以抓取
const HIGHLIGHT_COLOR = 0x00ff00;

// Rarity color configurations
const RARITY_COLORS: Record<CapsuleRarity, { base: number; glow: number; emissiveIntensity: number }> = {
    common: {
        base: 0x4a4a6a,
        glow: neonColors.cyan,
        emissiveIntensity: 0.5,
    },
    rare: {
        base: 0x6a4a8a,
        glow: neonColors.pink,
        emissiveIntensity: 1.0,
    },
    epic: {
        base: 0xffd700,
        glow: 0xffa500,
        emissiveIntensity: 1.5,
    },
};

interface CapsuleProps {
    id: string;
    position: [number, number, number];
    rarity: CapsuleRarity;
    isGrabbed?: boolean;
    isTargeted?: boolean; // 机械臂对准时高亮
    textureIndex?: number; // 纹理索引
    onCollide?: (id: string) => void;
}

/**
 * Single Capsule component with physics body
 */
export function Capsule({
    id,
    position,
    rarity,
    isGrabbed = false,
    isTargeted = false,
    textureIndex,
    onCollide,
}: CapsuleProps) {
    const colors = RARITY_COLORS[rarity];
    const prevGrabbedRef = useRef(isGrabbed);
    const updateCapsulePosition = useGameStore((state) => state.updateCapsulePosition);
    const physicsPositionRef = useRef<[number, number, number]>([...position]);

    // 根据 id 或 textureIndex 选择纹理
    const actualTextureIndex = useMemo(() => {
        if (textureIndex !== undefined) return textureIndex % CAPSULE_TEXTURES.length;
        // 从 id 中提取数字作为索引
        const match = id.match(/\d+/);
        return match ? parseInt(match[0], 10) % CAPSULE_TEXTURES.length : 0;
    }, [id, textureIndex]);

    // 加载纹理
    const texture = useTexture(CAPSULE_TEXTURES[actualTextureIndex]);

    // 使用 ref 存储 isGrabbed 的最新值，避免 useFrame 中的闭包问题
    const isGrabbedRef = useRef(isGrabbed);
    useEffect(() => {
        isGrabbedRef.current = isGrabbed;
    }, [isGrabbed]);

    // 直接从 store 订阅 clawPosition，避免通过 props 传递导致的延迟
    const clawPositionRef = useRef<Vector3D>({ x: 0, y: 0, z: 0 });

    // 使用 useEffect 订阅 store 变化
    useEffect(() => {
        const unsubscribe = useGameStore.subscribe(
            (state) => {
                clawPositionRef.current = state.clawPosition;
            }
        );
        // 初始化
        clawPositionRef.current = useGameStore.getState().clawPosition;
        return unsubscribe;
    }, []);

    const [physicsRef, api] = useSphere(() => ({
        mass: 1,
        position,
        args: [capsuleRadius],
        material: {
            friction: 0.8,
            restitution: 0.7,
        },
        linearDamping: 0.3,
        angularDamping: 0.3,
        onCollide: () => {
            if (onCollide) {
                onCollide(id);
            }
        },
    }));

    // 单独的视觉 group ref，用于被抓住时的位置控制
    const visualGroupRef = useRef<THREE.Group>(null);

    // Subscribe to physics position updates
    useEffect(() => {
        const unsubscribe = api.position.subscribe((pos) => {
            physicsPositionRef.current = pos as [number, number, number];
        });
        return unsubscribe;
    }, [api.position]);

    // Handle grab state changes - 关键：确保物理引擎正确恢复
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        // Skip the first render to avoid false state changes
        if (!hasInitializedRef.current) {
            hasInitializedRef.current = true;
            prevGrabbedRef.current = isGrabbed;
            return;
        }

        console.log(`[Capsule ${id}] isGrabbed changed to:`, isGrabbed, 'prev:', prevGrabbedRef.current);

        if (isGrabbed && !prevGrabbedRef.current) {
            // Just grabbed - make kinematic (mass 0)
            console.log(`[Capsule ${id}] Setting mass to 0 (grabbed)`);
            api.mass.set(0);
            api.velocity.set(0, 0, 0);
            api.angularVelocity.set(0, 0, 0);
        } else if (!isGrabbed && prevGrabbedRef.current) {
            // Just released - restore physics
            console.log(`[Capsule ${id}] Restoring mass to 1 (released)`);
            api.mass.set(1);
            // Give a downward velocity for natural fall
            api.velocity.set(0, -3, 0);
            // 施加一个小的冲量来确保物理体被唤醒
            api.applyImpulse([0, -0.5, 0], [0, 0, 0]);
        }
        prevGrabbedRef.current = isGrabbed;
    }, [isGrabbed, api, id]);

    // Follow claw position when grabbed, sync physics position to store
    const frameCountRef = useRef(0);
    const lastSyncedPosRef = useRef({ x: position[0], y: position[1], z: position[2] });
    const wasGrabbedRef = useRef(false);

    useFrame(() => {
        const clawPos = clawPositionRef.current;
        const grabbed = isGrabbedRef.current;
        const visualGroup = visualGroupRef.current;
        const physicsGroup = (physicsRef as React.MutableRefObject<THREE.Group | null>).current;

        if (grabbed && visualGroup) {
            // Position capsule below claw (offset for visual attachment)
            const offsetY = -0.5; // Below claw fingers
            const targetX = clawPos.x;
            const targetY = clawPos.y + offsetY;
            const targetZ = clawPos.z;

            // 设置视觉 group 的位置
            visualGroup.position.set(targetX, targetY, targetZ);
            visualGroup.visible = true;

            // 隐藏物理 group
            if (physicsGroup) {
                physicsGroup.visible = false;
            }

            // 同时更新物理引擎位置（保持同步）
            api.position.set(targetX, targetY, targetZ);

            if (!wasGrabbedRef.current) {
                console.log(`[Capsule ${id}] Now grabbed, following claw at:`, { targetX, targetY, targetZ });
            }
            wasGrabbedRef.current = true;
        } else {
            // 显示物理 group，隐藏视觉 group
            if (physicsGroup) {
                physicsGroup.visible = true;
            }
            if (visualGroup) {
                visualGroup.visible = false;
            }

            if (wasGrabbedRef.current) {
                console.log(`[Capsule ${id}] Released`);
                wasGrabbedRef.current = false;
            }
        }

        // Sync physics position to store (throttled - every 10 frames, only if moved significantly)
        // Only sync when NOT grabbed (grabbed position is controlled by claw)
        if (!grabbed) {
            frameCountRef.current++;
            if (frameCountRef.current >= 10) {
                frameCountRef.current = 0;
                const [px, py, pz] = physicsPositionRef.current;
                const last = lastSyncedPosRef.current;
                const dx = Math.abs(px - last.x);
                const dy = Math.abs(py - last.y);
                const dz = Math.abs(pz - last.z);

                if (dx > 0.05 || dy > 0.05 || dz > 0.05) {
                    lastSyncedPosRef.current = { x: px, y: py, z: pz };
                    updateCapsulePosition(id, { x: px, y: py, z: pz });
                }
            }
        }
    });

    // Materials - 使用 ref 来更新属性，避免重新创建材质
    const baseMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
    const glowMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
    const ringMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

    // 创建材质（只创建一次）- 使用纹理
    const baseMaterial = useMemo(() => {
        const mat = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.3,
            metalness: 0.5,
        });
        baseMaterialRef.current = mat;
        return mat;
    }, [texture]);

    const glowMaterial = useMemo(() => {
        const mat = new THREE.MeshStandardMaterial({
            color: colors.glow,
            emissive: colors.glow,
            emissiveIntensity: colors.emissiveIntensity,
            roughness: 0.2,
            metalness: 0.5,
            transparent: true,
            opacity: 0.9,
        });
        glowMaterialRef.current = mat;
        return mat;
    }, [colors.glow, colors.emissiveIntensity]);

    // 根据状态更新材质属性（不重新创建）
    useEffect(() => {
        const currentGlowColor = isTargeted ? HIGHLIGHT_COLOR : colors.glow;
        const currentEmissiveIntensity = isTargeted
            ? colors.emissiveIntensity * 3
            : (isGrabbed ? colors.emissiveIntensity * 2 : colors.emissiveIntensity);

        if (baseMaterialRef.current) {
            // 纹理模式下通过 emissive 来显示高亮效果
            if (isTargeted) {
                baseMaterialRef.current.emissive = new THREE.Color(HIGHLIGHT_COLOR);
                baseMaterialRef.current.emissiveIntensity = 0.3;
            } else {
                baseMaterialRef.current.emissive = new THREE.Color(0x000000);
                baseMaterialRef.current.emissiveIntensity = 0;
            }
        }
        if (glowMaterialRef.current) {
            glowMaterialRef.current.color.setHex(currentGlowColor);
            glowMaterialRef.current.emissive.setHex(currentGlowColor);
            glowMaterialRef.current.emissiveIntensity = currentEmissiveIntensity;
        }
        if (ringMaterialRef.current) {
            ringMaterialRef.current.color.setHex(currentGlowColor);
            ringMaterialRef.current.emissive.setHex(currentGlowColor);
            ringMaterialRef.current.emissiveIntensity = currentEmissiveIntensity * 1.5;
        }
    }, [isTargeted, isGrabbed, colors]);

    // Ring 材质
    const ringMaterial = useMemo(() => {
        const mat = new THREE.MeshStandardMaterial({
            color: colors.glow,
            emissive: colors.glow,
            emissiveIntensity: colors.emissiveIntensity * 1.5,
        });
        ringMaterialRef.current = mat;
        return mat;
    }, [colors.glow, colors.emissiveIntensity]);

    // 渲染球体的内容（共享）
    const capsuleContent = (
        <>
            {/* Main capsule sphere */}
            <mesh material={baseMaterial} castShadow receiveShadow>
                <sphereGeometry args={[capsuleRadius, 32, 32]} />
            </mesh>

            {/* Inner glow sphere */}
            <mesh material={glowMaterial}>
                <sphereGeometry args={[capsuleRadius * 0.85, 16, 16]} />
            </mesh>

            {/* Rarity indicator ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]} material={ringMaterial}>
                <torusGeometry args={[capsuleRadius * 0.7, 0.02, 8, 32]} />
            </mesh>

            {/* Point light for glow effect (brighter when targeted or grabbed) */}
            {(rarity !== 'common' || isGrabbed || isTargeted) && (
                <pointLight
                    color={isTargeted ? HIGHLIGHT_COLOR : colors.glow}
                    intensity={isTargeted ? 1.2 : (isGrabbed ? 0.8 : (rarity === 'epic' ? 0.5 : 0.3))}
                    distance={isTargeted ? 2.5 : (isGrabbed ? 2 : 1)}
                    decay={2}
                />
            )}
        </>
    );

    return (
        <>
            {/* 物理引擎控制的 group - 未被抓住时显示 */}
            <group ref={physicsRef as React.Ref<THREE.Group>}>
                {capsuleContent}
            </group>

            {/* 视觉 group - 被抓住时显示，完全由代码控制位置 */}
            <group ref={visualGroupRef} visible={false}>
                {capsuleContent}
            </group>
        </>
    );
}

export default Capsule;
