import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ProjectIsland, UserProgress, Achievement } from '@/types/adventure-map'

interface AdventureMapState {
    // Current state
    selectedIsland: ProjectIsland | null
    hoveredIsland: ProjectIsland | null
    islands: ProjectIsland[]
    isLoading: boolean
    error: string | null

    // User progress
    userProgress: UserProgress

    // Actions
    setSelectedIsland: (island: ProjectIsland | null) => void
    setHoveredIsland: (island: ProjectIsland | null) => void
    setIslands: (islands: ProjectIsland[]) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void

    // Progress actions
    visitIsland: (islandId: string) => void
    completeDemo: (islandId: string) => void
    unlockAchievement: (achievement: Achievement) => void
    incrementInteraction: () => void

    // Data fetching
    fetchIslands: () => Promise<void>

    // Reset
    reset: () => void
}

const initialUserProgress: UserProgress = {
    unlockedAchievements: [],
    totalPoints: 0,
    visitedIslands: [],
    completedDemos: [],
    interactionCount: 0
}

export const useAdventureMapStore = create<AdventureMapState>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial state
                selectedIsland: null,
                hoveredIsland: null,
                islands: [],
                isLoading: false,
                error: null,
                userProgress: initialUserProgress,

                // Basic actions
                setSelectedIsland: (island) => set({ selectedIsland: island }),
                setHoveredIsland: (island) => set({ hoveredIsland: island }),
                setIslands: (islands) => set({ islands }),
                setLoading: (loading) => set({ isLoading: loading }),
                setError: (error) => set({ error }),

                // Progress actions
                visitIsland: (islandId) => {
                    const { userProgress } = get()
                    if (!userProgress.visitedIslands.includes(islandId)) {
                        set({
                            userProgress: {
                                ...userProgress,
                                visitedIslands: [...userProgress.visitedIslands, islandId],
                                totalPoints: userProgress.totalPoints + 5
                            }
                        })
                    }
                },

                completeDemo: (islandId) => {
                    const { userProgress } = get()
                    if (!userProgress.completedDemos.includes(islandId)) {
                        set({
                            userProgress: {
                                ...userProgress,
                                completedDemos: [...userProgress.completedDemos, islandId],
                                totalPoints: userProgress.totalPoints + 15
                            }
                        })
                    }
                },

                unlockAchievement: (achievement) => {
                    const { userProgress } = get()
                    if (!userProgress.unlockedAchievements.includes(achievement.id)) {
                        set({
                            userProgress: {
                                ...userProgress,
                                unlockedAchievements: [...userProgress.unlockedAchievements, achievement.id],
                                totalPoints: userProgress.totalPoints + achievement.points
                            }
                        })
                    }
                },

                incrementInteraction: () => {
                    const { userProgress } = get()
                    set({
                        userProgress: {
                            ...userProgress,
                            interactionCount: userProgress.interactionCount + 1
                        }
                    })
                },

                // Data fetching
                fetchIslands: async () => {
                    set({ isLoading: true, error: null })

                    try {
                        const response = await fetch('/api/projects/map/islands')

                        if (!response.ok) {
                            throw new Error(`Failed to fetch islands: ${response.statusText}`)
                        }

                        const data = await response.json()

                        if (data.success) {
                            // Transform backend data to frontend format
                            const islands: ProjectIsland[] = data.data.map((island: any) => ({
                                id: island.id,
                                name: island.name,
                                description: island.description,
                                shortDescription: island.shortDescription,
                                position: island.position || {
                                    x: Math.random() * 10 - 5, // Random position if not set
                                    y: Math.random() * 10 - 5,
                                    size: island.size || 'medium',
                                    theme: island.theme || 'tropical'
                                },
                                techStack: island.techStack || [],
                                category: island.category,
                                status: island.status,
                                githubUrl: island.githubUrl,
                                liveUrl: island.liveUrl,
                                demoUrl: island.demoUrl,
                                featured: island.featured || false,
                                color: island.color || '#00f5ff',
                                metrics: island.metrics,
                                demoConfig: island.demoConfig,
                                achievements: island.achievements || []
                            }))

                            set({ islands, isLoading: false })
                        } else {
                            throw new Error(data.error || 'Failed to fetch islands')
                        }
                    } catch (error) {
                        console.error('Error fetching islands:', error)
                        set({
                            error: error instanceof Error ? error.message : 'Unknown error occurred',
                            isLoading: false
                        })

                        // Set real project data based on Ruby's experience
                        const fallbackIslands: ProjectIsland[] = [
                            {
                                id: 'micro-frontend-platform',
                                name: 'Enterprise Cloud Platform',
                                description: 'Architected and led 0-to-1 development of large-scale enterprise cloud platform using Wujie-based micro-frontend architecture. Successfully integrated 12+ subsystems with 1,000+ DAU and tens of thousands of total users. Resolved critical pain points of monolithic application including code bloat and team collaboration issues.',
                                shortDescription: 'Micro-frontend architecture with 12+ subsystems',
                                position: { x: 0, y: 0, size: 'large', theme: 'tech' },
                                techStack: [
                                    { name: 'Vue.js', category: 'frontend', proficiency: 'expert', color: '#42b883' },
                                    { name: 'Wujie', category: 'frontend', proficiency: 'expert', color: '#00d8ff' },
                                    { name: 'Micro-Frontend', category: 'frontend', proficiency: 'expert', color: '#ff6b6b' },
                                    { name: 'VuePress', category: 'frontend', proficiency: 'advanced', color: '#3eaf7c' }
                                ],
                                category: 'Enterprise Platform',
                                status: 'maintained',
                                featured: true,
                                color: '#00d8ff',
                                metrics: {
                                    githubStars: 0,
                                    githubForks: 0,
                                    githubWatchers: 0,
                                    commits: 500,
                                    contributors: 8,
                                    linesOfCode: 50000,
                                    deploymentStatus: 'deployed',
                                    uptime: 99.9,
                                    performanceScore: 95
                                }
                            },
                            {
                                id: 'monorepo-component-library',
                                name: 'Enterprise Component Library',
                                description: 'Spearheaded design and implementation of enterprise-grade Monorepo (Turborepo), centralizing 3 core packages and 2 applications. Significantly improved team development efficiency and reduced cross-project maintenance costs. Implemented Changeset for automated version management, changelog generation, and npm publishing. Established complete CI/CD pipeline using Jenkins.',
                                shortDescription: 'Monorepo with Turborepo & automated CI/CD',
                                position: { x: 4, y: -2, size: 'large', theme: 'tech' },
                                techStack: [
                                    { name: 'Turborepo', category: 'devops', proficiency: 'expert', color: '#ef4444' },
                                    { name: 'Changeset', category: 'devops', proficiency: 'expert', color: '#8b5cf6' },
                                    { name: 'Jenkins', category: 'devops', proficiency: 'advanced', color: '#d24939' },
                                    { name: 'Storybook', category: 'frontend', proficiency: 'advanced', color: '#ff4785' },
                                    { name: 'Element UI', category: 'frontend', proficiency: 'expert', color: '#409eff' }
                                ],
                                category: 'DevOps & Infrastructure',
                                status: 'maintained',
                                featured: true,
                                color: '#ef4444',
                                metrics: {
                                    githubStars: 0,
                                    githubForks: 0,
                                    githubWatchers: 0,
                                    commits: 300,
                                    contributors: 5,
                                    linesOfCode: 25000,
                                    deploymentStatus: 'deployed',
                                    uptime: 99.5,
                                    performanceScore: 93
                                }
                            },
                            {
                                id: 'ai-automation-rag',
                                name: 'AI Automation & RAG System',
                                description: 'Built and championed low-code AI solution stack (N8n, LLMs, AI Agents, MCP) for secure, on-premise workflow automation. Led development of intelligent Q&A system using Dify with RAG techniques. Applied advanced RAG by vectorizing documents into vector database, dynamically feeding context to LLMs. Engineered AI Agents for multi-step, cross-system automation.',
                                shortDescription: 'AI-powered automation with RAG & vector DB',
                                position: { x: -4, y: 2, size: 'large', theme: 'mystical' },
                                techStack: [
                                    { name: 'Dify', category: 'ai-ml', proficiency: 'expert', color: '#ff6b6b' },
                                    { name: 'n8n', category: 'ai-ml', proficiency: 'expert', color: '#ea4b71' },
                                    { name: 'RAG', category: 'ai-ml', proficiency: 'expert', color: '#8b5cf6' },
                                    { name: 'Vector DB', category: 'ai-ml', proficiency: 'advanced', color: '#06d6a0' },
                                    { name: 'ChatGPT', category: 'ai-ml', proficiency: 'expert', color: '#10a37f' },
                                    { name: 'Claude', category: 'ai-ml', proficiency: 'expert', color: '#d97706' }
                                ],
                                category: 'AI & Machine Learning',
                                status: 'maintained',
                                featured: true,
                                color: '#8b5cf6',
                                metrics: {
                                    githubStars: 0,
                                    githubForks: 0,
                                    githubWatchers: 0,
                                    commits: 250,
                                    contributors: 3,
                                    linesOfCode: 15000,
                                    deploymentStatus: 'deployed',
                                    uptime: 99.7,
                                    performanceScore: 91
                                }
                            },
                            {
                                id: 'realtime-communication',
                                name: 'Real-Time Communication System',
                                description: 'Developed full-stack real-time chat and co-browsing system, extending existing screen-sharing service. Built backend using Node.js, Express, and Socket.IO for real-time events, with Sequelize (MySQL) for persistence and Redis for session caching. Ensured high availability and concurrency handling by deploying in cluster mode using PM2.',
                                shortDescription: 'Real-time chat with WebRTC & Socket.IO',
                                position: { x: 2, y: 4, size: 'medium', theme: 'tech' },
                                techStack: [
                                    { name: 'Node.js', category: 'backend', proficiency: 'expert', color: '#339933' },
                                    { name: 'Socket.IO', category: 'backend', proficiency: 'expert', color: '#010101' },
                                    { name: 'WebRTC', category: 'frontend', proficiency: 'advanced', color: '#333333' },
                                    { name: 'Express.js', category: 'backend', proficiency: 'expert', color: '#000000' },
                                    { name: 'MySQL', category: 'database', proficiency: 'advanced', color: '#4479a1' },
                                    { name: 'Redis', category: 'database', proficiency: 'advanced', color: '#dc382d' },
                                    { name: 'PM2', category: 'devops', proficiency: 'advanced', color: '#2b037a' }
                                ],
                                category: 'Real-Time Systems',
                                status: 'completed',
                                featured: true,
                                color: '#339933',
                                metrics: {
                                    githubStars: 0,
                                    githubForks: 0,
                                    githubWatchers: 0,
                                    commits: 200,
                                    contributors: 2,
                                    linesOfCode: 12000,
                                    deploymentStatus: 'deployed',
                                    uptime: 99.8,
                                    performanceScore: 94
                                }
                            },
                            {
                                id: 'ai-assisted-development',
                                name: 'AI-Assisted Development Workflow',
                                description: 'Pioneered high-efficiency workflow (Cursor + Figma + MCP), drastically reducing design-to-delivery cycle. Intelligently parsed designs into code with automated validation. Leveraged AI-powered coding tools and advanced prompt engineering to enhance development speed, code quality, and refactoring processes.',
                                shortDescription: 'AI-powered development with Cursor & MCP',
                                position: { x: -2, y: -4, size: 'medium', theme: 'mystical' },
                                techStack: [
                                    { name: 'Cursor', category: 'ai-ml', proficiency: 'expert', color: '#000000' },
                                    { name: 'Windsurf', category: 'ai-ml', proficiency: 'expert', color: '#06d6a0' },
                                    { name: 'Kiro', category: 'ai-ml', proficiency: 'expert', color: '#3b82f6' },
                                    { name: 'MCP', category: 'ai-ml', proficiency: 'expert', color: '#8b5cf6' },
                                    { name: 'Figma', category: 'other', proficiency: 'advanced', color: '#f24e1e' }
                                ],
                                category: 'Development Tools',
                                status: 'maintained',
                                featured: false,
                                color: '#06d6a0'
                            },
                            {
                                id: 'frontend-monitoring-sdk',
                                name: 'Frontend Monitoring SDK',
                                description: 'Developed custom in-house frontend monitoring SDK for error tracking and performance analysis. Implemented non-intrusive logging using Babel for automated code instrumentation. Integrated user behavior analytics, including session recording/replay and heatmaps.',
                                shortDescription: 'Custom monitoring SDK with session replay',
                                position: { x: 4, y: 3, size: 'medium', theme: 'tech' },
                                techStack: [
                                    { name: 'Babel', category: 'frontend', proficiency: 'advanced', color: '#f9dc3e' },
                                    { name: 'TypeScript', category: 'frontend', proficiency: 'expert', color: '#3178c6' },
                                    { name: 'Puppeteer', category: 'other', proficiency: 'advanced', color: '#40b5a4' },
                                    { name: 'Playwright', category: 'other', proficiency: 'advanced', color: '#2ead33' }
                                ],
                                category: 'Monitoring & Analytics',
                                status: 'completed',
                                featured: false,
                                color: '#f9dc3e'
                            },
                            {
                                id: 'ai-voice-assistant',
                                name: 'Intelligent Voice Assistant',
                                description: 'Developed intelligent voice assistant (Dify + AI Agent + MCP) to automate customer intake and data submission. Provides 24/7 service and significantly reduced manual customer service workload. Integrated with core business systems for seamless data flow.',
                                shortDescription: '24/7 AI voice assistant with automation',
                                position: { x: -4, y: -2, size: 'small', theme: 'mystical' },
                                techStack: [
                                    { name: 'Dify', category: 'ai-ml', proficiency: 'expert', color: '#ff6b6b' },
                                    { name: 'AI Agent', category: 'ai-ml', proficiency: 'expert', color: '#8b5cf6' },
                                    { name: 'MCP', category: 'ai-ml', proficiency: 'expert', color: '#06d6a0' }
                                ],
                                category: 'AI Solutions',
                                status: 'completed',
                                featured: false,
                                color: '#ff6b6b'
                            }
                        ]

                        set({ islands: fallbackIslands })
                    }
                },

                // Reset
                reset: () => set({
                    selectedIsland: null,
                    hoveredIsland: null,
                    islands: [],
                    isLoading: false,
                    error: null,
                    userProgress: initialUserProgress
                })
            }),
            {
                name: 'adventure-map-storage',
                partialize: (state) => ({
                    userProgress: state.userProgress
                })
            }
        ),
        { name: 'adventure-map-store' }
    )
)