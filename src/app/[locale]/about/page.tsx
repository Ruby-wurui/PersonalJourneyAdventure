'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// Import the existing AboutPage component
const AboutPageContent = dynamic(
    () => import('@/app/about/page'),
    { ssr: false }
)

export default function AboutPage() {
    return <AboutPageContent />
}
