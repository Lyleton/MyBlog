// 便携令牌消费：/?pt=xxx 或 /auth/portable?pt=xxx → 建立会话 cookie → 回到首页
export default defineEventHandler((event) => {
  const pt = getQuery(event).pt
  if (typeof pt !== 'string' || !verifyToken(pt)) {
    throw createError({ statusCode: 401, statusMessage: '令牌无效或已过期' })
  }
  setAuthCookie(event, pt)
  return sendRedirect(event, '/')
})
