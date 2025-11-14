'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const LaboratoryPageContent = dynamic(
    () => import('@/app/laboratory/page'),
    { ssr: false }
)

export default function LaboratoryPage() {
    return <LaboratoryPageContent />
}
