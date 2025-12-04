import { getDictionary } from '@/i18n/get-dictionary';
import { Locale } from '@/i18n/config';
import AINewsClient from './AINewsClient';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
    const dict = await getDictionary(locale);
    return {
        title: `AI News | ${dict.brand.title}`,
        description: 'Latest AI news and tools aggregated from top communities.',
    };
}

export default async function AINewsPage({ params: { locale } }: { params: { locale: Locale } }) {
    const dict = await getDictionary(locale);

    return <AINewsClient dict={dict} locale={locale} />;
}
