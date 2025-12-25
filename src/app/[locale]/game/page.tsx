/**
 * Neon Claw Game - Main Game Page
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.5
 * 
 * Next.js page that serves as the entry point for the Neon Claw game.
 * Wraps the client component for Three.js rendering.
 */

import { Metadata } from 'next';
import GameClient from './GameClient';

export const metadata: Metadata = {
    title: 'Neon Claw | 霓虹神手',
    description: 'A cyberpunk claw machine game with AI-powered hand gesture controls',
};

export default function GamePage() {
    return <GameClient />;
}
