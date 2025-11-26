import { getDictionary } from '@/i18n'
import YueluoPageClient from './YueluoPageClient'

export default async function YueluoProjectPage({ params: { locale } }: { params: { locale: string } }) {
    const dict = await getDictionary(locale as any)

    return <YueluoPageClient locale={locale} dict={dict} />
}
