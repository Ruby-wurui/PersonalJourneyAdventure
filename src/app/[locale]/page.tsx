import { getDictionary, type Locale } from '@/i18n'
import GalaxyUniverseWrapper from '@/components/GalaxyUniverseWrapper'

export default async function UniversePage({
    params: { locale }
}: {
    params: { locale: Locale }
}) {
    const dict = await getDictionary(locale)

    return <GalaxyUniverseWrapper locale={locale} dict={dict} />
}
