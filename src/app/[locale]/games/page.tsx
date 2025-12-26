import React from 'react'
import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'
import GamesPageClient from './GamesPageClient'

interface GamesPageProps {
    params: {
        locale: Locale
    }
}

export default async function GamesPage({ params: { locale } }: GamesPageProps) {
    const dict = await getDictionary(locale)

    return <GamesPageClient dict={dict} locale={locale} />
}
