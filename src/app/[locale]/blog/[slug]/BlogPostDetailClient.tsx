'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { Locale } from '@/i18n/config';
import { Dictionary } from '@/i18n/get-dictionary';
import NavigationBarI18n from '@/components/layout/NavigationBarI18n';
import { useAuth } from '@/lib/auth-context';
import { LoginModal } from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import InteractiveGridBackground from '@/components/ui/InteractiveGridBackground';
import LoadingSpinner from '@/components/3d/LoadingSpinner';
import { BlogPost } from '@/types/blog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MermaidDiagram from '@/components/blog/MermaidDiagram';

interface BlogPostDetailClientProps {
    dict: Dictionary;
    slug: string;
}

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

export default function BlogPostDetailClient({ dict, slug }: BlogPostDetailClientProps) {
    const pathname = usePathname();
    const router = useRouter();
    const locale = pathname.split('/')[1] as Locale;
    const { isAuthenticated, user, logout } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPost();
    }, [slug]);

    const fetchPost = async () => {
        try {
            // Use the correct endpoint: /api/blog/posts/:slug
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/posts/${slug}`);
            const data = await response.json();

            if (data.success) {
                setPost(data.data);
            } else {
                setError(data.error || 'Failed to load post');
            }
        } catch (err) {
            setError('Failed to load post');
            console.error('Post fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="relative w-full min-h-screen bg-[#050505] text-white flex items-center justify-center">
                <InteractiveGridBackground />
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="relative w-full min-h-screen bg-[#050505] text-white">
                <InteractiveGridBackground />
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
                <div className="relative z-10 container mx-auto px-4 py-32 text-center">
                    {/* <div className="text-6xl mb-6">😕</div> */}
                    <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
                    <p className="text-gray-400 mb-8">{error || 'The blog post you are looking for does not exist.'}</p>
                    <button
                        onClick={() => router.push(`/${locale}/blog`)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all"
                    >
                        Back to Blog
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-purple-500/30">
            <InteractiveGridBackground />

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

            <main className="relative z-10 container mx-auto px-4 py-24 md:py-32 max-w-4xl">
                <motion.article
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl"
                >
                    {/* Header */}
                    <header className="mb-8 pb-8 border-b border-white/10">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                            <time dateTime={post.published_at} className="flex items-center gap-2">
                                <span className="text-purple-400">📅</span>
                                {formatDate(post.published_at)}
                            </time>
                            <span className="text-white/20">•</span>
                            <span className="flex items-center gap-2">
                                <span className="text-blue-400">👁️</span>
                                {post.view_count} views
                            </span>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-6">
                                {post.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-4 py-2 bg-white/5 border border-white/10 text-sm text-gray-300 rounded-full hover:bg-white/10 transition-colors"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>

                    {/* Content */}
                    <div className="prose prose-invert prose-lg max-w-none
                        prose-headings:text-white prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-8
                        prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                        prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                        prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 prose-a:transition-colors
                        prose-code:text-purple-300 prose-code:bg-white/5 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                        prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:p-4 prose-pre:overflow-x-auto
                        prose-pre:shadow-lg prose-pre:my-6
                        prose-strong:text-white prose-strong:font-bold
                        prose-em:text-gray-300 prose-em:italic
                        prose-ul:text-gray-300 prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                        prose-ol:text-gray-300 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
                        prose-li:text-gray-300 prose-li:my-2
                        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-400
                        prose-img:rounded-lg prose-img:shadow-xl prose-img:my-6
                        prose-hr:border-white/10 prose-hr:my-8
                        prose-table:border-collapse prose-table:w-full prose-table:my-6
                        prose-th:bg-white/5 prose-th:border prose-th:border-white/10 prose-th:p-3 prose-th:text-left prose-th:font-bold
                        prose-td:border prose-td:border-white/10 prose-td:p-3">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({ node, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const language = match ? match[1] : '';
                                    const isInline = !match;
                                    const code = String(children).replace(/\n$/, '');

                                    // Handle Mermaid diagrams
                                    if (language === 'mermaid') {
                                        return <MermaidDiagram chart={code} />;
                                    }

                                    return !isInline ? (
                                        <div className="relative group">
                                            {match && (
                                                <div className="absolute top-2 right-2 px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-md border border-blue-500/30 font-mono">
                                                    {language}
                                                </div>
                                            )}
                                            <pre className={className}>
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            </pre>
                                        </div>
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                                a({ node, children, href, ...props }: any) {
                                    return (
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1"
                                            {...props}
                                        >
                                            {children}
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    );
                                },
                                img({ node, src, alt, ...props }: any) {
                                    return (
                                        <div className="my-6">
                                            <img
                                                src={src}
                                                alt={alt}
                                                className="rounded-lg shadow-2xl border border-white/10"
                                                {...props}
                                            />
                                            {alt && (
                                                <p className="text-center text-sm text-gray-400 mt-2 italic">{alt}</p>
                                            )}
                                        </div>
                                    );
                                },
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>

                    {/* Back Button */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <button
                            onClick={() => router.push(`/${locale}/blog`)}
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Blog
                        </button>
                    </div>
                </motion.article>
            </main>

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
