/**
 * Neon Claw Game - Audio Provider Component
 * Requirements: 9.4
 * 
 * Provides audio context and initialization for the game.
 * Handles browser autoplay policies by requiring user interaction.
 */

'use client';

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { getAudioManager, AudioManagerImpl, resetAudioManager } from '../lib/audioManager';

interface AudioContextValue {
    /** Audio manager instance */
    audioManager: AudioManagerImpl;
    /** Whether audio has been initialized */
    isInitialized: boolean;
    /** Whether audio is muted */
    isMuted: boolean;
    /** Initialize audio (must be called after user interaction) */
    initializeAudio: () => void;
    /** Toggle mute state */
    toggleMute: () => void;
    /** Set BGM volume */
    setBgmVolume: (volume: number) => void;
    /** Set SFX volume */
    setSfxVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextValue | null>(null);

interface AudioProviderProps {
    children: React.ReactNode;
    /** Initial BGM volume (0-1) */
    bgmVolume?: number;
    /** Initial SFX volume (0-1) */
    sfxVolume?: number;
}

/**
 * Audio Provider Component
 * Wraps the game and provides audio functionality through context
 */
export function AudioProvider({
    children,
    bgmVolume = 0.3,
    sfxVolume = 0.5,
}: AudioProviderProps) {
    const [audioManager] = useState(() => getAudioManager({ bgmVolume, sfxVolume }));
    const [isInitialized, setIsInitialized] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    // Initialize audio on user interaction
    const initializeAudio = useCallback(() => {
        if (!audioManager.isInitialized()) {
            audioManager.initialize();
            setIsInitialized(true);
        }
    }, [audioManager]);

    // Toggle mute
    const toggleMute = useCallback(() => {
        const newMuted = audioManager.toggleMute();
        setIsMuted(newMuted);
    }, [audioManager]);

    // Set BGM volume
    const setBgmVolume = useCallback((volume: number) => {
        audioManager.setBgmVolume(volume);
    }, [audioManager]);

    // Set SFX volume
    const setSfxVolume = useCallback((volume: number) => {
        audioManager.setSfxVolume(volume);
    }, [audioManager]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            resetAudioManager();
        };
    }, []);

    const value: AudioContextValue = {
        audioManager,
        isInitialized,
        isMuted,
        initializeAudio,
        toggleMute,
        setBgmVolume,
        setSfxVolume,
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
}

/**
 * Hook to access audio context
 */
export function useAudioContext(): AudioContextValue {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudioContext must be used within an AudioProvider');
    }
    return context;
}

/**
 * Audio initialization button component
 * Shows a button to initialize audio (required for browser autoplay policies)
 */
interface AudioInitButtonProps {
    className?: string;
    onInitialized?: () => void;
}

export function AudioInitButton({ className, onInitialized }: AudioInitButtonProps) {
    const { isInitialized, initializeAudio } = useAudioContext();

    const handleClick = () => {
        initializeAudio();
        onInitialized?.();
    };

    if (isInitialized) {
        return null;
    }

    return (
        <button
            onClick={handleClick}
            className={`px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded transition-colors ${className || ''}`}
        >
            🔊 Enable Audio
        </button>
    );
}

/**
 * Audio mute toggle button component
 */
interface AudioMuteButtonProps {
    className?: string;
}

export function AudioMuteButton({ className }: AudioMuteButtonProps) {
    const { isMuted, toggleMute, isInitialized } = useAudioContext();

    if (!isInitialized) {
        return null;
    }

    return (
        <button
            onClick={toggleMute}
            className={`px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors ${className || ''}`}
            title={isMuted ? 'Unmute' : 'Mute'}
        >
            {isMuted ? '🔇' : '🔊'}
        </button>
    );
}

export default AudioProvider;
