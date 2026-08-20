export default defineEventHandler((event) => {
  requireAuth(event)
  return { categories: listCategories() }
})
