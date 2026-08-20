export default defineEventHandler((event) => {
  requireAuth(event)
  return { navigation: listNavigation() }
})
