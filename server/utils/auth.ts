import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

const TOKEN_TTL_MS = 30 * 24 * 3600 * 1000 // 30 天
const COOKIE_NAME = 'blog_auth'

function secret(): string {
  const s = process.env.AUTH_SECRET
  if (!s) throw new Error('AUTH_SECRET 未配置')
  return s
}

function passphraseHash(): string {
  const h = process.env.AUTH_PASSPHRASE_HASH
  if (!h) throw new Error('AUTH_PASSPHRASE_HASH 未配置')
  return h
}

// ---- 口令校验（scrypt，格式: scrypt:<salt_hex>:<hash_hex>）----

export function hashPassphrase(passphrase: string): string {
  const salt = randomBytes(16)
  const hash = scryptSync(passphrase, salt, 64)
  return `scrypt:${salt.toString('hex')}:${hash.toString('hex')}`
}

export function verifyPassphrase(passphrase: string): boolean {
  const parts = passphraseHash().split(':')
  if (parts[0] !== 'scrypt' || parts.length !== 3) return false
  const salt = Buffer.from(parts[1], 'hex')
  const expected = Buffer.from(parts[2], 'hex')
  const actual = scryptSync(passphrase, salt, expected.length)
  return timingSafeEqual(actual, expected)
}

// ---- 无状态令牌（HMAC 签名，无存储依赖）----

const b64url = (buf: Buffer) => buf.toString('base64url')

export function signToken(ttlMs = TOKEN_TTL_MS): string {
  const payload = b64url(Buffer.from(JSON.stringify({ exp: Date.now() + ttlMs })))
  const sig = b64url(createHmac('sha256', secret()).update(payload).digest())
  return `${payload}.${sig}`
}

export function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false
  const expected = b64url(createHmac('sha256', secret()).update(payload).digest())
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now()
  } catch {
    return false
  }
}

// ---- 限速（内存计数，单用户 VPS 场景够用）----
// ponytail: 内存限速重启即清零，需要跨重启持久再换文件/redis

const attempts = new Map<string, { count: number; windowStart: number; lockedUntil: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 10 * 60 * 1000
const LOCKOUT_MS = 60 * 60 * 1000

export function rateLimitOk(ip: string): boolean {
  const now = Date.now()
  const a = attempts.get(ip)
  if (!a) return true
  if (a.lockedUntil > now) return false
  if (a.count >= MAX_ATTEMPTS && now - a.windowStart < WINDOW_MS) return false
  if (now - a.windowStart >= WINDOW_MS) attempts.delete(ip)
  return true
}

export function recordFailure(ip: string) {
  const now = Date.now()
  const a = attempts.get(ip)
  if (!a || now - a.windowStart >= WINDOW_MS) {
    attempts.set(ip, { count: 1, windowStart: now, lockedUntil: 0 })
    return
  }
  a.count++
  if (a.count >= MAX_ATTEMPTS) {
    a.lockedUntil = now + LOCKOUT_MS
    console.warn(`[auth] IP ${ip} 触发锁定 1 小时`)
  }
}

export function recordSuccess(ip: string) {
  attempts.delete(ip)
}

// ---- 会话 ----

// API 请求只认 cookie；pt 令牌仅由 /auth/portable 一次性消费换成 cookie
export function requireAuth(event: H3Event) {
  if (!verifyToken(getCookie(event, COOKIE_NAME))) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
}

export function setAuthCookie(event: H3Event, token: string) {
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    secure: !process.dev,
    sameSite: 'lax',
    path: '/',
    maxAge: TOKEN_TTL_MS / 1000,
  })
}

export function clearAuthCookie(event: H3Event) {
  setCookie(event, COOKIE_NAME, '', { httpOnly: true, secure: !process.dev, path: '/', maxAge: 0 })
}
