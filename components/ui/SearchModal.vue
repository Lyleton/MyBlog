<script setup lang="ts">
import type { SearchResult } from '~/composables/useSearch'
import { highlightMatch } from '~/composables/useSearch'

/**
 * SearchModal - Terminal-style search modal with keyboard navigation,
 * fuzzy search, keyword highlighting, and search history
 */
interface Props {
  isOpen: boolean
  query: string
  results: SearchResult[]
  isLoading: boolean
  selectedIndex: number
  searchHistory: readonly string[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:query': [value: string]
  'close': []
  'navigate-up': []
  'navigate-down': []
  'select': []
  'use-history': [term: string]
  'clear-history': []
  'remove-history': [term: string]
}>()

const router = useRouter()
const inputRef = ref<HTMLInputElement | null>(null)
const showHistory = computed(() => !props.query && props.searchHistory.length > 0)

// Focus input when modal opens
watch(() => props.isOpen, (open) => {
  if (open) {
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})

// Handle keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault()
      emit('navigate-up')
      break
    case 'ArrowDown':
      e.preventDefault()
      emit('navigate-down')
      break
    case 'Enter':
      e.preventDefault()
      if (props.results.length > 0) {
        const selected = props.results[props.selectedIndex]
        router.push(selected.item._path!)
        emit('close')
      }
      break
    case 'Escape':
      e.preventDefault()
      emit('close')
      break
  }
}

// Format date
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Handle result click
const handleResultClick = (result: SearchResult) => {
  router.push(result.item._path!)
  emit('close')
}

// Get highlighted title
const getHighlightedTitle = (result: SearchResult): string => {
  const titleMatch = result.matches?.find(m => m.key === 'title')
  if (titleMatch) {
    return highlightMatch(result.item.title, titleMatch.indices)
  }
  return result.item.title
}

// Get match source indicator
const getMatchSource = (result: SearchResult): string | null => {
  if (!result.matches) return null

  const sources: string[] = []
  for (const match of result.matches) {
    if (match.key === 'tags') sources.push('标签')
    if (match.key === '_rawBody') sources.push('正文')
    if (match.key === 'description') sources.push('描述')
  }

  return sources.length > 0 ? sources[0] : null
}

// Get relevance indicator based on score
const getRelevanceClass = (score: number): string => {
  if (score < 0.2) return 'high'
  if (score < 0.4) return 'medium'
  return 'low'
}

// Use history item
const handleHistoryClick = (term: string) => {
  emit('use-history', term)
}

// Detect OS for shortcut display
const isMac = ref(false)
onMounted(() => {
  isMac.value = navigator.platform.toUpperCase().includes('MAC')
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="search-modal-overlay" @click.self="emit('close')">
        <div class="search-modal">
          <!-- Terminal header -->
          <div class="modal-header">
            <div class="terminal-buttons">
              <span class="terminal-btn red" @click="emit('close')" />
              <span class="terminal-btn yellow" />
              <span class="terminal-btn green" />
            </div>
            <span class="modal-title">search.sh</span>
            <span class="shortcut-hint">{{ isMac ? '⌘' : 'Ctrl' }}+K</span>
          </div>

          <!-- Search input -->
          <div class="search-input-wrapper">
            <span class="input-prompt">$</span>
            <span class="input-cmd">grep -ri</span>
            <input
              ref="inputRef"
              type="text"
              class="search-input"
              :value="query"
              placeholder="'keyword'"
              @input="emit('update:query', ($event.target as HTMLInputElement).value)"
              @keydown="handleKeydown"
            >
            <span v-if="isLoading" class="search-loading">
              <Icon name="ph:spinner" size="16" class="spin" />
            </span>
          </div>

          <!-- Results -->
          <div class="search-results">
            <!-- Loading state -->
            <div v-if="isLoading && !results.length" class="results-loading">
              <p class="loading-text">searching...</p>
            </div>

            <!-- Search History (when no query) -->
            <div v-else-if="showHistory" class="results-history">
              <div class="history-header">
                <span class="history-title">
                  <Icon name="ph:clock-counter-clockwise" size="14" />
                  最近搜索
                </span>
                <button class="history-clear" @click="emit('clear-history')">
                  清除
                </button>
              </div>
              <div class="history-list">
                <button
                  v-for="term in searchHistory"
                  :key="term"
                  class="history-item"
                  @click="handleHistoryClick(term)"
                >
                  <span class="history-term">{{ term }}</span>
                  <span
                    class="history-remove"
                    @click.stop="emit('remove-history', term)"
                  >
                    <Icon name="ph:x" size="12" />
                  </span>
                </button>
              </div>
            </div>

            <!-- Results list -->
            <div v-else-if="results.length" class="results-list">
              <button
                v-for="(result, index) in results"
                :key="result.item._id"
                class="result-item"
                :class="{ selected: index === selectedIndex }"
                @click="handleResultClick(result)"
              >
                <div class="result-main">
                  <span class="result-prefix">→</span>
                  <span
                    class="result-title"
                    v-html="getHighlightedTitle(result)"
                  />
                  <span
                    v-if="getMatchSource(result)"
                    class="result-source"
                  >
                    {{ getMatchSource(result) }}
                  </span>
                </div>
                <div class="result-meta">
                  <span class="result-category">{{ result.item.category }}</span>
                  <span
                    v-if="result.item.tags?.length"
                    class="result-tags"
                  >
                    <span
                      v-for="tag in result.item.tags.slice(0, 2)"
                      :key="tag"
                      class="result-tag"
                    >
                      #{{ tag }}
                    </span>
                  </span>
                  <span class="result-date">{{ formatDate(result.item.date) }}</span>
                  <span
                    class="result-relevance"
                    :class="getRelevanceClass(result.score)"
                    :title="`匹配度: ${Math.round((1 - result.score) * 100)}%`"
                  />
                </div>
              </button>
            </div>

            <!-- Empty state -->
            <div v-else-if="query && !isLoading" class="results-empty">
              <p class="empty-output">
                <span class="output-status">0</span> matches found
              </p>
              <p class="empty-hint">尝试不同的关键词或更短的搜索词</p>
            </div>

            <!-- Initial state -->
            <div v-else class="results-initial">
              <p class="initial-hint">
                <Icon name="ph:magnifying-glass" size="16" />
                输入关键词搜索文章...
              </p>
              <p class="initial-features">
                支持标题、描述、标签、正文模糊搜索
              </p>
              <div class="keyboard-hints">
                <span class="hint"><kbd>↑</kbd><kbd>↓</kbd> 导航</span>
                <span class="hint"><kbd>Enter</kbd> 选择</span>
                <span class="hint"><kbd>Esc</kbd> 关闭</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.search-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
  z-index: 200;
}

.search-modal {
  width: 100%;
  max-width: 600px;
  margin: 0 16px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
}

.terminal-buttons {
  display: flex;
  gap: 8px;
}

.terminal-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
}

