'use client'

import React, { useState, useRef } from 'react'
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

interface AboutPageClientProps {
    dict: Dictionary
}

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
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
            staggerChildren: 0.1
        }
    }
}

const cardHover = {
    hover: {
        scale: 1.02,
        boxShadow: "0px 10px 30px rgba(0,0,0,0.5)",
        borderColor: "rgba(255,255,255,0.2)",
        transition: { duration: 0.3 }
    }
}

// 3D Tilt Card Component
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

    const rotateX = useSpring(useTransform(mouseY, [-300, 300], [5, -5]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-5, 5]), { stiffness: 150, damping: 20 });
    const brightness = useSpring(useTransform(mouseY, [-300, 300], [1.2, 0.8]), { stiffness: 150, damping: 20 });

    return (
        <motion.div
            style={{ perspective: 1000 }}
            className={className}
        >
            <motion.div
                style={{ rotateX, rotateY, filter: useMotionTemplate`brightness(${brightness})` }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-full h-full bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-colors duration-300 transform-style-3d"
            >
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
        offset: ["start center", "end end"]
    })

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

    return (
        <div className="relative w-full min-h-screen bg-black text-white overflow-x-hidden selection:bg-blue-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[150px]" />
            </div>

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

            <main className="relative z-10 container mx-auto px-4 py-20 md:py-32 max-w-5xl">
                {/* Hero Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="flex flex-col items-center text-center mb-24"
                >
                    <motion.div variants={fadeInUp} className="relative mb-8 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-black/50 ring-2 ring-white/20 shadow-2xl">
                            <img src={avatarImg.src} alt="Ruby Wu" className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" />
                        </div>
                        <div className="absolute bottom-2 right-2 w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full border-4 border-black flex items-center justify-center z-20">
                            <div className="w-full h-full rounded-full animate-pulse bg-green-400/50"></div>
                        </div>
                    </motion.div>

                    <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-400">
                            {dict.about.title}
                        </span>
                    </motion.h1>

                    <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-blue-200/80 mb-8 font-light tracking-wide">
                        {dict.about.subtitle}
                    </motion.p>

                    <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 text-sm md:text-base text-gray-400">
                        <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
                            📍 {dict.about.location}
                        </span>
                        <a href="mailto:wurui3458@gmail.com" className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-blue-500/20 hover:border-blue-500/50 transition-all cursor-pointer">
                            📧 wurui3458@gmail.com
                        </a>
                        <a href="https://github.com/Ruby-wurui" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer">
                            💻 {dict.about.github}
                        </a>
                    </motion.div>
                </motion.div>

                {/* Professional Summary */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="mb-20"
                >
                    <TimelineCard>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-blue-400">✦</span> {dict.about.professional_summary}
                        </h2>
                        <p className="text-gray-300 leading-relaxed text-lg md:text-xl font-light">
                            {dict.about.professional_summary_text}
                        </p>
                    </TimelineCard>
                </motion.section>

                {/* Education */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="mb-20"
                >
                    <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-white mb-10 flex items-center gap-3 px-4">
                        <span className="text-purple-400">🎓</span> {dict.about.education}
                    </motion.h2>

                    <motion.div
                        variants={fadeInUp}
                    >
                        <TimelineCard className="relative group">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-l-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-1">{dict.about.education_degree}</h3>
                                    <p className="text-purple-300 text-lg">{dict.about.education_university}</p>
                                </div>
                                <span className="mt-2 md:mt-0 px-3 py-1 rounded-md bg-purple-500/20 text-purple-200 text-sm font-mono border border-purple-500/30">
                                    {dict.about.education_duration}
                                </span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div className="bg-black/20 rounded-xl p-4">
                                    <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">{dict.about.education_gpa}</p>
                                    <p className="text-white font-mono text-lg">{dict.about.education_gpa_value}</p>
                                </div>
                                <div className="bg-black/20 rounded-xl p-4">
                                    <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">{dict.about.education_coursework}</p>
                                    <p className="text-gray-300 text-sm leading-relaxed">{dict.about.education_coursework_list}</p>
                                </div>
                            </div>
                            <p className="mt-4 text-gray-400 italic text-sm border-t border-white/5 pt-4">
                                {dict.about.education_note}
                            </p>
                        </TimelineCard>
                    </motion.div>
                </motion.section>

                {/* Technical Skills */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="mb-20"
                >
                    <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-white mb-10 flex items-center gap-3 px-4">
                        <span className="text-green-400">⚡</span> {dict.about.technical_skills}
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                title: dict.about.skills_hci_design,
                                content: dict.about.skills_hci_design_list,
                                color: "blue",
                                icon: "🎨"
                            },
                            {
                                title: dict.about.skills_frontend,
                                content: dict.about.skills_frontend_list,
                                color: "green",
                                icon: "💻"
                            },
                            {
                                title: dict.about.skills_backend,
                                content: dict.about.skills_backend_list,
                                color: "purple",
                                icon: "⚙️"
                            },
                            {
                                title: dict.about.skills_ai,
                                content: dict.about.skills_ai_list,
                                color: "pink",
                                icon: "🤖"
                            }
                        ].map((skill, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className={`bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-${skill.color}-500/30 transition-colors group`}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl bg-white/5 p-2 rounded-lg">{skill.icon}</span>
                                    <h3 className={`text-xl font-bold text-${skill.color}-400 group-hover:text-${skill.color}-300 transition-colors`}>
                                        {skill.title}
                                    </h3>
                                </div>
                                <p className="text-gray-300 leading-relaxed font-light">
                                    {skill.content}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Work Experience */}
                <motion.section
                    ref={timelineRef}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="mb-20"
                >
                    <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-white mb-12 text-center">
                        <span className="text-yellow-400">💼</span> {dict.about.work_experience}
                    </motion.h2>

                    <div className="relative max-w-6xl mx-auto">
                        {/* Center Animated Vertical Line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-white/10 hidden md:block">
                            <motion.div
                                style={{ height: lineHeight }}
                                className="w-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                            />
                        </div>

                        {/* Position 1 - Right Side */}
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative grid md:grid-cols-2 gap-8 mb-16"
                        >
                            {/* Empty Left Side */}
                            <div className="hidden md:block"></div>

                            {/* Right Side Content */}
                            <div className="relative">
                                {/* Node on center line */}
                                <motion.div
                                    whileHover={{ scale: 1.5, boxShadow: "0 0 25px rgba(59,130,246,0.8)" }}
                                    className="hidden md:block absolute -left-[calc(50%+4rem+4px)] top-8 w-4 h-4 rounded-full bg-blue-500 border-4 border-black z-20 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                ></motion.div>

                                {/* Connecting Line */}
                                <div className="hidden md:block absolute -left-[calc(50%+4rem)] top-10 w-16 h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent"></div>

                                <TimelineCard>
                                    <div className="flex flex-col justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-1">{dict.about.position_1_title}</h3>
                                            <p className="text-blue-400 text-lg">{dict.about.position_1_company}</p>
                                        </div>
                                        <span className="mt-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-sm border border-blue-500/20">
                                            {dict.about.position_1_duration}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 italic mb-6 pl-4 border-l-2 border-white/10">
                                        {dict.about.position_1_context}
                                    </p>
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4].map((num) => (
                                            <div key={num} className="group/item">
                                                <h4 className="text-blue-300 font-medium mb-1 group-hover/item:text-blue-200 transition-colors">
                                                    • {dict.about[`position_1_project_${num}_title` as keyof typeof dict.about]}
                                                </h4>
                                                <p className="text-gray-400 text-sm pl-4 leading-relaxed">
                                                    {dict.about[`position_1_project_${num}_desc` as keyof typeof dict.about]}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </TimelineCard>
                            </div>
                        </motion.div>

                        {/* Position 2 - Left Side */}
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative grid md:grid-cols-2 gap-8 mb-16"
                        >
                            {/* Left Side Content */}
                            <div className="relative md:text-right">
                                {/* Node on center line */}
                                <motion.div
                                    whileHover={{ scale: 1.5, boxShadow: "0 0 25px rgba(34,197,94,0.8)" }}
                                    className="hidden md:block absolute -right-[calc(50%+4rem+4px)] top-8 w-4 h-4 rounded-full bg-green-500 border-4 border-black z-20 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                                ></motion.div>

                                {/* Connecting Line */}
                                <div className="hidden md:block absolute -right-[calc(50%+4rem)] top-10 w-16 h-0.5 bg-gradient-to-l from-green-500/50 to-transparent"></div>

                                <TimelineCard>
                                    <div className="flex flex-col justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-1">{dict.about.position_2_title}</h3>
                                            <p className="text-green-400 text-lg">{dict.about.position_2_company}</p>
                                        </div>
                                        <span className="mt-2 px-3 py-1 rounded-full bg-green-500/10 text-green-300 text-sm border border-green-500/20">
                                            {dict.about.position_2_duration}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 italic mb-6 pl-4 border-l-2 border-white/10">
                                        {dict.about.position_2_context}
                                    </p>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((num) => (
                                            <div key={num} className="group/item">
                                                <h4 className="text-green-300 font-medium mb-1 group-hover/item:text-green-200 transition-colors">
                                                    • {dict.about[`position_2_project_${num}_title` as keyof typeof dict.about]}
                                                </h4>
                                                <p className="text-gray-400 text-sm pl-4 leading-relaxed">
                                                    {dict.about[`position_2_project_${num}_desc` as keyof typeof dict.about]}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </TimelineCard>
                            </div>

                            {/* Empty Right Side */}
                            <div className="hidden md:block"></div>
                        </motion.div>

                        {/* Position 3 - Right Side */}
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative grid md:grid-cols-2 gap-8"
                        >
                            {/* Empty Left Side */}
                            <div className="hidden md:block"></div>

                            {/* Right Side Content */}
                            <div className="relative">
                                {/* Node on center line */}
                                <motion.div
                                    whileHover={{ scale: 1.5, boxShadow: "0 0 25px rgba(168,85,247,0.8)" }}
                                    className="hidden md:block absolute -left-[calc(50%+4rem+4px)] top-8 w-4 h-4 rounded-full bg-purple-500 border-4 border-black z-20 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                                ></motion.div>

                                {/* Connecting Line */}
                                <div className="hidden md:block absolute -left-[calc(50%+4rem)] top-10 w-16 h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent"></div>

                                <TimelineCard>
                                    <div className="flex flex-col justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-1">{dict.about.position_3_title}</h3>
                                            <p className="text-purple-400 text-lg">{dict.about.position_3_company}</p>
                                        </div>
                                        <span className="mt-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-sm border border-purple-500/20">
                                            {dict.about.position_3_duration}
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        {[1, 2].map((num) => (
                                            <div key={num} className="group/item">
                                                <p className="text-gray-300 text-sm pl-4 border-l-2 border-purple-500/30 leading-relaxed">
                                                    {dict.about[`position_3_project_${num}_desc` as keyof typeof dict.about]}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </TimelineCard>
                            </div>
                        </motion.div>
                    </div>
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
        </div>
    )
}