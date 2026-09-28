import { getDictionary } from '@/i18n'
import { Locale } from '@/i18n/config'
import LingoSlicePageClient from './LingoSlicePageClient'

export default async function LingoSliceProjectPage({
    params: { locale },
}: {
    params: { locale: string }
}) {
    const currentLocale = locale as Locale
    const dict = await getDictionary(currentLocale)

    return <LingoSlicePageClient locale={currentLocale} dict={dict} />
}
