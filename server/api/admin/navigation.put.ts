export default defineEventHandler(async (event) => {
  requireAuth(event)
  const body = await readBody(event)
  const items = body?.navigation
  if (!Array.isArray(items) || !items.every((i: unknown) => i && typeof i === 'object' && typeof (i as any).label === 'string' && typeof (i as any).path === 'string')) {
    throw createError({ statusCode: 400, statusMessage: 'navigation 必须是导航项数组' })
  }
  writeNavigation(items)
  return { ok: true }
})
