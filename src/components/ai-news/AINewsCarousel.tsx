'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react'

interface NewsItem {
    id: number
    title: string
    url: string
    source: string
    summary: string | null
    published_at: string
    tags: string[]
    score: number
    image_url: string | null
}

interface AINewsCarouselProps {
    items: NewsItem[]
}

export default function AINewsCarousel({ items }: AINewsCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide()
        }, 5000)
        return () => clearInterval(timer)
    }, [currentIndex])

    const nextSlide = () => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % items.length)
    }

    const prevSlide = () => {
        setDirection(-1)
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
    }

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    }

    if (!items || items.length === 0) return null

    const currentItem = items[currentIndex]

    return (
        <div className="relative w-full h-[400px] mb-12 rounded-2xl overflow-hidden group">
            {/* Background Image with Blur */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 blur-sm scale-110 opacity-50"
                style={{ backgroundImage: `url(${currentItem.image_url || '/assets/ai-news-placeholder.jpg'})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="absolute w-full max-w-4xl px-8 text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium mb-4 backdrop-blur-sm">
                            <TrendingUp className="w-4 h-4" />
                            Hot Topic
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                            {currentItem.title}
                        </h2>

                        {currentItem.summary && (
                            <p className="text-gray-200 text-lg mb-8 line-clamp-2 max-w-2xl mx-auto drop-shadow-md">
                                {currentItem.summary}
                            </p>
                        )}

                        <div className="flex items-center justify-center gap-4">
                            <a
                                href={currentItem.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors"
                            >
                                Read Article
                                <ExternalLink className="w-4 h-4" />
                            </a>
                            <div className="flex gap-2">
                                {currentItem.tags?.slice(0, 3).map((tag, idx) => (
                                    <span key={idx} className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm backdrop-blur-sm">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 text-white hover:bg-white/20 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 text-white hover:bg-white/20 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {items.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setDirection(idx > currentIndex ? 1 : -1)
                            setCurrentIndex(idx)
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}
