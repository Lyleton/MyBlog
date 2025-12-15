import { serverQueryContent } from '#content/server'
import { siteConfig } from '~/config/site'

export default defineEventHandler(async (event) => {
  const articles = await serverQueryContent(event, 'articles')
    .where({ published: { $ne: false } })
    .sort({ date: -1 })
    .limit(20)
    .find()

  const feedItems = articles.map((article) => {
    const link = `${siteConfig.url}${article._path}`
    const pubDate = new Date(article.date as string).toUTCString()

    return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${link}</link>
      <guid>${link}</guid>
      <description><![CDATA[${article.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category>${article.category}</category>
    </item>`
  }).join('')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${siteConfig.url}</link>
    <description>${siteConfig.description}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
    ${feedItems}
  </channel>
</rss>`

  setHeader(event, 'Content-Type', 'application/xml')
  return feed
})
