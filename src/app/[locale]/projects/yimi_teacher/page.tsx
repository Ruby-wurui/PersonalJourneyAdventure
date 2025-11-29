import { getDictionary } from '@/i18n'
import YiMiTeacherPageClient from './YiMiTeacherPageClient'

export default async function YiMiTeacherProjectPage({ params: { locale } }: { params: { locale: string } }) {
    const dict = await getDictionary(locale as any)

    return <YiMiTeacherPageClient locale={locale} dict={dict} />
}
