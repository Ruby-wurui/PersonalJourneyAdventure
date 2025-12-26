'use client';

/**
 * Neon Claw Game - Game Client Component
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.5
 * 
 * Main client component that integrates:
 * - Three.js 3D scene
 * - Game state management
 * - Audio system
 * - Hand tracking (gesture mode)
 * - HUD overlay
 * - Mode selection and results screens
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useGameStore } from './store/gameStore';
import { AudioProvider, useAudioContext } from './components/AudioProvider';
import { HUDOverlay } from './components/HUD';
import { ContextualPrompt } from './components/ContextualPrompt';
import { WebcamPiP, HandLandmark } from './components/WebcamPiP';
import { BorderFlash, BorderFlashRef } from './components/BorderFlash';
import { ParticleEffectsRef } from './components/ParticleEffects';
import { useHandTracking } from './hooks/useHandTracking';
import { useDefaultControls } from './hooks/useDefaultControls';
import { ControlMode } from './types';

// Dynamically import ClawMachineScene to avoid SSR issues with Three.js
const ClawMachineScene = dynamic(
    () => import('./components/ClawMachineScene').then(mod => ({ default: mod.ClawMachineScene })),
    { ssr: false, loading: () => <SceneLoadingFallback /> }
);

/**
 * Loading fallback while Three.js scene loads
 */
