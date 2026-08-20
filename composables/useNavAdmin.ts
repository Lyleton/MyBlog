import type { NavItem } from '~/types'

export function useNavAdmin() {
  const { authed } = useAuth()
  const items = useState<NavItem[]>('admin-nav', () => [])
  const loaded = useState('admin-nav-loaded', () => false)

  async function load() {
    if (!authed.value) return
    items.value = (await $fetch('/api/admin/navigation').catch(() => null))?.navigation ?? []
    loaded.value = true
  }

  async function save(next: NavItem[]) {
    await $fetch('/api/admin/navigation', { method: 'PUT', body: { navigation: next } })
    items.value = next
  }

  async function remove(idx: number) {
    const item = items.value[idx]
    if (!item || !confirm(`删除导航「${item.label}」？`)) return
    await save(items.value.filter((_, i) => i !== idx))
  }

  return { items, loaded, load, save, remove }
}
