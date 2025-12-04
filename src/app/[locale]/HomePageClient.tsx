'use client';

import React, { useState } from 'react';
import NavigationBarI18n from '@/components/layout/NavigationBarI18n';
import { useAuth } from '@/lib/auth-context';
import { LoginModal } from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';

// Import new home sections
import HeroSection from '@/components/home/HeroSection';
import IntroSection from '@/components/home/IntroSection';
import ProjectShowcase from '@/components/home/ProjectShowcase';
import SkillInterests from '@/components/home/SkillInterests';
import GallerySection from '@/components/home/GallerySection';

interface HomePageClientProps {
    locale: Locale;
    dict: Dictionary;
}

export default function HomePageClient({ locale, dict }: HomePageClientProps) {
    const { isAuthenticated, user, logout } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    if (!dict) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="text-white text-center">
                    <div className="text-2xl mb-4">⚠️</div>
                    <p>Error: Translations not loaded</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full min-h-screen bg-black overflow-x-hidden">
            {/* Navigation Bar */}
            <NavigationBarI18n
                locale={locale}
                dict={dict}
                isAuthenticated={isAuthenticated}
                user={user}
                onLogin={() => setShowLoginModal(true)}
                onRegister={() => setShowRegisterModal(true)}
                onLogout={logout}
            />

            {/* Main Content Sections */}
            <main className="flex flex-col">
                <HeroSection />
                <IntroSection />
                <ProjectShowcase />
                <SkillInterests />
                <GallerySection />
            </main>

            {/* Footer / Copyright */}
            <footer className="bg-neutral-900 py-8 text-center text-gray-500 text-sm border-t border-white/5">
                <p>© {new Date().getFullYear()} {dict.brand.title}. All rights reserved.</p>
            </footer>

            {/* Login Modal */}
            {showLoginModal && (
                <LoginModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                    onSwitchToRegister={() => {
                        setShowLoginModal(false);
                        setShowRegisterModal(true);
                    }}
                />
            )}

            {/* Register Modal */}
            {showRegisterModal && (
                <RegisterModal
                    isOpen={showRegisterModal}
                    onClose={() => setShowRegisterModal(false)}
                    onSwitchToLogin={() => {
                        setShowRegisterModal(false);
                        setShowLoginModal(true);
                    }}
                />
            )}
        </div>
    );
}
