"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import idleImg from "@/assets/astronaunt/astronaut_idle.png";
import waveImg from "@/assets/astronaunt/astronaut_trans.png";
import kissImg from "@/assets/astronaunt/astronaut_kiss.png";
import AiChatDialog from "./AiChatDialog";

const AiAssistantButton = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Random interval for appearing
    useEffect(() => {
        if (isChatOpen) {
            setIsVisible(true);
            return;
        }

        const showAssistant = () => {
            setIsVisible(true);
            // Hide after 4 seconds
            setTimeout(() => {
                if (!isChatOpen && !isHovered) {
                    setIsVisible(false);
                }
            }, 4000);
        };

        // Initial show
        const initialTimer = setTimeout(showAssistant, 1000);

        // Loop
        const loopInterval = setInterval(() => {
            if (!isChatOpen && !isHovered) {
                showAssistant();
            }
        }, 10000); // Every 10 seconds

        return () => {
            clearTimeout(initialTimer);
            clearInterval(loopInterval);
        };
    }, [isChatOpen, isHovered]);

    // Wave animation variants
    const containerVariants = {
        hidden: { y: 100, opacity: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 200, damping: 20 }
        },
        exit: { y: 100, opacity: 0, transition: { duration: 0.5 } }
    };

    const waveVariants = {
        wave: {
            rotate: [0, 15, -10, 10, -5, 0],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut"
            }
        },
        idle: {
            rotate: 0,
            y: [0, -5, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <>
            <AiChatDialog isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
            <AnimatePresence>
                {(isVisible || isChatOpen || isHovered) && (
                    <motion.div
                        className="fixed bottom-10 right-4 md:right-10 z-50 cursor-pointer"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={containerVariants}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => setIsChatOpen(!isChatOpen)}
                    >
                        {/* Tooltip */}
                        <AnimatePresence>
                            {(isHovered || isVisible) && !isChatOpen && (
                                <motion.div
                                    className="absolute right-full top-0 mr-4 w-max max-w-[200px] bg-white text-black px-4 py-2 rounded-xl shadow-lg text-sm font-medium"
                                    initial={{ opacity: 0, scale: 0.8, x: 10 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, x: 10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    Hi! 我是武瑞Ai 👋
                                    <div className="absolute top-4 -right-1 w-3 h-3 bg-white transform rotate-45" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Character */}
                        <motion.div
                            className="relative w-28 h-28 md:w-32 md:h-32"
                            animate={isChatOpen ? "idle" : "wave"}
                            variants={waveVariants}
                        >
                            <Image
                                src={waveImg}
                                alt="AI Assistant"
                                fill
                                className="object-contain drop-shadow-2xl"
                                priority
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AiAssistantButton;
