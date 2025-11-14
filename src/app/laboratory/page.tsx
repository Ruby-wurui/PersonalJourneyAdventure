import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default function LaboratoryPage() {
    const cookieStore = cookies()
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'
    redirect(`/${locale}/laboratory`)
}
