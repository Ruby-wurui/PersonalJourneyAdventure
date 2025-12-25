'use client';

/**
 * Neon Claw Game - HUD Components
 * Requirements: 8.1, 8.2, 8.5, 6.3
 * 
 * Implements the Heads-Up Display overlay with:
 * - Score display (top-right)
 * - Timer display (top-center) with red color at 10s
 * - Status indicator (Ready/Lost)
 */

import React from 'react';
import { useGameStore } from '../store/gameStore';
import { formatTime, TIMER_WARNING_THRESHOLD } from '../lib/timerManager';

// ============================================
// Score Display Component
// Requirements: 8.1
// ============================================

interface ScoreDisplayProps {
    score: number;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
    return (
        <div className="absolute top-4 right-4 z-50">
            <div className="bg-black/70 backdrop-blur-sm border border-cyan-500/50 rounded-lg px-4 py-2 shadow-lg shadow-cyan-500/20">
                <div className="text-xs text-cyan-400 uppercase tracking-wider mb-1">
                    Score
                </div>
                <div
                    className="text-3xl font-bold text-white tabular-nums"
                    style={{
                        textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
                        fontFamily: 'monospace',
                    }}
                >
                    {score.toString().padStart(3, '0')}
                </div>
            </div>
        </div>
    );
}

// ============================================
// Timer Display Component
// Requirements: 8.2, 6.3
// ============================================

interface TimerDisplayProps {
    timeRemaining: number;
}

export function TimerDisplay({ timeRemaining }: TimerDisplayProps) {
    const isWarning = timeRemaining <= TIMER_WARNING_THRESHOLD && timeRemaining > 0;
    const formattedTime = formatTime(timeRemaining);

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
            <div
                className={`bg-black/70 backdrop-blur-sm border rounded-lg px-6 py-2 shadow-lg transition-all duration-300 ${isWarning
                    ? 'border-red-500/70 shadow-red-500/30 animate-pulse'
                    : 'border-pink-500/50 shadow-pink-500/20'
                    }`}
            >
                <div
                    className={`text-xs uppercase tracking-wider mb-1 ${isWarning ? 'text-red-400' : 'text-pink-400'
                        }`}
                >
                    Time
                </div>
                <div
                    className={`text-4xl font-bold tabular-nums transition-colors duration-300 ${isWarning ? 'text-red-500' : 'text-white'
                        }`}
                    style={{
                        textShadow: isWarning
                            ? '0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000'
                            : '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff',
                        fontFamily: 'monospace',
                    }}
                >
                    {formattedTime}
                </div>
            </div>
        </div>
    );
}

// ============================================
// Status Indicator Component
// Requirements: 8.5
// ============================================

interface StatusIndicatorProps {
    isHandDetected: boolean;
    isGestureMode: boolean;
}

export function StatusIndicator({ isHandDetected, isGestureMode }: StatusIndicatorProps) {
    // Only show status indicator in gesture mode
    if (!isGestureMode) return null;

    return (
        <div className="absolute top-4 left-4 z-50">
            <div
                className={`bg-black/70 backdrop-blur-sm border rounded-lg px-4 py-2 shadow-lg transition-all duration-100 ${isHandDetected
                    ? 'border-green-500/50 shadow-green-500/20'
                    : 'border-red-500/50 shadow-red-500/20'
                    }`}
            >
                <div className="flex items-center gap-2">
                    {/* Status dot */}
                    <div
                        className={`w-3 h-3 rounded-full transition-colors duration-100 ${isHandDetected ? 'bg-green-500' : 'bg-red-500'
                            }`}
                        style={{
                            boxShadow: isHandDetected
                                ? '0 0 8px #22c55e, 0 0 16px #22c55e'
                                : '0 0 8px #ef4444, 0 0 16px #ef4444',
                        }}
                    />
                    {/* Status text */}
                    <span
                        className={`text-sm font-semibold uppercase tracking-wider ${isHandDetected ? 'text-green-400' : 'text-red-400'
                            }`}
                    >
                        {isHandDetected ? 'Ready' : 'Lost'}
                    </span>
                </div>
            </div>
        </div>
    );
}

// ============================================
// Control Hints Component (Default Mode)
// Requirements: 1.5
// ============================================

interface ControlHintsProps {
    isDefaultMode: boolean;
}

export function ControlHints({ isDefaultMode }: ControlHintsProps) {
    // Only show control hints in default mode
    if (!isDefaultMode) return null;

    return (
        <div className="absolute top-4 left-4 z-50">
            <div className="bg-black/70 backdrop-blur-sm border border-pink-500/50 rounded-lg px-4 py-2 shadow-lg shadow-pink-500/20">
                <div className="text-xs text-pink-400 uppercase tracking-wider mb-2">
                    Controls
                </div>
                <div className="space-y-1 text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                        <span className="font-mono bg-gray-700/50 px-1.5 py-0.5 rounded text-cyan-300">WASD</span>
                        <span className="text-gray-400">or</span>
                        <span className="font-mono bg-gray-700/50 px-1.5 py-0.5 rounded text-cyan-300">↑←↓→</span>
                        <span>Move</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-mono bg-gray-700/50 px-1.5 py-0.5 rounded text-cyan-300">SPACE</span>
                        <span className="text-gray-400">or</span>
                        <span className="font-mono bg-gray-700/50 px-1.5 py-0.5 rounded text-cyan-300">Click</span>
                        <span>Grab</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// Main HUD Overlay Component
// ============================================

export interface HUDOverlayProps {
    className?: string;
}

export function HUDOverlay({ className = '' }: HUDOverlayProps) {
    const score = useGameStore((state) => state.score);
    const timeRemaining = useGameStore((state) => state.timeRemaining);
    const isHandDetected = useGameStore((state) => state.isHandDetected);
    const controlMode = useGameStore((state) => state.controlMode);
    const phase = useGameStore((state) => state.phase);

    // Only show HUD during active gameplay phases
    const showHUD = phase === 'playing' || phase === 'grabbing' || phase === 'releasing' || phase === 'calibrating';

    if (!showHUD) return null;

    return (
        <div className={`fixed inset-0 pointer-events-none ${className}`}>
            <ScoreDisplay score={score} />
            <TimerDisplay timeRemaining={timeRemaining} />
            <StatusIndicator
                isHandDetected={isHandDetected}
                isGestureMode={controlMode === 'gesture'}
            />
            <ControlHints isDefaultMode={controlMode === 'default'} />
        </div>
    );
}

export default HUDOverlay;
