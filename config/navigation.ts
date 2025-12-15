// config/navigation.ts
import type { NavItem } from '~/types'

export const navigation: NavItem[] = [
  {
    label: '首页',
    path: '/',
    cmd: 'cd',
    arg: '~/home',
  },
  {
    label: '文章',
    path: '/articles',
    cmd: 'ls',
    arg: './articles',
  },
  {
    label: '归档',
    path: '/archives',
    cmd: 'cat',
    arg: 'archives.md',
  },
  {
    label: '关于',
    path: '/about',
    cmd: 'cat',
    arg: 'about.md',
  },
]
