"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AiChatDialog from "./AiChatDialog";

// Sprite configuration: 12 frames in 4x3 grid (582x582 image)
const SPRITE_COLS = 4;
const SPRITE_ROWS = 3;
const SPRITE_FRAMES = 12;
const FRAME_DURATION = 600; // ms per frame
const DISPLAY_SIZE = 80; // display size in pixels

const AiAssistantButton = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isWaving, setIsWaving] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(0);
    const animationRef = useRef<NodeJS.Timeout | null>(null);

    // Sprite animation loop - pause when chat is open
    useEffect(() => {
        if (isChatOpen) {
            // Stop animation when chat is open
            if (animationRef.current) {
                clearInterval(animationRef.current);
                animationRef.current = null;
            }
            return;
        }

        // Start animation when chat is closed
        animationRef.current = setInterval(() => {
            setCurrentFrame((prev) => (prev + 1) % SPRITE_FRAMES);
        }, FRAME_DURATION);

        return () => {
            if (animationRef.current) {
                clearInterval(animationRef.current);
            }
        };
    }, [isChatOpen]);

    // Calculate sprite position based on current frame (4x3 grid)
    const col = currentFrame % SPRITE_COLS;
    const row = Math.floor(currentFrame / SPRITE_COLS);

    // Random interval for appearing
    useEffect(() => {
        if (isChatOpen) {
            setIsWaving(true);
            return;
        }

        const showAssistant = () => {
            setIsWaving(true);
            setTimeout(() => {
                if (!isChatOpen && !isHovered) {
                    setIsWaving(false);
                }
            }, 4000);
        };

        const initialTimer = setTimeout(showAssistant, 12000);
        const loopInterval = setInterval(() => {
            if (!isChatOpen && !isHovered) {
                showAssistant();
            }
        }, 6000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(loopInterval);
        };
    }, [isChatOpen, isHovered]);

    const containerVariants = {
        peeking: {
            x: 40,
            y: "-50%",
            opacity: 1,
            transition: { type: "spring", stiffness: 200, damping: 20 }
        },
        visible: {
            x: 0,
            y: "-50%",
            opacity: 1,
            transition: { type: "spring", stiffness: 200, damping: 20 }
        }
    };

    const currentState = (isWaving || isChatOpen || isHovered) ? "visible" : "peeking";

    return (
        <>
            <AiChatDialog isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

            <motion.div
                className="fixed top-3/4 right-0 z-50 cursor-pointer"
                initial="peeking"
                animate={currentState}
                variants={containerVariants}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setIsChatOpen(!isChatOpen)}
            >
                {/* Tooltip */}
                <AnimatePresence>
                    {(isHovered || isWaving) && !isChatOpen && (
                        <motion.div
                            className="absolute right-full top-0 mr-4 w-max max-w-[200px] bg-white text-black px-4 py-2 rounded-xl shadow-lg text-sm font-medium"
                            initial={{ opacity: 0, scale: 0.8, x: 10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: 10 }}
                            transition={{ duration: 0.2 }}
                        >
                            Hi! I'm Rui Wu AI 👋
                            <div className="absolute top-4 -right-1 w-3 h-3 bg-white transform rotate-45" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sprite Animation Character - 4x3 grid */}
                <div className="relative w-20 h-20 md:w-20 md:h-20 overflow-hidden drop-shadow-2xl">
                    <div
                        className="absolute"
                        style={{
                            width: `${SPRITE_COLS * DISPLAY_SIZE}px`,
                            height: `${SPRITE_ROWS * DISPLAY_SIZE}px`,
                            backgroundImage: `url('/生成透明背景图片.png')`,
                            backgroundSize: '100% 100%',
                            transform: `translate(-${col * DISPLAY_SIZE}px, -${row * DISPLAY_SIZE}px)`,
                        }}
                    />
                </div>
            </motion.div>
        </>
    );
};

export default AiAssistantButton;
