'use client'

import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import { SkillPlanet } from '@/types/3d'

interface PlanetDetailModalProps {
    planet: SkillPlanet | null
    isOpen: boolean
    onClose: () => void
}

// 3D Planet Model for detailed view
function DetailedPlanetModel({ planet }: { planet: SkillPlanet }) {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005
        }
    })

    return (
        <group>
            <mesh ref={meshRef}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial
                    color={planet.color}
                    emissive={planet.color}
                    emissiveIntensity={0.2}
                    roughness={0.3}
                    metalness={0.7}
                />
            </mesh>

            {/* Skill level rings around planet */}
            {Array.from({ length: Math.floor(planet.proficiencyLevel / 20) }, (_, i) => (
                <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[2.5 + i * 0.3, 2.7 + i * 0.3, 32]} />
                    <meshBasicMaterial
                        color={planet.color}
                        transparent
                        opacity={0.3}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}

            <ambientLight intensity={0.4} />
            <pointLight position={[5, 5, 5]} intensity={1} />
        </group>
    )
}

export default function PlanetDetailModal({ planet, isOpen, onClose }: PlanetDetailModalProps) {
    if (!isOpen || !planet) return null

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <span className="text-4xl">🪐</span>
                            {planet.name}
                        </h2>
                        <div className="flex items-center gap-3">
                            <span
                                className="inline-block px-4 py-1 rounded-full text-sm font-medium"
                                style={{
                                    backgroundColor: `${planet.color}20`,
                                    color: planet.color,
                                    border: `1px solid ${planet.color}40`
                                }}
                            >
                                {planet.category}
                            </span>
                            <span className="text-gray-400 text-sm">
                                ⭐ {planet.proficiencyLevel}% Mastery
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl transition-colors hover:rotate-90 duration-300"
                    >
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 3D Planet View */}
                    <div className="space-y-4">
                        <div className="h-72 bg-black/50 rounded-xl overflow-hidden border border-gray-700 shadow-inner">
                            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                                <DetailedPlanetModel planet={planet} />
                                <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={2} />
                            </Canvas>
                        </div>

                        {/* Proficiency Level */}
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <span>📊</span>
                                Proficiency Level
                            </h3>
                            <div className="relative">
                                <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                                    <div
                                        className="h-4 rounded-full transition-all duration-1000 ease-out"
                                        style={{
                                            width: `${planet.proficiencyLevel}%`,
                                            background: `linear-gradient(90deg, ${planet.color}, ${planet.color}dd)`
                                        }}
                                    />
                                </div>
                                <span
                                    className="absolute right-2 top-0 text-sm font-bold"
                                    style={{ color: planet.color }}
                                >
                                    {planet.proficiencyLevel}%
                                </span>
                            </div>
                            <div className="mt-2 text-xs text-gray-400">
                                {planet.proficiencyLevel >= 90 && '🏆 Expert Level - Industry Leading'}
                                {planet.proficiencyLevel >= 80 && planet.proficiencyLevel < 90 && '⭐ Advanced Level - Production Ready'}
                                {planet.proficiencyLevel >= 70 && planet.proficiencyLevel < 80 && '✨ Intermediate Level - Solid Foundation'}
                                {planet.proficiencyLevel < 70 && '🌱 Growing Level - Continuous Learning'}
                            </div>
                        </div>
                    </div>

                    {/* Planet Information */}
                    <div className="space-y-4">
                        {/* Description */}
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <span>📝</span>
                                Overview
                            </h3>
                            <p className="text-gray-300 leading-relaxed">{planet.description}</p>
                        </div>

                        {/* Technologies */}
                        {planet.technologies.length > 0 && (
                            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <span>🛠️</span>
                                    Tech Stack ({planet.technologies.length})
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {planet.technologies.map((tech, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                                            style={{
                                                backgroundColor: `${planet.color}15`,
                                                color: planet.color,
                                                border: `1px solid ${planet.color}30`
                                            }}
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Related Experience */}
                        {planet.experience.length > 0 && (
                            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <span>💼</span>
                                    Key Projects & Experience
                                </h3>
                                <div className="space-y-3">
                                    {planet.experience.map((exp, index) => (
                                        <div
                                            key={index}
                                            className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors"
                                        >
                                            <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                                                <span style={{ color: planet.color }}>▸</span>
                                                {exp.title}
                                            </h4>
                                            <p className="text-sm text-gray-400 mb-2">
                                                🏢 {exp.company} • 📅 {exp.duration}
                                            </p>
                                            <p className="text-sm text-gray-300 leading-relaxed mb-2">
                                                {exp.description}
                                            </p>
                                            {exp.technologies && exp.technologies.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {exp.technologies.map((tech, techIndex) => (
                                                        <span
                                                            key={techIndex}
                                                            className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Stats */}
                <div className="mt-6 pt-4 border-t border-gray-700">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-gray-800/30 rounded-lg p-3">
                            <div className="text-2xl font-bold" style={{ color: planet.color }}>
                                {planet.technologies.length}+
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Technologies</div>
                        </div>
                        <div className="bg-gray-800/30 rounded-lg p-3">
                            <div className="text-2xl font-bold" style={{ color: planet.color }}>
                                {planet.experience.length}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Major Projects</div>
                        </div>
                        <div className="bg-gray-800/30 rounded-lg p-3">
                            <div className="text-2xl font-bold" style={{ color: planet.color }}>
                                10+
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Years Experience</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}