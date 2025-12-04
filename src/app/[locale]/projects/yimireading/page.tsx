import { getDictionary } from '@/i18n'
import YiMiReadingPageClient from '@/app/[locale]/projects/yimireading/YiMiReadingPageClient'

export default async function YiMiReadingProjectPage({ params: { locale } }: { params: { locale: string } }) {
    const dict = await getDictionary(locale as any)

    return <YiMiReadingPageClient locale={locale} dict={dict} />
}
