'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    FileText,
    Brain,
    ClipboardCheck,
    PenLine,
    Target,
    BarChart3,
    Repeat2,
    History,
    Layers,
    Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import NavigationBarI18n from '@/components/layout/NavigationBarI18n'
import { Dictionary } from '@/i18n/get-dictionary'
import { useAuth } from '@/lib/auth-context'
import { LoginModal } from '@/components/auth/LoginModal'
import RegisterModal from '@/components/auth/RegisterModal'
import { Locale } from '@/i18n/config'

import coverImg from '@/assets/projects/iwriting/cover.png'
import practiceFlowImg from '@/assets/projects/iwriting/practice_flow.png'
import thinkingSupportImg from '@/assets/projects/iwriting/thinking_support.png'
import gradingReportImg from '@/assets/projects/iwriting/grading_report.png'
import aiRewriteImg from '@/assets/projects/iwriting/ai_rewrite.png'
import abilityPracticeImg from '@/assets/projects/iwriting/ability_practice.png'
import supportingSystemImg from '@/assets/projects/iwriting/supporting_system.png'

interface IWritingPageClientProps {
    locale: Locale
    dict: Dictionary
}

const copyByLocale = {
    en: {
        title: 'iWriting',
        subtitle: 'Turning IELTS writing feedback into a continuous learning loop',
        description:
            'iWriting is a web-based IELTS writing practice experience that connects task selection, timed writing, planning support, AI-assisted feedback, revision, and targeted exercises. The core design question was not how to generate more feedback, but how to make each piece of feedback lead to a clear next action.',
        heroCard:
            'How might we turn one submitted essay into a structured cycle of diagnosis, revision, and deliberate practice?',

        role: 'Role',
        roleValue: 'Product Designer & Full-Stack Developer',
        platform: 'Platform',
        platformValue: 'Responsive Web',
        contribution: 'Contribution',
        contributionValue: 'Product Strategy · UX/UI · Interaction Design · Front-end Development · Back-end Development · AI Workflow Design',
        timeline: 'Status',
        timelineValue: '2026 · Functional Prototype',

        challengeTitle: 'Problem Framing',
        challengeHeading:
            'A score can tell learners where they are. It does not automatically tell them what to do next.',
        challengeText:
            'IELTS writing practice often becomes a fragmented sequence: find a prompt, write under time pressure, receive a score, read comments, and then start another essay. The learner may understand the feedback intellectually but still lack a concrete path from diagnosis to revision and from revision to skill building.',
        challengePoint1Title: 'Feedback without a next step',
        challengePoint1Desc:
            'Criterion-level feedback can become informational overload when weaknesses are presented with equal weight and no action priority.',
        challengePoint2Title: 'Learning context gets fragmented',
        challengePoint2Desc:
            'Planning, writing, grading, rewriting, and practice often live in separate tools or modes, forcing learners to rebuild context at every stage.',
        mission:
            'The product therefore treats one essay as the beginning of a learning loop—not the end of a grading event.',

        solutionTitle: 'Practice Flow',
        feature1Title: 'Preserve exam context from task selection to timed writing',
        feature1Desc:
            'The practice flow starts with a browsable IELTS task library, then moves into a split-screen writing environment that keeps the prompt visible while the learner writes.',
        feature1Point1Title: 'Structured task discovery',
        feature1Point1Desc:
            'Task type, source, and chart-format filters reduce the cost of finding a suitable prompt while keeping authentic and simulated practice in the same system.',
        feature1Point2Title: 'Prompt and essay stay visible together',
        feature1Point2Desc:
            'The writing workspace combines the question, visual material, timer, word count, and editor so the learner does not need to switch pages during a timed session.',

        feature2Title: 'Support thinking without replacing the learner’s argument',
        feature2Desc:
            'The “Writing Ideas” area decomposes the prompt into viewpoints and a recommended stance while the learner’s own essay remains visible on the right.',
        feature2Point1Title: 'Scaffold the reasoning process',
        feature2Point1Desc:
            'Prompt interpretation, possible positions, and strategy notes are separated into readable cards so support is presented as a thinking scaffold rather than a generated final answer.',
        feature2Point2Title: 'Keep the learner’s text in context',
        feature2Point2Desc:
            'The persistent essay panel helps users compare planning guidance with what they actually wrote, reducing memory load and making revision decisions easier.',

        feature3Title: 'Translate a score into a diagnosis',
        feature3Desc:
            'The grading report organizes AI-assisted feedback around IELTS-style dimensions—Task Response, Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy—while highlighting the most actionable weaknesses.',
        feature3Point1Title: 'Overview first, detail second',
        feature3Point1Desc:
            'Overall score, radar overview, and criterion cards create a layered information hierarchy instead of presenting every comment at once.',
        feature3Point2Title: 'Action priority makes feedback operational',
        feature3Point2Desc:
            'Priority tags surface the issues that should be addressed first, helping the learner move from “I scored 6.5” to “this is what I should work on next.”',

        feature4Title: 'Use rewriting as a comparison tool, not a replacement',
        feature4Desc:
            'The AI rewrite view keeps the original essay visible while showing a revised version, target band, overall evaluation, and specific improvement highlights.',
        feature4Point1Title: 'Targeted rather than generic rewriting',
        feature4Point1Desc:
            'Learners can choose a target score range, making the rewrite a level-specific example rather than an abstract “better version.”',
        feature4Point2Title: 'Explain what changed',
        feature4Point2Desc:
            'Vocabulary, sentence-structure, and cohesion highlights turn the rewrite into a comparison surface that can support noticing and reflection.',

        feature5Title: 'Feed diagnosis directly into deliberate practice',
        feature5Desc:
            'The ability-practice area generates focused exercises from the weak dimensions identified in the grading stage. The example shown prioritizes Grammar & Accuracy and tracks progress across a short exercise sequence.',
        feature5Point1Title: 'Weakness becomes exercise scope',
        feature5Point1Desc:
            'The practice module states why the exercise exists and links it back to the learner’s writing problems, making the drill feel consequential rather than generic.',
        feature5Point2Title: 'Short feedback loops',
        feature5Point2Desc:
            'Single-question exercises, visible progress, and immediate submission keep practice narrow enough to repeat while preserving the connection to the original essay.',

        supportingTitle: 'Supporting Product System',
        supportingDesc:
            'Practice history and membership sit outside the core learning loop but support continuity over time. History preserves completed attempts and grading state, while membership controls access to higher-cost AI features.',

        impactTitle: 'Prototype Scope',
        impactStat1Value: '5-stage loop',
        impactStat1Label: 'Select → Plan → Write → Diagnose → Practice',
        impactStat2Value: '4 criteria',
        impactStat2Label: 'TR · CC · LR · GRA organized into one diagnostic model',

        reflectionTitle: 'Reflection from an HCI Perspective',
        reflectionText:
            'The strongest design shift was moving from “AI gives an answer” to “AI helps sequence the learner’s next actions.” The interface is most useful when it reduces interpretation work while still leaving the learner responsible for reasoning, revision, and practice.',
        reflectionPoint1:
            '<strong>Feedback needs hierarchy.</strong> Scores, dimensions, priorities, and detailed corrections should appear at different levels so users can decide where to focus before reading everything.',
        reflectionPoint2:
            '<strong>Context persistence reduces cognitive load.</strong> Keeping the essay visible across planning, grading, and rewriting makes comparison easier and prevents each AI feature from feeling like an isolated tool.',

        heroAlt: 'iWriting IELTS writing learning loop',
        heroBadge1Title: 'Essay → Diagnosis',
        heroBadge1Desc: 'Turn criteria into prioritized feedback',
        heroBadge2Title: 'Diagnosis → Practice',
        heroBadge2Desc: 'Convert weak points into targeted exercises',
        practiceFlowAlt: 'iWriting task library and timed writing workspace',
        thinkingAlt: 'iWriting writing ideas and planning support interface',
        gradingAlt: 'iWriting AI-assisted grading report',
        rewriteAlt: 'iWriting AI rewrite comparison interface',
        practiceAlt: 'iWriting ability improvement exercise',
        supportingAlt: 'iWriting practice history and membership pages',
    },

    zh: {
        title: 'iWriting',
        subtitle: '把雅思写作反馈转化为连续的学习闭环',
        description:
            'iWriting 是一个面向雅思写作练习的 Web 产品，将题目选择、限时写作、写作思路、AI 辅助批改、改写和针对性练习连接在同一条学习路径中。这个项目关注的重点不是“如何生成更多反馈”，而是“如何让每一条反馈都能指向下一步行动”。',
        heroCard:
            '如何把一次作文提交，转化为“诊断 → 改写 → 针对性练习”的连续学习过程？',

        role: '角色',
        roleValue: '产品设计师 & 全栈开发者',
        platform: '平台',
        platformValue: '响应式 Web',
        contribution: '负责内容',
        contributionValue: '产品策略 · UX/UI · 交互设计 · 前端开发 · 后端开发 · AI 工作流设计',
        timeline: '项目状态',
        timelineValue: '2026 · 功能原型',

        challengeTitle: '问题定义',
        challengeHeading:
            '分数可以告诉学习者“现在在哪里”，但不会自动告诉他们“下一步做什么”。',
        challengeText:
            '雅思写作练习很容易变成一条割裂的流程：找题、限时写作、得到分数、阅读评语，然后继续写下一篇。学习者可能理解了反馈，却仍然不知道应该先改什么，也不知道如何把一次作文暴露出的弱点转化成后续练习。',
        challengePoint1Title: '反馈很多，但缺少行动顺序',
        challengePoint1Desc:
            '当多个评分维度和问题同时出现时，如果没有优先级，反馈本身就可能变成新的信息负担。',
        challengePoint2Title: '学习上下文不断被切断',
        challengePoint2Desc:
            '审题、写作、评分、改写和专项练习如果分散在不同工具或页面，学习者每一步都要重新建立上下文。',
        mission:
            '因此，这个产品把“一篇作文”视为学习闭环的起点，而不是一次评分事件的终点。',

        solutionTitle: '练习流程',
        feature1Title: '从选题到限时写作，持续保留考试上下文',
        feature1Desc:
            '练习从可筛选的雅思题库开始，然后进入左右分栏的写作环境，让题目在写作过程中始终保持可见。',
        feature1Point1Title: '结构化选题',
        feature1Point1Desc:
            '通过小作文/大作文、题目来源以及图表类型等筛选，降低寻找合适练习题的成本，同时把真题和模拟题放在同一套系统里。',
        feature1Point2Title: '题目与作文始终同时可见',
        feature1Point2Desc:
            '写作环境同时保留题目、图表材料、计时器、字数和编辑区，减少限时写作过程中的页面切换。',

        feature2Title: '辅助思考，但不替代学习者完成论证',
        feature2Desc:
            '“写作思路”将题目拆解成不同观点、推荐立场和策略提示，同时右侧持续展示学习者自己的作文。',
        feature2Point1Title: '给推理过程搭脚手架',
        feature2Point1Desc:
            '题目观点、可选立场和写作策略被拆成清晰卡片，让 AI 支持更像思考提示，而不是直接给出一篇最终答案。',
        feature2Point2Title: '始终保留自己的文本',
        feature2Point2Desc:
            '作文在右侧持续可见，学习者可以直接比较“建议怎么想”和“自己实际上怎么写”，降低记忆负担。',

        feature3Title: '把分数转化成可操作的诊断',
        feature3Desc:
            'AI 批改结果围绕雅思写作常用的四个维度组织：Task Response、Coherence & Cohesion、Lexical Resource、Grammatical Range & Accuracy，并进一步突出最值得优先处理的问题。',
        feature3Point1Title: '先总览，再进入细节',
        feature3Point1Desc:
            '总分、雷达图和四个维度卡片形成分层信息结构，避免一开始就把所有批改意见一次性压给用户。',
        feature3Point2Title: '用行动优先级连接“诊断”和“改进”',
        feature3Point2Desc:
            '优先级标签帮助学习者从“我只有 6.5 分”进一步明确成“我现在最应该先解决哪些问题”。',

        feature4Title: '把 AI 改写设计成“对照工具”，而不是“答案替代品”',
        feature4Desc:
            'AI 改写页面在展示目标分数、改写作文、整体评价和改写亮点的同时，继续保留原作文，让学习者能够对照，而不是只看到一个新的答案。',
        feature4Point1Title: '围绕目标分数改写',
        feature4Point1Desc:
            '学习者可以选择目标分数区间，使改写结果对应一个具体水平，而不是模糊地生成“更好的版本”。',
        feature4Point2Title: '说明到底改了什么',
        feature4Point2Desc:
            '词汇、句式和连贯性等改写亮点把结果变成可比较的学习材料，帮助学习者注意到具体变化。',

        feature5Title: '让诊断结果直接进入专项练习',
        feature5Desc:
            '“能力提升”把批改阶段识别出的薄弱项转成针对性练习。当前示例聚焦 Grammar & Accuracy，并用短题序列持续展示练习进度。',
        feature5Point1Title: '弱项决定练习范围',
        feature5Point1Desc:
            '练习模块会说明本轮为什么练这个知识点，并把练习依据连接回原作文中的问题，让专项训练不再是脱离语境的题库。',
        feature5Point2Title: '缩短反馈循环',
        feature5Point2Desc:
            '单题练习、进度提示和即时提交让训练保持足够聚焦，便于重复，同时仍能与原作文的诊断建立联系。',

        supportingTitle: '支撑产品系统',
        supportingDesc:
            '练习记录和会员系统不属于核心学习闭环，但承担长期连续性：练习记录保存历史作文和批改状态，会员模块则承载高成本 AI 功能的访问控制。',

        impactTitle: '原型范围',
        impactStat1Value: '5 阶段闭环',
        impactStat1Label: '选题 → 构思 → 写作 → 诊断 → 练习',
        impactStat2Value: '4 个维度',
        impactStat2Label: 'TR · CC · LR · GRA 被组织进同一套诊断模型',

        reflectionTitle: '从 HCI 视角的反思',
        reflectionText:
            '这个项目最重要的变化，是从“AI 给出答案”转向“AI 帮助安排下一步行动”。界面真正有价值的地方，是减少学习者解释反馈的成本，同时仍然让他们自己承担思考、修改和练习。',
        reflectionPoint1:
            '<strong>反馈需要层级。</strong> 分数、评分维度、行动优先级和逐条批改应该处在不同信息层级，让用户先决定“关注哪里”，再决定“读多深”。',
        reflectionPoint2:
            '<strong>上下文持续存在可以降低认知负担。</strong> 在写作思路、AI 批改和 AI 改写中持续保留原作文，使比较更直接，也避免每个 AI 功能都变成孤立工具。',

        heroAlt: 'iWriting 雅思写作学习闭环',
        heroBadge1Title: '作文 → 诊断',
        heroBadge1Desc: '把评分维度转化为有优先级的反馈',
        heroBadge2Title: '诊断 → 练习',
        heroBadge2Desc: '把薄弱项进一步转成专项练习',
        practiceFlowAlt: 'iWriting 题库与限时写作界面',
        thinkingAlt: 'iWriting 写作思路与审题支持界面',
        gradingAlt: 'iWriting AI 辅助评分报告',
        rewriteAlt: 'iWriting AI 改写与原文对照界面',
        practiceAlt: 'iWriting 能力提升专项练习',
        supportingAlt: 'iWriting 练习记录与会员页面',
    },
} as const

