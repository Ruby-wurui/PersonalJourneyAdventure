'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, useMotionValue } from 'framer-motion'
import NavigationBarI18n from '@/components/layout/NavigationBarI18n'
import { useAuth } from '@/lib/auth-context'
import { LoginModal } from '@/components/auth/LoginModal'
import RegisterModal from '@/components/auth/RegisterModal'
import avatarImg from '@/assets/imgs/avatar.png'
import { Dictionary } from '@/i18n/get-dictionary'
import { usePathname } from 'next/navigation'
import { Locale } from '@/i18n/config'
import { useRouter } from 'next/navigation'
import InteractiveGridBackground from '@/components/ui/InteractiveGridBackground'

interface AboutPageClientProps {
    dict: Dictionary
}

// --- Animation Variants ---
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

// --- 3D Tilt Card Component ---
const TimelineCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left - width / 2);
        mouseY.set(clientY - top - height / 2);
    }

    function handleMouseLeave() {
        mouseX.set(0);
        mouseY.set(0);
    }

    const rotateX = useSpring(useTransform(mouseY, [-300, 300], [4, -4]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-4, 4]), { stiffness: 150, damping: 20 });
    const brightness = useSpring(useTransform(mouseY, [-300, 300], [1.1, 0.9]), { stiffness: 150, damping: 20 });

    return (
        <motion.div
            style={{ perspective: 1000 }}
            className={`relative ${className}`}
        >
            <motion.div
                style={{ rotateX, rotateY, filter: useMotionTemplate`brightness(${brightness})` }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-full h-full bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 transform-style-3d shadow-2xl group"
            >
                {/* Inner Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {children}
            </motion.div>
        </motion.div>
    );
};

export default function AboutPageClient({ dict }: AboutPageClientProps) {
    const pathname = usePathname()
    const locale = pathname.split('/')[1] as Locale
    const { isAuthenticated, user, logout } = useAuth()
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showRegisterModal, setShowRegisterModal] = useState(false)
    const router = useRouter()

    // Scroll progress for timeline line
    const timelineRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start 20%", "end 80%"]
    })

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
    const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1])

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
                    className="flex flex-col items-center text-center mb-32"
                >
                    <motion.div variants={fadeInUp} className="relative mb-10 group cursor-pointer">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500 animate-tilt"></div>
                        <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-black/80 ring-2 ring-white/10 shadow-2xl">
                            <img src={avatarImg.src} alt="Ruby Wu" className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out" />
                        </div>
                        <div className="absolute bottom-3 right-3 w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full border-4 border-black flex items-center justify-center z-20 shadow-lg">
                            <div className="w-full h-full rounded-full animate-pulse bg-green-400/80"></div>
                        </div>
                    </motion.div>

                    <motion.h1 variants={fadeInUp} className="text-5xl md:text-8xl font-bold mb-6 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500 drop-shadow-sm">
                            {dict.about.title}
                        </span>
                    </motion.h1>

                    <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-400 mb-10 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
                        {dict.about.subtitle}
                    </motion.p>

                    <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 text-sm md:text-base font-medium">
                        <span className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-gray-300 shadow-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
                            <span className="text-red-400">📍</span> {dict.about.location}
                        </span>
                        <a href="mailto:wurui3458@gmail.com" className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-gray-300 shadow-lg hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-200 transition-all duration-300 flex items-center gap-2 group">
                            <span className="group-hover:scale-110 transition-transform">📧</span> wurui3458@gmail.com
                        </a>
                        <a href="https://github.com/Ruby-wurui" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-gray-300 shadow-lg hover:bg-purple-500/20 hover:border-purple-500/50 hover:text-purple-200 transition-all duration-300 flex items-center gap-2 group">
                            <span className="group-hover:scale-110 transition-transform">💻</span> {dict.about.github}
                        </a>
                    </motion.div>
                </motion.div>

                {/* Professional Summary */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="mb-32 max-w-4xl mx-auto"
                >
                    <TimelineCard>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60"></div>
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-blue-400 text-4xl">✦</span> {dict.about.professional_summary}
                        </h2>
                        <p className="text-gray-300 leading-relaxed text-lg md:text-xl font-light tracking-wide">
                            {dict.about.professional_summary_text}
                        </p>
                    </TimelineCard>
                </motion.section>

                {/* Work Experience Timeline */}
                <motion.section
                    ref={timelineRef}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="mb-32 relative"
                >
                    <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-20 text-center">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500">
                            {dict.about.work_experience}
                        </span>
                    </motion.h2>

                    <div className="relative max-w-7xl mx-auto">
                        {/* Center Animated Vertical Line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[2px] bg-white/5 hidden md:block rounded-full overflow-hidden">
                            <motion.div
                                style={{ height: lineHeight, opacity }}
                                className="w-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,1)]"
                            />
                        </div>

                        {/* Position 1 - Right Side */}
                        <div className="relative grid md:grid-cols-2 gap-8 mb-24">
                            <div className="hidden md:block"></div>
                            <motion.div
                                variants={fadeInUp}
                                className="relative"
                            >
                                {/* Node & Connector */}
                                <div className="hidden md:block absolute -left-[calc(50%+2rem)] top-10 w-8 h-8 z-20">
                                    <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-[#050505] shadow-[0_0_15px_rgba(59,130,246,0.8)] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                                </div>
                                <div className="hidden md:block absolute -left-[calc(50%+2rem)] top-10 w-[calc(50%+2rem)] h-[1px] bg-gradient-to-r from-blue-500/50 to-transparent"></div>

                                <TimelineCard className="border-l-4 border-l-blue-500">
                                    <div className="flex flex-col justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2">{dict.about.position_1_title}</h3>
                                            <p className="text-blue-400 text-lg font-medium">{dict.about.position_1_company}</p>
                                        </div>
                                        <span className="mt-3 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-300 text-sm border border-blue-500/20 font-mono">
                                            {dict.about.position_1_duration}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 italic mb-8 pl-4 border-l-2 border-white/5">
                                        {dict.about.position_1_context}
                                    </p>
                                    <div className="space-y-5">
                                        {[1, 2, 3, 4].map((num) => (
                                            <div key={num} className="group/item">
                                                <h4 className="text-blue-200 font-medium mb-2 group-hover/item:text-blue-100 transition-colors flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                    {dict.about[`position_1_project_${num}_title` as keyof typeof dict.about]}
                                                </h4>
                                                <p className="text-gray-400 text-sm pl-4 leading-relaxed border-l border-white/5 ml-[3px]">
                                                    {dict.about[`position_1_project_${num}_desc` as keyof typeof dict.about]}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </TimelineCard>
                            </motion.div>
                        </div>

                        {/* Position 2 - Left Side */}
                        <div className="relative grid md:grid-cols-2 gap-8 mb-24">
                            <motion.div
                                variants={fadeInUp}
                                className="relative md:text-right"
                            >
                                {/* Node & Connector */}
                                <div className="hidden md:block absolute -right-[calc(50%+2rem)] top-10 w-8 h-8 z-20">
                                    <div className="w-4 h-4 bg-green-500 rounded-full border-4 border-[#050505] shadow-[0_0_15px_rgba(34,197,94,0.8)] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                                </div>
                                <div className="hidden md:block absolute -right-[calc(50%+2rem)] top-10 w-[calc(50%+2rem)] h-[1px] bg-gradient-to-l from-green-500/50 to-transparent"></div>

                                <TimelineCard className="border-r-4 border-r-green-500">
                                    <div className="flex flex-col md:items-end justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2">{dict.about.position_2_title}</h3>
                                            <p className="text-green-400 text-lg font-medium">{dict.about.position_2_company}</p>
                                        </div>
                                        <span className="mt-3 px-4 py-1.5 rounded-full bg-green-500/10 text-green-300 text-sm border border-green-500/20 font-mono">
                                            {dict.about.position_2_duration}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 italic mb-8 md:pr-4 md:pl-0 pl-4 md:border-r-2 md:border-l-0 border-l-2 border-white/5">
                                        {dict.about.position_2_context}
                                    </p>
                                    <div className="space-y-5">
                                        {[1, 2, 3].map((num) => (
                                            <div key={num} className="group/item flex flex-col md:items-end">
                                                <h4 className="text-green-200 font-medium mb-2 group-hover/item:text-green-100 transition-colors flex items-center gap-2 md:flex-row-reverse">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                    {dict.about[`position_2_project_${num}_title` as keyof typeof dict.about]}
                                                </h4>
                                                <p className="text-gray-400 text-sm pl-4 md:pl-0 md:pr-4 leading-relaxed md:border-r border-l md:border-l-0 border-white/5 md:mr-[3px] ml-[3px] md:text-right">
                                                    {dict.about[`position_2_project_${num}_desc` as keyof typeof dict.about]}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </TimelineCard>
                            </motion.div>
                            <div className="hidden md:block"></div>
                        </div>

                        {/* Position 3 - Right Side */}
                        <div className="relative grid md:grid-cols-2 gap-8">
                            <div className="hidden md:block"></div>
                            <motion.div
                                variants={fadeInUp}
                                className="relative"
                            >
                                {/* Node & Connector */}
                                <div className="hidden md:block absolute -left-[calc(50%+2rem)] top-10 w-8 h-8 z-20">
                                    <div className="w-4 h-4 bg-purple-500 rounded-full border-4 border-[#050505] shadow-[0_0_15px_rgba(168,85,247,0.8)] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                                </div>
                                <div className="hidden md:block absolute -left-[calc(50%+2rem)] top-10 w-[calc(50%+2rem)] h-[1px] bg-gradient-to-r from-purple-500/50 to-transparent"></div>

                                <TimelineCard className="border-l-4 border-l-purple-500">
                                    <div className="flex flex-col justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2">{dict.about.position_3_title}</h3>
                                            <p className="text-purple-400 text-lg font-medium">{dict.about.position_3_company}</p>
                                        </div>
                                        <span className="mt-3 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-300 text-sm border border-purple-500/20 font-mono">
                                            {dict.about.position_3_duration}
                                        </span>
                                    </div>
                                    <div className="space-y-5">
                                        {[1, 2].map((num) => (
                                            <div key={num} className="group/item">
                                                <p className="text-gray-300 text-sm pl-4 border-l-2 border-purple-500/30 leading-relaxed">
                                                    {dict.about[`position_3_project_${num}_desc` as keyof typeof dict.about]}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </TimelineCard>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>



                {/* Education */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="mb-20"
                >
                    <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-white mb-16 text-center">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-600">
                            {dict.about.education}
                        </span>
                    </motion.h2>

                    <motion.div variants={fadeInUp}>
                        <TimelineCard className="relative group border-l-4 border-l-purple-500">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-2">{dict.about.education_degree}</h3>
                                    <p className="text-purple-300 text-xl">{dict.about.education_university}</p>
                                </div>
                                <span className="mt-4 md:mt-0 px-5 py-2 rounded-xl bg-purple-500/10 text-purple-200 text-sm font-mono border border-purple-500/30">
                                    {dict.about.education_duration}
                                </span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 mt-8">
                                <div className="bg-black/40 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                                    <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider font-bold">{dict.about.education_gpa}</p>
                                    <p className="text-white font-mono text-2xl text-purple-400">{dict.about.education_gpa_value}</p>
                                </div>
                                <div className="bg-black/40 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                                    <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider font-bold">{dict.about.education_coursework}</p>
                                    <p className="text-gray-300 text-sm leading-relaxed">{dict.about.education_coursework_list}</p>
                                </div>
                            </div>
                            <p className="mt-8 text-gray-500 italic text-sm border-t border-white/5 pt-6">
                                {dict.about.education_note}
                            </p>
                        </TimelineCard>
                    </motion.div>
                </motion.section>

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
        </div >
    )
}