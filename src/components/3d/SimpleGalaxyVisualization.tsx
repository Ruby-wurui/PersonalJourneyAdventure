'use client'

import React, { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { GalaxyVisualizationProps, SkillPlanet } from '@/types/3d'

// Import local planet textures
import earthLike from '@/assets/planet/earth_like.png'
import cyberTech from '@/assets/planet/cyber_tech.png'
import gasGiant from '@/assets/planet/gas_giant.png'
import iceWorld from '@/assets/planet/ice_world.png'

// Planet texture mapping using local images
const PLANET_TEXTURES: Record<string, any> = {
    about: earthLike,       // About Me - Earth-like
    tech: cyberTech,        // Technology - Cyber/Tech
    projects: gasGiant,     // Projects - Gas Giant
    blog: iceWorld,         // Blog - Ice World
}

// Enhanced Planet Component with Texture
function EnhancedPlanet({
    planet,
    isSelected,
    onClick
}: {
    planet: SkillPlanet
    isSelected: boolean
    onClick: (planet: SkillPlanet) => void
}) {
    const meshRef = useRef<THREE.Mesh>(null)
    const glowRef = useRef<THREE.Mesh>(null)
    const [hovered, setHovered] = useState(false)
    const [labelPosition, setLabelPosition] = useState<[number, number, number]>([0, 0, 0])

    // Load texture from local images
    const texture = useMemo(() => {
        const planetImage = PLANET_TEXTURES[planet.id]
        if (planetImage) {
            const loader = new THREE.TextureLoader()
            try {
                const tex = loader.load(planetImage.src)
                // Enhance texture quality
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

    // Calculate orbital position
    const angle = (planet.id.charCodeAt(0) * 0.1)

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const orbitAngle = time * planet.orbitSpeed + angle
        const x = Math.cos(orbitAngle) * planet.orbitRadius
        const z = Math.sin(orbitAngle) * planet.orbitRadius
        const y = planet.position[1]

        if (meshRef.current) {
            // Smooth rotation
            meshRef.current.rotation.y += 0.005

            // Update orbital position
            meshRef.current.position.x = x
            meshRef.current.position.z = z
            meshRef.current.position.y = y

            // Smooth scale animation with bounce effect
            const targetScale = (hovered || isSelected) ? 1.3 : 1
            const currentScale = meshRef.current.scale.x
            const newScale = currentScale + (targetScale - currentScale) * 0.1
            meshRef.current.scale.setScalar(newScale)
        }

        // Animate glow
        if (glowRef.current) {
            glowRef.current.position.x = x
            glowRef.current.position.z = z
            glowRef.current.position.y = y

            // Pulsing glow effect
            const pulse = Math.sin(time * 2) * 0.1 + 1.1
            glowRef.current.scale.setScalar(pulse * (hovered || isSelected ? 1.4 : 1.2))
        }

        // Update label position to follow planet
        setLabelPosition([x, y + planet.size + 0.8, z])
    })

    return (
        <group>
            {/* Outer glow - multiple layers for better effect */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[planet.size * 1.15, 32, 32]} />
                <meshBasicMaterial
                    color={planet.color}
                    transparent
                    opacity={hovered || isSelected ? 0.4 : 0.2}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Additional glow layer */}
            <mesh>
                <sphereGeometry args={[planet.size * 1.25, 32, 32]} />
                <meshBasicMaterial
                    color={planet.color}
                    transparent
                    opacity={hovered || isSelected ? 0.2 : 0.1}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Main planet */}
            <mesh
                ref={meshRef}
                onClick={() => onClick(planet)}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                castShadow
                receiveShadow
            >
                <sphereGeometry args={[planet.size, 128, 128]} />
                {texture ? (
                    <meshStandardMaterial
                        map={texture}
                        emissive={planet.color}
                        emissiveIntensity={isSelected ? 0.5 : hovered ? 0.4 : 0.2}
                        roughness={0.6}
                        metalness={0.3}
                        envMapIntensity={1.5}
                    />
                ) : (
                    <meshStandardMaterial
                        color={planet.color}
                        emissive={planet.color}
                        emissiveIntensity={isSelected ? 0.5 : hovered ? 0.4 : 0.2}
                        roughness={0.6}
                        metalness={0.3}
                    />
                )}
            </mesh>

            {/* Planet Label - follows planet position */}
            <Html
                position={labelPosition}
                center
                distanceFactor={8}
                style={{
                    pointerEvents: 'none',
                    userSelect: 'none'
                }}
            >
                <div className="text-center">
                    <div
                        className={`text-white font-bold whitespace-nowrap px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-200 ${hovered || isSelected
                            ? 'bg-black/90 text-2xl scale-125 border-2 border-white/50'
                            : 'bg-black/60 text-sm border border-white/20'
                            }`}
                        style={{
                            textShadow: `0 0 10px ${planet.color}, 0 0 20px ${planet.color}`,
                            boxShadow: hovered || isSelected ? `0 0 15px ${planet.color}40` : 'none'
                        }}
                    >
                        {planet.name}
                    </div>
                </div>
            </Html>

            {/* Ring for selected/hovered planet - enhanced */}
            {(hovered || isSelected) && meshRef.current && (
                <>
                    <mesh
                        position={[meshRef.current.position.x, meshRef.current.position.y, meshRef.current.position.z]}
                        rotation={[Math.PI / 2, 0, 0]}
                    >
                        <ringGeometry args={[planet.size * 1.5, planet.size * 1.55, 64]} />
                        <meshBasicMaterial
                            color={planet.color}
                            transparent
                            opacity={0.8}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                    <mesh
                        position={[meshRef.current.position.x, meshRef.current.position.y, meshRef.current.position.z]}
                        rotation={[Math.PI / 2, 0, 0]}
                    >
                        <ringGeometry args={[planet.size * 1.6, planet.size * 1.65, 64]} />
                        <meshBasicMaterial
                            color={planet.color}
                            transparent
                            opacity={0.4}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                </>
            )}
        </group>
    )
}

// Orbit Path Component
function OrbitPath({ radius }: { radius: number }) {
    const points = useMemo(() => {
        const curve = new THREE.EllipseCurve(
            0, 0,
            radius, radius,
            0, 2 * Math.PI,
            false,
            0
        )
        const pts = curve.getPoints(100)
        return pts.map(p => new THREE.Vector3(p.x, 0, p.y))
    }, [radius])

    return (
        <line>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={points.length}
                    array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial color="#444444" transparent opacity={0.3} />
        </line>
    )
}

// Starfield Background
function Starfield() {
    const starsRef = useRef<THREE.Points>(null)

    const [positions, colors] = useMemo(() => {
        const positions = new Float32Array(2000 * 3)
        const colors = new Float32Array(2000 * 3)

        for (let i = 0; i < 2000; i++) {
            const i3 = i * 3
            positions[i3] = (Math.random() - 0.5) * 100
            positions[i3 + 1] = (Math.random() - 0.5) * 100
            positions[i3 + 2] = (Math.random() - 0.5) * 100

            const color = new THREE.Color()
            color.setHSL(Math.random(), 0.3, 0.7)
            colors[i3] = color.r
            colors[i3 + 1] = color.g
            colors[i3 + 2] = color.b
        }

        return [positions, colors]
    }, [])

    useFrame(() => {
        if (starsRef.current) {
            starsRef.current.rotation.y += 0.0001
        }
    })

    return (
        <points ref={starsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
            />
        </points>
    )
}

// Enhanced Galaxy Scene
function EnhancedGalaxyScene({
    skillPlanets,
    onPlanetSelect
}: {
    skillPlanets: SkillPlanet[]
    onPlanetSelect: (planet: SkillPlanet) => void
}) {
    const [selectedPlanet, setSelectedPlanet] = useState<SkillPlanet | null>(null)
    const sunRef = useRef<THREE.Mesh>(null)

    const handlePlanetClick = (planet: SkillPlanet) => {
        setSelectedPlanet(planet)
        onPlanetSelect(planet)
    }

    useFrame((state) => {
        if (sunRef.current) {
            sunRef.current.rotation.y += 0.002
            // Pulsing sun effect
            const pulse = Math.sin(state.clock.getElapsedTime() * 2) * 0.05 + 1
            sunRef.current.scale.setScalar(pulse)
        }
    })

    return (
        <>
            {/* Starfield background */}
            <Starfield />

            {/* Enhanced Lighting System */}
            <ambientLight intensity={0.4} />

            {/* Sun light from center */}
            <pointLight position={[0, 0, 0]} intensity={3} color="#ffd700" distance={60} decay={2} />

            {/* Fill lights for better planet visibility */}
            <pointLight position={[15, 15, 15]} intensity={0.8} color="#ffffff" distance={50} />
            <pointLight position={[-15, -15, -15]} intensity={0.5} color="#6688ff" distance={50} />
            <pointLight position={[0, 20, 0]} intensity={0.6} color="#ff88ff" distance={50} />

            {/* Directional light for depth */}
            <directionalLight position={[10, 10, 5]} intensity={0.5} color="#ffffff" />

            {/* Galaxy center (Sun) - Enhanced */}
            <mesh ref={sunRef}>
                <sphereGeometry args={[0.9, 64, 64]} />
                <meshStandardMaterial
                    color="#ffcc00"
                    emissive="#ff8800"
                    emissiveIntensity={2}
                    roughness={0.3}
                    metalness={0.1}
                />
            </mesh>

            {/* Sun glow - multiple layers */}
            <mesh scale={1.2}>
                <sphereGeometry args={[0.9, 32, 32]} />
                <meshBasicMaterial
                    color="#ffaa00"
                    transparent
                    opacity={0.5}
                    side={THREE.BackSide}
                />
            </mesh>

            <mesh scale={1.5}>
                <sphereGeometry args={[0.9, 32, 32]} />
                <meshBasicMaterial
                    color="#ff8800"
                    transparent
                    opacity={0.3}
                    side={THREE.BackSide}
                />
            </mesh>

            <mesh scale={1.8}>
                <sphereGeometry args={[0.9, 32, 32]} />
                <meshBasicMaterial
                    color="#ff6600"
                    transparent
                    opacity={0.15}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Orbit paths */}
            {skillPlanets.map(planet => (
                <OrbitPath key={`orbit-${planet.id}`} radius={planet.orbitRadius} />
            ))}

            {/* Skill planets */}
            {skillPlanets.map(planet => (
                <EnhancedPlanet
                    key={planet.id}
                    planet={planet}
                    isSelected={selectedPlanet?.id === planet.id}
                    onClick={handlePlanetClick}
                />
            ))}

            {/* Controls */}
            <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={8}
                maxDistance={35}
                autoRotate={true}
                autoRotateSpeed={0.5}
            />
        </>
    )
}

// Main Enhanced Galaxy Visualization Component
export default function SimpleGalaxyVisualization(props: GalaxyVisualizationProps) {
    return (
        <div className="w-full h-full relative">
            {/* Ruby's Universe Logo - Top Left */}
            <div className="absolute top-27 left-6 z-10 pointer-events-none">
                <div className="flex item-center gap-4">
                    {/* Animated Planet Logo */}
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 animate-pulse shadow-2xl flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 flex items-center justify-center">
                                <span className="text-2xl">🪐</span>
                            </div>
                        </div>
                        {/* Orbit ring */}
                        <div className="absolute inset-0 rounded-full border-2 border-purple-400/30 animate-spin" style={{ animationDuration: '8s' }}>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                        </div>
                    </div>

                    {/* Text Logo */}
                    <div className="text-left">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
                            Ruby&apos;s Universe
                        </h1>
                        <p className="text-sm text-gray-300 mt-1 font-medium tracking-wide">
                            ✨ Explore Skills & Experience 111
                        </p>
                    </div>
                </div>
            </div>

            {/* 3D Canvas */}
            <Canvas
                camera={{ position: [0, 8, 15], fov: 75 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance'
                }}
                className="bg-black"
            >
                <EnhancedGalaxyScene
                    skillPlanets={props.skillPlanets}
                    onPlanetSelect={props.onPlanetSelect}
                />
            </Canvas>
        </div>
    )
}