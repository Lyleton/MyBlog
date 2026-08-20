export default defineEventHandler((event) => {
  requireAuth(event)
  return rebuildState()
})
