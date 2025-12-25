'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dictionary } from '@/i18n/get-dictionary';
import { Locale } from '@/i18n/config';
import InteractiveGridBackground from '@/components/ui/InteractiveGridBackground';
import NavigationBarI18n from '@/components/layout/NavigationBarI18n';
import { useAuth } from '@/lib/auth-context';
import { LoginModal } from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import LoadingSpinner from '@/components/3d/LoadingSpinner';
import AINewsCard from '@/components/ai-news/AINewsCard';
import AINewsCarousel from '@/components/ai-news/AINewsCarousel';

interface AINewsClientProps {
    dict: Dictionary;
    locale: Locale;
}

interface AINewsItem {
    id: number;
    title: string;
    url: string;
    source: string;
    summary: string | null;
    published_at: string;
    tags: string[];
    score: number;
    image_url: string | null;
}

export default function AINewsClient({ dict, locale }: AINewsClientProps) {
    const { isAuthenticated, user, logout } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [news, setNews] = useState<AINewsItem[]>([]);
    const [hotNews, setHotNews] = useState<AINewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch latest news
                const latestResponse = await fetch(`http://127.0.0.1:30001/api/ai-news?limit=50`);
                const latestData = await latestResponse.json();

                // Fetch hot news
                const hotResponse = await fetch(`http://127.0.0.1:30001/api/ai-news?limit=5&sort=hot`);
                const hotData = await hotResponse.json();

                if (latestData.success && hotData.success) {
                    setNews(latestData.data.news);
                    setHotNews(hotData.data.news);
                } else {
                    setError('Failed to load AI news');
                }
            } catch (err) {
                console.error('AI News fetch error:', err);
                setError('Failed to load AI news');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="relative w-full min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-purple-500/30">
            {/* Background Effects */}
            <InteractiveGridBackground />

            {/* Navigation Bar */}
            <div className="relative z-50">
                <NavigationBarI18n
                    locale={locale}
                    dict={dict}
                    isAuthenticated={isAuthenticated}
                    user={user}
                    onLogin={() => setShowLoginModal(true)}
                    onRegister={() => setShowRegisterModal(true)}
                    onLogout={logout}
                />
            </div>

            <main className="relative z-10 container mx-auto px-4 py-24 md:py-32 max-w-7xl">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center text-center mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                            AI News Aggregator
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                        Latest updates from the AI world, curated from top communities.
                    </p>
                </motion.div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <LoadingSpinner />
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="text-red-400 text-xl mb-4">⚠️ {error}</div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Hot News Carousel */}
                        {hotNews.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <AINewsCarousel items={hotNews} />
                            </motion.div>
                        )}

                        {/* News Grid */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <AnimatePresence>
                                {news.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                    >
                                        <AINewsCard item={item} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </>
                )}
            </main>

            {/* Login/Register Modals */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSwitchToRegister={() => {
                    setShowLoginModal(false);
                    setShowRegisterModal(true);
                }}
            />
            <RegisterModal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onSwitchToLogin={() => {
                    setShowRegisterModal(false);
                    setShowLoginModal(true);
                }}
            />
        </div>
    );
}
