'use client';

import { useEffect, useRef, useState } from 'react';
import { Dictionary } from '@/i18n/get-dictionary';
import { Locale } from '@/i18n/config';

declare global {
    interface Window {
        createUnityInstance: (
            canvas: HTMLCanvasElement,
            config: UnityConfig,
            onProgress?: (progress: number) => void
        ) => Promise<UnityInstance>;
    }
}

interface UnityConfig {
    arguments: string[];
    dataUrl: string;
    frameworkUrl: string;
    codeUrl: string;
    streamingAssetsUrl: string;
    companyName: string;
    productName: string;
    productVersion: string;
    showBanner: (msg: string, type: string) => void;
    matchWebGLToCanvasSize?: boolean;
    devicePixelRatio?: number;
}

interface UnityInstance {
    SetFullscreen: (fullscreen: number) => void;
    Quit: () => Promise<void>;
}

interface HanziShifterClientProps {
    dict: Dictionary;
    locale: Locale;
}

export default function HanziShifterClient({ dict, locale }: HanziShifterClientProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const unityInstanceRef = useRef<UnityInstance | null>(null);
    const [loadProgress, setLoadProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        let scriptElement: HTMLScriptElement | null = null;

        const showBanner = (msg: string, type: string) => {
            console.log(`Unity ${type}:`, msg);
            if (type === 'error') {
                setError(msg);
            }
        };

        const buildUrl = '/unity/hanzi-shifter/Build';
        const loaderUrl = `${buildUrl}/web_HanziShifter.loader.js`;

        const config: UnityConfig = {
            arguments: [],
            dataUrl: `${buildUrl}/web_HanziShifter.data`,
            frameworkUrl: `${buildUrl}/web_HanziShifter.framework.js`,
            codeUrl: `${buildUrl}/web_HanziShifter.wasm`,
            streamingAssetsUrl: 'StreamingAssets',
            companyName: 'Ruby',
            productName: 'HanziShifter',
            productVersion: '1.0',
            showBanner,
        };

        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            config.devicePixelRatio = 1;
        }

        scriptElement = document.createElement('script');
        scriptElement.src = loaderUrl;
        scriptElement.async = true;

        scriptElement.onload = () => {
            if (!canvas || !window.createUnityInstance) return;

            window
                .createUnityInstance(canvas, config, (progress) => {
                    setLoadProgress(progress);
                })
                .then((unityInstance) => {
                    unityInstanceRef.current = unityInstance;
                    setIsLoading(false);
                })
                .catch((message) => {
                    setError(message);
                    setIsLoading(false);
                });
        };

        scriptElement.onerror = () => {
            setError('Failed to load Unity game files');
            setIsLoading(false);
        };

        document.body.appendChild(scriptElement);

        return () => {
            if (unityInstanceRef.current) {
                unityInstanceRef.current.Quit().catch(console.error);
            }
            if (scriptElement && scriptElement.parentNode) {
                scriptElement.parentNode.removeChild(scriptElement);
            }
        };
    }, []);

    const handleFullscreen = () => {
        if (unityInstanceRef.current) {
            unityInstanceRef.current.SetFullscreen(1);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
                        HanziShifter
                    </h1>
                    <p className="text-gray-400">
                        {dict.games?.hanzi_shifter?.description || 'An interactive Chinese character learning game'}
                    </p>
                </div>

                <div className="relative mx-auto max-w-5xl">
                    <div className="unity-container bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-800">
                        <canvas
                            ref={canvasRef}
                            id="unity-canvas"
                            className="w-full h-auto"
                            width={960}
                            height={600}
                            tabIndex={-1}
                        />

                        {isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90">
                                <div className="mb-4">
                                    <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                                <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-pink-500 to-cyan-500 transition-all duration-300"
                                        style={{ width: `${loadProgress * 100}%` }}
                                    />
                                </div>
                                <p className="mt-4 text-gray-400">
                                    {dict.games?.loading || 'Loading'} {Math.round(loadProgress * 100)}%
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90">
                                <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-6 max-w-md">
                                    <h3 className="text-xl font-bold mb-2 text-red-400">Error</h3>
                                    <p className="text-gray-300">{error}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {!isLoading && !error && (
                        <div className="mt-4 flex justify-center gap-4">
                            <button
                                onClick={handleFullscreen}
                                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                            >
                                {dict.games?.fullscreen || 'Fullscreen'}
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-12 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4">
                        {dict.games?.how_to_play || 'How to Play'}
                    </h2>
                    <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 space-y-3 text-gray-300">
                        <p>• Use keyboard controls to play the game</p>
                        <p>• Match Chinese characters to learn and progress</p>
                        <p>• Complete levels to unlock new challenges</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
