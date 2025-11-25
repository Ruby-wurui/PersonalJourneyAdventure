import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'
import SkillsPageClient from './SkillsPageClient'

export default async function SkillsPage({
    params: { locale }
}: {
    params: { locale: Locale }
}) {
    const dict = await getDictionary(locale)

    return <SkillsPageClient dict={dict} />
}
