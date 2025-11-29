'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import NavigationBarI18n from '@/components/layout/NavigationBarI18n'
import { Dictionary } from '@/i18n/get-dictionary'

// Import project images
import avatarSystemImg from '@/assets/projects/yueluo/yueluo_v2_1.jpg'
import mapHeroImg from '@/assets/projects/yueluo/yueluo_v2_2.jpg'
import multimodalImg from '@/assets/projects/yueluo/yueluo_v2_3.jpg'
import mapProgressImg from '@/assets/projects/yueluo/yueluo_v2_4.jpg'
import socialPkImg from '@/assets/projects/yueluo/yueluo_v2_5.jpg'
import chuangguan from '@/assets/projects/yueluo/yimi_chuangguan.jpg'
import mibi from '@/assets/projects/yueluo/yimi_mibi.jpg'
import mibi2 from '@/assets/projects/yueluo/yimi_mibi2.jpg'
import avator from '@/assets/projects/yueluo/yimi_avator.jpg'
import avator2 from '@/assets/projects/yueluo/yimi_avator2.jpg'
import multimodalImg1 from '@/assets/projects/yueluo/yimi_multimodal_1.jpg'
import multimodalImg2 from '@/assets/projects/yueluo/yimi_multimodal_2.jpg'


interface YiMiReadingPageClientProps {
    locale: string
    dict: Dictionary
}

