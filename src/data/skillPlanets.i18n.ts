import { SkillPlanet, ExperienceEntry } from '@/types/3d'

// Skill Planets Data with i18n support
export const getSkillPlanetsData = (locale: 'en' | 'zh'): SkillPlanet[] => {
    const translations = {
        en: {
            frontend: {
                name: 'Frontend Architecture',
                category: 'Web Development',
                description: 'Senior Frontend Architect with 10 years of experience. Architected and led the 0-to-1 development of large-scale enterprise cloud platform using Wujie-based micro-frontend architecture, successfully integrating over 12 subsystems for 1,000+ DAU.',
                experience: {
                    title: 'Micro-Frontend Architecture',
                    company: 'Enterprise Company',
                    duration: '2015-Present',
                    description: 'Led 0-to-1 development of enterprise cloud platform with 12+ subsystems, 1,000+ DAU. Resolved monolithic application pain points including code bloat and team collaboration issues.'
                }
            },
            backend: {
                name: 'Backend & Full-Stack',
                category: 'Web Development',
                description: 'Expert in full-stack real-time communication systems. Built backend using Node.js, Express, and Socket.IO for real-time events, with Sequelize (MySQL) for persistence and Redis for session caching. Deployed in cluster mode using PM2 for high availability.',
                experience: {
                    title: 'Full-Stack Real-Time Communication System',
                    company: 'Enterprise Company',
                    duration: '2015-Present',
                    description: 'Developed full-stack real-time chat and co-browsing system. Ensured high availability and concurrency handling with PM2 cluster mode.'
                }
            },
            devops: {
                name: 'DevOps & Monorepo',
                category: 'Infrastructure',
                description: 'Spearheaded enterprise-grade Monorepo (Turborepo) design, centralizing 3 core packages and 2 applications. Implemented Changeset for automated version management and established complete CI/CD pipeline using Jenkins.',
                experience: {
                    title: 'Enterprise Component Library & Monorepo',
                    company: 'Enterprise Company',
                    duration: '2015-Present',
                    description: 'Significantly improved team development efficiency and reduced cross-project maintenance costs. Automated workflow from development to deployment with VuePress and Storybook documentation.'
                }
            },
            aiml: {
                name: 'AI & LLM Solutions',
                category: 'Artificial Intelligence',
                description: 'AI Solutions Specialist pioneering "Low-Code + LLM + AI Agent" solutions. Built intelligent workflows using Dify, RAG, and MCP. Applied advanced RAG techniques with vector databases and engineered AI Agents for multi-step automation.',
                experience: {
                    title: 'AI Automation & RAG Implementation',
                    company: 'Enterprise Company',
                    duration: '2015-Present',
                    description: 'Built low-code AI solution stack for secure workflow automation. Led development of intelligent Q&A system using Dify with RAG techniques. Designed automated transaction monitoring and intelligent voice assistant.'
                }
            },
            mobile: {
                name: 'AI-Assisted Development',
                category: 'Development Tools',
                description: 'Pioneered high-efficiency workflow (Cursor + Figma + MCP), drastically reducing design-to-delivery cycle. Leveraged AI-powered coding tools and advanced prompt engineering to enhance development speed and code quality.',
                experience: {
                    title: 'AI-Assisted Development & Workflow Optimization',
                    company: 'Enterprise Company',
                    duration: '2015-Present',
                    description: 'Intelligently parsed designs into code with automated validation. Enhanced development speed, code quality, and refactoring processes using AI tools.'
                }
            }
        },
        zh: {
            frontend: {
                name: '前端架构',
                category: 'Web开发',
                description: '资深前端架构师，拥有10年经验。架构并主导了基于Wujie的微前端架构的大型企业云平台的0到1开发，成功集成了12个以上的子系统，服务1000+日活用户。',
                experience: {
                    title: '微前端架构',
                    company: '企业公司',
                    duration: '2015-至今',
                    description: '主导企业云平台的0到1开发，包含12+子系统，1000+日活。解决了单体应用的关键痛点，包括代码臃肿和团队协作问题。'
                }
            },
            backend: {
                name: '后端与全栈',
                category: 'Web开发',
                description: '全栈实时通信系统专家。使用Node.js、Express和Socket.IO构建后端实时事件处理，使用Sequelize（MySQL）进行持久化，使用Redis进行会话缓存。通过PM2集群模式部署以确保高可用性。',
                experience: {
                    title: '全栈实时通信系统',
                    company: '企业公司',
                    duration: '2015-至今',
                    description: '开发了全栈实时聊天和协同浏览系统。通过PM2集群模式确保高可用性和并发处理。'
                }
            },
            devops: {
                name: 'DevOps与Monorepo',
                category: '基础设施',
                description: '主导企业级Monorepo（Turborepo）设计，集中管理3个核心包和2个应用程序。实施Changeset进行自动化版本管理，并使用Jenkins建立完整的CI/CD流水线。',
                experience: {
                    title: '企业组件库与Monorepo',
                    company: '企业公司',
                    duration: '2015-至今',
                    description: '显著提高了团队开发效率，降低了跨项目维护成本。使用VuePress和Storybook文档自动化从开发到部署的工作流程。'
                }
            },
            aiml: {
                name: 'AI与大语言模型解决方案',
                category: '人工智能',
                description: 'AI解决方案专家，开创"低代码+LLM+AI Agent"解决方案。使用Dify、RAG和MCP构建智能工作流。应用先进的RAG技术与向量数据库，设计AI Agents实现多步骤自动化。',
                experience: {
                    title: 'AI自动化与RAG实施',
                    company: '企业公司',
                    duration: '2015-至今',
                    description: '构建低代码AI解决方案栈用于安全的工作流自动化。主导使用Dify和RAG技术开发智能问答系统。设计了自动化交易监控和智能语音助手。'
                }
            },
            mobile: {
                name: 'AI辅助开发',
                category: '开发工具',
                description: '开创高效工作流（Cursor + Figma + MCP），大幅缩短从设计到交付的周期。利用AI驱动的编码工具和高级提示工程来提高开发速度和代码质量。',
                experience: {
                    title: 'AI辅助开发与工作流优化',
                    company: '企业公司',
                    duration: '2015-至今',
                    description: '智能解析设计并自动验证生成代码。使用AI工具提高开发速度、代码质量和重构流程。'
                }
            }
        }
    }

    const t = translations[locale]

    return [
        {
            id: 'frontend',
            name: t.frontend.name,
            category: t.frontend.category,
            position: [0, 0, 0],
            orbitRadius: 6,
            orbitSpeed: 0.5,
            size: 1.2,
            color: '#61dafb',
            proficiencyLevel: 95,
            description: t.frontend.description,
            technologies: ['Vue.js', 'VuePress', 'WebRTC', 'Socket.IO Client', 'Element UI', 'Micro-Frontend', 'Wujie'],
            experience: [
                {
                    id: 'exp1',
                    title: t.frontend.experience.title,
                    company: t.frontend.experience.company,
                    duration: t.frontend.experience.duration,
                    description: t.frontend.experience.description,
                    technologies: ['Wujie', 'Vue.js', 'Micro-Frontend'],
                    startDate: new Date('2015-01-01')
                }
            ]
        },
        {
            id: 'backend',
            name: t.backend.name,
            category: t.backend.category,
            position: [0, 0, 0],
            orbitRadius: 8,
            orbitSpeed: 0.3,
            size: 1.0,
            color: '#68d391',
            proficiencyLevel: 90,
            description: t.backend.description,
            technologies: ['Node.js', 'Express.js', 'Socket.IO', 'Sequelize ORM', 'PostgreSQL', 'MySQL', 'Redis'],
            experience: [
                {
                    id: 'exp2',
                    title: t.backend.experience.title,
                    company: t.backend.experience.company,
                    duration: t.backend.experience.duration,
                    description: t.backend.experience.description,
                    technologies: ['Node.js', 'Express', 'Socket.IO', 'MySQL', 'Redis', 'PM2'],
                    startDate: new Date('2015-01-01')
                }
            ]
        },
        {
            id: 'devops',
            name: t.devops.name,
            category: t.devops.category,
            position: [0, 0, 0],
            orbitRadius: 10,
            orbitSpeed: 0.2,
            size: 0.9,
            color: '#ffd93d',
            proficiencyLevel: 88,
            description: t.devops.description,
            technologies: ['Turborepo', 'Changeset', 'Jenkins', 'PM2', 'Microservices Architecture'],
            experience: [
                {
                    id: 'exp3',
                    title: t.devops.experience.title,
                    company: t.devops.experience.company,
                    duration: t.devops.experience.duration,
                    description: t.devops.experience.description,
                    technologies: ['Turborepo', 'Changeset', 'Jenkins', 'VuePress', 'Storybook'],
                    startDate: new Date('2015-01-01')
                }
            ]
        },
        {
            id: 'ai-ml',
            name: t.aiml.name,
            category: t.aiml.category,
            position: [0, 0, 0],
            orbitRadius: 12,
            orbitSpeed: 0.15,
            size: 1.1,
            color: '#ff6b6b',
            proficiencyLevel: 92,
            description: t.aiml.description,
            technologies: ['ChatGPT', 'Gemini', 'Claude', 'Qwen', 'n8n', 'Dify', 'RAG', 'AI Agent', 'MCP', 'Vector Databases', 'Nomic-embed-text'],
            experience: [
                {
                    id: 'exp4',
                    title: t.aiml.experience.title,
                    company: t.aiml.experience.company,
                    duration: t.aiml.experience.duration,
                    description: t.aiml.experience.description,
                    technologies: ['Dify', 'RAG', 'AI Agent', 'MCP', 'Vector DB'],
                    startDate: new Date('2015-01-01')
                }
            ]
        },
        {
            id: 'mobile',
            name: t.mobile.name,
            category: t.mobile.category,
            position: [0, 0, 0],
            orbitRadius: 14,
            orbitSpeed: 0.1,
            size: 0.85,
            color: '#f093fb',
            proficiencyLevel: 93,
            description: t.mobile.description,
            technologies: ['Cursor', 'Windsurf', 'Kiro', 'Gemini Code', 'Prompt Engineering', 'Puppeteer', 'Playwright', 'Firecrawl'],
            experience: [
                {
                    id: 'exp5',
                    title: t.mobile.experience.title,
                    company: t.mobile.experience.company,
                    duration: t.mobile.experience.duration,
                    description: t.mobile.experience.description,
                    technologies: ['Cursor', 'Figma', 'MCP', 'AI Coding'],
                    startDate: new Date('2015-01-01')
                }
            ]
        }
    ]
}

