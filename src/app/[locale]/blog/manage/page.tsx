import { getDictionary } from '@/i18n/get-dictionary'

export default async function BlogManagePage({
    params: { locale }
}: {
    params: { locale: 'en' | 'zh' }
}) {
    const dict = await getDictionary(locale)

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
            <div className="container mx-auto px-4 py-20">
                <h1 className="text-4xl font-bold mb-8">
                    {dict.blog?.manage || 'Manage Blog Posts'}
                </h1>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
                    <p className="text-gray-300 mb-4">
                        {dict.blog?.edit_organize || 'Edit and organize your blog posts here.'}
                    </p>
                    {/* Add your blog management UI here */}
                </div>
            </div>
        </div>
    )
}
