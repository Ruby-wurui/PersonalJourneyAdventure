'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { TimelineData, BlogPostListItem, Tag } from '@/types/blog';
import TimelineNavigation from './TimelineNavigation';
import BlogPostCard from './BlogPostCard';
import TagFilter from './TagFilter';
import LoadingSpinner from '@/components/3d/LoadingSpinner';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function BlogTimeline() {
  const [timelineData, setTimelineData] = useState<TimelineData>({});
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Scroll progress for timeline line - must be called unconditionally
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 20%", "end 80%"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  useEffect(() => {
    fetchTimelineData();
    fetchTags();
  }, []);

  const fetchTimelineData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/timeline`);
      const data = await response.json();

      if (data.success) {
        setTimelineData(data.data);
        // Set initial year to the most recent year with posts
        const years = Object.keys(data.data).map(Number).sort((a, b) => b - a);
        if (years.length > 0) {
          setSelectedYear(years[0]);
        }
      } else {
        setError(data.error || 'Failed to load timeline');
      }
    } catch (err) {
      setError('Failed to load timeline');
      console.error('Timeline fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/tags`);
      const data = await response.json();

      if (data.success) {
        setTags(data.data);
      }
    } catch (err) {
      console.error('Tags fetch error:', err);
    }
  };

  const getFilteredPosts = (): BlogPostListItem[] => {
    let posts: BlogPostListItem[] = [];

    // Collect posts based on selected year/month
    if (selectedYear && timelineData[selectedYear]) {
      if (selectedMonth !== null && timelineData[selectedYear][selectedMonth]) {
        posts = timelineData[selectedYear][selectedMonth];
      } else {
        // Get all posts from the selected year
        Object.values(timelineData[selectedYear]).forEach(monthPosts => {
          posts.push(...monthPosts);
        });
      }
    } else {
      // Get all posts
      Object.values(timelineData).forEach(yearData => {
        Object.values(yearData).forEach(monthPosts => {
          posts.push(...monthPosts);
        });
      });
    }

    // Filter by tag if selected
    if (selectedTag) {
      posts = posts.filter(post => post.tags.includes(selectedTag));
    }

    // Sort by date (newest first)
    return posts.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  };

  const scrollToYear = (year: number) => {
    const yearElement = document.getElementById(`year-${year}`);
    if (yearElement && timelineRef.current) {
      yearElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setSelectedMonth(null);
    scrollToYear(year);
  };

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(selectedMonth === month ? null : month);
  };

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-xl mb-4">⚠️ {error}</div>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchTimelineData();
          }}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const years = Object.keys(timelineData).map(Number).sort((a, b) => b - a);
  const filteredPosts = getFilteredPosts();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Navigation and Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 space-y-6"
      >
        <TimelineNavigation
          years={years}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearSelect={handleYearSelect}
          onMonthSelect={handleMonthSelect}
          timelineData={timelineData}
        />

        <TagFilter
          tags={tags}
          selectedTag={selectedTag}
          onTagSelect={handleTagSelect}
        />
      </motion.div>

      {/* Timeline Content */}
      <div ref={timelineRef} className="relative">
        {/* Animated Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-white/5 hidden md:block rounded-full overflow-hidden">
          <motion.div
            style={{ height: lineHeight, opacity }}
            className="w-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.6)]"
          />
        </div>

        {years.map((year, yearIndex) => (
          <motion.div
            key={year}
            id={`year-${year}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: yearIndex * 0.1 }}
            className="mb-20"
          >
            {/* Year Header */}
            <div className="flex items-center mb-12 relative">
              <div className="hidden md:block absolute left-8 w-6 h-6 -ml-3 z-20">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-[#050505] shadow-[0_0_15px_rgba(59,130,246,0.8)] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white ml-0 md:ml-20">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  {year}
                </span>
              </h2>
            </div>

            {/* Months */}
            {Object.keys(timelineData[year] || {}).map((monthIndex, monthIdx) => {
              const month = parseInt(monthIndex);
              const monthPosts = timelineData[year][month];

              // Filter posts by tag if selected
              const visiblePosts = selectedTag
                ? monthPosts.filter(post => post.tags.includes(selectedTag))
                : monthPosts;

              if (visiblePosts.length === 0 && selectedTag) return null;

              return (
                <motion.div
                  key={`${year}-${month}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: monthIdx * 0.1 }}
                  className="mb-12 ml-0 md:ml-20"
                >
                  {/* Month Header */}
                  <div className="flex items-center mb-6 relative">
                    <div className="hidden md:block absolute -left-[4.5rem] w-4 h-4 z-20">
                      <div className="w-3 h-3 bg-purple-400 rounded-full border-2 border-[#050505] shadow-[0_0_10px_rgba(192,132,252,0.6)] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-gray-200">
                      {MONTHS[month]}
                    </h3>
                    <span className="ml-3 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-sm border border-purple-500/20 font-mono">
                      {visiblePosts.length} post{visiblePosts.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Posts Grid */}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                      {visiblePosts.map((post, index) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 20 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                          <BlogPostCard post={post} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ))}

        {/* No Posts Message */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-6">📭</div>
            <div className="text-gray-400 text-2xl mb-6 font-light">
              {selectedTag ? `No posts found with tag "${selectedTag}"` : 'No posts found'}
            </div>
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/50 font-medium"
              >
                Clear Filter
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}