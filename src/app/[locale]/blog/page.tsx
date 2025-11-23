import React from 'react'
import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'
import BlogPageClient from './BlogPageClient'

interface BlogPageProps {
    params: {
        locale: Locale
    }
}

export default async function BlogPage({ params: { locale } }: BlogPageProps) {
    const dict = await getDictionary(locale)

    return <BlogPageClient dict={dict} />
}
