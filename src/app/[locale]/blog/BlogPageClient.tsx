'use client';

import { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import BlogTimeline from '@/components/blog/BlogTimeline';
import LoadingSpinner from '@/components/3d/LoadingSpinner';
import NavigationBarI18n from '@/components/layout/NavigationBarI18n';
import { useAuth } from '@/lib/auth-context';
import { LoginModal } from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import { Dictionary } from '@/i18n/get-dictionary';
import { usePathname } from 'next/navigation';
import { Locale } from '@/i18n/config';
import InteractiveGridBackground from '@/components/ui/InteractiveGridBackground';

interface BlogPageClientProps {
  dict: Dictionary
}

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

export default function BlogPageClient({ dict }: BlogPageClientProps) {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as Locale;
  const { isAuthenticated, user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

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
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-center text-center mb-20"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="text-6xl md:text-7xl">📝</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-5xl md:text-8xl font-bold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500 drop-shadow-sm">
              {dict.blog.title}
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-400 mb-10 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
            {dict.blog.subtitle}
          </motion.p>

          {/* Admin Action Buttons */}
          {isAuthenticated && user?.role === 'admin' && (
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center">
              <a
                href={`/${locale}/blog/manage`}
                className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:scale-105 flex items-center gap-3"
              >
                <span className="text-2xl">📋</span>
                <span>{dict.blog.manage || 'Manage'}</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              <a
                href={`/${locale}/blog/create`}
                className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-green-500/50 hover:scale-105 flex items-center gap-3"
              >
                <span className="text-2xl">✍️</span>
                <span>{dict.blog.new_post || 'New Post'}</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </motion.div>
          )}
        </motion.div>

        {/* Blog Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Suspense fallback={
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          }>
            <BlogTimeline />
          </Suspense>
        </motion.div>
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