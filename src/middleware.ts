import { NextRequest, NextResponse } from 'next/server'

const locales = ['en', 'zh']
const defaultLocale = 'en'

// Get the preferred locale from the request
function getLocale(request: NextRequest): string {
    // Check if locale is in the pathname
    const pathname = request.nextUrl.pathname
    const pathnameLocale = locales.find(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (pathnameLocale) return pathnameLocale

    // Check cookie
    const localeCookie = request.cookies.get('NEXT_LOCALE')?.value
    if (localeCookie && locales.includes(localeCookie)) {
        return localeCookie
    }

    // Check Accept-Language header
    const acceptLanguage = request.headers.get('Accept-Language')
    if (acceptLanguage) {
        const preferredLocale = acceptLanguage
            .split(',')
            .map(lang => lang.split(';')[0].trim())
            .find(lang => {
                const langCode = lang.split('-')[0]
                return locales.includes(langCode)
            })

        if (preferredLocale) {
            const langCode = preferredLocale.split('-')[0]
            if (locales.includes(langCode)) return langCode
        }
    }

    return defaultLocale
}

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Skip middleware for API routes, static files, and Next.js internals
    if (
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/static/') ||
        pathname.includes('.') // files with extensions
    ) {
        return NextResponse.next()
    }

    // Check if pathname already has a locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (pathnameHasLocale) {
        return NextResponse.next()
    }

    // Redirect to locale-prefixed path
    const locale = getLocale(request)
    const newUrl = new URL(`/${locale}${pathname}`, request.url)

    // Preserve query parameters
    newUrl.search = request.nextUrl.search

    const response = NextResponse.redirect(newUrl)

    // Set locale cookie
    response.cookies.set('NEXT_LOCALE', locale, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
    })

    return response
}

export const config = {
    matcher: [
        // Match all pathnames except for
        // - … if they start with `/api`, `/_next` or `/_vercel`
        // - … the ones containing a dot (e.g. `favicon.ico`)
        '/((?!api|_next|_vercel|.*\\..*).*)',
    ],
}
