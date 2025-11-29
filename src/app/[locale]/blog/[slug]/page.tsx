import React from 'react'
import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'
import BlogPostDetailClient from './BlogPostDetailClient'

interface BlogPostDetailPageProps {
    params: {
        locale: Locale
        slug: string
    }
}

export default async function BlogPostDetailPage({ params: { locale, slug } }: BlogPostDetailPageProps) {
    const dict = await getDictionary(locale)

    return <BlogPostDetailClient dict={dict} slug={slug} />
}
