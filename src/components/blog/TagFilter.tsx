'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Tag } from '@/types/blog';
import { useState } from 'react';

interface TagFilterProps {
  tags: Tag[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export default function TagFilter({ tags, selectedTag, onTagSelect }: TagFilterProps) {
  const [showAllTags, setShowAllTags] = useState(false);

  const displayTags = showAllTags ? tags : tags.slice(0, 8);
  const hasMoreTags = tags.length > 8;

  return (
    <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60 rounded-t-2xl"></div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-purple-400 text-3xl">🏷️</span> Filter by Topic
        </h3>
        {selectedTag && (
          <motion.button
            onClick={() => onTagSelect(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-full bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/20 transition-all text-sm font-medium"
          >
            Clear ✕
          </motion.button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <AnimatePresence>
          {displayTags.map((tag, index) => (
            <motion.button
              key={tag.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              onClick={() => onTagSelect(tag.name)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                ${selectedTag === tag.name
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/50 border border-white/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:border-white/20'
                }
              `}
            >
              {tag.name}
              <span className="ml-2 text-xs opacity-75 font-mono">({tag.count})</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {hasMoreTags && (
        <motion.button
          onClick={() => setShowAllTags(!showAllTags)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 font-medium"
        >
          {showAllTags ? (
            <>
              Show Less
              <motion.span
                animate={{ rotate: showAllTags ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-lg"
              >
                ↑
              </motion.span>
            </>
          ) : (
            <>
              Show {tags.length - 8} More Tags
              <motion.span
                animate={{ rotate: showAllTags ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-lg"
              >
                ↓
              </motion.span>
            </>
          )}
        </motion.button>
      )}

      {/* Tag Cloud Visualization */}
      {tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="text-sm text-gray-400 mb-4 font-medium uppercase tracking-wider">Popular Topics</div>
          <div className="flex flex-wrap gap-3">
            {tags.slice(0, 5).map((tag, index) => {
              const size = Math.max(0.8, Math.min(1.3, tag.count / Math.max(...tags.map(t => t.count))));
              return (
                <motion.span
                  key={tag.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  whileHover={{ opacity: 1, scale: 1.1 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ fontSize: `${size}rem` }}
                  className="text-gray-400 hover:text-white transition-all cursor-pointer font-medium"
                  onClick={() => onTagSelect(tag.name)}
                >
                  {tag.name}
                </motion.span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}