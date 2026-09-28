import { getDictionary } from '@/i18n'
import { Locale } from '@/i18n/config'
import IWritingPageClient from './IWritingPageClient'

export default async function IWritingProjectPage({
    params: { locale },
}: {
    params: { locale: string }
}) {
    const currentLocale = locale as Locale
    const dict = await getDictionary(currentLocale)

    return <IWritingPageClient locale={currentLocale} dict={dict} />
}
