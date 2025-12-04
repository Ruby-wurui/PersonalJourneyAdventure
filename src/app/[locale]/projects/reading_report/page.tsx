import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'
import ReadingReportPageClient from './ReadingReportPageClient'

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
    const dict = await getDictionary(locale)
    return {
        title: `${dict.projects.reading_report.title} | Ruby's Portfolio`,
        description: dict.projects.reading_report.description,
    }
}

export default async function ReadingReportPage({
    params: { locale },
}: {
    params: { locale: Locale }
}) {
    const dict = await getDictionary(locale)

    return <ReadingReportPageClient locale={locale} dict={dict} />
}
