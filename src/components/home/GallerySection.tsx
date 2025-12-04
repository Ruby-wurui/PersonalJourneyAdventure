'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const COVERFLOW_IMAGES = [
    { id: 1, url: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", title: "Mountain Escape", desc: "Adventure awaits" },
    { id: 2, url: "https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", title: "Forest Mystery", desc: "Into the woods" },
    { id: 3, url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", title: "Starry Night", desc: "Look up" },
    { id: 4, url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", title: "Ocean Breeze", desc: "Calm waters" },
    { id: 5, url: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", title: "Urban Dreams", desc: "City lights" },
    { id: 6, url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", title: "Golden Hour", desc: "Sunset glow" },
];

const CARD_WIDTH = 280;
const CARD_HEIGHT = 420;
const DRAG_BUFFER = 50;
const SPRING_OPTIONS = { type: "spring", stiffness: 200, damping: 25, mass: 1 };

export default function GallerySection() {
    const [activeIndex, setActiveIndex] = useState(2);
    const containerRef = useRef(null);

    const handlePrev = useCallback(() => {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
    }, []);

    const handleNext = useCallback(() => {
        setActiveIndex((prev) => Math.min(prev + 1, COVERFLOW_IMAGES.length - 1));
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlePrev, handleNext]);

    const onDragEnd = (event: any, info: any) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;
        if (offset > DRAG_BUFFER || velocity > 500) {
            handlePrev();
        } else if (offset < -DRAG_BUFFER || velocity < -500) {
            handleNext();
        }
    };

    return (
        <section id="gallery-section" className="h-screen bg-[#0f1014] text-white flex flex-col items-center justify-center overflow-hidden relative selection:bg-cyan-500/30">

            {/* Title */}
            <div className="absolute top-12 z-20 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <GalleryHorizontal className="text-cyan-400 w-6 h-6" />
                    <span className="text-cyan-400 font-mono text-sm tracking-widest">GALLERY</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-cyan-300 to-blue-500 tracking-tight">
                    Highlights
                </h2>
                <p className="text-slate-500 text-sm">Drag to explore</p>
            </div>

            {/* 3D Viewport */}
            <div
                ref={containerRef}
                className="relative w-full max-w-[1000px] h-[500px] flex items-center justify-center"
                style={{ perspective: 1000 }}
            >
                {/* Drag Trigger Layer */}
                <motion.div
                    className="absolute inset-0 z-50 touch-pan-y"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={onDragEnd}
                    style={{ cursor: 'grab' }}
                    whileTap={{ cursor: 'grabbing' }}
                />

                <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
                    <AnimatePresence initial={false} mode='popLayout'>
                        {COVERFLOW_IMAGES.map((item, index) => {
                            const isActive = index === activeIndex;
                            const offset = index - activeIndex;

                            const xOffset = offset * 220;
                            const scale = isActive ? 1 : 0.85;
                            const rotateY = isActive ? 0 : offset > 0 ? -45 : 45;
                            const zIndex = 100 - Math.abs(offset);
                            const opacity = Math.abs(offset) > 3 ? 0 : 1;

                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={false}
                                    animate={{
                                        x: xOffset,
                                        scale: scale,
                                        rotateY: rotateY,
                                        zIndex: zIndex,
                                        opacity: opacity,
                                        z: isActive ? 0 : -100,
                                    }}
                                    transition={SPRING_OPTIONS}
                                    className="absolute top-1/2 left-1/2 -ml-[140px] -mt-[210px] transform-style-3d pointer-events-none"
                                    style={{
                                        width: CARD_WIDTH,
                                        height: CARD_HEIGHT,
                                    }}
                                >
                                    {/* Card Content */}
                                    <div className={`
                    w-full h-full rounded-2xl overflow-hidden relative shadow-2xl
                    transition-all duration-500
                    ${isActive ? 'shadow-cyan-500/20' : 'brightness-[0.4]'}
                  `}>
                                        <img
                                            src={item.url}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Glassmorphism Shine */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {/* Text Content */}
                                        <motion.div
                                            className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <h3 className="text-xl font-bold text-white">{item.title}</h3>
                                            <p className="text-cyan-200 text-sm mt-1">{item.desc}</p>
                                        </motion.div>
                                    </div>

                                    {/* Reflection */}
                                    <div className="absolute top-full left-0 w-full h-full mt-2 rounded-2xl overflow-hidden opacity-30 transform-style-3d origin-top -scale-y-100 mask-image-linear">
                                        <img src={item.url} className="w-full h-full object-cover blur-sm" alt="" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014] to-transparent" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-12 flex items-center gap-6 z-50">
                <button
                    onClick={handlePrev}
                    disabled={activeIndex === 0}
                    className="p-3 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-white/5 backdrop-blur-sm"
                >
                    <ChevronLeft size={20} />
                </button>

                <div className="flex gap-2">
                    {COVERFLOW_IMAGES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex
                                ? 'w-8 bg-cyan-400'
                                : 'w-2 bg-slate-700 hover:bg-slate-600'
                                }`}
                        />
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    disabled={activeIndex === COVERFLOW_IMAGES.length - 1}
                    className="p-3 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-white/5 backdrop-blur-sm"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* CSS for Reflection Mask */}
            <style jsx global>{`
        .mask-image-linear {
          -webkit-mask-image: linear-gradient(to top, transparent 40%, black 100%);
          mask-image: linear-gradient(to top, transparent 40%, black 100%);
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>
        </section>
    );
}
