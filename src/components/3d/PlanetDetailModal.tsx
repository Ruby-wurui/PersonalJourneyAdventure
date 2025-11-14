'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import { SkillPlanet } from '@/types/3d'

// Import local planet textures
import planet1 from '@/assets/planet/image.png'
import planet2 from '@/assets/planet/image copy.png'
import planet3 from '@/assets/planet/image copy 2.png'
import planet4 from '@/assets/planet/image copy 3.png'
import planet5 from '@/assets/planet/image copy 4.png'

// Planet texture mapping
const PLANET_TEXTURES: Record<string, any> = {
    frontend: planet1,
    backend: planet2,
    devops: planet3,
    'ai-ml': planet4,
    mobile: planet5,
}

interface PlanetDetailModalProps {
    planet: SkillPlanet | null
    isOpen: boolean
    onClose: () => void
    dict?: any
}

// Enhanced 3D Planet Model for detailed view
function DetailedPlanetModel({ planet }: { planet: SkillPlanet }) {
    const meshRef = useRef<THREE.Mesh>(null)
    const glowRef = useRef<THREE.Mesh>(null)

    // Load texture
    const texture = useMemo(() => {
        const planetImage = PLANET_TEXTURES[planet.id]
        if (planetImage) {
            const loader = new THREE.TextureLoader()
            try {
                const tex = loader.load(planetImage.src)
                tex.anisotropy = 16
                tex.minFilter = THREE.LinearMipmapLinearFilter
                tex.magFilter = THREE.LinearFilter
                return tex
            } catch (error) {
                console.warn(`Failed to load texture for ${planet.id}`)
                return null
            }
        }
        return null
    }, [planet.id])

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.008
        }

        // Pulsing glow effect
        if (glowRef.current) {
            const pulse = Math.sin(state.clock.getElapsedTime() * 2) * 0.1 + 1.1
            glowRef.current.scale.setScalar(pulse)
        }
    })

    return (
        <group>
            {/* Ambient and point lights */}
            <ambientLight intensity={0.5} />
            <pointLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
            <pointLight position={[-5, -5, -5]} intensity={1} color={planet.color} />
            <pointLight position={[0, 8, 0]} intensity={1.5} color="#ffffff" />

            {/* Outer glow layers */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[2.3, 32, 32]} />
                <meshBasicMaterial
                    color={planet.color}
                    transparent
                    opacity={0.3}
                    side={THREE.BackSide}
                />
            </mesh>

            <mesh scale={1.15}>
                <sphereGeometry args={[2.3, 32, 32]} />
                <meshBasicMaterial
                    color={planet.color}
                    transparent
                    opacity={0.15}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Main planet with texture */}
            <mesh ref={meshRef} castShadow receiveShadow>
                <sphereGeometry args={[2, 128, 128]} />
                {texture ? (
                    <meshStandardMaterial
                        map={texture}
                        emissive={planet.color}
                        emissiveIntensity={0.4}
                        roughness={0.6}
                        metalness={0.3}
                        envMapIntensity={1.5}
                    />
                ) : (
                    <meshStandardMaterial
                        color={planet.color}
                        emissive={planet.color}
                        emissiveIntensity={0.4}
                        roughness={0.6}
                        metalness={0.3}
                    />
                )}
            </mesh>

            {/* Enhanced skill level rings */}
            {Array.from({ length: Math.floor(planet.proficiencyLevel / 20) }, (_, i) => (
                <group key={i}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[2.5 + i * 0.35, 2.55 + i * 0.35, 64]} />
                        <meshBasicMaterial
                            color={planet.color}
                            transparent
                            opacity={0.6}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[2.6 + i * 0.35, 2.65 + i * 0.35, 64]} />
                        <meshBasicMaterial
                            color={planet.color}
                            transparent
                            opacity={0.3}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                </group>
            ))}

            {/* Particle effects around planet */}
            <ParticleRing planet={planet} />
        </group>
    )
}

// Particle ring effect
function ParticleRing({ planet }: { planet: SkillPlanet }) {
    const particlesRef = useRef<THREE.Points>(null)

    const particles = useMemo(() => {
        const count = 100
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const color = new THREE.Color(planet.color)

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2
            const radius = 3 + Math.random() * 0.5
            positions[i * 3] = Math.cos(angle) * radius
            positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3
            positions[i * 3 + 2] = Math.sin(angle) * radius

            colors[i * 3] = color.r
            colors[i * 3 + 1] = color.g
            colors[i * 3 + 2] = color.b
        }

        return { positions, colors }
    }, [planet.color])

    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y += 0.002
        }
    })

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.positions.length / 3}
                    array={particles.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={particles.colors.length / 3}
                    array={particles.colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
            />
        </points>
    )
}

