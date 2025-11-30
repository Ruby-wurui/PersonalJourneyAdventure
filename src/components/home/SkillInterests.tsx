'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Star, ArrowRight } from 'lucide-react';

interface PopupItem {
    title: string;
    description: string;
    src: string;
    color: string;
}

const popupData: PopupItem[] = [
    {
        title: "Frontend Dev",
        description: "Building responsive and interactive user interfaces with React, Next.js, and Tailwind CSS.",
        src: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=600",
        color: "#a855f7"
    }, // Purple
    {
        title: "Backend Dev",
        description: "Designing robust APIs and database schemas with Node.js, Express, and PostgreSQL/MySQL.",
        src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600",
        color: "#3b82f6"
    }, // Blue
    {
        title: "AI Integration",
        description: "Leveraging LLMs and AI tools to enhance application functionality and user experience.",
        src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=600",
        color: "#eab308"
    }, // Yellow
    {
        title: "Creative Coding",
        description: "Experimenting with WebGL, Three.js, and Framer Motion to create immersive web art.",
        src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600",
        color: "#f97316"
    }, // Orange
];

const cardVariants = {
    offscreen: {
        y: 400,
        rotate: 15,
        scale: 0.8
    },
    onscreen: {
        y: 50,
        rotate: -2,
        scale: 1,
        transition: {
            type: "spring",
            bounce: 0.5,
            duration: 1
        },
    },
};

const PopUpCard = ({ item, i }: { item: PopupItem, i: number }) => {
    const background = `linear-gradient(135deg, ${item.color}88, ${item.color}22)`;
    const splashClipPath = `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")`;

    const cardBackground = `linear-gradient(160deg, #2a2a2a 0%, ${item.color}15 100%)`;

    return (
        <motion.div
            className="flex justify-center items-center relative pt-5 -mb-[160px] overflow-visible"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ amount: 0.6, margin: "0px 0px -100px 0px" }}
        >
            <div
                className="absolute inset-0 w-full h-full blur-3xl opacity-70 pointer-events-none"
                style={{ background, clipPath: splashClipPath }}
            />

            <motion.div
                variants={cardVariants}
                className="relative w-[380px] h-[520px] flex flex-col rounded-3xl border border-white/20 shadow-2xl overflow-hidden origin-[50%_100%]"
                style={{ background: cardBackground }}
            >
                <div className="h-[50%] w-full overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2a2a2a] via-transparent to-transparent opacity-80 z-10" />
                    <img
                        src={item.src}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs text-white font-mono">
                        0{i + 1}
                    </div>
                </div>

                <div className="h-[50%] w-full flex flex-col p-6 relative z-20">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold text-white tracking-tight">{item.title}</h3>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/5">
                            <Zap size={16} style={{ color: item.color }} />
                        </div>
                    </div>

                    <div className="w-10 h-1 rounded-full mb-4" style={{ backgroundColor: item.color }} />

                    <p className="text-neutral-300 text-sm leading-relaxed font-light mb-6 opacity-90">
                        {item.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between group cursor-pointer">
                        <span className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase group-hover:text-white transition-colors">Learn More</span>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
                            <ArrowRight size={14} className="text-white transform group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default function SkillInterests() {
    return (
        <section id="skills-section" className="py-40 bg-neutral-900 overflow-hidden">
            <div className="text-center mb-24 relative z-10">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Star className="text-yellow-500 w-6 h-6" />
                    <span className="text-yellow-400 font-mono text-sm tracking-widest">SKILLS & INTERESTS</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white">What I Do</h2>
                <p className="text-neutral-400 mt-4 max-w-md mx-auto">Scroll down to explore my areas of expertise.</p>
            </div>

            <div className="max-w-[600px] mx-auto w-full pb-[150px] relative z-0">
                {popupData.map((item, i) => (
                    <PopUpCard i={i} item={item} key={item.title} />
                ))}
            </div>
        </section>
    );
}