export default function IWritingPageClient({ locale, dict }: IWritingPageClientProps) {
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
            transition: { staggerChildren: 0.2 },
        },
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white">
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
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{copy.role}</h3>
                                    <p className="font-medium text-white">{copy.roleValue}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{copy.platform}</h3>
                                    <p className="font-medium text-white">{copy.platformValue}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{copy.contribution}</h3>
                                    <p className="font-medium text-white">{copy.contributionValue}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{copy.timeline}</h3>
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
                                className="absolute -bottom-6 -right-6 bg-[#111827] p-6 rounded-xl border border-white/10 shadow-xl hidden md:block"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-blue-500/20 rounded-lg">
                                        <ClipboardCheck className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-white">{copy.heroBadge1Title}</div>
                                        <div className="text-xs text-gray-400">{copy.heroBadge1Desc}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-cyan-500/20 rounded-lg">
                                        <Target className="w-6 h-6 text-cyan-400" />
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

                {/* Problem */}
                <section className="max-w-3xl mx-auto px-6 mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4">
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
                                    <h4 className="text-lg font-semibold mb-2 text-white">{copy.challengePoint1Title}</h4>
                                    <p className="text-gray-400 text-sm">{copy.challengePoint1Desc}</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                                        <Brain className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <h4 className="text-lg font-semibold mb-2 text-white">{copy.challengePoint2Title}</h4>
                                    <p className="text-gray-400 text-sm">{copy.challengePoint2Desc}</p>
                                </div>
                            </div>
                            <p className="text-white font-medium text-xl border-l-4 border-blue-500 pl-6 py-2 bg-blue-500/10 rounded-r-lg">
                                &quot;{copy.mission}&quot;
                            </p>
                        </div>
                    </motion.div>
                </section>

                {/* Feature 1 */}
                <section className="bg-zinc-900 py-32">
                    <div className="max-w-7xl mx-auto px-6 space-y-32">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4">
                                    {copy.solutionTitle}
                                </h2>
                                <h3 className="text-3xl font-bold mb-6 text-white">{copy.feature1Title}</h3>
                                <p className="text-lg text-gray-400 mb-6">{copy.feature1Desc}</p>
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-blue-400" />
                                            {copy.feature1Point1Title}
                                        </h4>
                                        <p className="text-gray-400 leading-relaxed">{copy.feature1Point1Desc}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                            <PenLine className="w-5 h-5 text-cyan-400" />
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
                                className="bg-black rounded-3xl p-4 border border-white/10"
                            >
                                <Image src={practiceFlowImg} alt={copy.practiceFlowAlt} className="w-full h-auto rounded-xl" />
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
                                    <div>
                                        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                            <Brain className="w-5 h-5 text-violet-400" />
                                            {copy.feature2Point1Title}
                                        </h4>
                                        <p className="text-gray-400">{copy.feature2Point1Desc}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                            <Layers className="w-5 h-5 text-blue-400" />
                                            {copy.feature2Point2Title}
                                        </h4>
                                        <p className="text-gray-400">{copy.feature2Point2Desc}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="bg-black rounded-3xl p-4 border border-white/10 md:order-1"
                            >
                                <Image src={thinkingSupportImg} alt={copy.thinkingAlt} className="w-full h-auto rounded-xl" />
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
                                            <BarChart3 className="w-5 h-5 text-blue-400" />
                                            {copy.feature3Point1Title}
                                        </h4>
                                        <p className="text-gray-400">{copy.feature3Point1Desc}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                            <Target className="w-5 h-5 text-cyan-400" />
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
                                <Image src={gradingReportImg} alt={copy.gradingAlt} className="w-full h-auto rounded-xl" />
                            </motion.div>
                        </div>

                        {/* Feature 4 */}
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="md:order-2"
                            >
                                <h3 className="text-3xl font-bold mb-6 text-white">{copy.feature4Title}</h3>
                                <p className="text-lg text-gray-400 mb-6">{copy.feature4Desc}</p>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-violet-400" />
                                            {copy.feature4Point1Title}
                                        </h4>
                                        <p className="text-gray-400">{copy.feature4Point1Desc}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                            <Repeat2 className="w-5 h-5 text-cyan-400" />
                                            {copy.feature4Point2Title}
                                        </h4>
                                        <p className="text-gray-400">{copy.feature4Point2Desc}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="bg-black rounded-3xl p-4 border border-white/10 md:order-1"
                            >
                                <Image src={aiRewriteImg} alt={copy.rewriteAlt} className="w-full h-auto rounded-xl" />
                            </motion.div>
                        </div>

                        {/* Feature 5 */}
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-3xl font-bold mb-6 text-white">{copy.feature5Title}</h3>
                                <p className="text-lg text-gray-400 mb-6">{copy.feature5Desc}</p>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                            <Target className="w-5 h-5 text-blue-400" />
                                            {copy.feature5Point1Title}
                                        </h4>
                                        <p className="text-gray-400">{copy.feature5Point1Desc}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                            <Repeat2 className="w-5 h-5 text-cyan-400" />
                                            {copy.feature5Point2Title}
                                        </h4>
                                        <p className="text-gray-400">{copy.feature5Point2Desc}</p>
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
                                <Image src={abilityPracticeImg} alt={copy.practiceAlt} className="w-full h-auto rounded-xl" />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Supporting system */}
                <section className="max-w-7xl mx-auto px-6 py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-6 text-center">
                            {copy.supportingTitle}
                        </h2>
                        <p className="max-w-3xl mx-auto text-center text-lg text-gray-400 leading-relaxed mb-10">
                            {copy.supportingDesc}
                        </p>
                        <div className="bg-zinc-950 rounded-2xl p-4 border border-white/10 shadow-2xl overflow-hidden">
                            <Image src={supportingSystemImg} alt={copy.supportingAlt} className="w-full h-auto rounded-xl" />
                        </div>
                    </motion.div>
                </section>

                {/* Scope & Reflection */}
                <section className="max-w-4xl mx-auto px-6 mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-blue-900/10 to-cyan-900/10 rounded-3xl p-12 border border-white/10"
                    >
                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h2 className="text-2xl font-bold mb-6 text-white">{copy.impactTitle}</h2>
                                <div className="space-y-6">
                                    <div>
                                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">
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
                                            <ClipboardCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                                            <span dangerouslySetInnerHTML={{ __html: copy.reflectionPoint1 }} />
                                        </li>
                                        <li className="flex gap-3">
                                            <History className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
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
