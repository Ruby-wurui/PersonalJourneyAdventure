'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera } from 'lucide-react';

const images = [
    "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop"
];

const Column = ({ images, y, className = "" }: { images: string[], y: any, className?: string }) => {
    return (
        <motion.div
            style={{ y }}
            className={`flex flex-col gap-4 md:gap-8 min-w-[150px] md:min-w-[250px] relative h-full ${className}`}
        >
            {images.map((src, i) => (
                <motion.div
                    key={i}
                    className="relative rounded-xl overflow-hidden aspect-[2/3] w-full shadow-2xl border border-white/10"
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-50px" }}
                >
                    <img src={src} alt="Parallax" className="w-full h-full object-cover" />
                </motion.div>
            ))}
        </motion.div>
    );
};

export default function HeroSection() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start']
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const y4 = useTransform(scrollYProgress, [0, 1], [0, -300]);

    return (
        <div id="hero-section" ref={containerRef} className="min-h-screen bg-neutral-950 overflow-hidden relative flex flex-col items-center justify-center py-20">
            <div className="text-center z-10 px-4 mb-20 mt-20">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Camera className="text-purple-500 w-6 h-6" />
                    <span className="text-purple-400 font-mono text-sm tracking-widest">WELCOME TO MY UNIVERSE</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                    Creative <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Developer</span>
                </h1>
                <p className="text-gray-400 max-w-lg mx-auto text-lg">
                    Exploring the intersection of design, technology, and storytelling.
                </p>
            </div>

            <div className="flex gap-4 md:gap-8 h-[120%] -mt-10 px-4 opacity-60 mask-image-linear-fade">
                <Column images={[images[0], images[1], images[0]]} y={y1} />
                <Column images={[images[1], images[2], images[3]]} y={y2} className="mt-[10vh]" />
                <Column images={[images[2], images[3], images[1]]} y={y3} />
                <Column images={[images[3], images[0], images[2]]} y={y4} className="mt-[25vh] hidden md:flex" />
            </div>

            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-20" />
        </div>
    );
}
