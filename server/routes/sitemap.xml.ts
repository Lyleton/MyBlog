import { serverQueryContent } from '#content/server'
import { siteConfig } from '~/config/site'

export default defineEventHandler(async (event) => {
  const articles = await serverQueryContent(event, 'articles')
    .where({ published: { $ne: false } })
    .sort({ date: -1 })
    .find()

  interface SitemapPage {
    url: string | undefined
    priority: string
    changefreq: string
    lastmod?: string
  }

  // Static pages
  const staticPages: SitemapPage[] = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/articles', priority: '0.9', changefreq: 'daily' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/archives', priority: '0.7', changefreq: 'weekly' },
  ]

  // Article pages
  const articlePages: SitemapPage[] = articles.map((article) => ({
    url: article._path,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: (article.updated || article.date) as string,
  }))

  const allPages: SitemapPage[] = [...staticPages, ...articlePages]

  const urls = allPages.map((page) => {
    const lastmod = page.lastmod ? `<lastmod>${new Date(page.lastmod).toISOString().split('T')[0]}</lastmod>` : ''
    return `
  <url>
    <loc>${siteConfig.url}${page.url}</loc>
    ${lastmod}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  }).join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml')
  return sitemap
})
