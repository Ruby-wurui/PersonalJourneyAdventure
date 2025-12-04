'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, Flame, ExternalLink } from 'lucide-react';

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

interface AINewsCardProps {
    item: AINewsItem;
}

export default function AINewsCard({ item }: AINewsCardProps) {
    const getSourceColor = (source: string) => {
        if (source.includes('Reddit')) return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
        if (source.includes('Hacker News')) return 'bg-orange-600/10 text-orange-500 border-orange-600/20';
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    };

    const formattedDate = format(new Date(item.published_at), 'MMM d, yyyy'); // Defined formattedDate

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="group relative flex flex-col h-full bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm hover:border-purple-500/50 transition-colors"
        >
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden bg-gray-900">
                <img
                    src={item.image_url || `https://picsum.photos/seed/${item.id}/800/600?grayscale&blur=2`}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        // Fallback if the source image fails to load
                        e.currentTarget.src = `https://picsum.photos/seed/${item.id}/800/600?grayscale&blur=2`;
                    }}
                />
                <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-purple-300">
                    {item.source}
                </div>
            </div>

            <div className="flex flex-col flex-grow p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {formattedDate}
                    </div>
                    {item.score > 0 && (
                        <div className="flex items-center gap-1 text-xs font-medium text-yellow-500">
                            <Flame className="w-3 h-3" />
                            {item.score}
                        </div>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {item.title}
                </h3>

                {/* Summary */}
                {item.summary && (
                    <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-grow">
                        {item.summary}
                    </p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                    {item.tags && item.tags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                    <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        Read More <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>
        </motion.div>
    );
}
