'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import NavigationBarI18n from '@/components/layout/NavigationBarI18n'
import { useAuth } from '@/lib/auth-context'
import { LoginModal } from '@/components/auth/LoginModal'
import RegisterModal from '@/components/auth/RegisterModal'
import { Dictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'
import { useRouter } from 'next/navigation'
import InteractiveGridBackground from '@/components/ui/InteractiveGridBackground'

interface GamesPageClientProps {
    dict: Dictionary
    locale: Locale
}

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
}

// Game Card Component
const GameCard = ({
    title,
    description,
    image,
    tags,
    onClick,
    gradient
}: {
    title: string
    description: string
    image: string
    tags: string[]
    onClick: () => void
    gradient: string
}) => {
    return (
        <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative group cursor-pointer"
            onClick={onClick}
        >
            <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 shadow-2xl">
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 from-transparent to-gray-900/80 z-10" />
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                </div>

                {/* Content */}
                <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                        {title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        {description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-medium"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 backdrop-blur-sm">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default function GamesPageClient({ dict, locale }: GamesPageClientProps) {
    const { isAuthenticated, user, logout } = useAuth()
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showRegisterModal, setShowRegisterModal] = useState(false)
    const router = useRouter()

    // Game list data
    const games = [
        {
            id: 'neon-claw',
            title: dict.games?.neon_claw_title || 'Neon Claw Machine',
            description: dict.games?.neon_claw_desc || 'A cyberpunk-style claw machine game with AI hand gesture control',
            image: '/NeonClaw.jpg',
            tags: ['3D', 'AI', 'Hand Tracking', 'WebGL'],
            path: `/${locale}/game`,
            gradient: 'from-cyan-500 via-purple-500 to-pink-500'
        },
        {
            id: 'hanzi-shifter',
            title: dict.games?.hanzi_shifter_title || 'HanziShifter',
            description: dict.games?.hanzi_shifter_desc || 'An interactive Chinese character learning game built with Unity',
            image: '/HanziShifter.png',
            tags: ['Unity', 'WebGL', 'Education', 'Chinese'],
            path: `/${locale}/hanzi-shifter`,
            gradient: 'from-orange-500 via-red-500 to-pink-500'
        },
        // 添加新游戏模板 - 取消注释并修改以下内容来添加新游戏
        // {
        //     id: 'your-game-id',
        //     title: dict.games?.your_game_title || 'Your Game Title',
        //     description: dict.games?.your_game_desc || 'Your game description',
        //     image: '/path/to/your/game/image.jpg',
        //     tags: ['Tag1', 'Tag2', 'Tag3'],
        //     path: `/${locale}/your-game-route`,
        //     gradient: 'from-blue-500 via-green-500 to-yellow-500'
        // },
    ]

    const handleGameClick = (path: string) => {
        router.push(path)
    }

    return (
        <div className="relative w-full min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-purple-500/30">
            {/* Background Effects */}
            <InteractiveGridBackground />

            {/* Navigation Bar */}
            <div className="relative z-50">
                <NavigationBarI18n
                    locale={locale}
                    dict={dict}
                    isAuthenticated={isAuthenticated}
                    user={user}
                    onLogin={() => setShowLoginModal(true)}
                    onRegister={() => setShowRegisterModal(true)}
                    onLogout={logout}
                />
            </div>

            <main className="relative z-10 container mx-auto px-4 py-24 md:py-32 max-w-6xl">
                {/* Hero Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="flex flex-col items-center text-center mb-20"
                >
                    <motion.div variants={fadeInUp} className="mb-6">
                        <div className="inline-block p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10">
                            <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </motion.div>

                    <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500 drop-shadow-sm">
                            {dict.games?.title || 'Game Center'}
                        </span>
                    </motion.h1>

                    <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-400 mb-10 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
                        {dict.games?.subtitle || 'Explore interactive games built with cutting-edge web technologies'}
                    </motion.p>

                    <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 text-sm md:text-base font-medium">
                        <span className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-gray-300 shadow-lg flex items-center gap-2">
                            <span className="text-blue-400">🎮</span> {games.length} {dict.games?.games_available || 'Games Available'}
                        </span>
                        <span className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-gray-300 shadow-lg flex items-center gap-2">
                            <span className="text-purple-400">✨</span> {dict.games?.powered_by || 'Powered by'} WebGL & Three.js
                        </span>
                    </motion.div>
                </motion.div>

                {/* Games Grid */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="mb-20"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {games.map((game) => (
                            <GameCard
                                key={game.id}
                                title={game.title}
                                description={game.description}
                                image={game.image}
                                tags={game.tags}
                                onClick={() => handleGameClick(game.path)}
                                gradient={game.gradient}
                            />
                        ))}
                    </div>
                </motion.section>

                {/* Coming Soon Section */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="text-center"
                >
                    <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-12 border border-white/10">
                        <div className="text-6xl mb-4">🚀</div>
                        <h2 className="text-3xl font-bold text-white mb-4">
                            {dict.games?.more_coming_soon || 'More Games Coming Soon'}
                        </h2>
                        <p className="text-gray-400 text-lg">
                            {dict.games?.stay_tuned || 'Stay tuned for more interactive experiences'}
                        </p>
                    </div>
                </motion.section>
            </main>

            {/* Login/Register Modals */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSwitchToRegister={() => {
                    setShowLoginModal(false)
                    setShowRegisterModal(true)
                }}
            />
            <RegisterModal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onSwitchToLogin={() => {
                    setShowRegisterModal(false)
                    setShowLoginModal(true)
                }}
            />
        </div>
    )
}
