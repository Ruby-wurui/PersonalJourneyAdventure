// Export config (safe for client components)
export { locales, defaultLocale, localeNames } from './config'
export type { Locale } from './config'

// Export dictionary (server-only)
export { getDictionary } from './get-dictionary'
export type { Dictionary } from './get-dictionary'
