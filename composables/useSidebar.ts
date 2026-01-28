import { useLocalStorage } from '@vueuse/core'

/**
 * useSidebar - 侧边栏状态管理
 * 提供响应式的侧边栏折叠状态，支持本地存储持久化
 */
export const useSidebar = () => {
  // 折叠状态（持久化到本地存储）
  const isCollapsed = useLocalStorage('sidebar-collapsed', false)

  // 切换折叠状态
  const toggle = () => {
    isCollapsed.value = !isCollapsed.value
  }

  // 展开侧边栏
  const expand = () => {
    isCollapsed.value = false
  }

  // 收缩侧边栏
  const collapse = () => {
    isCollapsed.value = true
  }

  // 侧边栏宽度（计算属性）
  const sidebarWidth = computed(() => {
    return isCollapsed.value ? '72px' : '280px'
  })

  // 键盘快捷键支持
  if (import.meta.client) {
    const handleKeydown = (e: KeyboardEvent) => {
      // 使用 [ 键切换侧边栏（不在输入框中时）
      const target = e.target as HTMLElement
      const isInputElement = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'

      if (e.key === '[' && !isInputElement && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        toggle()
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown)
    })
  }

  return {
    isCollapsed: readonly(isCollapsed),
    sidebarWidth,
    toggle,
    expand,
    collapse,
  }
}
