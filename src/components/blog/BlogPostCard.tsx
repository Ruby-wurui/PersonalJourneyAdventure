'use client';

import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { BlogPostListItem } from '@/types/blog';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale } from '@/i18n/config';

interface BlogPostCardProps {
  post: BlogPostListItem;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as Locale;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left - width / 2);
    mouseY.set(clientY - top - height / 2);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [4, -4]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-4, 4]), { stiffness: 150, damping: 20 });
  const brightness = useSpring(useTransform(mouseY, [-300, 300], [1.1, 0.9]), { stiffness: 150, damping: 20 });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Use slug if available and not empty/dash, otherwise use ID
  const postSlug = (post.slug && post.slug !== '-' && post.slug.trim() !== '')
    ? post.slug
    : post.id?.toString() || 'unknown';
  const postUrl = `/${locale}/blog/${postSlug}`;

  return (
    <motion.div
      style={{ perspective: 1000 }}
      className="relative h-full"
    >
      <Link href={postUrl}>
        <motion.div
          style={{
            rotateX,
            rotateY,
            filter: useMotionTemplate`brightness(${brightness})`
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full h-full bg-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 transform-style-3d shadow-2xl group flex flex-col"
        >
          {/* Inner Glow Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60 rounded-t-2xl"></div>

          {/* Header */}
          <div className="mb-4 relative z-10">
            <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300 line-clamp-2 mb-3">
              {post.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-400 font-mono">
              <time dateTime={post.published_at} className="text-purple-300">
                {formatDate(post.published_at)}
              </time>
              <span className="text-white/20">•</span>
              <span className="text-blue-300">{getReadingTime(post.excerpt || '')} min read</span>
            </div>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow line-clamp-3 relative z-10">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 relative z-10">
              {post.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/5 border border-white/10 text-xs text-gray-300 rounded-full hover:bg-white/10 transition-colors"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="px-3 py-1 bg-white/5 border border-white/10 text-xs text-gray-400 rounded-full">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 relative z-10">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
              <span className="font-medium">Read More</span>
            </div>

            <motion.div
              className="text-blue-400 group-hover:text-blue-300 transition-colors"
              whileHover={{ x: 5 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}