export default function YiMiReadingPageClient({ locale, dict }: YiMiReadingPageClientProps) {
    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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
        <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white">
            {/* Navigation */}
            <NavigationBarI18n locale={locale as any} dict={dict} />

            <main className="pt-24 pb-20">
                {/* Back Button */}
                <div className="max-w-7xl mx-auto px-6 mb-8 pt-4">
                    <Link
                        href={`/${locale}/projects`}
                        className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors inline-flex"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Projects
                    </Link>
                </div>
                {/* Hero Section */}
                <section className="max-w-4xl mx-auto px-6 mb-24">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="space-y-8"
                    >
                        <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-bold tracking-tight leading-tight text-white">
                            {dict.projects.yimireading.title}
                            <span className="block text-3xl md:text-4xl text-gray-400 mt-2 font-normal">
                                {dict.projects.yimireading.subtitle}
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeIn} className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                            {dict.projects.yimireading.description}
                        </motion.p>

                        <motion.div variants={fadeIn} className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <p className="text-lg text-gray-200">
                                {dict.projects.yimireading.hero_card_text}
                            </p>
                        </motion.div>

                        {/* Metadata Grid */}
                        <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/10">
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{dict.projects.yimireading.role}</h3>
                                <p className="font-medium text-white">{dict.projects.yimireading.role_value}</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{dict.projects.yimireading.platform}</h3>
                                <p className="font-medium text-white">{dict.projects.yimireading.platform_value}</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{dict.projects.yimireading.contribution}</h3>
                                <p className="font-medium text-white">{dict.projects.yimireading.contribution_value}</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{dict.projects.yimireading.timeline}</h3>
                                <p className="font-medium text-white">{dict.projects.yimireading.timeline_value}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Hero Image */}
                <section className="max-w-7xl mx-auto px-6 mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5"
                    >
                        <div className="absolute inset-0 flex items-center justify-center bg-black">

                            <Image
                                src={avatarSystemImg}
                                alt="Borrowing Basket Interface"
                                className="object-contain h-full w-auto rounded-2xl shadow-lg"
                            />
                        </div>
                    </motion.div>
                </section>

                {/* Background & Challenge */}
                <section className="max-w-3xl mx-auto px-6 mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4">{dict.projects.yimireading.challenge_title}</h2>
                        <h3 className="text-3xl md:text-4xl font-bold mb-8 text-white">{dict.projects.yimireading.challenge_heading}</h3>

                        <div className="prose prose-lg prose-invert text-gray-300">
                            <p className="mb-6">
                                {dict.projects.yimireading.challenge_text_1}
                            </p>
                            <ul className="space-y-4 mb-8 list-none pl-0">
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white mt-2.5"></span>
                                    <span>
                                        <strong className="text-white">{dict.projects.yimireading.challenge_point_1_title}</strong> {dict.projects.yimireading.challenge_point_1_desc}
                                    </span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white mt-2.5"></span>
                                    <span>
                                        <strong className="text-white">{dict.projects.yimireading.challenge_point_2_title}</strong> {dict.projects.yimireading.challenge_point_2_desc}
                                    </span>
                                </li>
                            </ul>
                            <p className="text-white font-medium text-xl border-l-4 border-blue-500 pl-6 py-2 bg-blue-500/10 rounded-r-lg">
                                {dict.projects.yimireading.challenge_mission}
                            </p>
                        </div>
                    </motion.div>
                </section>

                {/* Solution Section */}
                <section className="bg-zinc-900 py-32">
                    <div className="max-w-7xl mx-auto px-6 space-y-32">

                        {/* Feature 1: Map System */}
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4">{dict.projects.yimireading.solution_title}</h2>
                                <h3 className="text-3xl font-bold mb-6 text-white">{dict.projects.yimireading.feature_1_title}</h3>
                                <p className="text-lg text-gray-400 mb-6">
                                    {dict.projects.yimireading.feature_1_desc}
                                </p>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-white mb-2">{dict.projects.yimireading.feature_1_point_1_title}</h4>
                                        <p className="text-gray-400">{dict.projects.yimireading.feature_1_point_1_desc}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2">{dict.projects.yimireading.feature_1_point_2_title}</h4>
                                        <p className="text-gray-400">{dict.projects.yimireading.feature_1_point_2_desc}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2">{dict.projects.yimireading.feature_1_point_3_title}</h4>
                                        <p className="text-gray-400">{dict.projects.yimireading.feature_1_point_3_desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="bg-black rounded-3xl aspect-[4/3] flex items-center justify-center relative overflow-hidden border border-white/10 md:order-1"
                            >
                                <div className="flex gap-4 h-full p-8 overflow-hidden">
                                    <Image
                                        src={socialPkImg}
                                        alt="Avatar System Interface"
                                        className="object-contain h-full w-auto rounded-2xl shadow-lg"
                                    />
                                    <Image
                                        src={chuangguan}
                                        alt="Social PK Interface"
                                        className="object-contain h-full w-auto rounded-2xl shadow-lg"
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {/* Feature 2: Virtual Economy */}
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="bg-black rounded-3xl aspect-[4/3] flex items-center justify-center relative overflow-hidden border border-white/10 md:order-1"
                            >
                                <div className="flex gap-4 h-full p-8 overflow-hidden">
                                    <Image
                                        src={mibi}
                                        alt="Avatar System Interface"
                                        className="object-contain h-full w-auto rounded-2xl shadow-lg"
                                    />
                                    <Image
                                        src={mibi2}
                                        alt="Social PK Interface"
                                        className="object-contain h-full w-auto rounded-2xl shadow-lg"
                                    />
                                </div>

                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="md:order-2"
                            >
                                <h3 className="text-3xl font-bold mb-6 text-white">{dict.projects.yimireading.feature_2_title}</h3>
                                <p className="text-lg text-gray-400 mb-6">
                                    {dict.projects.yimireading.feature_2_desc}
                                </p>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-white mb-2">{dict.projects.yimireading.feature_2_point_1_title}</h4>
                                        <p className="text-gray-400">{dict.projects.yimireading.feature_2_point_1_desc}</p>
                                    </div>

                                </div>
                            </motion.div>
                        </div>

                        {/* Feature 3: Multimodal Learning */}
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-3xl font-bold mb-6 text-white">{dict.projects.yimireading.feature_3_title}</h3>
                                <p className="text-lg text-gray-400 mb-6">
                                    {dict.projects.yimireading.feature_3_desc}
                                </p>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-white mb-2">{dict.projects.yimireading.feature_3_point_1_title}</h4>
                                        <p className="text-gray-400">{dict.projects.yimireading.feature_3_point_1_desc}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2">{dict.projects.yimireading.feature_3_point_2_title}</h4>
                                        <p className="text-gray-400">{dict.projects.yimireading.feature_3_point_2_desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="bg-black rounded-3xl aspect-[4/3] flex items-center justify-center relative overflow-hidden border border-white/10"
                            >
                                <div className="flex gap-4 h-full p-8 overflow-hidden">
                                    <Image
                                        src={multimodalImg1}
                                        alt="Multimodal Learning Interface 1"
                                        className="object-contain h-full w-auto rounded-2xl shadow-lg"
                                    />
                                    <Image
                                        src={multimodalImg2}
                                        alt="Multimodal Learning Interface 2"
                                        className="object-contain h-full w-auto rounded-2xl shadow-lg"
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {/* Feature 4: Identity Construction and Social */}
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="bg-black rounded-3xl aspect-[4/3] flex items-center justify-center relative overflow-hidden border border-white/10 md:order-1"
                            >
                                <div className="flex gap-4 h-full p-8 overflow-hidden">
                                    <Image
                                        src={multimodalImg}
                                        alt="Avatar System Interface"
                                        className="object-contain h-full w-auto rounded-2xl shadow-lg"
                                    />
                                    <Image
                                        src={avator}
                                        alt="Social PK Interface"
                                        className="object-contain h-full w-auto rounded-2xl shadow-lg"
                                    />
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="md:order-2"
                            >
                                <h3 className="text-3xl font-bold mb-6 text-white">{dict.projects.yimireading.feature_4_title}</h3>
                                <p className="text-lg text-gray-400 mb-6">
                                    {dict.projects.yimireading.feature_4_desc}
                                </p>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-white mb-2">{dict.projects.yimireading.feature_4_point_1_title}</h4>
                                        <p className="text-gray-400">{dict.projects.yimireading.feature_4_point_1_desc}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2">{dict.projects.yimireading.feature_4_point_2_title}</h4>
                                        <p className="text-gray-400">{dict.projects.yimireading.feature_4_point_2_desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                    </div>
                </section>

                {/* Technical Challenges */}
                <section className="max-w-4xl mx-auto px-6 py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="bg-white/5 text-white rounded-3xl p-12 md:p-16 border border-white/10 backdrop-blur-sm"
                    >
                        <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-8">{dict.projects.yimireading.technical_title}</h2>
                        <h3 className="text-3xl font-bold mb-8 text-white">{dict.projects.yimireading.technical_heading}</h3>
                        <p className="text-lg text-gray-300 mb-12">
                            {dict.projects.yimireading.technical_desc}
                        </p>

                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h4 className="text-xl font-bold mb-4 text-white">{dict.projects.yimireading.technical_point_1_title}</h4>
                                <p className="text-gray-400 leading-relaxed">
                                    {dict.projects.yimireading.technical_point_1_desc}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-4 text-white">{dict.projects.yimireading.technical_point_2_title}</h4>
                                <p className="text-gray-400 leading-relaxed">
                                    {dict.projects.yimireading.technical_point_2_desc}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Impact & Reflection */}
                <section className="max-w-3xl mx-auto px-6 mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-8">{dict.projects.yimireading.impact_title}</h2>

                        <div className="grid grid-cols-2 gap-8 mb-16">
                            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
                                <div className="text-4xl font-bold text-white mb-2">{dict.projects.yimireading.impact_stat_1_value}</div>
                                <div className="text-gray-400">{dict.projects.yimireading.impact_stat_1_label}</div>
                            </div>
                            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
                                <div className="text-4xl font-bold text-white mb-2">{dict.projects.yimireading.impact_stat_2_value}</div>
                                <div className="text-gray-400">{dict.projects.yimireading.impact_stat_2_label}</div>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold mb-6 text-white">{dict.projects.yimireading.reflection_title}</h3>
                        <p
                            className="text-lg text-gray-300 mb-8 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: dict.projects.yimireading.reflection_text_1 }}
                        />
                        <ul className="space-y-4 mb-8 text-gray-300">
                            <li className="flex gap-4">
                                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5"></span>
                                <span dangerouslySetInnerHTML={{ __html: dict.projects.yimireading.reflection_point_1 }} />
                            </li>
                            <li className="flex gap-4">
                                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5"></span>
                                <span dangerouslySetInnerHTML={{ __html: dict.projects.yimireading.reflection_point_2 }} />
                            </li>
                        </ul>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            {dict.projects.yimireading.reflection_text_2}
                        </p>
                    </motion.div>
                </section>

            </main>
        </div>
    )
}
