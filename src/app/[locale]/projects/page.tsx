import { getDictionary, type Locale } from '@/i18n'
import ProjectsPageClient from './ProjectsPageClient'

export default async function ProjectsPage({
    params: { locale }
}: {
    params: { locale: Locale }
}) {
    const dict = await getDictionary(locale)

    return <ProjectsPageClient locale={locale} dict={dict} />
}
