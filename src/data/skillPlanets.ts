import { SkillPlanet, ExperienceEntry } from '@/types/3d'

export const skillPlanetsData: SkillPlanet[] = [
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
]

export const experiencesData: ExperienceEntry[] = [
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
]
