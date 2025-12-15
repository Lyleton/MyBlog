// types/index.ts
import type { ParsedContent } from '@nuxt/content'

/**
 * 文章类型定义
 */
export interface Article extends ParsedContent {
  title: string
  description: string
  date: string
  category: string
  updated?: string
  tags?: string[]
  cover?: string
  featured?: boolean
  published?: boolean
  readingTime?: {
    text: string
    minutes: number
    words: number
  }
}

/**
 * 目录项类型定义
 */
export interface TOCItem {
  id: string
  text: string
  depth: number
  children?: TOCItem[]
}

/**
 * 导航项类型定义
 */
export interface NavItem {
  label: string
  path: string
  cmd: string
  arg: string
  icon?: string
}

/**
 * 社交链接类型定义
 */
export interface SocialLink {
  name: string
  url: string
  icon: string
}

/**
 * 站点配置类型定义
 */
export interface SiteConfig {
  name: string
  title: string
  description: string
  author: {
    name: string
    bio: string
    avatar?: string
  }
  url: string
  social: SocialLink[]
  categories: string[]
}

/**
 * 分页数据类型
 */
export interface PaginationData {
  currentPage: number
  totalPages: number
  totalItems: number
  perPage: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * 搜索结果类型
 */
export interface SearchResult {
  item: Article
  score: number
  matches?: {
    key: string
    value: string
    indices: [number, number][]
  }[]
}
