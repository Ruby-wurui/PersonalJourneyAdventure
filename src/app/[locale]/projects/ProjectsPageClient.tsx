'use client'

import React from 'react'
import { motion } from 'framer-motion'
import NavigationBarI18n from '@/components/layout/NavigationBarI18n'
import { useAuth } from '@/lib/auth-context'
import { LoginModal } from '@/components/auth/LoginModal'
import RegisterModal from '@/components/auth/RegisterModal'
import { Dictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'
import InteractiveGridBackground from '@/components/ui/InteractiveGridBackground'
import ProjectCard from '@/components/ui/ProjectCard'
import { getProjectsData, getProjectsPageContent } from '@/data/projects.i18n'

interface ProjectsPageClientProps {
  locale: Locale
  dict: Dictionary
}

export default function ProjectsPageClient({ locale, dict }: ProjectsPageClientProps) {
  const { isAuthenticated, user, logout } = useAuth()
  const [showLoginModal, setShowLoginModal] = React.useState(false)
  const [showRegisterModal, setShowRegisterModal] = React.useState(false)

  const projects = getProjectsData(locale)
  const pageContent = getProjectsPageContent(locale)

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden relative">
      <InteractiveGridBackground />

      <NavigationBarI18n
        locale={locale}
        dict={dict}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogin={() => setShowLoginModal(true)}
        onRegister={() => setShowRegisterModal(true)}
        onLogout={logout}
      />

      <main className="relative pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            {pageContent.title}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            {pageContent.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:gap-12">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              image={project.image}
              tags={project.tags}
              link={project.link}
            />
          ))}
        </div>
      </main>

      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}

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
    </div>
  )
}