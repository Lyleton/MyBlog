import { useDebounceFn } from '@vueuse/core'
import type { Article } from '~/types'

/**
 * useSearch - Search functionality with debounced query
 * Provides search query, results, loading state and search function
 */
export const useSearch = () => {
  const query = ref('')
  const results = ref<Article[]>([])
  const isLoading = ref(false)
  const isOpen = ref(false)
  const selectedIndex = ref(0)

  // Debounced search function
  const performSearch = useDebounceFn(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      results.value = []
      isLoading.value = false
      return
    }

    isLoading.value = true

    try {
      const articles = await queryContent<Article>('articles')
        .where({
          published: { $ne: false },
          $or: [
            { title: { $icontains: searchQuery } },
            { description: { $icontains: searchQuery } },
            { category: { $icontains: searchQuery } },
          ],
        })
        .sort({ date: -1 })
        .limit(10)
        .find()

      results.value = articles as Article[]
      selectedIndex.value = 0
    }
    catch (error) {
      console.error('Search error:', error)
      results.value = []
    }
    finally {
      isLoading.value = false
    }
  }, 300)

  // Watch query changes
  watch(query, (newQuery) => {
    performSearch(newQuery)
  })

  // Open search modal
  const open = () => {
    isOpen.value = true
    query.value = ''
    results.value = []
    selectedIndex.value = 0
  }

  // Close search modal
  const close = () => {
    isOpen.value = false
    query.value = ''
    results.value = []
  }

  // Keyboard navigation
  const navigateUp = () => {
    if (selectedIndex.value > 0) {
      selectedIndex.value--
    }
  }

  const navigateDown = () => {
    if (selectedIndex.value < results.value.length - 1) {
      selectedIndex.value++
    }
  }

  const selectCurrent = () => {
    if (results.value.length > 0) {
      const selected = results.value[selectedIndex.value]
      return selected._path
    }
    return null
  }

  // Global keyboard shortcut for opening search
  if (import.meta.client) {
    const handleKeydown = (e: KeyboardEvent) => {
      // Open with / key (when not in input)
      if (e.key === '/' && !isOpen.value) {
        const target = e.target as HTMLElement
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault()
          open()
        }
      }

      // Close with Escape
      if (e.key === 'Escape' && isOpen.value) {
        e.preventDefault()
        close()
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
    query,
    results,
    isLoading,
    isOpen: readonly(isOpen),
    selectedIndex,
    open,
    close,
    navigateUp,
    navigateDown,
    selectCurrent,
  }
}
