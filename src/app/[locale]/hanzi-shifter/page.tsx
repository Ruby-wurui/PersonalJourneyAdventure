import { Metadata } from 'next';
import HanziShifterClient from './HanziShifterClient';
import { getDictionary } from '@/i18n/get-dictionary';
import { Locale } from '@/i18n/config';

export const metadata: Metadata = {
    title: 'HanziShifter Game',
    description: 'An interactive Chinese character learning game',
};

export default async function HanziShifterPage({
    params,
}: {
    params: { locale: Locale };
}) {
    const dict = await getDictionary(params.locale);

    return <HanziShifterClient dict={dict} locale={params.locale} />;
}
