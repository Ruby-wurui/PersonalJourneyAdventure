'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    Headphones,
    Bookmark,
    Repeat2,
    FileText,
    Layers,
    Smartphone,
    ShieldCheck,
    Volume2,
    FolderOpen,
} from 'lucide-react'
import Link from 'next/link'
import NavigationBarI18n from '@/components/layout/NavigationBarI18n'
import { Dictionary } from '@/i18n/get-dictionary'
import { useAuth } from '@/lib/auth-context'
import { LoginModal } from '@/components/auth/LoginModal'
import RegisterModal from '@/components/auth/RegisterModal'
import { Locale } from '@/i18n/config'

// Portfolio exports built from the current LingoSlice prototype screens.
import coverImg from '@/assets/projects/lingoslice/cover.png'
import playerModesImg from '@/assets/projects/lingoslice/player_modes.png'
import markingFlowImg from '@/assets/projects/lingoslice/marking_flow.png'
import markerListImg from '@/assets/projects/lingoslice/marker_list.png'
import libraryImg from '@/assets/projects/lingoslice/library.png'
import persistentPlaybackImg from '@/assets/projects/lingoslice/persistent_playback.png'
import productMapImg from '@/assets/projects/lingoslice/product_map.png'

interface LingoSlicePageClientProps {
    locale: Locale
    dict: Dictionary
}

/**
 * Portfolio copy is intentionally local to this component so the page can be
 * dropped into the existing project without first changing the Dictionary type.
 * When the content is stable, move this object into your i18n dictionaries.
 */
