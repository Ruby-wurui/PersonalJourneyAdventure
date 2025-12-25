/**
 * Neon Claw Game - Game Audio Hook
 * Requirements: 9.4, 3.5, 5.3, 5.4
 * 
 * React hook that integrates AudioManager with game events:
 * - Play servo sound on claw movement
 * - Play grab sound when claw grabs
 * - Play success/fail sounds on grab result
 * - Play coin sound on scoring
 * - Manage BGM playback
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { getAudioManager, AudioManagerImpl } from '../lib/audioManager';
import { ClawState, GamePhase } from '../types';

export interface UseGameAudioOptions {
    /** Enable/disable audio */
    enabled?: boolean;
    /** BGM volume (0-1) */
    bgmVolume?: number;
    /** SFX volume (0-1) */
    sfxVolume?: number;
    /** Auto-play BGM when game starts */
    autoPlayBgm?: boolean;
}

export interface UseGameAudioReturn {
    /** Audio manager instance */
    audioManager: AudioManagerImpl;
    /** Play servo sound manually */
    playServo: () => void;
    /** Play grab sound manually */
    playGrab: () => void;
    /** Play success sound manually */
    playSuccess: () => void;
    /** Play fail sound manually */
    playFail: () => void;
    /** Play coin sound manually */
    playCoin: () => void;
    /** Start BGM */
    startBgm: () => void;
    /** Stop BGM */
    stopBgm: () => void;
    /** Toggle mute */
    toggleMute: () => boolean;
    /** Check if muted */
    isMuted: boolean;
    /** Initialize audio (call after user interaction) */
    initialize: () => void;
}

/**
 * Hook for integrating game audio with game state
 */
export function useGameAudio(options: UseGameAudioOptions = {}): UseGameAudioReturn {
    const {
        enabled = true,
        bgmVolume = 0.3,
        sfxVolume = 0.5,
        autoPlayBgm = true,
    } = options;

    // Get audio manager instance
    const audioManagerRef = useRef<AudioManagerImpl>(
        getAudioManager({ bgmVolume, sfxVolume })
    );

    // Track previous states for change detection
    const prevClawStateRef = useRef<ClawState | null>(null);
    const prevPhaseRef = useRef<GamePhase | null>(null);
    const prevScoreRef = useRef<number>(0);
    const prevClawXRef = useRef<number>(0);
    const prevClawZRef = useRef<number>(0);
    const servoThrottleRef = useRef<number>(0);

    // Subscribe to game store
    const clawState = useGameStore((state) => state.clawState);
    const phase = useGameStore((state) => state.phase);
    const score = useGameStore((state) => state.score);
    const clawPosition = useGameStore((state) => state.clawPosition);

    // Initialize audio manager
    const initialize = useCallback(() => {
        if (!audioManagerRef.current.isInitialized()) {
            audioManagerRef.current.initialize();
        }
    }, []);

    // Manual sound triggers
    const playServo = useCallback(() => {
        if (enabled) {
            audioManagerRef.current.playServoSound();
        }
    }, [enabled]);

    const playGrab = useCallback(() => {
        if (enabled) {
            audioManagerRef.current.playGrabSound();
        }
    }, [enabled]);

    const playSuccess = useCallback(() => {
        if (enabled) {
            audioManagerRef.current.playSuccessSound();
        }
    }, [enabled]);

    const playFail = useCallback(() => {
        if (enabled) {
            audioManagerRef.current.playFailSound();
        }
    }, [enabled]);

    const playCoin = useCallback(() => {
        if (enabled) {
            audioManagerRef.current.playCoinSound();
        }
    }, [enabled]);

    const startBgm = useCallback(() => {
        if (enabled) {
            audioManagerRef.current.playBGM();
        }
    }, [enabled]);

    const stopBgm = useCallback(() => {
        audioManagerRef.current.stopBGM();
    }, []);

    const toggleMute = useCallback(() => {
        return audioManagerRef.current.toggleMute();
    }, []);

    // Update volumes when options change
    useEffect(() => {
        audioManagerRef.current.setBgmVolume(bgmVolume);
        audioManagerRef.current.setSfxVolume(sfxVolume);
    }, [bgmVolume, sfxVolume]);

    // Handle phase changes - BGM control
    useEffect(() => {
        if (!enabled) return;

        const prevPhase = prevPhaseRef.current;
        prevPhaseRef.current = phase;

        // Start BGM when game starts playing
        if (autoPlayBgm && phase === 'playing' && prevPhase !== 'playing') {
            audioManagerRef.current.playBGM();
        }

        // Stop BGM when game ends or returns to idle
        if (phase === 'results' || phase === 'idle') {
            if (prevPhase === 'playing' || prevPhase === 'grabbing' || prevPhase === 'releasing') {
                audioManagerRef.current.stopBGM();
            }
        }
    }, [phase, enabled, autoPlayBgm]);

    // Handle claw state changes - grab/release sounds
    useEffect(() => {
        if (!enabled) return;

        const prevState = prevClawStateRef.current;
        prevClawStateRef.current = clawState;

        // Play grab sound when claw starts descending
        if (clawState === 'descending' && prevState !== 'descending') {
            audioManagerRef.current.playGrabSound();
        }

        // Play sound when claw starts holding (successful grab)
        if (clawState === 'holding' && prevState === 'ascending') {
            audioManagerRef.current.playSuccessSound();
        }

        // Play fail sound when grab fails (ascending without holding)
        if (clawState === 'hovering' && prevState === 'ascending') {
            // This indicates a failed grab - claw returned without capsule
            audioManagerRef.current.playFailSound();
        }
    }, [clawState, enabled]);

    // Handle score changes - coin sound
    useEffect(() => {
        if (!enabled) return;

        const prevScore = prevScoreRef.current;
        prevScoreRef.current = score;

        // Play coin sound when score increases
        if (score > prevScore) {
            audioManagerRef.current.playCoinSound();
        }
    }, [score, enabled]);

    // Handle claw movement - servo sound (throttled)
    useEffect(() => {
        if (!enabled) return;
        if (phase !== 'playing') return;
        if (clawState !== 'hovering') return;

        const now = Date.now();
        const deltaX = Math.abs(clawPosition.x - prevClawXRef.current);
        const deltaZ = Math.abs(clawPosition.z - prevClawZRef.current);
        const moved = deltaX > 0.05 || deltaZ > 0.05;

        // Throttle servo sound to prevent spam (max once per 200ms)
        if (moved && now - servoThrottleRef.current > 200) {
            audioManagerRef.current.playServoSound();
            servoThrottleRef.current = now;
        }

        prevClawXRef.current = clawPosition.x;
        prevClawZRef.current = clawPosition.z;
    }, [clawPosition.x, clawPosition.z, phase, clawState, enabled]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            audioManagerRef.current.stopBGM();
        };
    }, []);

    return {
        audioManager: audioManagerRef.current,
        playServo,
        playGrab,
        playSuccess,
        playFail,
        playCoin,
        startBgm,
        stopBgm,
        toggleMute,
        isMuted: audioManagerRef.current.isMuted(),
        initialize,
    };
}

export default useGameAudio;
