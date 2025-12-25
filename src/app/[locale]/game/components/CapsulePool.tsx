'use client';

import { useRef, useEffect, useCallback, useMemo } from 'react';
import { Capsule } from './Capsule';
import { useGameStore } from '../store/gameStore';
import {
    CapsuleRarity,
    DEFAULT_PHYSICS_CONFIG,
    Capsule as CapsuleType,
} from '../types';

const { machineBounds, capsuleCount, capsuleRadius } = DEFAULT_PHYSICS_CONFIG;
const BASE_HEIGHT = 0.3;

// 抓取检测半径 - 与 ClawPhysics 保持一致
const GRAB_DETECTION_RADIUS = capsuleRadius * 6;

const RARITY_DISTRIBUTION = {
    common: 0.7,
    rare: 0.25,
    epic: 0.05,
};

function generateRandomPosition(): [number, number, number] {
    const padding = capsuleRadius * 2;
    const x = (Math.random() - 0.5) * (machineBounds.maxX - machineBounds.minX - padding * 2);
    const y = BASE_HEIGHT + capsuleRadius + Math.random() * 1.5;
    const z = (Math.random() - 0.5) * (machineBounds.maxZ - machineBounds.minZ - padding * 2);
    return [x, y, z];
}

function determineRarity(): CapsuleRarity {
    const roll = Math.random();
    if (roll < RARITY_DISTRIBUTION.epic) {
        return 'epic';
    } else if (roll < RARITY_DISTRIBUTION.epic + RARITY_DISTRIBUTION.rare) {
        return 'rare';
    }
    return 'common';
}

function generateCapsules(count: number): CapsuleType[] {
    const capsules: CapsuleType[] = [];
    for (let i = 0; i < count; i++) {
        const position = generateRandomPosition();
        const rarity = determineRarity();
        capsules.push({
            id: `capsule-${i}`,
            body: null,
            mesh: null,
            rarity,
            position: { x: position[0], y: position[1], z: position[2] },
            isGrabbed: false,
            glowColor: rarity === 'epic' ? 0xffa500 : rarity === 'rare' ? 0xff00ff : 0x00ffff,
        });
    }
    return capsules;
}

interface CapsulePoolProps {
    onCapsuleCollide?: (capsuleId: string) => void;
}

export function CapsulePool({ onCapsuleCollide }: CapsulePoolProps) {
    const setCapsules = useGameStore((state) => state.setCapsules);
    const capsules = useGameStore((state) => state.capsules);
    const grabbedCapsule = useGameStore((state) => state.grabbedCapsule);
    const clawPosition = useGameStore((state) => state.clawPosition);
    const clawState = useGameStore((state) => state.clawState);
    const phase = useGameStore((state) => state.phase);

    // Use ref to track if we've initialized capsules (avoids setState during render)
    const initializedRef = useRef(false);
    const initialCapsulesRef = useRef<CapsuleType[]>([]);

    // Generate initial capsules only once
    if (!initializedRef.current && capsules.length === 0) {
        initialCapsulesRef.current = generateCapsules(capsuleCount);
    }

    // Set capsules in store after mount (not during render)
    useEffect(() => {
        if (!initializedRef.current && capsules.length === 0) {
            initializedRef.current = true;
            setCapsules(initialCapsulesRef.current);
        }
    }, [capsules.length, setCapsules]);

    // Use store capsules if available, otherwise use the ref (for first render before effect runs)
    const displayCapsules = capsules.length > 0 ? capsules : initialCapsulesRef.current;

    // 计算哪个胶囊在抓取范围内（只在 hovering 状态时显示）
    const targetedCapsuleId = useMemo(() => {
        // 只在游戏进行中且机械臂悬停时显示高亮
        if (phase !== 'playing' || clawState !== 'hovering') {
            return null;
        }

        let nearestId: string | null = null;
        let minDistance = GRAB_DETECTION_RADIUS;

        for (const capsule of displayCapsules) {
            if (capsule.isGrabbed) continue;

            const dx = capsule.position.x - clawPosition.x;
            // 使用 XZ 平面距离来判断（因为机械臂在上方）
            const dz = capsule.position.z - clawPosition.z;
            const horizontalDistance = Math.sqrt(dx * dx + dz * dz);

            if (horizontalDistance < minDistance) {
                minDistance = horizontalDistance;
                nearestId = capsule.id;
            }
        }

        return nearestId;
    }, [displayCapsules, clawPosition.x, clawPosition.z, phase, clawState]);

    const handleCollide = useCallback((id: string) => {
        if (onCapsuleCollide) {
            onCapsuleCollide(id);
        }
    }, [onCapsuleCollide]);

    // Don't render until we have capsules
    if (displayCapsules.length === 0) {
        return null;
    }

    return (
        <group>
            {displayCapsules.map((capsule) => {
                const isGrabbed = grabbedCapsule?.id === capsule.id;
                const isTargeted = targetedCapsuleId === capsule.id && !isGrabbed;

                return (
                    <Capsule
                        key={capsule.id}
                        id={capsule.id}
                        position={[capsule.position.x, capsule.position.y, capsule.position.z]}
                        rarity={capsule.rarity}
                        isGrabbed={isGrabbed}
                        isTargeted={isTargeted}
                        onCollide={handleCollide}
                    />
                );
            })}
        </group>
    );
}

export default CapsulePool;
