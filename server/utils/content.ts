import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { dirname, join, normalize, resolve } from 'node:path'

// 项目根目录 = 启动 node 的目录（部署时 node .output/server/index.mjs 在项目根运行）
const ROOT = process.env.PROJECT_ROOT || process.cwd()
const CONTENT_DIR = join(ROOT, 'content')
const SITE_CONFIG = join(ROOT, 'config', 'site.ts')

// ---- 路径安全 ----

// rel 相对 content/ 目录，如 articles/xxx.md、about.md
export function safeContentPath(rel: string): string {
  if (typeof rel !== 'string' || !rel || rel.includes('\0')) throw badRequest('非法路径')
  const full = resolve(CONTENT_DIR, normalize(rel))
  if (full !== CONTENT_DIR && !full.startsWith(CONTENT_DIR + '/')) throw badRequest('非法路径')
  if (!full.endsWith('.md')) throw badRequest('仅支持 .md 文件')
  return full
}

function badRequest(msg: string) {
  const err = new Error(msg) as Error & { statusCode?: number }
  err.statusCode = 400
  return err
}

// ---- 文章 CRUD ----

export interface ArticleMeta {
  path: string
  title: string
  date: string
  category: string
}

function fm(raw: string, key: string): string {
  const m = raw.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : ''
}

export function listArticles(): ArticleMeta[] {
  const dir = join(CONTENT_DIR, 'articles')
  if (!existsSync(dir)) return []
  return readdirSync(dir, { recursive: true, encoding: 'utf-8' })
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = readFileSync(join(dir, f), 'utf-8')
      return { path: `articles/${f}`, title: fm(raw, 'title') || f, date: fm(raw, 'date'), category: fm(raw, 'category') }
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function readContentFile(rel: string): string {
  const full = safeContentPath(rel)
  if (!existsSync(full)) {
    const err = new Error('文件不存在') as Error & { statusCode?: number }
    err.statusCode = 404
    throw err
  }
  return readFileSync(full, 'utf-8')
}

export function writeContentFile(rel: string, content: string) {
  const full = safeContentPath(rel)
  if (typeof content !== 'string') throw badRequest('内容不能为空')
  if (rel.startsWith('articles/') && !content.includes('---')) throw badRequest('文章内容必须包含 frontmatter')
  mkdirSync(dirname(full), { recursive: true })
  writeFileSync(full, content)
  scheduleRebuild()
}

export function deleteContentFile(rel: string) {
  const full = safeContentPath(rel)
  if (!existsSync(full)) return
  if (!full.startsWith(join(CONTENT_DIR, 'articles') + '/')) throw badRequest('仅允许删除文章')
  rmSync(full)
  scheduleRebuild()
}

// ---- 栏目（config/site.ts 的 categories 数组）----

export function listCategories(): string[] {
  const m = readFileSync(SITE_CONFIG, 'utf-8').match(/categories:\s*\[([\s\S]*?)\]/)
  if (!m) return []
  return [...m[1].matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1])
}

export function writeCategories(categories: string[]) {
  for (const c of categories) {
    if (!c || c.includes('\'') || c.includes('"') || c.includes('\n')) throw badRequest('非法栏目名')
  }
  const src = readFileSync(SITE_CONFIG, 'utf-8')
  const replaced = src.replace(
    /categories:\s*\[[\s\S]*?\]/,
    `categories: [\n${categories.map((c) => `    '${c}',`).join('\n')}\n  ]`,
  )
  if (replaced === src) throw badRequest('未找到 categories 配置')
  writeFileSync(SITE_CONFIG, replaced)
  scheduleRebuild()
}

// ---- 写后自动重建 ----
// ponytail: 重建期间站点继续用旧构建服务，构建完成后进程退出由 systemd 拉起新构建；
// 升级路径：需要零停机再做 .output 双目录切换

let rebuildTimer: NodeJS.Timeout | undefined
let building = false

export function rebuildState() {
  return { building }
}

export function scheduleRebuild() {
  if (process.dev) return // 开发模式 content 热更新，无需重建
  clearTimeout(rebuildTimer)
  rebuildTimer = setTimeout(startRebuild, 2000)
}

function startRebuild() {
  if (building) return
  building = true
  console.log('[rebuild] 开始重建…')
  const child = spawn('npm', ['run', 'build'], { cwd: ROOT, stdio: 'inherit', detached: false })
  child.on('exit', (code) => {
    if (code === 0) {
      console.log('[rebuild] 构建成功，退出进程由 systemd 重启以加载新内容')
      process.exit(0)
    }
    building = false
    console.error(`[rebuild] 构建失败 (code=${code})，保留旧版本`)
  })
}
