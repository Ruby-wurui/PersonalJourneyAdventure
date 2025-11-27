'use client';

import { motion } from 'framer-motion';
import { TimelineData } from '@/types/blog';

interface TimelineNavigationProps {
  years: number[];
  selectedYear: number | null;
  selectedMonth: number | null;
  onYearSelect: (year: number) => void;
  onMonthSelect: (month: number) => void;
  timelineData: TimelineData;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function TimelineNavigation({
  years,
  selectedYear,
  selectedMonth,
  onYearSelect,
  onMonthSelect,
  timelineData
}: TimelineNavigationProps) {
  const getMonthsForYear = (year: number): number[] => {
    if (!timelineData[year]) return [];
    return Object.keys(timelineData[year]).map(Number).sort((a, b) => b - a);
  };

  return (
    <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60 rounded-t-2xl"></div>

      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-blue-400 text-3xl">📅</span> Navigate Timeline
      </h3>

      {/* Years Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          {years.map(year => {
            const postCount = Object.values(timelineData[year] || {}).reduce(
              (total, monthPosts) => total + monthPosts.length,
              0
            );

            return (
              <motion.button
                key={year}
                onClick={() => onYearSelect(year)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-6 py-3 rounded-xl font-bold transition-all duration-300 text-lg
                  ${selectedYear === year
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 border border-white/20'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:border-white/20'
                  }
                `}
              >
                {year}
                <span className="ml-2 text-sm opacity-75 font-mono">({postCount})</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Months Navigation */}
      {selectedYear && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-white/10 pt-6"
        >
          <h4 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">
            Months in {selectedYear}
          </h4>
          <div className="flex flex-wrap gap-2">
            {getMonthsForYear(selectedYear).map(month => {
              const postCount = timelineData[selectedYear]?.[month]?.length || 0;

              return (
                <motion.button
                  key={month}
                  onClick={() => onMonthSelect(month)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${selectedMonth === month
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/50 border border-white/20'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:border-white/20'
                    }
                  `}
                >
                  {MONTHS[month]}
                  <span className="ml-1.5 text-xs opacity-75 font-mono">({postCount})</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-black/40 rounded-xl p-4 border border-white/5">
            <div className="text-3xl font-bold text-blue-400 mb-1">{years.length}</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">Years</div>
          </div>
          <div className="bg-black/40 rounded-xl p-4 border border-white/5">
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {Object.values(timelineData).reduce(
                (total, yearData) => total + Object.values(yearData).reduce(
                  (yearTotal, monthPosts) => yearTotal + monthPosts.length,
                  0
                ),
                0
              )}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">Total Posts</div>
          </div>
          {selectedYear && (
            <div className="bg-black/40 rounded-xl p-4 border border-white/5 col-span-2 md:col-span-1">
              <div className="text-3xl font-bold text-pink-400 mb-1">
                {Object.values(timelineData[selectedYear] || {}).reduce(
                  (total, monthPosts) => total + monthPosts.length,
                  0
                )}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">In {selectedYear}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}