const copyByLocale = {
    en: {
        title: 'LingoSlice',
        subtitle: 'Designing a low-friction listening, marking, and repeat-practice workflow',
        description:
            'LingoSlice is an iOS intensive-listening tool for learners who study with imported audio and time-synced lyrics or transcripts. Instead of treating playback, annotation, and review as separate modes, it turns a fleeting “I missed that” moment into a reusable practice slice.',
        heroCard:
            'How might we let learners preserve the exact moment they want to practice without interrupting the act of listening?',

        role: 'Role',
        roleValue: 'Independent Product Designer & Developer',
        platform: 'Platform',
        platformValue: 'iOS · iPhone',
        contribution: 'Contribution',
        contributionValue: 'Product Strategy · UX/UI · Interaction Design · Prototyping · SwiftUI',
        timeline: 'Status',
        timelineValue: '2026 · Prototype in Development',

        challengeTitle: 'Problem Framing',
        challengeHeading:
            'The difficult part of intensive listening is not playback. It is preserving the moment you want to practice.',
        challengeText:
            'During intensive listening, useful learning moments are brief. A learner notices an unclear sentence, a difficult phrase, or a short passage worth repeating. Traditional players make that moment expensive: pause, scrub, switch views, find the text, create a note, and then reconstruct the original context later. The interface can consume the attention that should stay on the language.',
        challengePoint1Title: 'Context Loss',
        challengePoint1Desc:
            'When listening, transcript reading, annotation, and review live in separate places, the learner has to rebuild where they were and why the sentence mattered.',
        challengePoint2Title: 'Interface Overhead',
        challengePoint2Desc:
            'The path from “I missed that” to “save this for practice” should take seconds, not a sequence of mode changes and manual bookkeeping.',
        mission:
            'The design goal became simple: shorten the path from noticing a problem to replaying it in context.',

        solutionTitle: 'Core Interaction',
        feature1Title: 'Keep listening and transcript navigation in the same mental context',
        feature1Desc:
            'The full player has two lightweight views—cover and lyrics—but both are driven by the same playback state. Switching views changes what the learner sees, not what the learner is doing.',
        feature1Point1Title: 'Two views, one playback state',
        feature1Point1Desc:
            'The cover view keeps playback visually calm; the lyrics view exposes the current line and surrounding context. Moving between them does not reset position, controls, or the learner’s place in the session.',
        feature1Point2Title: 'Transcript as a navigation surface',
        feature1Point2Desc:
            'Time-synced lines make the transcript part of playback rather than a passive document. The active sentence is visually dominant so attention follows the audio without forcing a separate reading workflow.',

        feature2Title: 'Make a mark more useful than a bookmark',
        feature2Desc:
            'LingoSlice distinguishes a quick sentence mark from a longer selected passage. Both become time-based learning objects that can be replayed directly from the marker list.',
        feature2Point1Title: 'Sentence mark or practice segment',
        feature2Point1Desc:
            'A learner can capture one sentence immediately or use “Select Segment” for a longer range. The interaction supports two different intentions without adding a separate editing screen.',
        feature2Point2Title: 'Review stays anchored to audio time',
        feature2Point2Desc:
            'The marker list keeps the sentence, timestamp, repeat count, and current practice state together. Review therefore starts from the original audio moment instead of from an isolated note.',

        feature3Title: 'Make the library reflect the learner’s study structure',
        feature3Desc:
            'Imported material is organized into folders and individual audio items. The library exposes useful study state—lyrics availability, existing marks, and current playback—before the learner opens a track.',
        feature3Point1Title: 'Folders without losing the audio list',
        feature3Point1Desc:
            'Expandable folders let learners group courses or topics while still keeping individual tracks visible in the same browsing context.',
        feature3Point2Title: 'Study state is visible at a glance',
        feature3Point2Desc:
            'Lyrics badges, mark counts, and the active-track indicator turn the library from a file list into a lightweight progress and navigation surface.',

        technicalTitle: 'Make playback persistent across navigation',
        technicalDesc:
            'Playback should feel like an ongoing activity, not something owned by a single screen. A persistent mini player carries the current track across the Audio and Profile areas so learners can browse or manage settings without losing the session.',
        technicalPoint1Title: 'Continuity over screen ownership',
        technicalPoint1Desc:
            'The same playback state survives tab changes and view transitions. The full player, mini player, transcript position, and pause/play state stay synchronized.',
        technicalPoint2Title: 'System state becomes visible',
        technicalPoint2Desc:
            'Track identity, elapsed time, duration, progress, and play state remain readable from the mini player, giving the learner confidence that navigation has not interrupted playback.',

        additionalTitle: 'System Mapping Before Screen Design',
        additionalDesc:
            'Before refining individual screens, I mapped the product as a connected system: library, folders, imports, playback, lyrics, marking, review, settings, membership, and edge states. This made cross-screen dependencies visible early and reduced the risk of designing isolated UI states.',

        impactTitle: 'Prototype Scope',
        impactStat1Value: 'Core loop',
        impactStat1Label: 'Library → Player → Mark → Marker List → Repeat',
        impactStat2Value: 'Local-first',
        impactStat2Label: 'Imported audio and synced lyrics remain useful without cloud processing',

        reflectionTitle: 'Reflection from an HCI Perspective',
        reflectionText:
            'The project shifted my attention from feature inventory to interaction cost. The central question was not whether the app could play audio or save text, but whether those actions could happen at the exact learning moment with minimal cognitive interruption.',
        reflectionPoint1:
            '<strong>State models shape interaction.</strong> Treating a mark as a time-based learning object connects playback, transcript position, review, and repetition into one coherent system.',
        reflectionPoint2:
            '<strong>Continuity is a usability feature.</strong> Persistent playback and shared state make navigation feel reversible and safe, which matters when the learner is concentrating on language rather than on the interface.',

        heroAlt: 'LingoSlice mobile app overview',
        heroBadge1Title: 'Listen → Mark',
        heroBadge1Desc: 'Capture without leaving playback',
        heroBadge2Title: 'Review → Repeat',
        heroBadge2Desc: 'Return to the original audio context',
        playerModesAlt: 'LingoSlice cover and lyrics player modes',
        markingFlowAlt: 'LingoSlice sentence and segment marking flow',
        markerListAlt: 'LingoSlice marked sentence and segment review list',
        libraryAlt: 'LingoSlice audio library with folders, lyrics status, and marks',
        persistentPlaybackAlt: 'LingoSlice persistent mini player across Audio and Profile tabs',
        productMapAlt: 'LingoSlice product architecture and interaction map',
        productMapAria: 'Open the full LingoSlice product map',
        productMapHint: '{copy.productMapHint}',
    },

    zh: {
        title: 'LingoSlice',
        subtitle: '设计低摩擦的精听、标记与重复练习工作流',
        description:
            'LingoSlice 是一款面向语言学习者的 iOS 精听工具，支持导入自己的音频以及带时间轴的歌词或转写文本。它不把播放、标注和复习拆成彼此割裂的功能，而是把稍纵即逝的“这一句没听懂”转化为可以持续练习的学习片段。',
        heroCard:
            '如何让学习者在不中断听力注意力的情况下，保留那个最值得反复练习的瞬间？',

        role: '角色',
        roleValue: '独立产品设计师 & 开发者',
        platform: '平台',
        platformValue: 'iOS · iPhone',
        contribution: '负责内容',
        contributionValue: '产品策略 · UX/UI · 交互设计 · 原型设计 · SwiftUI',
        timeline: '项目状态',
        timelineValue: '2026 · 原型开发中',

        challengeTitle: '问题定义',
        challengeHeading:
            '精听真正困难的并不是“播放音频”，而是如何保留那个刚刚发现自己需要练习的瞬间。',
        challengeText:
            '在精听过程中，有价值的学习瞬间往往非常短暂：学习者突然发现一句话没听清、一个短语很难，或某一小段值得反复练习。传统播放器会让这个瞬间产生很高的操作成本——暂停、拖动进度、切换界面、找到文本、记录内容，之后还要重新找回原来的语境。界面本身反而消耗了原本应该放在语言上的注意力。',
        challengePoint1Title: '语境丢失',
        challengePoint1Desc:
            '当听音频、阅读文本、做标记和复习分散在不同位置时，学习者每次都需要重新确认自己刚才听到了哪里，以及为什么这一句值得练习。',
        challengePoint2Title: '交互负担',
        challengePoint2Desc:
            '从“这句没听懂”到“把它留下来练习”，应该只需要几秒，而不应该经历多次模式切换和手工整理。',
        mission:
            '因此，设计目标被收敛为一个问题：尽可能缩短从发现听力问题，到在原语境中重新练习它的路径。',

        solutionTitle: '核心交互',
        feature1Title: '让听力与文本导航始终处于同一个认知上下文',
        feature1Desc:
            '完整播放器提供“封面”和“歌词”两个轻量视图，但它们共享同一套播放状态。切换视图只改变学习者看到的信息，不改变正在进行的学习任务。',
        feature1Point1Title: '两个视图，一套播放状态',
        feature1Point1Desc:
            '封面视图让播放界面保持安静、低干扰；歌词视图则展示当前句以及上下文。两者之间切换不会重置播放位置、控制状态，也不会让学习者丢失当前学习进度。',
        feature1Point2Title: '把文本变成播放导航界面',
        feature1Point2Desc:
            '带时间轴的文本不再只是被动阅读内容，而成为播放交互的一部分。当前句通过视觉层级被突出，让注意力自然跟随音频，而不需要进入另一套阅读流程。',

        feature2Title: '让“标记”比普通书签更有价值',
        feature2Desc:
            'LingoSlice 区分快速标记单句与选择更长的练习片段。两种结果都会成为与音频时间绑定的学习对象，并可以直接从标记列表重新播放。',
        feature2Point1Title: '标记一句，或选择一个练习片段',
        feature2Point1Desc:
            '学习者可以立即保存当前句，也可以使用“选段”捕捉更长范围。两个不同的学习意图被放进同一条交互路径中，而不需要额外进入编辑页面。',
        feature2Point2Title: '复习始终锚定在原始音频时间',
        feature2Point2Desc:
            '标记列表把文本、时间点、重复次数和当前练习状态放在一起。复习因此从原始音频语境开始，而不是从一条脱离上下文的笔记开始。',

        feature3Title: '让音频库体现学习者自己的学习结构',
        feature3Desc:
            '导入的内容可以按文件夹和单条音频组织。在真正进入某个音频之前，音频库已经会展示歌词状态、已有标记数量和当前播放状态等学习信息。',
        feature3Point1Title: '使用文件夹，但不牺牲音频浏览效率',
        feature3Point1Desc:
            '可展开文件夹让学习者按照课程、语言或主题组织内容，同时仍能在同一浏览上下文中直接看到具体音频。',
        feature3Point2Title: '一眼看到当前学习状态',
        feature3Point2Desc:
            '歌词标签、标记数量以及正在播放的状态提示，让音频库不再只是文件列表，而成为轻量的学习进度与导航界面。',

        technicalTitle: '让播放状态跨页面持续存在',
        technicalDesc:
            '播放应该是一项持续进行的活动，而不是某一个页面独占的功能。常驻 Mini Player 会把当前音频带到“音频”和“我的”等不同区域，让学习者可以浏览内容或调整设置，而不会丢失当前学习会话。',
        technicalPoint1Title: '任务连续性优先于页面归属',
        technicalPoint1Desc:
            '同一套播放状态会跨 Tab 和页面切换持续存在。完整播放器、Mini Player、文本位置以及播放/暂停状态始终保持同步。',
        technicalPoint2Title: '让系统状态始终可见',
        technicalPoint2Desc:
            '当前音频、已播放时间、总时长、进度和播放状态都会持续显示在 Mini Player 中，让学习者知道导航并没有打断当前播放。',

        additionalTitle: '先做系统映射，再进入界面设计',
        additionalDesc:
            '在细化单个页面之前，我先把产品梳理成一个相互连接的系统：音频库、文件夹、导入、播放、歌词、标记、复习、设置、会员以及各种边界状态。这样可以更早暴露跨页面依赖，降低只设计孤立 UI 状态的风险。',

        impactTitle: '原型范围',
        impactStat1Value: '核心闭环',
        impactStat1Label: '音频库 → 播放器 → 标记 → 标记列表 → 重复练习',
        impactStat2Value: '本地优先',
        impactStat2Label: '导入的音频与同步歌词无需云端处理也能完成核心学习流程',

        reflectionTitle: '从 HCI 视角的反思',
        reflectionText:
            '这个项目让我从“有哪些功能”转向关注“一次操作需要付出多少认知成本”。真正的问题并不是 App 能不能播放音频、能不能保存文本，而是这些动作能否恰好发生在学习者意识到问题的那个瞬间，并尽可能减少注意力中断。',
        reflectionPoint1:
            '<strong>状态模型会直接塑造交互。</strong> 当“标记”被定义为一个与时间绑定的学习对象后，播放、文本位置、复习与重复练习就能被连接成一套连贯系统。',
        reflectionPoint2:
            '<strong>连续性本身就是可用性。</strong> 持续播放和共享状态让页面导航变得可逆且可预测；当学习者的注意力放在语言上，而不是界面上时，这一点尤其重要。',

        heroAlt: 'LingoSlice 移动端产品概览',
        heroBadge1Title: '精听 → 标记',
        heroBadge1Desc: '无需离开播放流程即可捕捉学习点',
        heroBadge2Title: '复习 → 重复',
        heroBadge2Desc: '回到原始音频语境中继续练习',
        playerModesAlt: 'LingoSlice 封面模式与歌词模式',
        markingFlowAlt: 'LingoSlice 单句标记与选段标记流程',
        markerListAlt: 'LingoSlice 标记句与练习片段列表',
        libraryAlt: 'LingoSlice 音频库、文件夹、歌词状态与标记信息',
        persistentPlaybackAlt: 'LingoSlice 在音频页与我的页面之间持续存在的 Mini Player',
        productMapAlt: 'LingoSlice 产品架构与交互脑图',
        productMapAria: '打开完整的 LingoSlice 产品脑图',
        productMapHint: '点击脑图可查看完整高清版本。',
    },
} as const

