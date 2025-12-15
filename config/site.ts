// config/site.ts
import type { SiteConfig } from '~/types'

export const siteConfig: SiteConfig = {
  name: 'Lyleton\'s Blog',
  title: 'Lyleton\'s Blog - 技术博客',
  description: '专注于前端开发、后端架构和 DevOps 实践的技术博客',
  author: {
    name: 'Lyleton',
    bio: 'Per aspera ad astra',
    avatar: '/images/avatar.png',
  },
  url: 'https://lyleton.fun',
  social: [
    {
      name: 'GitHub',
      url: 'https://github.com/lyleton',
      icon: 'i-mdi-github',
    },
    {
      name: 'Email',
      url: 'mailto:lyleton@163.com',
      icon: 'i-mdi-email',
    },
    {
      name: 'RSS',
      url: '/feed.xml',
      icon: 'i-mdi-rss',
    },
  ],
  categories: [
    'Vue',
    'React',
    'TypeScript',
    'Node.js',
    'DevOps',
    'Performance',
    '架构设计',
  ],
}