.terminal-btn.red {
  background-color: var(--status-red);
}

.terminal-btn.yellow {
  background-color: var(--status-yellow);
}

.terminal-btn.green {
  background-color: var(--status-green);
}

.modal-title {
  flex: 1;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.shortcut-hint {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  padding: 2px 8px;
  background-color: var(--bg-secondary);
  border-radius: 4px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  font-family: var(--font-mono);
}

.input-prompt {
  color: var(--text-muted);
}

.input-cmd {
  color: var(--syntax-keyword);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--syntax-string);
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-loading {
  color: var(--text-muted);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
}

/* History styles */
.results-history {
  padding: 12px;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px 8px;
}

.history-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.history-clear {
  font-size: 0.75rem;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.history-clear:hover {
  color: var(--status-red);
  background-color: var(--bg-tertiary);
}

.history-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-item:hover {
  border-color: var(--primary);
  color: var(--text-primary);
}

.history-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.history-remove:hover {
  background-color: var(--status-red);
  color: white;
}

.results-loading,
.results-empty,
.results-initial {
  padding: 32px 16px;
  text-align: center;
}

.loading-text {
  font-family: var(--font-mono);
  color: var(--text-muted);
  margin: 0;
}

.empty-output {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0 0 8px 0;
}

.output-status {
  color: var(--status-yellow);
}

.empty-hint {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.initial-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text-muted);
  margin: 0 0 8px 0;
}

.initial-features {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0 0 16px 0;
}

.keyboard-hints {
  display: flex;
  justify-content: center;
  gap: 16px;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.hint {
  display: flex;
  align-items: center;
  gap: 4px;
}

kbd {
  padding: 2px 6px;
  background-color: var(--bg-tertiary);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
}

.results-list {
  padding: 8px;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  padding: 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease;
}

.result-item:hover,
.result-item.selected {
  background-color: var(--bg-tertiary);
}

.result-item.selected {
  outline: 2px solid var(--primary);
  outline-offset: -2px;
}

.result-main {
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-prefix {
  color: var(--primary);
  font-family: var(--font-mono);
}

.result-title {
  font-weight: 500;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.result-title :deep(mark) {
  background-color: var(--status-yellow);
  color: var(--bg-primary);
  padding: 0 2px;
  border-radius: 2px;
}

.result-source {
  font-size: 0.625rem;
  padding: 2px 6px;
  background-color: var(--bg-secondary);
  border-radius: 4px;
  color: var(--text-muted);
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 20px;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.result-category {
  color: var(--syntax-keyword);
}

.result-tags {
  display: flex;
  gap: 6px;
}

.result-tag {
  color: var(--syntax-function);
  font-size: 0.6875rem;
}

.result-relevance {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: auto;
}

.result-relevance.high {
  background-color: var(--status-green);
}

.result-relevance.medium {
  background-color: var(--status-yellow);
}

.result-relevance.low {
  background-color: var(--text-muted);
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .search-modal,
.modal-leave-active .search-modal {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .search-modal,
.modal-leave-to .search-modal {
  transform: scale(0.95);
  opacity: 0;
}

/* Dark mode */
:root.dark .search-modal-overlay {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
