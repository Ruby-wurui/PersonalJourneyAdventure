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
    const [isWaving, setIsWaving] = useState(false);

    // Random interval for appearing
    useEffect(() => {
        if (isChatOpen) {
            setIsWaving(true);
            return;
        }

        const showAssistant = () => {
            setIsWaving(true);
            // Hide after 4 seconds
            setTimeout(() => {
                if (!isChatOpen && !isHovered) {
                    setIsWaving(false);
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
        }, 60000); // Every 60 seconds

        return () => {
            clearTimeout(initialTimer);
            clearInterval(loopInterval);
        };
    }, [isChatOpen, isHovered]);

    // Container variants
    const containerVariants = {
        peeking: {
            x: 40, // Push right to show only half head
            y: "-50%", // Keep vertically centered
            opacity: 1,
            transition: { type: "spring", stiffness: 200, damping: 20 }
        },
        visible: {
            x: 0,
            y: "-50%", // Keep vertically centered
            opacity: 1,
            transition: { type: "spring", stiffness: 200, damping: 20 }
        }
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

    // Determine current state
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

                {/* Character */}
                <motion.div
                    className="relative w-20 h-20 md:w-20 md:h-20"
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
        </>
    );
};

export default AiAssistantButton;
