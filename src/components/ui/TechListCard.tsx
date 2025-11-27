'use client'

import React from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'

interface SkillItem {
    title: string
    content: string
    icon: string
    color: string
}

interface TechListCardProps {
    category: string
    items: SkillItem[]
    index: number
}

export default function TechListCard({ category, items, index }: TechListCardProps) {
    // Floating animation variants
    const floatingVariant = {
        initial: { y: 0 },
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5 // Stagger animations
            }
        }
    }

    // Determine color theme based on the first item (simplified for now)
    const baseColor = items[0]?.color || 'blue'

    // Map color names to Tailwind classes
    const colorMap: Record<string, string> = {
        blue: 'cyan',
        green: 'emerald',
        purple: 'violet',
        pink: 'rose'
    }
    const themeColor = colorMap[baseColor] || 'cyan'

    // Static background classes to ensure Tailwind generates them
    const bgClasses: Record<string, string> = {
        cyan: 'bg-cyan-900/30',
        emerald: 'bg-emerald-900/30',
        violet: 'bg-violet-900/30',
        rose: 'bg-rose-900/30'
    }
    const headerFooterBg = bgClasses[themeColor]

    // 3D Tilt Logic
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect()
        mouseX.set(clientX - left - width / 2)
        mouseY.set(clientY - top - height / 2)
    }

    function handleMouseLeave() {
        mouseX.set(0)
        mouseY.set(0)
    }

    const rotateX = useSpring(useTransform(mouseY, [-300, 300], [5, -5]), { stiffness: 150, damping: 20 })
    const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-5, 5]), { stiffness: 150, damping: 20 })
    const brightness = useSpring(useTransform(mouseY, [-300, 300], [1.1, 0.9]), { stiffness: 150, damping: 20 })

    return (
        <motion.div
            variants={floatingVariant}
            initial="initial"
            animate="animate"
            whileHover={{ y: 0, transition: { duration: 0.3 } }} // Pause/Reset float on hover
            style={{ perspective: 1000 }}
            className="relative w-full h-full"
        >
            <motion.div
                style={{ rotateX, rotateY, filter: useMotionTemplate`brightness(${brightness})` }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`
                    relative h-full bg-[#050a10]/90 backdrop-blur-xl 
                    border border-${themeColor}-500/30 rounded-2xl p-1 
                    overflow-hidden group hover:border-${themeColor}-400/60 transition-colors duration-300
                    transform-style-3d shadow-2xl
                `}
            >
                {/* Spotlight Effect */}
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                650px circle at ${mouseX}px ${mouseY}px,
                                rgba(255,255,255,0.1),
                                transparent 40%
                            )
                        `
                    }}
                />

                {/* Corner Accents */}
                <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-${themeColor}-500 rounded-tl-2xl opacity-60`} />
                <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-${themeColor}-500 rounded-br-2xl opacity-60`} />

                {/* Inner Container */}
                <div className="relative h-full bg-[#020408]/60 rounded-xl flex flex-col z-10 overflow-hidden">

                    {/* Header */}
                    <div className={`flex items-center justify-between p-6 border-b border-${themeColor}-500/10 ${headerFooterBg}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full bg-${themeColor}-500/20 flex items-center justify-center border border-${themeColor}-500/30 shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                                <span className="text-2xl">{items[0]?.icon}</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white tracking-wider uppercase font-mono">{category}</h3>
                                <p className={`text-xs text-${themeColor}-400 font-mono tracking-widest opacity-80`}>PROTOCOL_V{index + 1}</p>
                            </div>
                        </div>
                        <div className={`text-${themeColor}-500 opacity-80`}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                    </div>

                    {/* Body - List */}
                    <div className="space-y-6 flex-grow relative p-6">
                        {/* Vertical Line connecting items */}
                        <div className={`absolute left-[35px] top-6 bottom-6 w-[1px] bg-${themeColor}-500/20`} />

                        {items.map((item, i) => (
                            <div key={i} className="relative pl-12 group/item">
                                {/* Node on the line */}
                                <div className={`
                                    absolute left-[29px] top-1.5 w-3 h-3 rounded-full border-2 border-[#050505] 
                                    bg-[#050505] ring-1 ring-${themeColor}-500/50
                                    group-hover/item:bg-${themeColor}-400 group-hover/item:ring-${themeColor}-400 transition-all duration-300
                                `}>
                                    {/* Inner dot for active look */}
                                    <div className={`w-full h-full rounded-full bg-${themeColor}-500 opacity-0 group-hover/item:opacity-100 transition-opacity`} />
                                </div>

                                <h4 className="text-gray-200 font-bold text-sm mb-1 group-hover/item:text-${themeColor}-300 transition-colors tracking-wide">
                                    {item.title}
                                </h4>
                                <p className="text-gray-500 text-xs font-mono leading-relaxed group-hover/item:text-gray-400 transition-colors">
                                    {item.content}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className={`mt-auto border-t border-${themeColor}-500/10 p-4 ${headerFooterBg} flex justify-between items-center text-xs font-mono text-${themeColor}-400/80`}>
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full bg-${themeColor}-500 animate-pulse`} />
                            <span>STATUS: AVAILABLE</span>
                        </div>
                        <span>{items.length} SLOTS</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
