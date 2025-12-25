'use client';

/**
 * Neon Claw Game - Picture-in-Picture Webcam Feed
 * Requirements: 8.3
 * 
 * Displays webcam video in corner with hand skeleton overlay visualization.
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useGameStore } from '../store/gameStore';

// MediaPipe hand landmark connections for skeleton drawing
const HAND_CONNECTIONS = [
    // Thumb
    [0, 1], [1, 2], [2, 3], [3, 4],
    // Index finger
    [0, 5], [5, 6], [6, 7], [7, 8],
    // Middle finger
    [5, 9], [9, 10], [10, 11], [11, 12],
    // Ring finger
    [9, 13], [13, 14], [14, 15], [15, 16],
    // Pinky
    [13, 17], [17, 18], [18, 19], [19, 20],
    // Palm
    [0, 17],
];

// Landmark indices for fingertips (for highlighting)
const FINGERTIP_INDICES = [4, 8, 12, 16, 20];

// Colors for neon effect
const NEON_CYAN = '#00ffff';
const NEON_PINK = '#ff00ff';
const NEON_GREEN = '#00ff00';

export interface HandLandmark {
    x: number;
    y: number;
    z?: number;
}

export interface WebcamPiPProps {
    videoRef?: React.RefObject<HTMLVideoElement | null>;
    landmarks?: HandLandmark[] | null;
    className?: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    size?: 'small' | 'medium' | 'large';
}

export function WebcamPiP({
    videoRef: externalVideoRef,
    landmarks,
    className = '',
    position = 'bottom-left',
    size = 'medium',
}: WebcamPiPProps) {
    const displayVideoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isVideoReady, setIsVideoReady] = useState(false);

    const controlMode = useGameStore((state) => state.controlMode);
    const isHandDetected = useGameStore((state) => state.isHandDetected);

    // Copy stream from external video to display video
    useEffect(() => {
        const sourceVideo = externalVideoRef?.current;
        const displayVideo = displayVideoRef.current;

        if (!sourceVideo || !displayVideo) return;

        // Copy the stream from source to display video
        const copyStream = () => {
            if (sourceVideo.srcObject && !displayVideo.srcObject) {
                displayVideo.srcObject = sourceVideo.srcObject;
                displayVideo.play().catch(console.warn);
            }
        };

        // Try immediately
        copyStream();

        // Also listen for when source video starts playing
        sourceVideo.addEventListener('playing', copyStream);

        // Poll in case we missed the event
        const interval = setInterval(copyStream, 100);
        const timeout = setTimeout(() => clearInterval(interval), 3000);

        return () => {
            sourceVideo.removeEventListener('playing', copyStream);
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [externalVideoRef]);

    // Size configurations
    const sizeConfig = {
        small: { width: 160, height: 120 },
        medium: { width: 240, height: 180 },
        large: { width: 320, height: 240 },
    };

    const { width, height } = sizeConfig[size];

    // Position configurations
    const positionClasses = {
        'top-left': 'top-4 left-4',
        'top-right': 'top-20 right-4', // Below score display
        'bottom-left': 'bottom-4 left-4',
        'bottom-right': 'bottom-4 right-4',
    };

    // Draw hand skeleton on canvas
    const drawSkeleton = useCallback((ctx: CanvasRenderingContext2D, handLandmarks: HandLandmark[]) => {
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        if (!handLandmarks || handLandmarks.length === 0) return;

        // Draw connections (bones)
        ctx.strokeStyle = NEON_CYAN;
        ctx.lineWidth = 2;
        ctx.shadowColor = NEON_CYAN;
        ctx.shadowBlur = 10;

        HAND_CONNECTIONS.forEach(([start, end]) => {
            const startLm = handLandmarks[start];
            const endLm = handLandmarks[end];

            if (startLm && endLm) {
                ctx.beginPath();
                ctx.moveTo(startLm.x * canvasWidth, startLm.y * canvasHeight);
                ctx.lineTo(endLm.x * canvasWidth, endLm.y * canvasHeight);
                ctx.stroke();
            }
        });

        // Draw landmarks (joints)
        handLandmarks.forEach((landmark, index) => {
            const x = landmark.x * canvasWidth;
            const y = landmark.y * canvasHeight;

            // Fingertips get special highlighting
            const isFingertip = FINGERTIP_INDICES.includes(index);
            const isWrist = index === 0;

            ctx.beginPath();

            if (isFingertip) {
                // Fingertips: larger pink circles
                ctx.fillStyle = NEON_PINK;
                ctx.shadowColor = NEON_PINK;
                ctx.shadowBlur = 15;
                ctx.arc(x, y, 6, 0, Math.PI * 2);
            } else if (isWrist) {
                // Wrist: green circle
                ctx.fillStyle = NEON_GREEN;
                ctx.shadowColor = NEON_GREEN;
                ctx.shadowBlur = 12;
                ctx.arc(x, y, 5, 0, Math.PI * 2);
            } else {
                // Other joints: small cyan circles
                ctx.fillStyle = NEON_CYAN;
                ctx.shadowColor = NEON_CYAN;
                ctx.shadowBlur = 8;
                ctx.arc(x, y, 3, 0, Math.PI * 2);
            }

            ctx.fill();
        });

        // Reset shadow
        ctx.shadowBlur = 0;
    }, []);

    // Update canvas when landmarks change
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (landmarks && landmarks.length > 0) {
            drawSkeleton(ctx, landmarks);
        } else {
            // Clear canvas when no landmarks
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, [landmarks, drawSkeleton]);

    // Handle video ready state
    useEffect(() => {
        const video = displayVideoRef.current;
        if (!video) return;

        const checkVideoReady = () => {
            // Check if video has valid dimensions and is playing
            if (video.readyState >= 2 || (video.videoWidth > 0 && video.videoHeight > 0)) {
                setIsVideoReady(true);
            }
        };

        const handleLoadedData = () => setIsVideoReady(true);
        const handlePlaying = () => setIsVideoReady(true);

        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('playing', handlePlaying);

        // Check immediately if already ready
        checkVideoReady();

        // Also poll for a short time in case events were missed
        const pollInterval = setInterval(checkVideoReady, 100);
        const pollTimeout = setTimeout(() => clearInterval(pollInterval), 3000);

        return () => {
            video.removeEventListener('loadeddata', handleLoadedData);
            video.removeEventListener('playing', handlePlaying);
            clearInterval(pollInterval);
            clearTimeout(pollTimeout);
        };
    }, []);

    // Only show in gesture mode
    if (controlMode !== 'gesture') return null;

    return (
        <div
            className={`absolute z-50 ${positionClasses[position]} ${className}`}
            style={{ width, height }}
        >
            {/* Container with neon border */}
            <div
                className={`relative w-full h-full rounded-lg overflow-hidden border-2 transition-all duration-300 ${isHandDetected
                    ? 'border-cyan-500/70 shadow-lg shadow-cyan-500/30'
                    : 'border-pink-500/50 shadow-lg shadow-pink-500/20'
                    }`}
            >
                {/* Video element */}
                <video
                    ref={displayVideoRef}
                    className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
                    autoPlay
                    playsInline
                    muted
                    style={{
                        filter: 'brightness(0.8) contrast(1.1)',
                    }}
                />

                {/* Skeleton overlay canvas */}
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className="absolute inset-0 w-full h-full transform scale-x-[-1]"
                    style={{ pointerEvents: 'none' }}
                />

                {/* Scanline effect overlay */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
                    }}
                />

                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-pink-400" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-pink-400" />

                {/* Loading indicator */}
                {!isVideoReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                        <div className="text-cyan-400 text-sm animate-pulse">
                            Initializing camera...
                        </div>
                    </div>
                )}

                {/* Detection status badge */}
                <div
                    className={`absolute bottom-1 right-1 px-2 py-0.5 rounded text-xs font-semibold ${isHandDetected
                        ? 'bg-green-500/80 text-white'
                        : 'bg-red-500/80 text-white'
                        }`}
                >
                    {isHandDetected ? '✓' : '✗'}
                </div>
            </div>
        </div>
    );
}

export default WebcamPiP;
