"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import idleImg from "@/assets/astronaunt/astronaut_idle.png";
import waveImg from "@/assets/astronaunt/astronaut_wave.png";
import kissImg from "@/assets/astronaunt/astronaut_kiss.png";
import AiChatDialog from "./AiChatDialog";

const AiAssistantButton = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [animationState, setAnimationState] = useState<"hidden" | "peek" | "wave" | "kiss">("hidden");
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        // Cycle: Hidden -> Peek (Idle) -> Wave -> Kiss -> Hidden
        const interval = setInterval(() => {
            setAnimationState((prev) => {
                if (prev === "hidden") return "peek";
                if (prev === "peek") return "wave";
                if (prev === "wave") return "kiss";
                return "hidden";
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // Determine which image to show based on state
    const getCurrentImage = () => {
        if (isHovered) return waveImg; // Always wave on hover
        switch (animationState) {
            case "peek": return idleImg;
            case "wave": return waveImg;
            case "kiss": return kissImg;
            default: return idleImg; // Fallback
        }
    };

    const variants = {
        hidden: { x: 80, y: 50, rotate: 10 },
        peek: { x: 30, y: 0, rotate: 0 },
        wave: { x: 0, y: -20, rotate: -10 },
        kiss: { x: 0, y: -20, rotate: -5, scale: 1.1 },
    };

    return (
        <>
            <AiChatDialog isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
            <motion.div
                className="fixed bottom-10 right-0 z-50 cursor-pointer"
                initial="hidden"
                animate={isHovered ? "wave" : animationState}
                variants={variants}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setIsChatOpen(!isChatOpen)}
            >
                <div className="relative w-32 h-32">
                    <Image
                        src={getCurrentImage()}
                        alt="AI Assistant"
                        fill
                        className="object-contain drop-shadow-xl"
                        priority
                    />
                </div>

                <AnimatePresence>
                    {(isHovered || animationState === "wave") && !isChatOpen && (
                        <motion.div
                            className="absolute right-full top-0 mr-2 w-max max-w-[200px] bg-white text-black px-4 py-2 rounded-xl shadow-lg text-sm font-medium"
                            initial={{ opacity: 0, scale: 0.8, x: 10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: 10 }}
                            transition={{ duration: 0.2 }}
                        >
                            我是武瑞Ai 分身点击了解我
                            <div className="absolute top-4 -right-1 w-3 h-3 bg-white transform rotate-45" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
};

export default AiAssistantButton;
