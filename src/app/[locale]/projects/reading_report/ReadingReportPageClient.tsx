'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Printer, BarChart2, Activity, PieChart, Layers, FileText } from 'lucide-react'
import Link from 'next/link'
import NavigationBarI18n from '@/components/layout/NavigationBarI18n'
import { Dictionary } from '@/i18n/get-dictionary'
import { useAuth } from '@/lib/auth-context'
import { LoginModal } from '@/components/auth/LoginModal'
import RegisterModal from '@/components/auth/RegisterModal'
import { Locale } from '@/i18n/config'

// Import project images
import coverImg from '@/assets/projects/reading_report/cover.png'
import gradeOverviewImg from '@/assets/projects/reading_report/grade_overview.png'
import abilityBreakdownImg from '@/assets/projects/reading_report/ability_breakdown.png'
import normalDistributionImg from '@/assets/projects/reading_report/normal_distribution.png'
import familySupportImg from '@/assets/projects/reading_report/family_support.png'
import schoolSupportImg from '@/assets/projects/reading_report/school_support.png'
import readingHabitsImg from '@/assets/projects/reading_report/reading_habits.png'
import quadrantAnalysisImg from '@/assets/projects/reading_report/quadrant_analysis.png'
import printBookletImg from '@/assets/projects/reading_report/print_booklet.jpg'

interface ReadingReportPageClientProps {
    locale: Locale
    dict: Dictionary
}

