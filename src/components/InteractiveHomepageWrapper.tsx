'use client'

import { Suspense } from 'react'
import InteractiveHomepage from '@/components/InteractiveHomepage'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/get-dictionary'

interface InteractiveHomepageWrapperProps {
    locale: Locale
    dict: Dictionary
}

export default function InteractiveHomepageWrapper({ locale, dict }: InteractiveHomepageWrapperProps) {
    // Debug: Check if props are received
    console.log('InteractiveHomepageWrapper - locale:', locale)
    console.log('InteractiveHomepageWrapper - dict:', dict ? 'loaded' : 'undefined')

    if (!dict) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black">
                <div className="text-white text-center">
                    <div className="text-2xl mb-4">⚠️</div>
                    <p>Error: Translations not loaded</p>
                    <p className="text-sm text-gray-400 mt-2">Locale: {locale}</p>
                </div>
            </div>
        )
    }

    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black">
                    <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p>Loading Interactive Laboratory...</p>
                    </div>
                </div>
            }
        >
            <InteractiveHomepage locale={locale} dict={dict} />
        </Suspense>
    )
}
