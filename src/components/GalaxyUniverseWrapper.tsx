'use client'

import { Suspense, useState } from 'react'
import dynamic from 'next/dynamic'
import NavigationBarI18n from '@/components/layout/NavigationBarI18n'
import { useAuth } from '@/lib/auth-context'
import { LoginModal } from '@/components/auth/LoginModal'
import RegisterModal from '@/components/auth/RegisterModal'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/get-dictionary'
import type { SkillPlanet } from '@/types/3d'
import { skillPlanetsData, experiencesData } from '@/data/skillPlanets'
import PlanetDetailModal from '@/components/3d/PlanetDetailModal'

const SimpleGalaxyVisualization = dynamic(
    () => import('@/components/3d/SimpleGalaxyVisualization'),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black">
                <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p>Loading Universe...</p>
                </div>
            </div>
        )
    }
)

interface GalaxyUniverseWrapperProps {
    locale: Locale
    dict: Dictionary
}

export default function GalaxyUniverseWrapper({ locale, dict }: GalaxyUniverseWrapperProps) {
    const { isAuthenticated, user, logout } = useAuth()
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showRegisterModal, setShowRegisterModal] = useState(false)
    const [selectedPlanet, setSelectedPlanet] = useState<SkillPlanet | null>(null)
    const [showPlanetModal, setShowPlanetModal] = useState(false)

    if (!dict) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black">
                <div className="text-white text-center">
                    <div className="text-2xl mb-4">⚠️</div>
                    <p>Error: Translations not loaded</p>
                </div>
            </div>
        )
    }

    const handleSkillClick = (skill: SkillPlanet) => {
        console.log('Skill clicked:', skill)
        setSelectedPlanet(skill)
        setShowPlanetModal(true)
    }

    return (
        <div className="relative w-full min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black overflow-hidden">
            {/* Navigation Bar */}
            <NavigationBarI18n
                locale={locale}
                dict={dict}
                isAuthenticated={isAuthenticated}
                user={user}
                onLogin={() => setShowLoginModal(true)}
                onRegister={() => setShowRegisterModal(true)}
                onLogout={logout}
            />

            {/* Galaxy Visualization - Full Screen */}
            <div className="absolute inset-0 pt-20">
                <Suspense
                    fallback={
                        <div className="flex items-center justify-center h-full">
                            <div className="text-white text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                                <p>{dict.universe.loading_galaxy}</p>
                            </div>
                        </div>
                    }
                >
                    <SimpleGalaxyVisualization
                        skillPlanets={skillPlanetsData}
                        experiences={experiencesData}
                        onPlanetSelect={handleSkillClick}
                        onExperienceSelect={() => { }}
                    />
                </Suspense>
            </div>

            {/* Welcome Overlay */}
            <div className="absolute bottom-0 md:bottom-0 left-1/2 transform -translate-x-1/2 z-50 text-center w-[90%] md:w-auto max-w-4xl">
                <div className="bg-black/50 backdrop-blur-md px-4 py-3 md:px-8 md:py-0 rounded-2xl border border-purple-500/30">
                    {/* <h1 className="text-2xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-1 md:mb-2">
                        {dict.universe.welcome}
                    </h1> */}
                    {/* <p className="text-gray-300 text-xs md:text-base">
                        {dict.universe.subtitle}
                    </p> */}
                </div>
            </div>

            {/* Login Modal */}
            {showLoginModal && (
                <LoginModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                />
            )}

            {/* Register Modal */}
            {showRegisterModal && (
                <RegisterModal
                    isOpen={showRegisterModal}
                    onClose={() => setShowRegisterModal(false)}
                    onSwitchToLogin={() => {
                        setShowRegisterModal(false)
                        setShowLoginModal(true)
                    }}
                />
            )}

            {/* Planet Detail Modal */}
            <PlanetDetailModal
                planet={selectedPlanet}
                isOpen={showPlanetModal}
                onClose={() => {
                    setShowPlanetModal(false)
                    setSelectedPlanet(null)
                }}
            />
        </div>
    )
}