export default function PlanetDetailModal({ planet, isOpen, onClose, dict }: PlanetDetailModalProps) {
    if (!isOpen || !planet) return null

    // Default to English if dict is not provided
    const t = dict?.planet_modal || {
        proficiency_level: "Proficiency Level",
        overview: "Overview",
        tech_stack: "Tech Stack",
        key_projects: "Key Projects & Experience",
        technologies: "Technologies",
        major_projects: "Major Projects",
        years_experience: "Years Experience",
        mastery: "Mastery",
        expert_level: "Expert Level - Industry Leading",
        advanced_level: "Advanced Level - Production Ready",
        intermediate_level: "Intermediate Level - Solid Foundation",
        growing_level: "Growing Level - Continuous Learning"
    }

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="stars-small"></div>
                <div className="stars-medium"></div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
                style={{
                    border: `2px solid ${planet.color}40`,
                    boxShadow: `0 0 60px ${planet.color}20, 0 20px 80px rgba(0,0,0,0.5)`
                }}
            >
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
                                ⭐ {planet.proficiencyLevel}% {t.mastery}
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
                        <div className="h-72 bg-gradient-to-b from-black via-gray-900 to-black rounded-xl overflow-hidden border-2 shadow-2xl relative"
                            style={{ borderColor: `${planet.color}40` }}
                        >
                            {/* Starfield background */}
                            <div className="absolute inset-0 opacity-30">
                                <div className="stars-small"></div>
                            </div>

                            <Canvas
                                camera={{ position: [0, 0, 8], fov: 50 }}
                                gl={{
                                    antialias: true,
                                    alpha: true,
                                    powerPreference: 'high-performance'
                                }}
                            >
                                <DetailedPlanetModel planet={planet} />
                                <OrbitControls
                                    enableZoom={true}
                                    enablePan={false}
                                    autoRotate
                                    autoRotateSpeed={1.5}
                                    minDistance={5}
                                    maxDistance={12}
                                />
                            </Canvas>

                            {/* Planet name overlay */}
                            <div className="absolute bottom-4 left-4 right-4 text-center">
                                <div
                                    className="inline-block px-4 py-2 rounded-full backdrop-blur-md font-bold text-white"
                                    style={{
                                        backgroundColor: `${planet.color}30`,
                                        border: `2px solid ${planet.color}60`,
                                        textShadow: `0 0 10px ${planet.color}`
                                    }}
                                >
                                    {planet.name}
                                </div>
                            </div>
                        </div>

                        {/* Proficiency Level */}
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <span>📊</span>
                                {t.proficiency_level}
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
                                {planet.proficiencyLevel >= 90 && `🏆 ${t.expert_level}`}
                                {planet.proficiencyLevel >= 80 && planet.proficiencyLevel < 90 && `⭐ ${t.advanced_level}`}
                                {planet.proficiencyLevel >= 70 && planet.proficiencyLevel < 80 && `✨ ${t.intermediate_level}`}
                                {planet.proficiencyLevel < 70 && `🌱 ${t.growing_level}`}
                            </div>
                        </div>
                    </div>

                    {/* Planet Information */}
                    <div className="space-y-4">
                        {/* Description */}
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <span>📝</span>
                                {t.overview}
                            </h3>
                            <p className="text-gray-300 leading-relaxed">{planet.description}</p>
                        </div>

                        {/* Technologies */}
                        {planet.technologies.length > 0 && (
                            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <span>🛠️</span>
                                    {t.tech_stack} ({planet.technologies.length})
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
                                    {t.key_projects}
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
                            <div className="text-xs text-gray-400 mt-1">{t.technologies}</div>
                        </div>
                        <div className="bg-gray-800/30 rounded-lg p-3">
                            <div className="text-2xl font-bold" style={{ color: planet.color }}>
                                {planet.experience.length}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">{t.major_projects}</div>
                        </div>
                        <div className="bg-gray-800/30 rounded-lg p-3">
                            <div className="text-2xl font-bold" style={{ color: planet.color }}>
                                7+
                            </div>
                            <div className="text-xs text-gray-400 mt-1">{t.years_experience}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}