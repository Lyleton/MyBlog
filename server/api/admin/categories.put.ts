export default defineEventHandler(async (event) => {
  requireAuth(event)
  const body = await readBody(event)
  if (!Array.isArray(body?.categories) || !body.categories.every((c: unknown) => typeof c === 'string')) {
    throw createError({ statusCode: 400, statusMessage: 'categories 必须是字符串数组' })
  }
  writeCategories(body.categories)
  return { ok: true }
})
