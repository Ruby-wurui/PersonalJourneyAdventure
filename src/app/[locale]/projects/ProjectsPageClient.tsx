'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdventureMap } from '@/components/adventure-map/AdventureMap'
import { ProjectDetailModal } from '@/components/adventure-map/ProjectDetailModal'
import { AchievementSystem } from '@/components/adventure-map/AchievementSystem'
import { useAdventureMapStore } from '@/store/adventure-map'
import { ProjectIsland } from '@/types/adventure-map'
import NavigationBarI18n from '@/components/layout/NavigationBarI18n'
import { Dictionary } from '@/i18n/get-dictionary'
import { useAuth } from '@/lib/auth-context'
import { LoginModal } from '@/components/auth/LoginModal'

import { usePathname } from 'next/navigation'
import { Locale } from '@/i18n/config'

interface ProjectsPageClientProps {
  dict: Dictionary
}

const ProjectsPageClient: React.FC<ProjectsPageClientProps> = ({ dict }) => {
  const pathname = usePathname()
  const locale = pathname.split('/')[1] as Locale
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const { isAuthenticated, user, logout } = useAuth()

  const {
    islands,
    selectedIsland,
    hoveredIsland,
    isLoading: storeLoading,
    error,
    setSelectedIsland,
    setHoveredIsland,
    fetchIslands
  } = useAdventureMapStore()

  const handleLogin = () => setShowLoginModal(true)
  const handleRegister = () => setShowLoginModal(true)

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchIslands()
      } catch (error) {
        console.error('Failed to fetch islands:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [fetchIslands])

  const handleIslandClick = (island: ProjectIsland) => {
    setSelectedIsland(island)
    setShowModal(true)
  }

  const handleIslandHover = (island: ProjectIsland | null) => {
    setHoveredIsland(island)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedIsland(null)
  }

  const handleDemoLaunch = (island: ProjectIsland) => {
    console.log('Launching demo for:', island.name)
    // Demo launch is handled by the modal itself
  }

  const handleGithubClick = (island: ProjectIsland) => {
    if (island.githubUrl) {
      window.open(island.githubUrl, '_blank')
    }
  }

  const handleLiveUrlClick = (island: ProjectIsland) => {
    if (island.liveUrl) {
      window.open(island.liveUrl, '_blank')
    }
  }

  if (isLoading || storeLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            className="text-white text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading Adventure Map...
          </motion.p>
          <motion.p
            className="text-purple-300 text-sm mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Preparing interactive project showcase
          </motion.p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🚨</div>
          <h2 className="text-white text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-black overflow-hidden">
      {/* Navigation Bar */}
      <NavigationBarI18n
        locale={locale}
        dict={dict}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={logout}
      />

      {/* Page Header */}
      <motion.div
        className="relative z-10 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-pink-900/20 backdrop-blur-md border-b border-purple-500/20"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="container mx-auto px-6 py-0">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center animate-pulse">
                  <span className="text-3xl">🗺️</span>
                </div>
                <div>
                  <h4 className="text-2xl md:text-3xl font-bold text-white mb-1">
                    Project Map
                  </h4>
                  <p className="text-xl text-purple-300">
                    Explore my journey through enterprise-scale projects
                  </p>
                </div>
              </div>
              {/* <p className="text-gray-300 text-lg max-w-3xl">
                Explore my journey through enterprise-scale projects
              </p> */}
            </div>

            {/* <div className="flex flex-wrap gap-4">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30 min-w-[120px]">
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {islands.length}
                </div>
                <div className="text-blue-200 text-sm font-medium">
                  Major Projects
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 min-w-[120px]">
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {islands.filter(i => i.featured).length}
                </div>
                <div className="text-purple-200 text-sm font-medium">
                  Featured
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-4 border border-green-500/30 min-w-[120px]">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  7+
                </div>
                <div className="text-green-200 text-sm font-medium">
                  Years Exp
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </motion.div>

      {/* Instructions Panel */}
      {/* <motion.div
        className="absolute top-32 left-6 z-10 bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-black/40 backdrop-blur-md rounded-xl p-5 max-w-xs border border-purple-500/20 shadow-2xl shadow-purple-500/10"
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-lg">
          <span className="text-2xl">🧭</span>
          Navigation Guide
        </h3>
        <div className="space-y-3 text-sm text-gray-200">
          <div className="flex items-center gap-3 p-2 bg-blue-500/10 rounded-lg">
            <span className="text-blue-400 text-lg">🖱️</span>
            <span className="font-medium">Click islands to explore</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-green-500/10 rounded-lg">
            <span className="text-green-400 text-lg">🎮</span>
            <span className="font-medium">Try interactive demos</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-yellow-500/10 rounded-lg">
            <span className="text-yellow-400 text-lg">🏆</span>
            <span className="font-medium">Unlock achievements</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-purple-500/10 rounded-lg">
            <span className="text-purple-400 text-lg">🔍</span>
            <span className="font-medium">Drag to pan, scroll to zoom</span>
          </div>
        </div>
      </motion.div> */}

      {/* Adventure Map */}
      <motion.div
        className="absolute inset-0 pt-32"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <AdventureMap
          islands={islands}
          onIslandClick={handleIslandClick}
          onIslandHover={handleIslandHover}
          selectedIsland={selectedIsland}
          className="w-full h-full"
        />
      </motion.div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        island={selectedIsland}
        isOpen={showModal}
        onClose={handleCloseModal}
        onDemoLaunch={handleDemoLaunch}
        onGithubClick={handleGithubClick}
        onLiveUrlClick={handleLiveUrlClick}
      />

      {/* Achievement System */}
      <AchievementSystem />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Enhanced Stats Panel */}
      <motion.div
        className="absolute bottom-6 left-6 z-10 bg-gradient-to-br from-gray-900/90 via-purple-900/80 to-blue-900/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-500/30 shadow-2xl max-w-sm"
        style={{
          boxShadow: '0 0 60px rgba(168, 85, 247, 0.3), 0 20px 80px rgba(0,0,0,0.5)'
        }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <h3 className="text-white font-bold mb-4 flex items-center gap-3 text-xl">
          <span className="text-3xl">📊</span>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Portfolio Impact
          </span>
        </h3>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/20 to-blue-600/10 rounded-lg border border-blue-500/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏗️</span>
              <span className="text-gray-200 font-medium">Total Projects</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">{islands.length}</div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/20 to-green-600/10 rounded-lg border border-green-500/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <span className="text-gray-200 font-medium">Completed</span>
            </div>
            <div className="text-2xl font-bold text-green-400">
              {islands.filter(i => i.status === 'completed' || i.status === 'maintained').length}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/20 to-purple-600/10 rounded-lg border border-purple-500/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛠️</span>
              <span className="text-gray-200 font-medium">Tech Stack</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {new Set(islands.flatMap(i => i.techStack.map(t => t.name))).size}+
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 rounded-lg border border-yellow-500/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👥</span>
              <span className="text-gray-200 font-medium">Users Served</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">1000+</div>
          </div>
        </div>

        <div className="pt-4 border-t border-purple-500/20">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Achievement Score</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              🏆 Expert Level
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating particles background effect */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default ProjectsPageClient