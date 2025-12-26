'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, LogOut, ChevronDown } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';
import styles from './NavigationBarI18n.module.css';

interface NavigationBarI18nProps {
    locale: Locale;
    dict: Dictionary;
    isAuthenticated?: boolean;
    user?: any;
    onLogin?: () => void;
    onRegister?: () => void;
    onLogout?: () => void;
}

const NavigationBarI18n: React.FC<NavigationBarI18nProps> = ({
    locale,
    dict,
    isAuthenticated = false,
    user,
    onLogin,
    onRegister,
    onLogout
}) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsProfileMenuOpen(false);
    }, [pathname]);

    const navigationItems = [
        {
            name: dict.nav.universe,
            href: `/${locale}`,
            icon: '🌌',
            description: dict.nav.universe_desc
        },
        // {
        //     name: dict.nav.home,
        //     href: `/${locale}/laboratory`,
        //     icon: '🏠',
        //     description: dict.nav.home_desc
        // },
        {
            name: dict.nav.about,
            href: `/${locale}/about`,
            icon: '🪐',
            description: dict.nav.about_desc
        },
        {
            name: dict.nav.skills,
            href: `/${locale}/skills`,
            icon: '⚡',
            description: dict.nav.skills_desc
        },
        {
            name: dict.nav.projects,
            href: `/${locale}/projects`,
            icon: '🗺️',
            description: dict.nav.projects_desc
        },
        {
            name: dict.nav.blog,
            href: `/${locale}/blog`,
            icon: '📚',
            description: dict.nav.blog_desc
        },
        {
            name: dict.nav.ai_news,
            href: `/${locale}/ai-news`,
            icon: '🤖',
            description: dict.nav.ai_news_desc
        },
        {
            name: dict.nav.games,
            href: `/${locale}/games`,
            icon: '🎮',
            description: dict.nav.games_desc
        }
    ];

    const isActive = (href: string) => {
        if (href === `/${locale}`) {
            return pathname === `/${locale}` || pathname === `/${locale}/`;
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            <nav className={`${styles.nav} ${isScrolled ? styles.navScrolled : ''}`}>
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        {/* Logo and Brand */}
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-lg font-bold">R</span>
                                </div>
                                <div className="hidden sm:block">
                                    <h1 className="text-white font-bold text-lg">{dict.brand.title}</h1>
                                    <p className="text-gray-400 text-xs">{dict.brand.subtitle}</p>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                    group relative px-4 py-2 rounded-lg transition-all duration-200
                    ${isActive(item.href)
                                            ? 'bg-blue-600/25 text-blue-300 border border-blue-500/50 shadow-lg shadow-blue-500/20'
                                            : 'text-gray-300 hover:text-white hover:bg-gray-800/50 hover:border-gray-600/50 border border-transparent'
                                        }
                  `}
                                >
                                    <div className="flex items-center space-x-2">
                                        {/* <span className="text-lg">{item.icon}</span> */}
                                        <span className="font-medium">{item.name}</span>
                                    </div>

                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                        {item.description}
                                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Language Switcher & Auth Section */}
                        <div className="hidden lg:flex items-center space-x-4">
                            <LanguageSwitcher currentLocale={locale} />

                            {/* Auth Buttons */}
                            {isAuthenticated ? (
                                <div className="relative" ref={profileMenuRef}>
                                    <button
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors focus:outline-none group"
                                    >
                                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border border-white/10 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all">
                                            <span className="text-white font-bold text-sm">
                                                {user?.username?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
                                            </span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 mt-3 w-56 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl py-2 z-50 transform origin-top-right animate-in fade-in zoom-in-95 duration-200">
                                            <div className="px-4 py-3 border-b border-gray-700/50">
                                                <p className="text-sm text-white font-medium truncate">{user?.username}</p>
                                                <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
                                                {user?.role === 'admin' && (
                                                    <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
                                                        {dict.auth.admin}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="py-1">
                                                <button
                                                    onClick={() => {
                                                        setIsProfileMenuOpen(false);
                                                        onLogout?.();
                                                    }}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    {dict.auth.logout}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={onLogin}
                                        className="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:border-white/30 backdrop-blur-sm"
                                    >
                                        {dict.auth.login}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-gray-900/98 backdrop-blur-md border-t border-blue-500/30 shadow-lg shadow-blue-500/10">
                        <div className="px-4 py-4 space-y-2">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive(item.href)
                                            ? 'bg-blue-600/25 text-blue-300 border border-blue-500/50 shadow-lg shadow-blue-500/20'
                                            : 'text-gray-300 hover:text-white hover:bg-gray-800/50 hover:border-gray-600/50 border border-transparent'
                                        }
                  `}
                                >
                                    {/* <span className="text-xl">{item.icon}</span> */}
                                    <div>
                                        <div className="font-medium">{item.name}</div>
                                        {/* <div className="text-xs text-gray-400">{item.description}</div> */}
                                    </div>
                                </Link>
                            ))}

                            {/* Mobile Language Switcher */}
                            <div className="border-t border-gray-700/50 pt-4 mt-4">
                                <div className="px-4 mb-3 text-gray-400 text-sm">Language / 语言</div>
                                <LanguageSwitcher currentLocale={locale} />
                            </div>



                            {/* Mobile Auth Section */}
                            <div className="border-t border-gray-700/50 pt-4 mt-4">
                                {isAuthenticated ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-lg border border-white/10">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border border-white/10 shadow-lg shadow-purple-500/20">
                                                <span className="text-white font-bold">
                                                    {user?.username?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-white font-medium truncate">{user?.username}</div>
                                                <div className="text-xs text-gray-400 truncate">{user?.email}</div>
                                                {user?.role === 'admin' && (
                                                    <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
                                                        {dict.auth.admin}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={onLogout}
                                            className="w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-colors text-left flex items-center gap-2"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            {dict.auth.logout}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <button
                                            onClick={onLogin}
                                            className="w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:border-white/30 backdrop-blur-sm flex items-center justify-center gap-2"
                                        >
                                            {dict.auth.admin_login}
                                        </button>
                                        {/* <button
                                            onClick={onRegister}
                                            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border border-blue-500/50 shadow-lg shadow-blue-500/20"
                                        >
                                            📝 {dict.auth.user_registration}
                                        </button> */}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <div className="h-16 sm:h-20"></div>
        </>
    );
};

export default NavigationBarI18n;
