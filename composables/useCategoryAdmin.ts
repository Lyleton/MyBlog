export function useCategoryAdmin() {
  const { authed } = useAuth()
  const categories = useState<string[]>('admin-categories', () => [])

  async function load() {
    if (!authed.value) return
    categories.value = (await $fetch('/api/admin/categories').catch(() => null))?.categories ?? []
  }

  async function save(next: string[]) {
    await $fetch('/api/admin/categories', { method: 'PUT', body: { categories: next } })
    categories.value = next
  }

  async function add(name: string | null) {
    const c = name?.trim()
    if (!c || categories.value.includes(c)) return
    await save([...categories.value, c])
  }

  async function rename(oldName: string) {
    const next = prompt(`重命名栏目「${oldName}」`, oldName)
    if (!next || next.trim() === oldName) return
    await save(categories.value.map((c) => (c === oldName ? next.trim() : c)))
    alert('栏目已改名；已发布文章的 frontmatter category 需手动同步（编辑文章页）')
  }

  async function remove(name: string) {
    if (!confirm(`删除栏目「${name}」？（仅从栏目列表移除，文章不受影响）`)) return
    await save(categories.value.filter((c) => c !== name))
  }

  return { categories, load, add, rename, remove }
}