export default function LingoSlicePageClient({ locale, dict }: LingoSlicePageClientProps) {
    const language = String(locale).toLowerCase().startsWith('zh') ? 'zh' : 'en'
    const copy = copyByLocale[language]

    const { isAuthenticated, user, logout } = useAuth()
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showRegisterModal, setShowRegisterModal] = useState(false)

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500 selection:text-black">
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
                {/* Back */}
                <div className="max-w-7xl mx-auto px-6 mb-8 pt-4">
                    <Link
                        href={`/${locale}/projects`}
                        className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors inline-flex"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {dict.common.back}
                    </Link>
                </div>

                {/* Hero */}
                <section className="max-w-7xl mx-auto px-6 mb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="space-y-8"
                        >
                            <motion.h1
                                variants={fadeIn}
                                className="text-5xl md:text-6xl font-bold tracking-tight leading-tight text-white"
                            >
                                {copy.title}
                                <span className="block text-2xl md:text-3xl text-gray-400 mt-4 font-normal leading-normal">
                                    {copy.subtitle}
                                </span>
                            </motion.h1>

                            <motion.p variants={fadeIn} className="text-xl text-gray-300 leading-relaxed">
                                {copy.description}
                            </motion.p>

                            <motion.div
                                variants={fadeIn}
                                className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm"
                            >
                                <p className="text-lg text-gray-200 italic">&quot;{copy.heroCard}&quot;</p>
                            </motion.div>

                            <motion.div
                                variants={fadeIn}
                                className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10"
                            >
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                        {copy.role}
                                    </h3>
                                    <p className="font-medium text-white">{copy.roleValue}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                        {copy.platform}
                                    </h3>
                                    <p className="font-medium text-white">{copy.platformValue}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                        {copy.contribution}
                                    </h3>
                                    <p className="font-medium text-white">{copy.contributionValue}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                        {copy.timeline}
                                    </h3>
                                    <p className="font-medium text-white">{copy.timelineValue}</p>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group bg-zinc-950">
                                <Image
                                    src={coverImg}
                                    alt={copy.heroAlt}
                                    className="w-full h-auto transform group-hover:scale-[1.02] transition-transform duration-700"
                                    priority
                                />
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="absolute -bottom-6 -right-6 bg-[#1a1a1a] p-6 rounded-xl border border-white/10 shadow-xl hidden md:block"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-emerald-500/20 rounded-lg">
                                        <Headphones className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-white">{copy.heroBadge1Title}</div>
                                        <div className="text-xs text-gray-400">{copy.heroBadge1Desc}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-cyan-500/20 rounded-lg">
                                        <Repeat2 className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-white">{copy.heroBadge2Title}</div>
                                        <div className="text-xs text-gray-400">{copy.heroBadge2Desc}</div>
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
                        <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest mb-4">
                            {copy.challengeTitle}
                        </h2>
                        <h3 className="text-3xl md:text-4xl font-bold mb-8 text-white">
                            {copy.challengeHeading}
                        </h3>

                        <div className="prose prose-lg prose-invert text-gray-300">
                            <p className="mb-6">{copy.challengeText}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 not-prose">
                                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 bg-rose-500/20 rounded-full flex items-center justify-center mb-4">
                                        <Layers className="w-5 h-5 text-rose-400" />
                                    </div>
                                    <h4 className="text-lg font-semibold mb-2 text-white">
                                        {copy.challengePoint1Title}
                                    </h4>
                                    <p className="text-gray-400 text-sm">{copy.challengePoint1Desc}</p>
                                </div>

                                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                                        <Volume2 className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <h4 className="text-lg font-semibold mb-2 text-white">
                                        {copy.challengePoint2Title}
                                    </h4>
                                    <p className="text-gray-400 text-sm">{copy.challengePoint2Desc}</p>
                                </div>
                            </div>

                            <p className="text-white font-medium text-xl border-l-4 border-emerald-500 pl-6 py-2 bg-emerald-500/10 rounded-r-lg">
                                &quot;{copy.mission}&quot;
                            </p>
                        </div>
                    </motion.div>
                </section>

                {/* Solution */}
                <section className="bg-zinc-900 py-32">
                    <div className="max-w-7xl mx-auto px-6 space-y-32">
                        {/* Feature 1 */}
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest mb-4">
                                    {copy.solutionTitle}
                                </h2>
                                <h3 className="text-3xl font-bold mb-6 text-white">{copy.feature1Title}</h3>
                                <p className="text-lg text-gray-400 mb-6">{copy.feature1Desc}</p>

                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-cyan-400" />
                                            {copy.feature1Point1Title}
                                        </h4>
                                        <p className="text-gray-400 leading-relaxed">{copy.feature1Point1Desc}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                            <Bookmark className="w-5 h-5 text-emerald-400" />
                                            {copy.feature1Point2Title}
                                        </h4>
                                        <p className="text-gray-400 leading-relaxed">{copy.feature1Point2Desc}</p>
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
                                        src={playerModesImg}
                                        alt={copy.playerModesAlt}
                                        className="w-full h-auto"
                                    />
                                </div>
                                <div className="bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                    <Image
                                        src={markingFlowImg}
                                        alt={copy.markingFlowAlt}
                                        className="w-full h-auto"
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {/* Feature 2 */}
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="md:order-2"
                            >
                                <h3 className="text-3xl font-bold mb-6 text-white">{copy.feature2Title}</h3>
                                <p className="text-lg text-gray-400 mb-6">{copy.feature2Desc}</p>

                                <div className="space-y-6">
                                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                        <h4 className="font-bold text-white mb-2">{copy.feature2Point1Title}</h4>
                                        <p className="text-gray-400">{copy.feature2Point1Desc}</p>
                                    </div>
                                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                        <h4 className="font-bold text-white mb-2">{copy.feature2Point2Title}</h4>
                                        <p className="text-gray-400">{copy.feature2Point2Desc}</p>
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
                                    src={markerListImg}
                                    alt={copy.markerListAlt}
                                    className="w-full h-auto rounded-xl"
                                />
                            </motion.div>
                        </div>

                        {/* Feature 3 */}
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-3xl font-bold mb-6 text-white">{copy.feature3Title}</h3>
                                <p className="text-lg text-gray-400 mb-6">{copy.feature3Desc}</p>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                            <FolderOpen className="w-5 h-5 text-emerald-400" />
                                            {copy.feature3Point1Title}
                                        </h4>
                                        <p className="text-gray-400">{copy.feature3Point1Desc}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                            <ShieldCheck className="w-5 h-5 text-cyan-400" />
                                            {copy.feature3Point2Title}
                                        </h4>
                                        <p className="text-gray-400">{copy.feature3Point2Desc}</p>
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
                                    src={libraryImg}
                                    alt={copy.libraryAlt}
                                    className="w-full h-auto rounded-xl"
                                />
                            </motion.div>
                        </div>

                        {/* Technical / HCI */}
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-3xl font-bold mb-6 text-white">{copy.technicalTitle}</h3>
                                <p className="text-lg text-gray-400 mb-6">{copy.technicalDesc}</p>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-white mb-2">{copy.technicalPoint1Title}</h4>
                                        <p className="text-gray-400">{copy.technicalPoint1Desc}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2">{copy.technicalPoint2Title}</h4>
                                        <p className="text-gray-400">{copy.technicalPoint2Desc}</p>
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
                                    src={persistentPlaybackImg}
                                    alt={copy.persistentPlaybackAlt}
                                    className="w-full h-auto rounded-xl"
                                />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Additional visuals */}
                <section className="max-w-7xl mx-auto px-6 py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest mb-12 text-center">
                            {copy.additionalTitle}
                        </h2>

                        <p className="max-w-3xl mx-auto text-center text-lg text-gray-400 leading-relaxed mb-10">
                            {copy.additionalDesc}
                        </p>

                        <a
                            href={productMapImg.src}
                            target="_blank"
                            rel="noreferrer"
                            className="block bg-white rounded-2xl p-4 border border-white/10 shadow-2xl overflow-hidden cursor-zoom-in"
                            aria-label={copy.productMapAria}
                        >
                            <Image
                                src={productMapImg}
                                alt={copy.productMapAlt}
                                className="w-full h-auto rounded-xl"
                            />
                        </a>
                        <p className="text-center text-sm text-gray-500 mt-4">
                            {copy.productMapHint}
                        </p>
                    </motion.div>
                </section>

                {/* Impact & Reflection */}
                <section className="max-w-4xl mx-auto px-6 mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-emerald-900/10 to-cyan-900/10 rounded-3xl p-12 border border-white/10"
                    >
                        <div className="grid md:grid-cols-2 gap-12 mb-4">
                            <div>
                                <h2 className="text-2xl font-bold mb-6 text-white">{copy.impactTitle}</h2>
                                <div className="space-y-6">
                                    <div>
                                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-400 mb-2">
                                            {copy.impactStat1Value}
                                        </div>
                                        <div className="text-gray-400">{copy.impactStat1Label}</div>
                                    </div>
                                    <div>
                                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400 mb-2">
                                            {copy.impactStat2Value}
                                        </div>
                                        <div className="text-gray-400">{copy.impactStat2Label}</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-6 text-white">{copy.reflectionTitle}</h2>
                                <div className="space-y-4 text-gray-300 leading-relaxed">
                                    <p>{copy.reflectionText}</p>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3">
                                            <Layers className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                                            <span dangerouslySetInnerHTML={{ __html: copy.reflectionPoint1 }} />
                                        </li>
                                        <li className="flex gap-3">
                                            <Smartphone className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                                            <span dangerouslySetInnerHTML={{ __html: copy.reflectionPoint2 }} />
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>
            </main>

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
