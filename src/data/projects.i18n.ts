import { StaticImageData } from 'next/image'

// Import project images
import yimiAppImg from '@/assets/projects/yimi_app.png'
import yimiWebImg from '@/assets/projects/yimi_web.png'
import cloudChineseImg from '@/assets/projects/cloud_chinese.png'
import yueluoImg from '@/assets/projects/yueluo.jpg'

export interface ProjectData {
    title: string
    description: string
    image: StaticImageData | string
    tags: string[]
    link: string
}

export const getProjectsData = (locale: 'en' | 'zh'): ProjectData[] => {
    const translations = {
        en: [
            {
                title: 'YiMi Reading (APP)',
                description: 'A fun reading tool designed to make reading engaging for young readers. It provides rich reading resources and interactive elements that encourage children to think while they read, completing a meaningful reading journey.',
                image: yimiAppImg,
                tags: ['Mobile App', 'Education', 'Gamification'],
                link: '#'
            },
            {
                title: 'YiMi Reading (Website)',
                description: 'Refactored the website to align with the company\'s strategic goals. Shifted the target audience from students to teachers, providing resources specifically tailored to educators\' needs.',
                image: yimiWebImg,
                tags: ['Web Development', 'Refactoring', 'B2B'],
                link: '#'
            },
            {
                title: 'Cloud Chinese',
                description: 'A bridge connecting Chinese and foreign schools. It serves as a witness to the friendship between students from different cultures and a platform for mutual cultural learning and exchange.',
                image: cloudChineseImg,
                tags: ['Platform', 'Cultural Exchange', 'Education'],
                link: '#'
            },
            {
                title: 'Yue Luo Children\'s Book Club',
                description: 'A picture book borrowing platform dedicated to serving young readers. The mission is to allow more children to read more books for less money.',
                image: yueluoImg,
                tags: ['Platform', 'E-commerce', 'Social Impact'],
                link: '#'
            }
        ],
        zh: [
            {
                title: '一米阅读 (APP)',
                description: '这是一款趣味阅读工具，丰富的阅读资源让阅读不再枯燥，小读者们可以边读边思考完成阅读之旅。',
                image: yimiAppImg,
                tags: ['移动应用', '教育', '游戏化'],
                link: '#'
            },
            {
                title: '一米阅读 (网站)',
                description: '跟随公司运营方向和战略目标重构网站，目标用户由学生转为老师，网站资源更换为老师所需要的资源。',
                image: yimiWebImg,
                tags: ['网站开发', '重构', 'B2B'],
                link: '#'
            },
            {
                title: '云上华文',
                description: '一个沟通中外学校的桥梁，是中外学生友谊的见证，也是中外文化互相学习的平台。',
                image: cloudChineseImg,
                tags: ['平台', '文化交流', '教育'],
                link: '#'
            },
            {
                title: '阅落童书会',
                description: '这是一个专注为低龄读者服务的绘本借阅平台。让更多的孩子用更少的钱读到更多的书。',
                image: yueluoImg,
                tags: ['平台', '电商', '社会公益'],
                link: '#'
            }
        ]
    }

    return translations[locale]
}

export const getProjectsPageContent = (locale: 'en' | 'zh') => {
    const content = {
        en: {
            title: 'Selected Projects',
            subtitle: 'A showcase of my work in education technology, platform development, and digital innovation.'
        },
        zh: {
            title: '精选作品',
            subtitle: '展示我在教育科技、平台开发和数字创新方面的作品。'
        }
    }
    return content[locale]
}
