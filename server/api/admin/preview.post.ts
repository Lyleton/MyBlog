import { parseContent } from '#content/server'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const body = await readBody(event)
  let md = typeof body?.content === 'string' ? body.content : ''
  // 预览只渲染正文，剥掉 frontmatter
  md = md.replace(/^---\n[\s\S]*?\n---\n?/, '')
  const doc = await parseContent('preview.md', md)
  return { doc }
})
