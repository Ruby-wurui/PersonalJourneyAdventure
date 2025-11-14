'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const BlogPageContent = dynamic(
    () => import('@/app/blog/page'),
    { ssr: false }
)

export default function BlogPage() {
    return <BlogPageContent />
}
