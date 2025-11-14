'use client'

import { usePathname, useRouter } from 'next/navigation'
import { locales, localeNames, type Locale } from '@/i18n/config'
import { useState, useRef, useEffect } from 'react'

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
    const pathname = usePathname()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const switchLocale = (newLocale: Locale) => {
        if (newLocale === currentLocale) {
            setIsOpen(false)
            return
        }

        // Remove current locale from pathname
        const segments = pathname.split('/')
        segments[1] = newLocale
        const newPath = segments.join('/')

        // Set cookie and navigate
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`
        router.push(newPath)
        setIsOpen(false)
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium 
                         text-gray-300 hover:text-white hover:bg-gray-800/50 
                         border border-gray-700/50 hover:border-gray-600/50
                         transition-all duration-200"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                </svg>
                <span>{localeNames[currentLocale]}</span>
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-lg bg-gray-900/95 backdrop-blur-sm 
                              border border-gray-700/50 shadow-xl overflow-hidden z-50">
                    {locales.map((locale) => (
                        <button
                            key={locale}
                            onClick={() => switchLocale(locale)}
                            className={`
                                w-full px-4 py-2.5 text-left text-sm font-medium transition-all duration-150
                                ${currentLocale === locale
                                    ? 'bg-blue-600/30 text-blue-300 border-l-2 border-blue-500'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-800/70'
                                }
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <span>{localeNames[locale]}</span>
                                {currentLocale === locale && (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
