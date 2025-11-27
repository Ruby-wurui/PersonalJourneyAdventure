'use client'

import React, { useState } from 'react'
import { motion, useSpring, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion'
import NavigationBarI18n from '@/components/layout/NavigationBarI18n'
import { useAuth } from '@/lib/auth-context'
import { LoginModal } from '@/components/auth/LoginModal'
import RegisterModal from '@/components/auth/RegisterModal'
import { Dictionary } from '@/i18n/get-dictionary'
import { usePathname } from 'next/navigation'
import { Locale } from '@/i18n/config'
import InteractiveGridBackground from '@/components/ui/InteractiveGridBackground'
import TechListCard from '@/components/ui/TechListCard'

interface SkillsPageClientProps {
    dict: Dictionary
}

// --- Animation Variants ---
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
}



export default function SkillsPageClient({ dict }: SkillsPageClientProps) {
    const pathname = usePathname()
    const locale = pathname.split('/')[1] as Locale
    const { isAuthenticated, user, logout } = useAuth()
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showRegisterModal, setShowRegisterModal] = useState(false)

    const skillsData = [
        {
            category: dict.about.skills_hci_design,
            items: [
                { title: "Rapid Prototyping", content: "Figma, Axure, Sketch", icon: "⚡", color: "blue", gradient: "from-blue-500/20 to-cyan-500/20" },
                { title: "Information Architecture", content: "User Flow Analysis, Sitemaps", icon: "🗺️", color: "blue", gradient: "from-blue-500/20 to-indigo-500/20" },
                { title: "Accessibility (A11y)", content: "WCAG 2.1, Screen Reader Optimization", icon: "♿", color: "blue", gradient: "from-cyan-500/20 to-blue-500/20" },
                { title: "UI Implementation", content: "Responsive Design, Pixel Perfect", icon: "🎨", color: "blue", gradient: "from-indigo-500/20 to-blue-500/20" },
            ]
        },
        {
            category: dict.about.skills_frontend,
            items: [
                { title: "Vue.js Ecosystem", content: "VuePress, Element UI", icon: "🟢", color: "green", gradient: "from-green-500/20 to-emerald-500/20" },
                { title: "Core Stack", content: "JavaScript/TypeScript, HTML5/CSS3", icon: "💻", color: "green", gradient: "from-emerald-500/20 to-teal-500/20" },
                { title: "Real-time", content: "WebRTC", icon: "📡", color: "green", gradient: "from-teal-500/20 to-green-500/20" },
            ]
        },
        {
            category: dict.about.skills_backend,
            items: [
                { title: "Runtime & Frameworks", content: "Node.js, Express.js", icon: "⚙️", color: "purple", gradient: "from-purple-500/20 to-violet-500/20" },
                { title: "Databases", content: "PostgreSQL, MySQL, Redis", icon: "🗄️", color: "purple", gradient: "from-violet-500/20 to-fuchsia-500/20" },
            ]
        },
        {
            category: dict.about.skills_ai,
            items: [
                { title: "LLM Integration", content: "ChatGPT, Claude", icon: "🤖", color: "pink", gradient: "from-pink-500/20 to-rose-500/20" },
                { title: "RAG Systems", content: "Retrieval-Augmented Generation", icon: "🧠", color: "pink", gradient: "from-rose-500/20 to-red-500/20" },
                { title: "AI Workflows", content: "Prompt Engineering, n8n, Dify", icon: "⛓️", color: "pink", gradient: "from-red-500/20 to-pink-500/20" },
            ]
        }
    ];

    return (
        <div className="relative w-full min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-green-500/30">
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

            <main className="relative z-10 container mx-auto px-4 py-24 md:py-32 max-w-7xl">
                {/* Hero Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="flex flex-col items-center text-center mb-24"
                >
                    <motion.div variants={fadeInUp} className="relative mb-6">
                        <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-mono text-green-400 backdrop-blur-md">
                            {dict.nav.skills_desc}
                        </span>
                    </motion.div>

                    <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
                            {dict.nav.skills}
                        </span>
                    </motion.h1>

                    <motion.p variants={fadeInUp} className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
                        {dict.universe.subtitle}
                    </motion.p>
                </motion.div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {skillsData.map((category, index) => (
                        <div key={index} className="h-full">
                            <TechListCard
                                category={category.category}
                                items={category.items}
                                index={index}
                            />
                        </div>
                    ))}
                </div>

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
            </main>
        </div>
    )
}
