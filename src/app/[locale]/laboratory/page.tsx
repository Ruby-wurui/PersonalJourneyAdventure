import { getDictionary, type Locale } from '@/i18n'
import InteractiveHomepageWrapper from '@/components/InteractiveHomepageWrapper'

export default async function LaboratoryPage({
    params: { locale }
}: {
    params: { locale: Locale }
}) {
    const dict = await getDictionary(locale)

    return <InteractiveHomepageWrapper locale={locale} dict={dict} />
}