export default function ReadingReportPageClient({ locale, dict }: ReadingReportPageClientProps) {
    const { isAuthenticated, user, logout } = useAuth()
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showRegisterModal, setShowRegisterModal] = useState(false)

    const t = dict.projects.reading_report

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white">
            {/* Navigation */}
            <NavigationBarI18n
                locale={locale}
                dict={dict}
                isAuthenticated={isAuthenticated}
                user={user}
                onLogin={() => setShowLoginModal(true)}
                onRegister={() => setShowRegisterModal(true)}
                onLogout={logout}
            />

            <main className="pt-24 pb-20">
                {/* Back Button */}
                <div className="max-w-7xl mx-auto px-6 mb-8 pt-4">
                    <Link
                        href={`/${locale}/projects`}
                        className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors inline-flex"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {dict.common.back}
                    </Link>
                </div>

                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 mb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="space-y-8"
                        >
                            <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl font-bold tracking-tight leading-tight text-white">
                                {t.title}
                                <span className="block text-2xl md:text-3xl text-gray-400 mt-4 font-normal leading-normal">
                                    {t.subtitle}
                                </span>
                            </motion.h1>

                            <motion.p variants={fadeIn} className="text-xl text-gray-300 leading-relaxed">
                                {t.description}
                            </motion.p>

                            <motion.div variants={fadeIn} className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <p className="text-lg text-gray-200 italic">
                                    &quot;{t.hero_card_text}&quot;
                                </p>
                            </motion.div>

                            {/* Metadata Grid */}
                            <motion.div variants={fadeIn} className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{t.role}</h3>
                                    <p className="font-medium text-white">{t.role_value}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{t.platform}</h3>
                                    <p className="font-medium text-white">{t.platform_value}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{t.contribution}</h3>
                                    <p className="font-medium text-white">{t.contribution_value}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{t.timeline}</h3>
                                    <p className="font-medium text-white">{t.timeline_value}</p>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                                <Image
                                    src={coverImg}
                                    alt="Reading Report Cover"
                                    className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                                    priority
                                />
                            </div>
                            {/* Floating Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="absolute -bottom-6 -right-6 bg-[#1a1a1a] p-6 rounded-xl border border-white/10 shadow-xl hidden md:block"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-purple-500/20 rounded-lg">
                                        <Printer className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">100K+</div>
                                        <div className="text-xs text-gray-400">PDF Reports</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/20 rounded-lg">
                                        <BarChart2 className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">2.6M+</div>
                                        <div className="text-xs text-gray-400">Students Served</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Context & Challenge */}
                <section className="max-w-3xl mx-auto px-6 mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-4">{t.challenge_title}</h2>
                        <h3 className="text-3xl md:text-4xl font-bold mb-8 text-white">{t.challenge_heading}</h3>

                        <div className="prose prose-lg prose-invert text-gray-300">
                            <p className="mb-6">
                                {t.challenge_text_1}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 not-prose">
                                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                                        <Activity className="w-5 h-5 text-red-400" />
                                    </div>
                                    <h4 className="text-lg font-semibold mb-2 text-white">{t.challenge_point_1_title}</h4>
                                    <p className="text-gray-400 text-sm">{t.challenge_point_1_desc}</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
                                        <Printer className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <h4 className="text-lg font-semibold mb-2 text-white">{t.challenge_point_2_title}</h4>
                                    <p className="text-gray-400 text-sm">{t.challenge_point_2_desc}</p>
                                </div>
                            </div>
                            <p className="text-white font-medium text-xl border-l-4 border-purple-500 pl-6 py-2 bg-purple-500/10 rounded-r-lg">
                                &quot;{t.challenge_mission}&quot;
                            </p>
                        </div>
                    </motion.div>
                </section>

                {/* Solution Section */}
                <section className="bg-zinc-900 py-32">
                    <div className="max-w-7xl mx-auto px-6 space-y-32">

                        {/* Feature 1: Macro to Micro */}
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-4">{t.solution_title}</h2>
                                <h3 className="text-3xl font-bold mb-6 text-white">{t.feature_1_title}</h3>
                                <p className="text-lg text-gray-400 mb-6">
                                    {t.feature_1_desc}
                                </p>
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                            <Activity className="w-5 h-5 text-blue-400" />
                                            {t.feature_1_point_1_title}
                                        </h4>
                                        <p className="text-gray-400 leading-relaxed">{t.feature_1_point_1_desc}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                            <PieChart className="w-5 h-5 text-green-400" />
                                            {t.feature_1_point_2_title}
                                        </h4>
                                        <p className="text-gray-400 leading-relaxed">{t.feature_1_point_2_desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                <div className="bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                    <Image
                                        src={normalDistributionImg}
                                        alt="Normal Distribution"
                                        className="w-full h-auto"
                                    />
                                </div>
                                <div className="bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                    <Image
                                        src={abilityBreakdownImg}
                                        alt="Ability Breakdown"
                                        className="w-full h-auto"
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {/* Feature 2: Quadrant Analysis */}
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="md:order-2"
                            >
                                <h3 className="text-3xl font-bold mb-6 text-white">{t.feature_2_title}</h3>
                                <p className="text-lg text-gray-400 mb-6">
                                    {t.feature_2_desc}
                                </p>
                                <div className="space-y-6">
                                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                        <h4 className="font-bold text-white mb-2">{t.feature_2_point_1_title}</h4>
                                        <p className="text-gray-400">{t.feature_2_point_1_desc}</p>
                                    </div>
                                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                        <h4 className="font-bold text-white mb-2">{t.feature_2_point_2_title}</h4>
                                        <p className="text-gray-400">{t.feature_2_point_2_desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="md:order-1 bg-black rounded-3xl p-4 border border-white/10"
                            >
                                <Image
                                    src={quadrantAnalysisImg}
                                    alt="Quadrant Analysis"
                                    className="w-full h-auto rounded-xl"
                                />
                            </motion.div>
                        </div>

                        {/* Feature 3: Cross-Media Consistency */}
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-3xl font-bold mb-6 text-white">{t.feature_3_title}</h3>
                                <p className="text-lg text-gray-400 mb-6">
                                    {t.feature_3_desc}
                                </p>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-white mb-2">{t.feature_3_point_1_title}</h4>
                                        <p className="text-gray-400">{t.feature_3_point_1_desc}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2">{t.feature_3_point_2_title}</h4>
                                        <p className="text-gray-400">{t.feature_3_point_2_desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="bg-black rounded-3xl p-4 border border-white/10"
                            >
                                <Image
                                    src={printBookletImg}
                                    alt="Printed Report Booklet"
                                    className="w-full h-auto rounded-xl"
                                />
                            </motion.div>
                        </div>

                        {/* Technical Challenges: Layout & Engineering */}
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-3xl font-bold mb-6 text-white">{t.technical_title}</h3>
                                <p className="text-lg text-gray-400 mb-6">
                                    {t.technical_desc}
                                </p>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-white mb-2">{t.technical_point_1_title}</h4>
                                        <p className="text-gray-400">{t.technical_point_1_desc}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2">{t.technical_point_2_title}</h4>
                                        <p className="text-gray-400">{t.technical_point_2_desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="bg-black rounded-3xl p-4 border border-white/10"
                            >
                                <Image
                                    src={readingHabitsImg}
                                    alt="Reading Habits Layout"
                                    className="w-full h-auto rounded-xl"
                                />
                            </motion.div>
                        </div>

                    </div>
                </section>

                {/* Additional Visuals Section */}
                <section className="max-w-7xl mx-auto px-6 py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-12 text-center">Comprehensive Analysis</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                <Image
                                    src={familySupportImg}
                                    alt="Family Support Analysis"
                                    className="w-full h-auto rounded-xl"
                                />
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                <Image
                                    src={schoolSupportImg}
                                    alt="School Support Analysis"
                                    className="w-full h-auto rounded-xl"
                                />
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Impact & Reflection */}
                <section className="max-w-4xl mx-auto px-6 mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-purple-900/10 to-blue-900/10 rounded-3xl p-12 border border-white/10"
                    >
                        <div className="grid md:grid-cols-2 gap-12 mb-12">
                            <div>
                                <h2 className="text-2xl font-bold mb-6 text-white">{t.impact_title}</h2>
                                <div className="space-y-6">
                                    <div>
                                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                                            {t.impact_stat_1_value}
                                        </div>
                                        <div className="text-gray-400">{t.impact_stat_1_label}</div>
                                    </div>
                                    <div>
                                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
                                            {t.impact_stat_2_value}
                                        </div>
                                        <div className="text-gray-400">{t.impact_stat_2_label}</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-6 text-white">{t.reflection_title}</h2>
                                <div className="space-y-4 text-gray-300 leading-relaxed">
                                    <p>{t.reflection_text_1}</p>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3">
                                            <Layers className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                                            <span dangerouslySetInnerHTML={{ __html: t.reflection_point_1 }} />
                                        </li>
                                        <li className="flex gap-3">
                                            <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                                            <span dangerouslySetInnerHTML={{ __html: t.reflection_point_2 }} />
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

            </main>

            {/* Login Modal */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSwitchToRegister={() => {
                    setShowLoginModal(false)
                    setShowRegisterModal(true)
                }}
            />

            {/* Register Modal */}
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
