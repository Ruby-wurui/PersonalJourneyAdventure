'use client';

/**
 * Neon Claw Game - Contextual Prompt Display
 * Requirements: 8.4
 * Property 11: Contextual Prompts for Game States
 * 
 * Shows dynamic prompts based on game state with cyberpunk styling.
 */

import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CONTEXTUAL_PROMPTS, GamePhase } from '../types';

// ============================================
// Glitch Text Effect Component
// ============================================

interface GlitchTextProps {
    text: string;
    className?: string;
}

function GlitchText({ text, className = '' }: GlitchTextProps) {
    const [glitchActive, setGlitchActive] = useState(false);

    // Randomly trigger glitch effect
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                setGlitchActive(true);
                setTimeout(() => setGlitchActive(false), 100 + Math.random() * 150);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <span className={`relative inline-block ${className}`}>
            {/* Main text */}
            <span className="relative z-10">{text}</span>

            {/* Glitch layers */}
            {glitchActive && (
                <>
                    <span
                        className="absolute inset-0 text-cyan-400 opacity-70"
                        style={{
                            transform: `translate(${Math.random() * 4 - 2}px, ${Math.random() * 2 - 1}px)`,
                            clipPath: 'inset(0 0 50% 0)',
                        }}
                    >
                        {text}
                    </span>
                    <span
                        className="absolute inset-0 text-pink-400 opacity-70"
                        style={{
                            transform: `translate(${Math.random() * -4 + 2}px, ${Math.random() * 2 - 1}px)`,
                            clipPath: 'inset(50% 0 0 0)',
                        }}
                    >
                        {text}
                    </span>
                </>
            )}
        </span>
    );
}

// ============================================
// Get Prompt for Game Phase
// Property 11: Each game state SHALL have a corresponding non-empty prompt
// ============================================

export function getPromptForPhase(phase: GamePhase, controlMode: 'gesture' | 'default'): string {
    // Override prompts for default mode
    if (controlMode === 'default') {
        switch (phase) {
            case 'idle':
                return 'Press START to begin';
            case 'playing':
                return 'WASD/Arrows to move • SPACE/Click to grab';
            case 'grabbing':
                return 'Grabbing...';
            case 'releasing':
                return 'Release over the drop zone!';
            case 'results':
                return 'Game Over!';
            default:
                return CONTEXTUAL_PROMPTS[phase] || '';
        }
    }

    // Use default prompts for gesture mode
    return CONTEXTUAL_PROMPTS[phase] || '';
}

// ============================================
// Contextual Prompt Component
// ============================================

export interface ContextualPromptProps {
    className?: string;
}

export function ContextualPrompt({ className = '' }: ContextualPromptProps) {
    const phase = useGameStore((state) => state.phase);
    const controlMode = useGameStore((state) => state.controlMode);
    const [isVisible, setIsVisible] = useState(true);

    const prompt = getPromptForPhase(phase, controlMode);

    // Animate prompt changes
    useEffect(() => {
        setIsVisible(false);
        const timer = setTimeout(() => setIsVisible(true), 150);
        return () => clearTimeout(timer);
    }, [phase]);

    // Don't show prompt during results (handled by results screen)
    if (phase === 'results') return null;

    return (
        <div
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                } ${className}`}
        >
            <div className="bg-black/80 backdrop-blur-sm border border-purple-500/50 rounded-lg px-8 py-4 shadow-lg shadow-purple-500/20">
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 -translate-x-1 -translate-y-1" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 translate-x-1 -translate-y-1" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-pink-400 -translate-x-1 translate-y-1" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-pink-400 translate-x-1 translate-y-1" />

                {/* Prompt text with glitch effect */}
                <div
                    className="text-lg font-semibold text-white text-center tracking-wide"
                    style={{
                        textShadow: '0 0 10px #a855f7, 0 0 20px #a855f7',
                    }}
                >
                    <GlitchText text={prompt} />
                </div>
            </div>
        </div>
    );
}

// ============================================
// Animated Prompt for Special Events
// ============================================

interface AnimatedPromptProps {
    message: string;
    type: 'success' | 'fail' | 'info';
    onComplete?: () => void;
}

export function AnimatedPrompt({ message, type, onComplete }: AnimatedPromptProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
        }, 2000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    const colorClasses = {
        success: 'border-green-500/70 text-green-400 shadow-green-500/30',
        fail: 'border-red-500/70 text-red-400 shadow-red-500/30',
        info: 'border-cyan-500/70 text-cyan-400 shadow-cyan-500/30',
    };

    const glowColors = {
        success: '#22c55e',
        fail: '#ef4444',
        info: '#00ffff',
    };

    return (
        <div
            className={`fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                }`}
        >
            <div
                className={`bg-black/90 backdrop-blur-md border-2 rounded-xl px-12 py-6 shadow-2xl ${colorClasses[type]}`}
            >
                <div
                    className="text-3xl font-bold text-center uppercase tracking-widest"
                    style={{
                        textShadow: `0 0 15px ${glowColors[type]}, 0 0 30px ${glowColors[type]}, 0 0 45px ${glowColors[type]}`,
                    }}
                >
                    <GlitchText text={message} />
                </div>
            </div>
        </div>
    );
}

export default ContextualPrompt;