export const getExperiencesData = (locale: 'en' | 'zh'): ExperienceEntry[] => {
    const translations = {
        en: {
            exp1: {
                title: 'Senior Frontend Developer',
                company: 'Tech Corp',
                duration: '2022-Present',
                description: 'Leading frontend development for enterprise applications with React and TypeScript.'
            },
            exp2: {
                title: 'Full Stack Developer',
                company: 'StartupXYZ',
                duration: '2020-2022',
                description: 'Built scalable web applications and RESTful APIs using modern technologies.'
            },
            exp3: {
                title: 'Junior Developer',
                company: 'WebDev Agency',
                duration: '2019-2020',
                description: 'Developed responsive websites and learned modern web development practices.'
            }
        },
        zh: {
            exp1: {
                title: '高级前端开发工程师',
                company: '科技公司',
                duration: '2022-至今',
                description: '使用React和TypeScript主导企业应用的前端开发。'
            },
            exp2: {
                title: '全栈开发工程师',
                company: '创业公司XYZ',
                duration: '2020-2022',
                description: '使用现代技术构建可扩展的Web应用程序和RESTful API。'
            },
            exp3: {
                title: '初级开发工程师',
                company: 'Web开发机构',
                duration: '2019-2020',
                description: '开发响应式网站并学习现代Web开发实践。'
            }
        }
    }

    const t = translations[locale]

    return [
        {
            id: 'exp1',
            title: t.exp1.title,
            company: t.exp1.company,
            duration: t.exp1.duration,
            description: t.exp1.description,
            technologies: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
            startDate: new Date('2022-01-01')
        },
        {
            id: 'exp2',
            title: t.exp2.title,
            company: t.exp2.company,
            duration: t.exp2.duration,
            description: t.exp2.description,
            technologies: ['Node.js', 'React', 'MongoDB', 'Express'],
            startDate: new Date('2020-01-01'),
            endDate: new Date('2022-01-01')
        },
        {
            id: 'exp3',
            title: t.exp3.title,
            company: t.exp3.company,
            duration: t.exp3.duration,
            description: t.exp3.description,
            technologies: ['HTML', 'CSS', 'JavaScript', 'PHP'],
            startDate: new Date('2019-01-01'),
            endDate: new Date('2020-01-01')
        }
    ]
}
