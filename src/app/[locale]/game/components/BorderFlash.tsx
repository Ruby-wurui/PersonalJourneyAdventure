/**
 * Neon Claw Game - Border Flash Effect Component
 * Requirements: 9.7, 5.3
 * 
 * Creates a border flash effect with green/gold colors on successful grab.
 * Coordinates with particle explosion effect for simultaneous visual feedback.
 */

'use client';

import { useState, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';

/**
 * Border flash color types
 */
export type BorderFlashColor = 'green' | 'gold';

/**
 * Ref interface for controlling border flash externally
 */
export interface BorderFlashRef {
    flash: (color?: BorderFlashColor) => void;
}

interface BorderFlashProps {
    duration?: number; // Duration of flash in milliseconds
    className?: string;
}

/**
 * BorderFlash component
 * Renders a full-screen border flash effect that can be triggered programmatically
 */
export const BorderFlash = forwardRef<BorderFlashRef, BorderFlashProps>(
    function BorderFlash({ duration = 500, className = '' }, ref) {
        const [isFlashing, setIsFlashing] = useState(false);
        const [flashColor, setFlashColor] = useState<BorderFlashColor>('green');

        /**
         * Trigger a border flash with specified color
         */
        const flash = useCallback((color: BorderFlashColor = 'green') => {
            setFlashColor(color);
            setIsFlashing(true);
        }, []);

        // Expose flash method to parent components
        useImperativeHandle(ref, () => ({
            flash,
        }));

        // Auto-hide flash after duration
        useEffect(() => {
            if (isFlashing) {
                const timer = setTimeout(() => {
                    setIsFlashing(false);
                }, duration);

                return () => clearTimeout(timer);
            }
        }, [isFlashing, duration]);

        // Color mapping
        const colorClasses = {
            green: 'border-green-400 shadow-green-400',
            gold: 'border-yellow-400 shadow-yellow-400',
        };

        if (!isFlashing) return null;

        return (
            <div
                className={`
                    fixed inset-0 pointer-events-none z-50
                    border-8 ${colorClasses[flashColor]}
                    shadow-[0_0_30px_rgba(0,255,0,0.8)]
                    animate-pulse
                    ${className}
                `}
                style={{
                    animation: 'borderFlash 0.5s ease-out',
                }}
            />
        );
    }
);

export default BorderFlash;
