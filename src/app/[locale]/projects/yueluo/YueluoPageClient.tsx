'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import NavigationBarI18n from '@/components/layout/NavigationBarI18n'
import { Dictionary } from '@/i18n/get-dictionary'

// Import project images
import homeHeroImg from '@/assets/projects/yueluo/home_hero.jpg'
import borrowBasketImg from '@/assets/projects/yueluo/borrow_basket.jpg'
import userInfoImg from '@/assets/projects/yueluo/user_info.jpg'
import categoryListImg from '@/assets/projects/yueluo/category_list.jpg'
import audioPlaylistImg from '@/assets/projects/yueluo/audio_playlist.jpg'

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
                            阅落童书会
                            <span className="block text-3xl md:text-4xl text-gray-400 mt-2 font-normal">
                                Yueluo Children's Book Club
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeIn} className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                            通过数字伴读与智能推荐，重塑 3-6 岁儿童的家庭阅读体验。
                        </motion.p>

                        <motion.div variants={fadeIn} className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <p className="text-lg text-gray-200">
                                在一个拥有 40,000+ 次借阅的微信小程序中，我作为核心前端工程师，通过构建流畅的音频交互与个性化借阅流程，解决了家长“选书难”与儿童“读不懂”的痛点。
                            </p>
                        </motion.div>

                        {/* Metadata Grid */}
                        <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/10">
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Role</h3>
                                <p className="font-medium text-white">Frontend Engineer</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Platform</h3>
                                <p className="font-medium text-white">WeChat Mini Program</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Core Contribution</h3>
                                <p className="font-medium text-white">Interaction Logic, Audio Player, Performance</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Timeline</h3>
                                <p className="font-medium text-white">2024 - Present</p>
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
                                src={homeHeroImg}
                                alt="Yueluo App Interface"
                                className="object-contain h-full w-auto"
                                priority
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
                        <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4">The Challenge</h2>
                        <h3 className="text-3xl md:text-4xl font-bold mb-8 text-white">不仅是借书，更是陪伴</h3>

                        <div className="prose prose-lg prose-invert text-gray-300">
                            <p className="mb-6">
                                在快节奏的现代生活中，中国家长非常重视儿童的早期阅读，但面临两个主要痛点：
                            </p>
                            <ul className="space-y-4 mb-8 list-none pl-0">
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white mt-2.5"></span>
                                    <span>
                                        <strong className="text-white">选书困难：</strong> 面对海量绘本，家长不知道什么适合自己孩子的年龄和兴趣（如情绪管理、认识身体等需求）。
                                    </span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white mt-2.5"></span>
                                    <span>
                                        <strong className="text-white">陪伴缺失：</strong> 家长并不总是懂得如何生动地讲故事，导致孩子对静态的纸质书失去兴趣。
                                    </span>
                                </li>
                            </ul>
                            <p className="text-white font-medium text-xl border-l-4 border-blue-500 pl-6 py-2 bg-blue-500/10 rounded-r-lg">
                                我的任务：构建一个高保真的微信小程序，不仅要实现电商级别的借阅流畅度，更要通过“有声伴读”功能，将物理书本与数字音频无缝连接，创造沉浸式的阅读环境。
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
                                <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4">The Solution</h2>
                                <h3 className="text-3xl font-bold mb-6 text-white">听觉维度的交互设计</h3>
                                <p className="text-lg text-gray-400 mb-6">
                                    绘本阅读是视觉的，但为了保持孩子的注意力，我们需要引入听觉。如何在不干扰浏览体验的前提下，提供流畅的音频控制？
                                </p>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-white mb-2">全局音频状态管理</h4>
                                        <p className="text-gray-400">我设计了一个全局的音频播放器组件。无论用户是在浏览书单，还是查看借阅状态，音频播放都不会中断。这模拟了父母在耳边讲故事的连续感。</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2">无缝衔接</h4>
                                        <p className="text-gray-400">在《竹林里的大熊猫2》等详情页中，用户可以点击“开始试听”并立即获得反馈。我优化了音频资源的预加载逻辑，将延迟降至最低，确保孩子不会因为等待而分心。</p>
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
                                <Image
                                    src={audioPlaylistImg}
                                    alt="Audio Playlist Interface"
                                    className="object-contain h-full w-auto"
                                />
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
                                        src={userInfoImg}
                                        alt="User Info Interface"
                                        className="object-contain h-full w-auto rounded-xl shadow-lg"
                                    />
                                    <Image
                                        src={categoryListImg}
                                        alt="Category List Interface"
                                        className="object-contain h-full w-auto rounded-xl shadow-lg"
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
                                <h3 className="text-3xl font-bold mb-6 text-white">个性化引导与数据驱动的推荐</h3>
                                <p className="text-lg text-gray-400 mb-6">
                                    3岁和6岁的孩子阅读需求截然不同。如果首页内容不相关，家长会迅速流失。
                                </p>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-white mb-2">动态表单交互</h4>
                                        <p className="text-gray-400">依据用户输入的出生日期和成长关注点（如“情绪管理”或“社会关系”），我构建了动态的标签过滤系统。</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2">算法可视化的前端呈现</h4>
                                        <p className="text-gray-400">在首页，我实现了基于用户标签的动态渲染逻辑。如果家长选择了“认识身体”，系统会优先展示《妈妈的肚脐》等相关书籍，减少了用户的搜索认知负荷。</p>
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
                                <h3 className="text-3xl font-bold mb-6 text-white">优化借阅决策的“摩擦力”</h3>
                                <p className="text-lg text-gray-400 mb-6">
                                    借阅服务的核心是“凑单”。用户需要凑满5本书才能达到借阅门槛或最优运费，这通常是一个繁琐的反复跳转过程。
                                </p>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-white mb-2">实时状态反馈</h4>
                                        <p className="text-gray-400">我开发了底部的悬浮借阅栏（Floating Action Bar），实时显示“当前0本，还可放入5本”。利用 React 的响应式特性，用户在任何列表页添加书籍，底部状态栏都会伴随微动画即时更新，给予用户明确的视觉反馈。</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2">预览体验</h4>
                                        <p className="text-gray-400">为了辅助决策，点击书籍封面可进入沉浸式预览模式，支持手势缩放和滑动，高度还原纸书质感。</p>
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
                                <Image
                                    src={borrowBasketImg}
                                    alt="Borrowing Basket Interface"
                                    className="object-contain h-full w-auto"
                                />
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
                        <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-8">Engineering for Experience</h2>
                        <h3 className="text-3xl font-bold mb-8 text-white">技术挑战与性能优化</h3>
                        <p className="text-lg text-gray-300 mb-12">
                            作为微信小程序，由于包体积限制（2MB），要在保持高质量图片展示的同时保证流畅度是一个巨大的挑战。
                        </p>

                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h4 className="text-xl font-bold mb-4 text-white">图片懒加载与骨架屏</h4>
                                <p className="text-gray-400 leading-relaxed">
                                    为了防止白屏焦虑，我实现了自定义的骨架屏（Skeleton Screen）加载策略，特别是在多图网格布局中，提升了首屏感官速度 (Perceived Performance)。
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-4 text-white">音频资源缓存策略</h4>
                                <p className="text-gray-400 leading-relaxed">
                                    考虑到移动网络的不稳定性，我编写了本地缓存逻辑，记录用户的播放进度，确保再次打开小程序时能“断点续听”。
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
                        <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-8">Impact & Reflection</h2>

                        <div className="grid grid-cols-2 gap-8 mb-16">
                            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
                                <div className="text-4xl font-bold text-white mb-2">42,875+</div>
                                <div className="text-gray-400">累计借阅次数</div>
                            </div>
                            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
                                <div className="text-4xl font-bold text-white mb-2">20%</div>
                                <div className="text-gray-400">用户平均单次使用时长提升</div>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold mb-6 text-white">HCI 视角的反思</h3>
                        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                            这个项目让我意识到，前端开发不仅仅是还原设计稿，更是<strong>“构建连接”</strong>。在这个案例中，我的代码连接了：
                        </p>
                        <ul className="space-y-4 mb-8 text-gray-300">
                            <li className="flex gap-4">
                                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5"></span>
                                <span><strong>物理世界与数字世界：</strong> 纸质书借阅与数字音频播放。</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5"></span>
                                <span><strong>家长与孩子：</strong> 通过个性化标签，帮助家长理解孩子当下的成长需求。</span>
                            </li>
                        </ul>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            申请 MHCI，我希望进一步探索如何通过多模态交互（不仅仅是屏幕点击，还包括语音、手势等）来辅助儿童教育，让技术更有温度。
                        </p>
                    </motion.div>
                </section>

            </main>
        </div>
    )
}
