export default defineEventHandler((event) => {
  requireAuth(event)
  const path = getQuery(event).path
  if (typeof path === 'string' && path) {
    return { path, content: readContentFile(path) }
  }
  return { articles: listArticles() }
})
