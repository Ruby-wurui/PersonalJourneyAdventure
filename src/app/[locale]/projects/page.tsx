'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const ProjectsPageContent = dynamic(
    () => import('@/app/projects/page'),
    { ssr: false }
)

export default function ProjectsPage() {
    return <ProjectsPageContent />
}
