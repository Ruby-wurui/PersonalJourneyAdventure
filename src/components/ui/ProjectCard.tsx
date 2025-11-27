'use client'

import React from 'react'
import Image, { StaticImageData } from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface ProjectCardProps {
    title: string
    description: string
    image: StaticImageData | string
    link?: string
    tags?: string[]
}

export default function ProjectCard({ title, description, image, link = '#', tags = [] }: ProjectCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative w-full bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-colors duration-300"
        >
            <div className="flex flex-col md:flex-row h-full">
                {/* Image Section - Left (or Top on mobile) */}
                <div className="w-full md:w-1/3 relative min-h-[200px] md:min-h-full bg-white/5 flex items-center justify-center p-8">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 shadow-2xl rounded-2xl overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Content Section - Right */}
                <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col justify-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight group-hover:text-purple-400 transition-colors">
                        {title}
                    </h3>

                    <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
                        {description}
                    </p>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {tags.map((tag, index) => (
                                <span key={index} className="px-3 py-1 text-xs font-mono rounded-full bg-white/5 text-gray-300 border border-white/10">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <Link
                        href={link}
                        className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium transition-colors group/link"
                    >
                        Read More
                        <svg
                            className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
