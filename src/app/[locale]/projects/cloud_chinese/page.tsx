import { getDictionary } from '@/i18n'
import CloudChinesePageClient from './CloudChinesePageClient'

export default async function CloudChineseProjectPage({ params: { locale } }: { params: { locale: string } }) {
    const dict = await getDictionary(locale as any)

    return <CloudChinesePageClient locale={locale} dict={dict} />
}
