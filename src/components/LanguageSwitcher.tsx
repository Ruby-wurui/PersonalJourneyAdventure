'use client'

import { usePathname, useRouter } from 'next/navigation'
import { locales, localeNames, type Locale } from '@/i18n/config'

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
    const pathname = usePathname()
    const router = useRouter()

    const switchLocale = (newLocale: Locale) => {
        if (newLocale === currentLocale) return

        // Remove current locale from pathname
        const segments = pathname.split('/')
        segments[1] = newLocale
        const newPath = segments.join('/')

        // Set cookie and navigate
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`
        router.push(newPath)
    }

    return (
        <div className="flex items-center space-x-2">
            {locales.map((locale) => (
                <button
                    key={locale}
                    onClick={() => switchLocale(locale)}
                    className={`
            px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
            ${currentLocale === locale
                            ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent'
                        }
          `}
                >
                    {localeNames[locale]}
                </button>
            ))}
        </div>
    )
}
