/**
 * Neon Claw Game - Audio Manager
 * Requirements: 9.4, 3.5, 5.3, 5.4
 * 
 * Manages all game audio using Howler.js including:
 * - BGM (synthwave style)
 * - Sound effects (servo, grab, success, fail, 8-bit coin)
 */

import { Howl, Howler } from 'howler';
import { AudioManager } from '../types';

// Audio file paths (using placeholder paths - actual audio files would be in public/audio)
const AUDIO_PATHS = {
    bgm: '/audio/game/synthwave-bgm.mp3',
    servo: '/audio/game/servo-motor.mp3',
    grab: '/audio/game/claw-grab.mp3',
    success: '/audio/game/success-coin.mp3',
    fail: '/audio/game/fail-slip.mp3',
    coin: '/audio/game/8bit-coin.mp3',
    collision: '/audio/game/capsule-collision.mp3',
};

// Default volume levels
const DEFAULT_VOLUMES = {
    bgm: 0.3,
    sfx: 0.5,
};

/**
 * Audio Manager Configuration
 */
export interface AudioManagerConfig {
    bgmVolume?: number;
    sfxVolume?: number;
    muted?: boolean;
}

/**
 * Audio Manager State
 */
export interface AudioManagerState {
    isInitialized: boolean;
    isMuted: boolean;
    bgmVolume: number;
    sfxVolume: number;
    isBgmPlaying: boolean;
}

/**
 * Creates and manages all game audio
 */
export class AudioManagerImpl implements AudioManager {
    private bgm: Howl | null = null;
    private servoSound: Howl | null = null;
    private grabSound: Howl | null = null;
    private successSound: Howl | null = null;
    private failSound: Howl | null = null;
    private coinSound: Howl | null = null;
    private collisionSound: Howl | null = null;

    private state: AudioManagerState = {
        isInitialized: false,
        isMuted: false,
        bgmVolume: DEFAULT_VOLUMES.bgm,
        sfxVolume: DEFAULT_VOLUMES.sfx,
        isBgmPlaying: false,
    };

    constructor(config?: AudioManagerConfig) {
        if (config) {
            this.state.bgmVolume = config.bgmVolume ?? DEFAULT_VOLUMES.bgm;
            this.state.sfxVolume = config.sfxVolume ?? DEFAULT_VOLUMES.sfx;
            this.state.isMuted = config.muted ?? false;
        }
    }

    /**
     * Initialize all audio resources
     * Should be called after user interaction to comply with browser autoplay policies
     */
    public initialize(): void {
        if (this.state.isInitialized) {
            return;
        }

        // Initialize BGM - synthwave style, looping
        this.bgm = new Howl({
            src: [AUDIO_PATHS.bgm],
            loop: true,
            volume: this.state.bgmVolume,
            preload: true,
            html5: true, // Use HTML5 Audio for longer tracks
            onloaderror: (_id, error) => {
                console.warn('BGM load error:', error);
            },
        });

        // Initialize servo motor sound - short, can overlap
        this.servoSound = new Howl({
            src: [AUDIO_PATHS.servo],
            volume: this.state.sfxVolume,
            preload: true,
            pool: 3, // Allow multiple instances
            onloaderror: (_id, error) => {
                console.warn('Servo sound load error:', error);
            },
        });

        // Initialize grab sound
        this.grabSound = new Howl({
            src: [AUDIO_PATHS.grab],
            volume: this.state.sfxVolume,
            preload: true,
            onloaderror: (_id, error) => {
                console.warn('Grab sound load error:', error);
            },
        });

        // Initialize success sound - 8-bit coin style
        this.successSound = new Howl({
            src: [AUDIO_PATHS.success],
            volume: this.state.sfxVolume,
            preload: true,
            onloaderror: (_id, error) => {
                console.warn('Success sound load error:', error);
            },
        });

        // Initialize fail sound
        this.failSound = new Howl({
            src: [AUDIO_PATHS.fail],
            volume: this.state.sfxVolume,
            preload: true,
            onloaderror: (_id, error) => {
                console.warn('Fail sound load error:', error);
            },
        });

        // Initialize 8-bit coin sound (for scoring)
        this.coinSound = new Howl({
            src: [AUDIO_PATHS.coin],
            volume: this.state.sfxVolume,
            preload: true,
            onloaderror: (_id, error) => {
                console.warn('Coin sound load error:', error);
            },
        });

        // Initialize collision sound - short, can overlap
        this.collisionSound = new Howl({
            src: [AUDIO_PATHS.collision],
            volume: this.state.sfxVolume * 0.3, // Lower volume for collision
            preload: true,
            pool: 5, // Allow multiple instances for multiple collisions
            onloaderror: (_id, error) => {
                console.warn('Collision sound load error:', error);
            },
        });

        this.state.isInitialized = true;
    }

    /**
     * Play background music
     */
    public playBGM(): void {
        if (!this.state.isInitialized) {
            this.initialize();
        }

        if (this.bgm && !this.state.isBgmPlaying && !this.state.isMuted) {
            this.bgm.play();
            this.state.isBgmPlaying = true;
        }
    }

    /**
     * Stop background music
     */
    public stopBGM(): void {
        if (this.bgm && this.state.isBgmPlaying) {
            this.bgm.stop();
            this.state.isBgmPlaying = false;
        }
    }

    /**
     * Pause background music
     */
    public pauseBGM(): void {
        if (this.bgm && this.state.isBgmPlaying) {
            this.bgm.pause();
            this.state.isBgmPlaying = false;
        }
    }

