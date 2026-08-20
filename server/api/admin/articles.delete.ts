export default defineEventHandler((event) => {
  requireAuth(event)
  const path = getQuery(event).path
  if (typeof path !== 'string' || !path) throw createError({ statusCode: 400, statusMessage: '缺少 path' })
  deleteContentFile(path)
  return { ok: true }
})
