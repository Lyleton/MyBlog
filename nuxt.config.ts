// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true,

  // App configuration
  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'TechBlog - 技术博客',
      meta: [
        { name: 'description', content: '专注于前端开发、后端架构和 DevOps 实践的技术博客' },
        { name: 'theme-color', content: '#e07a5f' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'TechBlog' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/avatar.png' },
        { rel: 'apple-touch-icon', href: '/images/avatar.png' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'RSS Feed', href: '/feed.xml' },
      ],
    },
  },

  // 引入全局 CSS
  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/icon',
  ],

  content: {
    highlight: {
      theme: {
        default: 'one-dark-pro',
        dark: 'one-dark-pro',
        light: 'github-light',
      },
      langs: [
        'javascript',
        'typescript',
        'vue',
        'vue-html',
        'html',
        'css',
        'scss',
        'json',
        'yaml',
        'markdown',
        'bash',
        'shell',
        'dockerfile',
        'nginx',
        'python',
        'go',
        'rust',
        'sql',
        'graphql',
      ],
    },
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  fonts: {
    // 使用本地字体回退，避免网络请求失败
    provider: 'none',
    families: [
      { name: 'Inter', provider: 'none' },
      { name: 'JetBrains Mono', provider: 'none' },
    ],
  },

  // SSG 预渲染配置
  nitro: {
    prerender: {
      routes: ['/feed.xml', '/sitemap.xml'],
      crawlLinks: true,
    },
  },

  // 组件自动导入配置 - 禁用目录前缀
  components: {
    dirs: [
      { path: '~/components/ui', pathPrefix: false },
      { path: '~/components/layout', pathPrefix: false },
      { path: '~/components/content', pathPrefix: false },
    ],
  },

  typescript: {
    strict: true,
  },

  devtools: { enabled: true },

  compatibilityDate: '2025-01-01',
})
