'use client'

import { useEffect, useState } from 'react'

export default function CodeInspector() {
    const [isDev, setIsDev] = useState(false)

    useEffect(() => {
        // Check if we are in development mode
        if (process.env.NODE_ENV === 'development') {
            setIsDev(true)
        }
    }, [])

    if (!isDev) return null

    return (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-full shadow-lg text-xs text-white/70 hover:text-white transition-colors select-none">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Shift + option + Click to Inspect</span>
        </div>
    )
}