function SceneLoadingFallback() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f]">
            <div className="text-center">
                {/* Neon loading spinner */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                    <div
                        className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"
                        style={{
                            boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
                        }}
                    />
                    <div
                        className="absolute inset-0 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin"
                        style={{
                            boxShadow: '0 0 30px rgba(0, 255, 255, 0.8)',
                            animationDuration: '1s',
                        }}
                    />
                    <div
                        className="absolute inset-2 border-4 border-transparent border-t-pink-500 rounded-full animate-spin"
                        style={{
                            boxShadow: '0 0 30px rgba(255, 0, 255, 0.8)',
                            animationDuration: '1.5s',
                            animationDirection: 'reverse',
                        }}
                    />
                </div>

                {/* Loading text with neon effect */}
                <h2
                    className="text-3xl font-bold mb-2 tracking-wider animate-pulse"
                    style={{
                        background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
                    }}
                >
                    LOADING
                </h2>
                <p className="text-cyan-400 text-sm tracking-widest opacity-70">
                    Initializing Neon Claw Machine...
                </p>

                {/* Loading bar */}
                <div className="mt-6 w-64 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 animate-pulse"
                        style={{
                            width: '100%',
                            boxShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}


/**
 * Mode Selection Screen Component
 * Requirements: 1.1, 1.2, 1.5
 */
interface ModeSelectionProps {
    onSelectMode: (mode: ControlMode) => void;
    isRequestingWebcam: boolean;
}

function ModeSelectionScreen({ onSelectMode, isRequestingWebcam }: ModeSelectionProps) {
    return (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="text-center max-w-lg px-8">
                {/* Title */}
                <h1
                    className="text-6xl font-bold mb-2 tracking-wider"
                    style={{
                        background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 50%, #00ffff 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 30px rgba(0, 255, 255, 0.5)',
                    }}
                >
                    NEON CLAW
                </h1>
                <p className="text-pink-400 text-xl mb-12 tracking-widest">霓虹神手</p>

                {/* Mode selection buttons */}
                <div className="space-y-4">
                    {/* Gesture Mode Button */}
                    <button
                        onClick={() => onSelectMode('gesture')}
                        disabled={isRequestingWebcam}
                        className="w-full py-4 px-8 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 
                                   text-black font-bold text-lg rounded-lg transition-all duration-300 
                                   shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   border border-cyan-400/50"
                    >
                        {isRequestingWebcam ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                Requesting Camera...
                            </span>
                        ) : (
                            <>
                                ✋ Gesture Mode
                                <span className="block text-sm font-normal mt-1 opacity-80">
                                    Control with hand gestures via webcam
                                </span>
                            </>
                        )}
                    </button>

                    {/* Default Mode Button */}
                    <button
                        onClick={() => onSelectMode('default')}
                        disabled={isRequestingWebcam}
                        className="w-full py-4 px-8 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 
                                   text-white font-bold text-lg rounded-lg transition-all duration-300 
                                   shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   border border-pink-400/50"
                    >
                        🖱️ Classic Mode
                        <span className="block text-sm font-normal mt-1 opacity-80">
                            Control with mouse & keyboard
                        </span>
                    </button>
                </div>

                {/* Instructions */}
                <div className="mt-12 text-gray-400 text-sm">
                    <p>Grab capsules and drop them in the prize zone!</p>
                    <p className="mt-1">You have 30 seconds. Good luck!</p>
                </div>
            </div>
        </div>
    );
}


/**
 * Results Screen Component
 * Requirements: 6.5
 */
interface ResultsScreenProps {
    score: number;
    onPlayAgain: () => void;
}

function ResultsScreen({ score, onPlayAgain }: ResultsScreenProps) {
    return (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="text-center max-w-lg px-8">
                {/* Game Over Title */}
                <h2
                    className="text-5xl font-bold mb-8 tracking-wider"
                    style={{
                        color: '#ff00ff',
                        textShadow: '0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 60px #ff00ff',
                    }}
                >
                    GAME OVER
                </h2>

                {/* Score Display */}
                <div className="mb-12">
                    <p className="text-cyan-400 text-lg uppercase tracking-widest mb-2">Final Score</p>
                    <div
                        className="text-8xl font-bold tabular-nums"
                        style={{
                            color: '#00ffff',
                            textShadow: '0 0 30px #00ffff, 0 0 60px #00ffff',
                            fontFamily: 'monospace',
                        }}
                    >
                        {score.toString().padStart(3, '0')}
                    </div>
                </div>

                {/* Score Message */}
                <p className="text-gray-300 text-lg mb-8">
                    {score === 0 && "Better luck next time!"}
                    {score === 1 && "Nice catch!"}
                    {score >= 2 && score <= 3 && "Great job!"}
                    {score >= 4 && score <= 5 && "Amazing skills!"}
                    {score > 5 && "LEGENDARY! 🏆"}
                </p>

                {/* Play Again Button */}
                <button
                    onClick={onPlayAgain}
                    className="py-4 px-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 
                               text-white font-bold text-xl rounded-lg transition-all duration-300 
                               shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50
                               border border-purple-400/50 animate-pulse"
                >
                    🔄 Play Again
                </button>

                {/* Back to menu hint */}
                <p className="mt-6 text-gray-500 text-sm">
                    Press ESC to return to mode selection
                </p>
            </div>
        </div>
    );
}


/**
 * Webcam Permission Denied Notification
 * Requirements: 1.4
 */
function WebcamDeniedNotification({ onDismiss }: { onDismiss: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 5000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
            <div className="bg-red-900/90 border border-red-500/50 rounded-lg px-6 py-3 shadow-lg shadow-red-500/20">
                <p className="text-red-200 text-sm">
                    ⚠️ Camera access denied. Falling back to Classic Mode.
                </p>
            </div>
        </div>
    );
}

/**
 * Main Game Content Component (inside AudioProvider)
 */
function GameContent() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const borderFlashRef = useRef<BorderFlashRef>(null);
    const particleEffectsRef = useRef<ParticleEffectsRef>(null);
    const [landmarks] = useState<HandLandmark[] | null>(null);
    const [isRequestingWebcam, setIsRequestingWebcam] = useState(false);
    const [showWebcamDenied, setShowWebcamDenied] = useState(false);
    const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);

    // Game store
    const phase = useGameStore((state) => state.phase);
    const score = useGameStore((state) => state.score);
    const controlMode = useGameStore((state) => state.controlMode);
    const startGame = useGameStore((state) => state.startGame);
    const setControlMode = useGameStore((state) => state.setControlMode);
    const resetGame = useGameStore((state) => state.resetGame);
    const updateTimer = useGameStore((state) => state.updateTimer);

    // Audio context
    const { audioManager, initializeAudio, isInitialized: isAudioInitialized } = useAudioContext();

    // Hand tracking hook
    const handTracking = useHandTracking({ enabled: controlMode === 'gesture' });

    // Default controls hook (mouse/keyboard) - Requirements: 1.5, 3.2
    useDefaultControls({ enabled: controlMode === 'default' });

    // Timer update loop
    useEffect(() => {
        if (phase !== 'playing' && phase !== 'grabbing' && phase !== 'releasing') {
            return;
        }

        let lastTime = performance.now();
        let animationId: number;

        const updateLoop = () => {
            const currentTime = performance.now();
            const delta = (currentTime - lastTime) / 1000; // Convert to seconds
            lastTime = currentTime;

            updateTimer(delta);
            animationId = requestAnimationFrame(updateLoop);
        };

        animationId = requestAnimationFrame(updateLoop);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [phase, updateTimer]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (phase === 'results') {
                    resetGame();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [phase, resetGame]);

    // Cleanup webcam stream on unmount
    useEffect(() => {
        return () => {
            if (webcamStream) {
                webcamStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [webcamStream]);


    /**
     * Handle mode selection
     * Requirements: 1.2, 1.3, 1.4, 1.5
     */
    const handleSelectMode = useCallback(async (mode: ControlMode) => {
        // Initialize audio on first interaction
        if (!isAudioInitialized) {
            initializeAudio();
        }

        if (mode === 'gesture') {
            // Request webcam permission
            setIsRequestingWebcam(true);
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: 640, height: 480 }
                });
                setWebcamStream(stream);

                // Set video source
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();

                    // Initialize hand tracking
                    await handTracking.initialize(videoRef.current);
                    handTracking.start();
                }

                setControlMode('gesture');
                startGame();
            } catch (error) {
                console.warn('Webcam access denied:', error);
                setShowWebcamDenied(true);
                // Fall back to default mode
                setControlMode('default');
                startGame();
            } finally {
                setIsRequestingWebcam(false);
            }
        } else {
            // Default mode - start immediately
            setControlMode('default');
            startGame();
        }
    }, [isAudioInitialized, initializeAudio, setControlMode, startGame, handTracking]);

    /**
     * Handle play again
     */
    const handlePlayAgain = useCallback(() => {
        // Stop hand tracking if active
        if (controlMode === 'gesture') {
            handTracking.stop();
        }

        // Reset game state
        resetGame();
    }, [controlMode, handTracking, resetGame]);

    /**
     * Handle grab complete callback from 3D scene
     */
    const handleGrabComplete = useCallback((success: boolean) => {
        if (success) {
            audioManager.playSuccessSound();
        } else {
            audioManager.playFailSound();
        }
    }, [audioManager]);

    /**
     * Handle capsule collision callback
     */
    const handleCapsuleCollide = useCallback(() => {
        audioManager.playGrabSound();
    }, [audioManager]);

    // Determine what to show based on game phase
    const showModeSelection = phase === 'idle';
    const showResults = phase === 'results';
    const showGame = !showModeSelection;

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0f]">
            {/* Hidden video element for webcam */}
            <video
                ref={videoRef}
                className="hidden"
                playsInline
                muted
            />

            {/* 3D Scene */}
            {showGame && (
                <ClawMachineScene
                    className="absolute inset-0"
                    onGrabComplete={handleGrabComplete}
                    onCapsuleCollide={handleCapsuleCollide}
                    enablePostProcessing={true}
                    borderFlashRef={borderFlashRef}
                    particleEffectsRef={particleEffectsRef}
                />
            )}

            {/* Border Flash Effect */}
            <BorderFlash ref={borderFlashRef} duration={500} />

            {/* HUD Overlay */}
            <HUDOverlay />

            {/* Contextual Prompt */}
            <ContextualPrompt />

            {/* Webcam Picture-in-Picture */}
            {controlMode === 'gesture' && phase !== 'idle' && phase !== 'results' && (
                <WebcamPiP
                    videoRef={videoRef}
                    landmarks={landmarks}
                    position="bottom-left"
                    size="medium"
                />
            )}

            {/* Mode Selection Screen */}
            {showModeSelection && (
                <ModeSelectionScreen
                    onSelectMode={handleSelectMode}
                    isRequestingWebcam={isRequestingWebcam}
                />
            )}

            {/* Results Screen */}
            {showResults && (
                <ResultsScreen
                    score={score}
                    onPlayAgain={handlePlayAgain}
                />
            )}

            {/* Webcam Denied Notification */}
            {showWebcamDenied && (
                <WebcamDeniedNotification onDismiss={() => setShowWebcamDenied(false)} />
            )}

            {/* Audio Mute Button */}
            {isAudioInitialized && (
                <div className="absolute bottom-4 right-4 z-50">
                    <AudioMuteButtonWrapper />
                </div>
            )}
        </div>
    );
}

/**
 * Audio Mute Button Wrapper (needs to be inside AudioProvider)
 */
function AudioMuteButtonWrapper() {
    const { isMuted, toggleMute } = useAudioContext();

    return (
        <button
            onClick={toggleMute}
            className="px-3 py-2 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-lg 
                       transition-colors border border-gray-600/50 backdrop-blur-sm"
            title={isMuted ? 'Unmute' : 'Mute'}
        >
            {isMuted ? '🔇' : '🔊'}
        </button>
    );
}

/**
 * Main GameClient Component
 * Wraps everything in AudioProvider
 */
export default function GameClient() {
    return (
        <AudioProvider bgmVolume={0.3} sfxVolume={0.5}>
            <GameContent />
        </AudioProvider>
    );
}
