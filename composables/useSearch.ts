import { useDebounceFn, useLocalStorage } from '@vueuse/core'
import Fuse, { type IFuseOptions } from 'fuse.js'
import type { Article } from '~/types'

/**
 * Extended Article type with body content for full-text search
 */
interface SearchableArticle extends Omit<Article, 'body'> {
  body?: {
    children?: Array<{ value?: string, children?: Array<{ value?: string }> }>
  } | null
  _rawBody?: string
}

/**
 * Search result with highlight information
 */
export interface SearchResult {
  item: Article
  score: number
  matches?: Array<{
    key: string
    value: string
    indices: Array<[number, number]>
  }>
}

/**
 * useSearch - Enhanced search with fuzzy matching, full-text search, and history
 */
export const useSearch = () => {
  const query = ref('')
  const results = ref<SearchResult[]>([])
  const isLoading = ref(false)
  const isOpen = ref(false)
  const selectedIndex = ref(0)

  // Search history (persisted in localStorage)
  const searchHistory = useLocalStorage<string[]>('blog-search-history', [])
  const maxHistoryItems = 10

  // Fuse.js instance
  let fuseInstance: Fuse<SearchableArticle> | null = null
  const articles = ref<SearchableArticle[]>([])

  // Fuse.js configuration for fuzzy search
  const fuseOptions: IFuseOptions<SearchableArticle> = {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'description', weight: 0.25 },
      { name: 'category', weight: 0.15 },
      { name: 'tags', weight: 0.1 },
      { name: '_rawBody', weight: 0.1 },
    ],
    threshold: 0.4, // 0 = exact match, 1 = match anything
    distance: 100,
    minMatchCharLength: 2,
    includeScore: true,
    includeMatches: true,
    ignoreLocation: true,
    useExtendedSearch: true,
  }

  // Extract plain text from markdown body
  const extractBodyText = (article: SearchableArticle): string => {
    if (!article.body?.children) return ''

    const extractText = (nodes: any[]): string => {
      return nodes.map((node) => {
        if (typeof node === 'string') return node
        if (node.value) return node.value
        if (node.children) return extractText(node.children)
        return ''
      }).join(' ')
    }

    return extractText(article.body.children).slice(0, 500) // Limit body text
  }

  // Initialize search index
  const initializeSearch = async () => {
    try {
      const allArticles = await queryContent<SearchableArticle>('articles')
        .where({ published: { $ne: false } })
        .find()

      // Add raw body text for full-text search
      articles.value = allArticles.map(article => ({
        ...article,
        _rawBody: extractBodyText(article),
      }))

      fuseInstance = new Fuse(articles.value, fuseOptions)
    }
    catch (error) {
      console.error('Failed to initialize search:', error)
    }
  }

  // Debounced search function
  const performSearch = useDebounceFn(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      results.value = []
      isLoading.value = false
      return
    }

    isLoading.value = true

    try {
      // Initialize if not already done
      if (!fuseInstance) {
        await initializeSearch()
      }

      if (fuseInstance) {
        const searchResults = fuseInstance.search(searchQuery, { limit: 10 })
        results.value = searchResults.map(result => ({
          item: result.item as Article,
          score: result.score || 0,
          matches: result.matches?.map(match => ({
            key: match.key || '',
            value: match.value || '',
            indices: match.indices as Array<[number, number]>,
          })),
        }))
      }

      selectedIndex.value = 0
    }
    catch (error) {
      console.error('Search error:', error)
      results.value = []
    }
    finally {
      isLoading.value = false
    }
  }, 200) // Reduced debounce for better responsiveness

  // Watch query changes
  watch(query, (newQuery) => {
    performSearch(newQuery)
  })

  // Add to search history
  const addToHistory = (term: string) => {
    if (!term.trim()) return

    // Remove if already exists
    const filtered = searchHistory.value.filter(h => h !== term)

    // Add to beginning
    searchHistory.value = [term, ...filtered].slice(0, maxHistoryItems)
  }

  // Clear search history
  const clearHistory = () => {
    searchHistory.value = []
  }

  // Remove single history item
  const removeFromHistory = (term: string) => {
    searchHistory.value = searchHistory.value.filter(h => h !== term)
  }

  // Open search modal
  const open = () => {
    isOpen.value = true
    query.value = ''
    results.value = []
    selectedIndex.value = 0

    // Pre-initialize search index
    if (!fuseInstance) {
      initializeSearch()
    }
  }

  // Close search modal
  const close = () => {
    // Save current query to history if has results
    if (query.value.trim() && results.value.length > 0) {
      addToHistory(query.value.trim())
    }

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
      addToHistory(query.value.trim())
      return selected.item._path
    }
    return null
  }

  // Use history item as search query
  const useHistoryItem = (term: string) => {
    query.value = term
  }

  // Global keyboard shortcuts
  if (import.meta.client) {
    const handleKeydown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInputElement = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'

      // Open with / key (when not in input)
      if (e.key === '/' && !isOpen.value && !isInputElement) {
        e.preventDefault()
        open()
        return
      }

      // Open with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen.value) {
          close()
        }
        else {
          open()
        }
        return
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
    searchHistory: readonly(searchHistory),
    open,
    close,
    navigateUp,
    navigateDown,
    selectCurrent,
    addToHistory,
    clearHistory,
    removeFromHistory,
    useHistoryItem,
  }
}

/**
 * Utility function to highlight matched text
 */
export const highlightMatch = (
  text: string,
  indices: Array<[number, number]> | undefined,
): string => {
  if (!indices || indices.length === 0) return text

  let result = ''
  let lastIndex = 0

  // Sort indices and merge overlapping
  const sortedIndices = [...indices].sort((a, b) => a[0] - b[0])

  for (const [start, end] of sortedIndices) {
    // Add text before match
    result += text.slice(lastIndex, start)
    // Add highlighted match
    result += `<mark>${text.slice(start, end + 1)}</mark>`
    lastIndex = end + 1
  }

  // Add remaining text
  result += text.slice(lastIndex)

  return result
}
