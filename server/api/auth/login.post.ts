export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true })

  if (!rateLimitOk(ip)) {
    throw createError({ statusCode: 429, statusMessage: '尝试过于频繁，请稍后再试' })
  }

  const body = await readBody(event).catch(() => null)
  const passphrase = typeof body?.passphrase === 'string' ? body.passphrase : ''

  if (!passphrase || !verifyPassphrase(passphrase)) {
    recordFailure(ip)
    console.warn(`[auth] 口令验证失败 ip=${ip}`)
    // 通用错误，不区分口令错误与锁定
    throw createError({ statusCode: 401, statusMessage: '验证失败' })
  }

  recordSuccess(ip)
  const token = signToken()
  setAuthCookie(event, token)
  console.log(`[auth] 管理登录成功 ip=${ip}`)
  return { token }
})
