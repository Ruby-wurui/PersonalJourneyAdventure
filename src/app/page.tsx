'use client'

import React, { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { SkillPlanet, ExperienceEntry } from '@/types/3d'
import PlanetDetailModal from '@/components/3d/PlanetDetailModal'
import Scene3DErrorBoundaryWrapper from '@/components/3d/Scene3DErrorBoundaryWrapper'
import NavigationBar from '@/components/layout/NavigationBar'
import { useAuth } from '@/lib/auth-context'
import { LoginModal } from '@/components/auth/LoginModal'
import RegisterModal from '@/components/auth/RegisterModal'

// Dynamically import 3D components to avoid SSR issues
const SimpleGalaxyVisualization = dynamic(
  () => import('@/components/3d/SimpleGalaxyVisualization'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-purple-900 via-blue-900 to-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading Galaxy...</p>
        </div>
      </div>
    )
  }
)

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth()
  const [selectedPlanet, setSelectedPlanet] = useState<SkillPlanet | null>(null)
  const [selectedExperience, setSelectedExperience] = useState<ExperienceEntry | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  // Skill planets data based on resume
  const skillPlanets: SkillPlanet[] = useMemo(() => [
    {
      id: 'frontend',
      name: 'Frontend Architecture',
      category: 'Web Development',
      position: [0, 0, 0],
      orbitRadius: 6,
      orbitSpeed: 0.5,
      size: 1.2,
      color: '#61dafb',
      proficiencyLevel: 95,
      description: 'Senior Frontend Architect with 10 years of experience. Architected and led the 0-to-1 development of large-scale enterprise cloud platform using Wujie-based micro-frontend architecture, successfully integrating over 12 subsystems for 1,000+ DAU.',
      technologies: ['Vue.js', 'VuePress', 'WebRTC', 'Socket.IO Client', 'Element UI', 'Micro-Frontend', 'Wujie'],
      experience: [
        {
          id: 'exp1',
          title: 'Micro-Frontend Architecture',
          company: 'Enterprise Company',
          duration: '2015-Present',
          description: 'Led 0-to-1 development of enterprise cloud platform with 12+ subsystems, 1,000+ DAU. Resolved monolithic application pain points including code bloat and team collaboration issues.',
          technologies: ['Wujie', 'Vue.js', 'Micro-Frontend'],
          startDate: new Date('2015-01-01')
        }
      ]
    },
    {
      id: 'backend',
      name: 'Backend & Full-Stack',
      category: 'Web Development',
      position: [0, 0, 0],
      orbitRadius: 8,
      orbitSpeed: 0.3,
      size: 1.0,
      color: '#68d391',
      proficiencyLevel: 90,
      description: 'Expert in full-stack real-time communication systems. Built backend using Node.js, Express, and Socket.IO for real-time events, with Sequelize (MySQL) for persistence and Redis for session caching. Deployed in cluster mode using PM2 for high availability.',
      technologies: ['Node.js', 'Express.js', 'Socket.IO', 'Sequelize ORM', 'PostgreSQL', 'MySQL', 'Redis'],
      experience: [
        {
          id: 'exp2',
          title: 'Full-Stack Real-Time Communication System',
          company: 'Enterprise Company',
          duration: '2015-Present',
          description: 'Developed full-stack real-time chat and co-browsing system. Ensured high availability and concurrency handling with PM2 cluster mode.',
          technologies: ['Node.js', 'Express', 'Socket.IO', 'MySQL', 'Redis', 'PM2'],
          startDate: new Date('2015-01-01')
        }
      ]
    },
    {
      id: 'devops',
      name: 'DevOps & Monorepo',
      category: 'Infrastructure',
      position: [0, 0, 0],
      orbitRadius: 10,
      orbitSpeed: 0.2,
      size: 0.9,
      color: '#ffd93d',
      proficiencyLevel: 88,
      description: 'Spearheaded enterprise-grade Monorepo (Turborepo) design, centralizing 3 core packages and 2 applications. Implemented Changeset for automated version management and established complete CI/CD pipeline using Jenkins.',
      technologies: ['Turborepo', 'Changeset', 'Jenkins', 'PM2', 'Microservices Architecture'],
      experience: [
        {
          id: 'exp3',
          title: 'Enterprise Component Library & Monorepo',
          company: 'Enterprise Company',
          duration: '2015-Present',
          description: 'Significantly improved team development efficiency and reduced cross-project maintenance costs. Automated workflow from development to deployment with VuePress and Storybook documentation.',
          technologies: ['Turborepo', 'Changeset', 'Jenkins', 'VuePress', 'Storybook'],
          startDate: new Date('2015-01-01')
        }
      ]
    },
    {
      id: 'ai-ml',
      name: 'AI & LLM Solutions',
      category: 'Artificial Intelligence',
      position: [0, 0, 0],
      orbitRadius: 12,
      orbitSpeed: 0.15,
      size: 1.1,
      color: '#ff6b6b',
      proficiencyLevel: 92,
      description: 'AI Solutions Specialist pioneering "Low-Code + LLM + AI Agent" solutions. Built intelligent workflows using Dify, RAG, and MCP. Applied advanced RAG techniques with vector databases and engineered AI Agents for multi-step automation.',
      technologies: ['ChatGPT', 'Gemini', 'Claude', 'Qwen', 'n8n', 'Dify', 'RAG', 'AI Agent', 'MCP', 'Vector Databases', 'Nomic-embed-text'],
      experience: [
        {
          id: 'exp4',
          title: 'AI Automation & RAG Implementation',
          company: 'Enterprise Company',
          duration: '2015-Present',
          description: 'Built low-code AI solution stack for secure workflow automation. Led development of intelligent Q&A system using Dify with RAG techniques. Designed automated transaction monitoring and intelligent voice assistant.',
          technologies: ['Dify', 'RAG', 'AI Agent', 'MCP', 'Vector DB'],
          startDate: new Date('2015-01-01')
        }
      ]
    },
    {
      id: 'mobile',
      name: 'AI-Assisted Development',
      category: 'Development Tools',
      position: [0, 0, 0],
      orbitRadius: 14,
      orbitSpeed: 0.1,
      size: 0.85,
      color: '#f093fb',
      proficiencyLevel: 93,
      description: 'Pioneered high-efficiency workflow (Cursor + Figma + MCP), drastically reducing design-to-delivery cycle. Leveraged AI-powered coding tools and advanced prompt engineering to enhance development speed and code quality.',
      technologies: ['Cursor', 'Windsurf', 'Kiro', 'Gemini Code', 'Prompt Engineering', 'Puppeteer', 'Playwright', 'Firecrawl'],
      experience: [
        {
          id: 'exp5',
          title: 'AI-Assisted Development & Workflow Optimization',
          company: 'Enterprise Company',
          duration: '2015-Present',
          description: 'Intelligently parsed designs into code with automated validation. Enhanced development speed, code quality, and refactoring processes using AI tools.',
          technologies: ['Cursor', 'Figma', 'MCP', 'AI Coding'],
          startDate: new Date('2015-01-01')
        }
      ]
    }
  ], [])

  // Mock experience data
  const experiences: ExperienceEntry[] = useMemo(() => [
    {
      id: 'exp1',
      title: 'Senior Frontend Developer',
      company: 'Tech Corp',
      duration: '2022-Present',
      description: 'Leading frontend development for enterprise applications with React and TypeScript.',
      technologies: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
      startDate: new Date('2022-01-01')
    },
    {
      id: 'exp2',
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      duration: '2020-2022',
      description: 'Built scalable web applications and RESTful APIs using modern technologies.',
      technologies: ['Node.js', 'React', 'MongoDB', 'Express'],
      startDate: new Date('2020-01-01'),
      endDate: new Date('2022-01-01')
    },
    {
      id: 'exp3',
      title: 'Junior Developer',
      company: 'WebDev Agency',
      duration: '2019-2020',
      description: 'Developed responsive websites and learned modern web development practices.',
      technologies: ['HTML', 'CSS', 'JavaScript', 'PHP'],
      startDate: new Date('2019-01-01'),
      endDate: new Date('2020-01-01')
    }
  ], [])

  const handlePlanetSelect = (planet: SkillPlanet) => {
    setSelectedPlanet(planet)
  }

  const handleExperienceSelect = (experience: ExperienceEntry) => {
    setSelectedExperience(experience)
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black overflow-hidden">
      {/* Navigation Bar */}
      <NavigationBar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogin={() => setShowLoginModal(true)}
        onRegister={() => setShowRegisterModal(true)}
        onLogout={logout}
      />

      {/* Background stars effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="stars-small"></div>
        <div className="stars-medium"></div>
        <div className="stars-large"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          {/* <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            🌌 Welcome to My Universe
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-2">
            Explore my skills and experience through an interactive 3D galaxy
          </p> */}
          {/* <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Click on planets to discover technologies, drag to rotate, and zoom to explore
          </p> */}
        </div>

        {/* Galaxy Visualization */}
        <div className="h-[70vh] relative mb-8">
          <Scene3DErrorBoundaryWrapper
            fallback={
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-purple-900 via-blue-900 to-black rounded-lg">
                <div className="text-center text-white p-6">
                  <div className="text-6xl mb-4">🪐</div>
                  <h2 className="text-2xl font-bold mb-4">Personal Universe</h2>
                  <p className="text-gray-300 mb-6">3D visualization is not available on this device</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
                    {skillPlanets.map(planet => (
                      <div
                        key={planet.id}
                        className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
                        onClick={() => handlePlanetSelect(planet)}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: planet.color }}
                          />
                          <h3 className="font-semibold text-white">{planet.name}</h3>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{planet.category}</p>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${planet.proficiencyLevel}%`,
                              backgroundColor: planet.color
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{planet.proficiencyLevel}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
          >
            <SimpleGalaxyVisualization
              skillPlanets={skillPlanets}
              experiences={experiences}
              onPlanetSelect={handlePlanetSelect}
              onExperienceSelect={handleExperienceSelect}
              autoRotate={true}
            />
          </Scene3DErrorBoundaryWrapper>
        </div>

        {/* Instructions */}
        {/* <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">How to Navigate</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-gray-300">Click planets to explore skills in detail</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <span className="text-gray-300">Drag to rotate and zoom the galaxy</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-300">Experience timeline orbits around the center</span>
            </div>
          </div>
        </div> */}
      </div>

      {/* Planet Detail Modal */}
      <PlanetDetailModal
        planet={selectedPlanet}
        isOpen={!!selectedPlanet}
        onClose={() => setSelectedPlanet(null)}
      />

      {/* Experience Detail Modal */}
      {selectedExperience && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-6 max-w-2xl w-full mx-4 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedExperience.title}</h2>
              <button
                onClick={() => setSelectedExperience(null)}
                className="text-gray-400 hover:text-white text-xl transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedExperience.company}</h3>
                <p className="text-gray-400">{selectedExperience.duration}</p>
              </div>
              <p className="text-gray-300">{selectedExperience.description}</p>
              <div>
                <h4 className="font-medium text-white mb-2">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedExperience.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false)
          setShowRegisterModal(true)
        }}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false)
          setShowLoginModal(true)
        }}
      />
    </div>
  )
}
