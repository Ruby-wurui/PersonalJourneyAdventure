import { getDictionary, type Locale } from '@/i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import Link from 'next/link'

export default async function TestI18nPage({
    params: { locale }
}: {
    params: { locale: Locale }
}) {
    const dict = await getDictionary(locale)

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-4xl font-bold">i18n Test Page</h1>
                    <LanguageSwitcher currentLocale={locale} />
                </div>

                <div className="space-y-6 bg-gray-800/50 p-6 rounded-lg">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Current Locale: {locale}</h2>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-xl font-semibold mb-3">Navigation Translations</h3>
                        <ul className="space-y-2">
                            <li>🌌 {dict.nav.universe} - {dict.nav.universe_desc}</li>
                            <li>🏠 {dict.nav.home} - {dict.nav.home_desc}</li>
                            <li>🪐 {dict.nav.about} - {dict.nav.about_desc}</li>
                            <li>🗺️ {dict.nav.projects} - {dict.nav.projects_desc}</li>
                            <li>📚 {dict.nav.blog} - {dict.nav.blog_desc}</li>
                        </ul>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-xl font-semibold mb-3">Auth Translations</h3>
                        <ul className="space-y-2">
                            <li>🔐 {dict.auth.login}</li>
                            <li>📝 {dict.auth.register}</li>
                            <li>🚪 {dict.auth.logout}</li>
                            <li>👤 {dict.auth.admin}</li>
                        </ul>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-xl font-semibold mb-3">Blog Translations</h3>
                        <ul className="space-y-2">
                            <li>📝 {dict.blog.manage}</li>
                            <li>✍️ {dict.blog.new_post}</li>
                            <li>📋 {dict.blog.manage_posts}</li>
                            <li>🆕 {dict.blog.create_new_post}</li>
                        </ul>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-xl font-semibold mb-3">Brand Translations</h3>
                        <ul className="space-y-2">
                            <li>🏷️ {dict.brand.title}</li>
                            <li>📄 {dict.brand.subtitle}</li>
                        </ul>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-xl font-semibold mb-3">Test Links</h3>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={`/${locale}`}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                href={`/${locale}/about`}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                            >
                                About
                            </Link>
                            <Link
                                href={`/${locale}/projects`}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                            >
                                Projects
                            </Link>
                            <Link
                                href={`/${locale}/blog`}
                                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                            >
                                Blog
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
