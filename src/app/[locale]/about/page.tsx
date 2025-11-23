import React from 'react'
import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'
import AboutPageClient from './AboutPageClient'

interface AboutPageProps {
    params: {
        locale: Locale
    }
}

export default async function AboutPage({ params: { locale } }: AboutPageProps) {
    const dict = await getDictionary(locale)

    return <AboutPageClient dict={dict} />
}
