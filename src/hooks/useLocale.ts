'use client'

import { usePathname } from 'next/navigation'
import { locales, type Locale } from '@/i18n/config'
import { useEffect, useState } from 'react'
import type { Dictionary } from '@/i18n/get-dictionary'

export function useLocale() {
    const pathname = usePathname()
    const [dict, setDict] = useState<Dictionary | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Extract locale from pathname
    const locale = (locales.find(loc => pathname.startsWith(`/${loc}`)) || 'en') as Locale

    useEffect(() => {
        setIsLoading(true)
        // Dynamically import dictionary
        import(`@/i18n/dictionaries/${locale}.json`)
            .then(module => {
                setDict(module.default)
                setIsLoading(false)
            })
            .catch(err => {
                console.error('Failed to load dictionary:', err)
                setIsLoading(false)
            })
    }, [locale])

    return {
        locale,
        dict: dict || {} as Dictionary,
        isLoading
    }
}
