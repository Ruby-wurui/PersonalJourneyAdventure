'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Layers } from 'lucide-react';

interface CardData {
    title: string;
    description: string;
    src: string;
    color: string;
}

const cardData: CardData[] = [
    { title: "Exploration", description: "Discovering new technologies and pushing boundaries.", src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000&auto=format&fit=crop", color: "#27272a" },
    { title: "Design", description: "Crafting intuitive and beautiful user experiences.", src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop", color: "#202022" },
    { title: "Innovation", description: "Building the future of the web with modern tools.", src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop", color: "#18181b" }
];

const StackCard = ({ i, title, description, src, color, progress, range, targetScale }: { i: number, title: string, description: string, src: string, color: string, progress: MotionValue<number>, range: number[], targetScale: number }) => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    });

    const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
    const scale = useTransform(progress, range, [1, targetScale]);

    return (
        <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
            <motion.div
                style={{ scale, backgroundColor: color, top: `calc(-5vh + ${i * 25}px)` }}
                className="flex flex-col relative w-[90vw] md:w-[1000px] h-[60vh] md:h-[500px] rounded-3xl p-8 md:p-12 origin-top border border-white/10 shadow-2xl overflow-hidden"
            >
                <div className="flex flex-col md:flex-row h-full gap-8">
                    <div className="w-full md:w-2/5 flex flex-col justify-center z-10">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{title}</h2>
                        <p className="text-base md:text-lg text-neutral-300">{description}</p>
                    </div>
                    <div className="w-full md:w-3/5 h-full relative rounded-2xl overflow-hidden">
                        <motion.div className="w-full h-full" style={{ scale: imageScale }}>
                            <img src={src} alt="card" className="w-full h-full object-cover" />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default function ProjectShowcase() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });

    return (
        <div id="projects-section" ref={containerRef} className="bg-black relative pt-20 pb-[20vh]">
            <div className="sticky top-10 text-center mb-10 pt-10 z-10">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Layers className="text-blue-500 w-6 h-6" />
                    <span className="text-blue-400 font-mono text-sm tracking-widest">FEATURED PROJECTS</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white">Selected Works</h2>
            </div>
            {cardData.map((card, i) => {
                const targetScale = 1 - ((cardData.length - i) * 0.05);
                return (
                    <StackCard key={i} i={i} {...card} progress={scrollYProgress} range={[i * 0.25, 1]} targetScale={targetScale} />
                );
            })}
        </div>
    );
}
