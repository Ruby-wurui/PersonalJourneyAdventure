import { getDictionary, type Locale } from '@/i18n'

export default async function TestDictPage({
    params: { locale }
}: {
    params: { locale: Locale }
}) {
    const dict = await getDictionary(locale)

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-3xl mb-4">Dictionary Test</h1>
            <div className="space-y-4">
                <div>
                    <strong>Locale:</strong> {locale}
                </div>
                <div>
                    <strong>Dict loaded:</strong> {dict ? 'Yes' : 'No'}
                </div>
                <div>
                    <strong>Homepage exists:</strong> {dict?.homepage ? 'Yes' : 'No'}
                </div>
                {/* <div>
                    <strong>Homepage.welcome:</strong> {dict?.homepage?.welcome || 'undefined'}
                </div> */}
                <div>
                    <strong>Nav.home:</strong> {dict?.nav?.home || 'undefined'}
                </div>
                <div className="mt-8">
                    <h2 className="text-xl mb-2">Full Dict:</h2>
                    <pre className="bg-gray-800 p-4 rounded overflow-auto">
                        {JSON.stringify(dict, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    )
}
