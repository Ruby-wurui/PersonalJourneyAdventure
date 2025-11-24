import { SkillPlanet, ExperienceEntry } from '@/types/3d'

// Navigation Planets Data with i18n support
export const getSkillPlanetsData = (locale: 'en' | 'zh'): SkillPlanet[] => {
    const translations = {
        en: {
            about: {
                name: 'About',
                category: 'Introduction',
                description: 'Learn more about me, my journey, and what drives my passion for technology and innovation.',
                experience: {
                    title: 'About Me',
                    company: 'Personal Journey',
                    duration: '2015-Present',
                    description: 'Explore my background, skills, and professional journey in the world of technology.'
                }
            },
            tech: {
                name: 'Technology',
                category: 'Tech Stack',
                description: 'Discover the technologies and tools I work with, from frontend frameworks to AI solutions.',
                experience: {
                    title: 'Technology Stack',
                    company: 'Technical Skills',
                    duration: '2015-Present',
                    description: 'A comprehensive overview of my technical expertise and the technologies I specialize in.'
                }
            },
            projects: {
                name: 'Projects',
                category: 'Portfolio',
                description: 'Explore my portfolio of projects, from enterprise applications to innovative solutions.',
                experience: {
                    title: 'Project Portfolio',
                    company: 'Professional Work',
                    duration: '2015-Present',
                    description: 'A showcase of my professional projects and technical achievements.'
                }
            },
            blog: {
                name: 'Blog',
                category: 'Articles',
                description: 'Read my thoughts on technology, development practices, and industry insights.',
                experience: {
                    title: 'Tech Blog',
                    company: 'Knowledge Sharing',
                    duration: '2015-Present',
                    description: 'Articles and insights about web development, AI, and modern technologies.'
                }
            }
        },
        zh: {
            about: {
                name: '关于',
                category: '介绍',
                description: '了解更多关于我的信息、我的旅程以及驱动我对技术和创新热情的动力。',
                experience: {
                    title: '关于我',
                    company: '个人旅程',
                    duration: '2015-至今',
                    description: '探索我在技术世界中的背景、技能和职业旅程。'
                }
            },
            tech: {
                name: '技术',
                category: '技术栈',
                description: '发现我使用的技术和工具，从前端框架到AI解决方案。',
                experience: {
                    title: '技术栈',
                    company: '技术技能',
                    duration: '2015-至今',
                    description: '全面概述我的技术专长和专业技术。'
                }
            },
            projects: {
                name: '项目',
                category: '作品集',
                description: '探索我的项目作品集，从企业应用到创新解决方案。',
                experience: {
                    title: '项目作品集',
                    company: '专业工作',
                    duration: '2015-至今',
                    description: '展示我的专业项目和技术成就。'
                }
            },
            blog: {
                name: '博客',
                category: '文章',
                description: '阅读我对技术、开发实践和行业见解的思考。',
                experience: {
                    title: '技术博客',
                    company: '知识分享',
                    duration: '2015-至今',
                    description: '关于Web开发、AI和现代技术的文章和见解。'
                }
            }
        }
    }

    const t = translations[locale]

    return [
        {
            id: 'about',
            name: t.about.name,
            category: t.about.category,
            position: [0, 0, 0],
            orbitRadius: 6,
            orbitSpeed: 0.5,
            size: 1.2,
            color: '#61dafb',
            proficiencyLevel: 100,
            description: t.about.description,
            technologies: ['Personal', 'Journey', 'Background'],
            experience: [
                {
                    id: 'exp1',
                    title: t.about.experience.title,
                    company: t.about.experience.company,
                    duration: t.about.experience.duration,
                    description: t.about.experience.description,
                    technologies: ['About', 'Profile', 'Introduction'],
                    startDate: new Date('2015-01-01')
                }
            ]
        },
        {
            id: 'tech',
            name: t.tech.name,
            category: t.tech.category,
            position: [0, 0, 0],
            orbitRadius: 8,
            orbitSpeed: 0.3,
            size: 1.0,
            color: '#68d391',
            proficiencyLevel: 100,
            description: t.tech.description,
            technologies: ['Frontend', 'Backend', 'AI', 'DevOps'],
            experience: [
                {
                    id: 'exp2',
                    title: t.tech.experience.title,
                    company: t.tech.experience.company,
                    duration: t.tech.experience.duration,
                    description: t.tech.experience.description,
                    technologies: ['React', 'Node.js', 'AI', 'Cloud'],
                    startDate: new Date('2015-01-01')
                }
            ]
        },
        {
            id: 'projects',
            name: t.projects.name,
            category: t.projects.category,
            position: [0, 0, 0],
            orbitRadius: 10,
            orbitSpeed: 0.2,
            size: 0.9,
            color: '#ffd93d',
            proficiencyLevel: 100,
            description: t.projects.description,
            technologies: ['Portfolio', 'Showcase', 'Work'],
            experience: [
                {
                    id: 'exp3',
                    title: t.projects.experience.title,
                    company: t.projects.experience.company,
                    duration: t.projects.experience.duration,
                    description: t.projects.experience.description,
                    technologies: ['Enterprise', 'Innovation', 'Solutions'],
                    startDate: new Date('2015-01-01')
                }
            ]
        },
        {
            id: 'blog',
            name: t.blog.name,
            category: t.blog.category,
            position: [0, 0, 0],
            orbitRadius: 12,
            orbitSpeed: 0.15,
            size: 1.1,
            color: '#ff6b6b',
            proficiencyLevel: 100,
            description: t.blog.description,
            technologies: ['Articles', 'Insights', 'Knowledge'],
            experience: [
                {
                    id: 'exp4',
                    title: t.blog.experience.title,
                    company: t.blog.experience.company,
                    duration: t.blog.experience.duration,
                    description: t.blog.experience.description,
                    technologies: ['Writing', 'Sharing', 'Learning'],
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
