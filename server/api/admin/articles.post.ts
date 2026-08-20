export default defineEventHandler(async (event) => {
  requireAuth(event)
  const body = await readBody(event)
  writeContentFile(body?.path, body?.content)
  return { ok: true }
})
