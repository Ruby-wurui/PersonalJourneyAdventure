import React from 'react'
import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'
import ProjectsPageClient from './ProjectsPageClient'

interface ProjectsPageProps {
    params: {
        locale: Locale
    }
}

export default async function ProjectsPage({ params: { locale } }: ProjectsPageProps) {
    const dict = await getDictionary(locale)

    return <ProjectsPageClient dict={dict} />
}