    /**
     * Resume background music
     */
    public resumeBGM(): void {
        if (this.bgm && !this.state.isBgmPlaying && !this.state.isMuted) {
            this.bgm.play();
            this.state.isBgmPlaying = true;
        }
    }

    /**
     * Play servo motor sound (claw movement)
     */
    public playServoSound(): void {
        if (!this.state.isInitialized) {
            this.initialize();
        }

        if (this.servoSound && !this.state.isMuted) {
            this.servoSound.play();
        }
    }

    /**
     * Play grab sound (claw closing)
     */
    public playGrabSound(): void {
        if (!this.state.isInitialized) {
            this.initialize();
        }

        if (this.grabSound && !this.state.isMuted) {
            this.grabSound.play();
        }
    }

    /**
     * Play success sound (successful grab/score)
     */
    public playSuccessSound(): void {
        if (!this.state.isInitialized) {
            this.initialize();
        }

        if (this.successSound && !this.state.isMuted) {
            this.successSound.play();
        }
    }

    /**
     * Play fail sound (grab failure/slip)
     */
    public playFailSound(): void {
        if (!this.state.isInitialized) {
            this.initialize();
        }

        if (this.failSound && !this.state.isMuted) {
            this.failSound.play();
        }
    }

    /**
     * Play 8-bit coin sound (scoring)
     */
    public playCoinSound(): void {
        if (!this.state.isInitialized) {
            this.initialize();
        }

        if (this.coinSound && !this.state.isMuted) {
            this.coinSound.play();
        }
    }

    /**
     * Play collision sound (capsule-to-capsule impact)
     */
    public playCollisionSound(): void {
        if (!this.state.isInitialized) {
            this.initialize();
        }

        if (this.collisionSound && !this.state.isMuted) {
            this.collisionSound.play();
        }
    }

    /**
     * Set master volume (0-1)
     */
    public setVolume(volume: number): void {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        Howler.volume(clampedVolume);
    }

    /**
     * Set BGM volume (0-1)
     */
    public setBgmVolume(volume: number): void {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        this.state.bgmVolume = clampedVolume;
        if (this.bgm) {
            this.bgm.volume(clampedVolume);
        }
    }

    /**
     * Set SFX volume (0-1)
     */
    public setSfxVolume(volume: number): void {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        this.state.sfxVolume = clampedVolume;

        // Update all SFX volumes
        if (this.servoSound) this.servoSound.volume(clampedVolume);
        if (this.grabSound) this.grabSound.volume(clampedVolume);
        if (this.successSound) this.successSound.volume(clampedVolume);
        if (this.failSound) this.failSound.volume(clampedVolume);
        if (this.coinSound) this.coinSound.volume(clampedVolume);
        if (this.collisionSound) this.collisionSound.volume(clampedVolume * 0.3); // Lower volume for collision
    }

    /**
     * Mute all audio
     */
    public mute(): void {
        this.state.isMuted = true;
        Howler.mute(true);
    }

    /**
     * Unmute all audio
     */
    public unmute(): void {
        this.state.isMuted = false;
        Howler.mute(false);
    }

    /**
     * Toggle mute state
     */
    public toggleMute(): boolean {
        if (this.state.isMuted) {
            this.unmute();
        } else {
            this.mute();
        }
        return this.state.isMuted;
    }

    /**
     * Get current audio state
     */
    public getState(): AudioManagerState {
        return { ...this.state };
    }

    /**
     * Check if audio is initialized
     */
    public isInitialized(): boolean {
        return this.state.isInitialized;
    }

    /**
     * Check if muted
     */
    public isMuted(): boolean {
        return this.state.isMuted;
    }

    /**
     * Cleanup and dispose all audio resources
     */
    public dispose(): void {
        this.stopBGM();

        if (this.bgm) {
            this.bgm.unload();
            this.bgm = null;
        }
        if (this.servoSound) {
            this.servoSound.unload();
            this.servoSound = null;
        }
        if (this.grabSound) {
            this.grabSound.unload();
            this.grabSound = null;
        }
        if (this.successSound) {
            this.successSound.unload();
            this.successSound = null;
        }
        if (this.failSound) {
            this.failSound.unload();
            this.failSound = null;
        }
        if (this.coinSound) {
            this.coinSound.unload();
            this.coinSound = null;
        }
        if (this.collisionSound) {
            this.collisionSound.unload();
            this.collisionSound = null;
        }

        this.state.isInitialized = false;
        this.state.isBgmPlaying = false;
    }
}

/**
 * Factory function to create an AudioManager instance
 */
export function createAudioManager(config?: AudioManagerConfig): AudioManagerImpl {
    return new AudioManagerImpl(config);
}

/**
 * Singleton instance for global audio management
 */
let audioManagerInstance: AudioManagerImpl | null = null;

/**
 * Get or create the global AudioManager instance
 */
export function getAudioManager(config?: AudioManagerConfig): AudioManagerImpl {
    if (!audioManagerInstance) {
        audioManagerInstance = createAudioManager(config);
    }
    return audioManagerInstance;
}

/**
 * Reset the global AudioManager instance (useful for testing)
 */
export function resetAudioManager(): void {
    if (audioManagerInstance) {
        audioManagerInstance.dispose();
        audioManagerInstance = null;
    }
}

// Default export
export default AudioManagerImpl;
