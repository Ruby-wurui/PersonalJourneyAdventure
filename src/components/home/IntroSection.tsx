'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function IntroSection() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const x1 = useTransform(scrollYProgress, [0, 1], [200, -200]);
    const x2 = useTransform(scrollYProgress, [0, 1], [-200, 200]);
    const maskSize = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);

    return (
        <div id="intro-section" ref={containerRef} className="h-[80vh] bg-white flex flex-col items-center justify-center overflow-hidden relative">
            <div className="absolute top-20 flex items-center gap-2">
                <Zap className="text-orange-500 w-6 h-6" />
                <span className="text-orange-600 font-mono text-sm tracking-widest">SCROLL TYPOGRAPHY</span>
            </div>

            <motion.div style={{ x: x1 }} className="whitespace-nowrap mb-4">
                <h1 className="text-[10vw] md:text-[8vw] font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-400 leading-none uppercase">
                    Motion Design
                </h1>
            </motion.div>

            <div className="relative">
                <h1 className="text-[12vw] md:text-[10vw] font-black text-neutral-200 leading-none text-center">CREATIVITY</h1>
                <motion.div style={{ height: maskSize }} className="absolute bottom-0 left-0 w-full overflow-hidden flex items-end justify-center">
                    <h1 className="text-[12vw] md:text-[10vw] font-black text-black leading-none text-center">CREATIVITY</h1>
                </motion.div>
            </div>

            <motion.div style={{ x: x2 }} className="whitespace-nowrap mt-4">
                <h1 className="text-[10vw] md:text-[8vw] font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-neutral-200 leading-none uppercase">
                    Interactive Web
                </h1>
            </motion.div>
        </div>
    );
}
