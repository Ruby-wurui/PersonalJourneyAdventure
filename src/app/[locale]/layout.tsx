import type { Metadata } from 'next'
import { AuthProvider } from '@/lib/auth-context'
import { locales, type Locale } from '@/i18n/config'
import '../globals.css'

export const metadata: Metadata = {
    title: 'Interactive Portfolio - Tech Adventure Journey',
    description: 'An immersive portfolio experience showcasing full-stack development skills through interactive 3D elements and real-time features.',
}

export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }))
}

import AiAssistantButton from '@/components/AiAssistantButton'

export default function RootLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode
    params: { locale: Locale }
}) {
    return (
        <html lang={locale}>
            <body className="font-sans">
                <AuthProvider>
                    {children}
                    <AiAssistantButton />
                </AuthProvider>
            </body>
        </html>
    )
}
