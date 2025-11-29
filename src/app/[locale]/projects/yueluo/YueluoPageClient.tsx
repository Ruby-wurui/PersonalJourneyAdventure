'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import NavigationBarI18n from '@/components/layout/NavigationBarI18n'
import { Dictionary } from '@/i18n/get-dictionary'

// Import project images
import homeHeroImg from '@/assets/projects/yueluo/home_hero.png'
import borrowBasketImg from '@/assets/projects/yueluo/borrow_basket.jpg'
import userInfoImg from '@/assets/projects/yueluo/user_info.png'
import categoryListImg from '@/assets/projects/yueluo/category_list.png'
import audioPlaylistImg from '@/assets/projects/yueluo/audio_playlist_v2.png'
import audioInteractionImg from '@/assets/projects/yueluo/audio_interaction_v2.png'
import borrowFrictionImg from '@/assets/projects/yueluo/borrow_friction.png'
import audioPlay from '@/assets/projects/yueluo/audio_playlist.png'
import bookInfo from '@/assets/projects/yueluo/book_info.png'

interface YueluoPageClientProps {
    locale: string
    dict: Dictionary
}

export default function YueluoPageClient({ locale, dict }: YueluoPageClientProps) {
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
                            {dict.projects.yueluo.title}
                            <span className="block text-3xl md:text-4xl text-gray-400 mt-2 font-normal">
                                {dict.projects.yueluo.subtitle}
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeIn} className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                            {dict.projects.yueluo.description}
                        </motion.p>

                        <motion.div variants={fadeIn} className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <p className="text-lg text-gray-200">
                                {dict.projects.yueluo.hero_card_text}
                            </p>
                        </motion.div>

                        {/* Metadata Grid */}
                        <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/10">
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{dict.projects.yueluo.role}</h3>
                                <p className="font-medium text-white">{dict.projects.yueluo.role_value}</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{dict.projects.yueluo.platform}</h3>
                                <p className="font-medium text-white">{dict.projects.yueluo.platform_value}</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{dict.projects.yueluo.contribution}</h3>
                                <p className="font-medium text-white">{dict.projects.yueluo.contribution_value}</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{dict.projects.yueluo.timeline}</h3>
                                <p className="font-medium text-white">{dict.projects.yueluo.timeline_value}</p>
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
                        {/* Using home_hero.jpg but fitting it nicely, maybe blur background if aspect ratio differs */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black">
                            <Image
                                src={borrowBasketImg}
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
                        <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4">{dict.projects.yueluo.challenge_title}</h2>
                        <h3 className="text-3xl md:text-4xl font-bold mb-8 text-white">{dict.projects.yueluo.challenge_heading}</h3>

                        <div className="prose prose-lg prose-invert text-gray-300">
                            <p className="mb-6">
                                {dict.projects.yueluo.challenge_text_1}
                            </p>
                            <ul className="space-y-4 mb-8 list-none pl-0">
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white mt-2.5"></span>
                                    <span>
                                        <strong className="text-white">{dict.projects.yueluo.challenge_point_1_title}</strong> {dict.projects.yueluo.challenge_point_1_desc}
                                    </span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white mt-2.5"></span>
                                    <span>
                                        <strong className="text-white">{dict.projects.yueluo.challenge_point_2_title}</strong> {dict.projects.yueluo.challenge_point_2_desc}
                                    </span>
                                </li>
                            </ul>
                            <p className="text-white font-medium text-xl border-l-4 border-blue-500 pl-6 py-2 bg-blue-500/10 rounded-r-lg">
                                {dict.projects.yueluo.challenge_mission}
                            </p>
                        </div>
                    </motion.div>
                </section>

                {/* Solution Section */}
                <section className="bg-zinc-900 py-32">
                    <div className="max-w-7xl mx-auto px-6 space-y-32">

                        {/* Feature 1: Audio Companion */}
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4">{dict.projects.yueluo.solution_title}</h2>
                                <h3 className="text-3xl font-bold mb-6 text-white">{dict.projects.yueluo.feature_1_title}</h3>
                                <p className="text-lg text-gray-400 mb-6">
                                    {dict.projects.yueluo.feature_1_desc}
                                </p>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-white mb-2">{dict.projects.yueluo.feature_1_point_1_title}</h4>
                                        <p className="text-gray-400">{dict.projects.yueluo.feature_1_point_1_desc}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2">{dict.projects.yueluo.feature_1_point_2_title}</h4>
                                        <p className="text-gray-400">{dict.projects.yueluo.feature_1_point_2_desc}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2">{dict.projects.yueluo.feature_1_point_3_title}</h4>
                                        <p className="text-gray-400">{dict.projects.yueluo.feature_1_point_3_desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="bg-black rounded-3xl aspect-[3/4] flex items-center justify-center relative overflow-hidden border border-white/10"
                            >
                                <div className="flex flex-col gap-2 h-full w-full p-6 overflow-hidden">
                                    <div className="relative w-full flex-1 min-h-0">
                                        <div className="flex flex-row gap-2 h-full p-4 overflow-hidden">
                                            <Image
                                                src={audioPlay}
                                                alt="Audio Playlist Interface"
                                                className="object-contain rounded-2xl shadow-lg"
                                            />
                                            <Image
                                                src={bookInfo}
                                                alt="Audio Playlist Interface"
                                                className="object-contain rounded-2xl shadow-lg"
                                            />
                                        </div>
                                    </div>
                                    <div className="relative w-full flex-1 min-h-0">
                                        <Image
                                            src={audioInteractionImg}
                                            alt="Audio Interaction Interface"
                                            fill
                                            className="object-contain rounded-2xl shadow-lg"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Feature 2: Personalized Onboarding */}
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
                                        src={audioPlaylistImg}
                                        alt="User Info Interface"
                                        className="object-contain h-full w-auto rounded-2xl shadow-lg"
                                    />
                                    <Image
                                        src={categoryListImg}
                                        alt="Category List Interface"
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
                                <h3 className="text-3xl font-bold mb-6 text-white">{dict.projects.yueluo.feature_2_title}</h3>
                                <p className="text-lg text-gray-400 mb-6">
                                    {dict.projects.yueluo.feature_2_desc}
                                </p>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-white mb-2">{dict.projects.yueluo.feature_2_point_1_title}</h4>
                                        <p className="text-gray-400">{dict.projects.yueluo.feature_2_point_1_desc}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2">{dict.projects.yueluo.feature_2_point_2_title}</h4>
                                        <p className="text-gray-400">{dict.projects.yueluo.feature_2_point_2_desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Feature 3: Borrowing Loop */}
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-3xl font-bold mb-6 text-white">{dict.projects.yueluo.feature_3_title}</h3>
                                <p className="text-lg text-gray-400 mb-6">
                                    {dict.projects.yueluo.feature_3_desc}
                                </p>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-white mb-2">{dict.projects.yueluo.feature_3_point_1_title}</h4>
                                        <p className="text-gray-400">{dict.projects.yueluo.feature_3_point_1_desc}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2">{dict.projects.yueluo.feature_3_point_2_title}</h4>
                                        <p className="text-gray-400">{dict.projects.yueluo.feature_3_point_2_desc}</p>
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
                                        src={homeHeroImg}
                                        alt="Yueluo App Interface"
                                        className="object-contain h-full w-auto"
                                        priority
                                    />
                                    <Image
                                        src={borrowFrictionImg}
                                        alt="Borrowing Friction Interface"
                                        className="object-contain h-full w-auto rounded-2xl shadow-lg"
                                    />
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
                        <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-8">{dict.projects.yueluo.technical_title}</h2>
                        <h3 className="text-3xl font-bold mb-8 text-white">{dict.projects.yueluo.technical_heading}</h3>
                        <p className="text-lg text-gray-300 mb-12">
                            {dict.projects.yueluo.technical_desc}
                        </p>

                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h4 className="text-xl font-bold mb-4 text-white">{dict.projects.yueluo.technical_point_1_title}</h4>
                                <p className="text-gray-400 leading-relaxed">
                                    {dict.projects.yueluo.technical_point_1_desc}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-4 text-white">{dict.projects.yueluo.technical_point_2_title}</h4>
                                <p className="text-gray-400 leading-relaxed">
                                    {dict.projects.yueluo.technical_point_2_desc}
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
                        <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-8">{dict.projects.yueluo.impact_title}</h2>

                        <div className="grid grid-cols-2 gap-8 mb-16">
                            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
                                <div className="text-4xl font-bold text-white mb-2">{dict.projects.yueluo.impact_stat_1_value}</div>
                                <div className="text-gray-400">{dict.projects.yueluo.impact_stat_1_label}</div>
                            </div>
                            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
                                <div className="text-4xl font-bold text-white mb-2">{dict.projects.yueluo.impact_stat_2_value}</div>
                                <div className="text-gray-400">{dict.projects.yueluo.impact_stat_2_label}</div>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold mb-6 text-white">{dict.projects.yueluo.reflection_title}</h3>
                        <p
                            className="text-lg text-gray-300 mb-8 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: dict.projects.yueluo.reflection_text_1 }}
                        />
                        <ul className="space-y-4 mb-8 text-gray-300">
                            <li className="flex gap-4">
                                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5"></span>
                                <span dangerouslySetInnerHTML={{ __html: dict.projects.yueluo.reflection_point_1 }} />
                            </li>
                            <li className="flex gap-4">
                                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5"></span>
                                <span dangerouslySetInnerHTML={{ __html: dict.projects.yueluo.reflection_point_2 }} />
                            </li>
                        </ul>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            {dict.projects.yueluo.reflection_text_2}
                        </p>
                    </motion.div>
                </section>

            </main>
        </div>
    )
}
