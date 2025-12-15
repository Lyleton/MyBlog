<script setup lang="ts">
import type { Article } from '~/types'

/**
 * SearchModal - Terminal-style search modal with keyboard navigation
 */
interface Props {
  isOpen: boolean
  query: string
  results: Article[]
  isLoading: boolean
  selectedIndex: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:query': [value: string]
  'close': []
  'navigate-up': []
  'navigate-down': []
  'select': []
}>()

const router = useRouter()
const inputRef = ref<HTMLInputElement | null>(null)

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
        router.push(selected._path!)
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
const handleResultClick = (article: Article) => {
  router.push(article._path!)
  emit('close')
}
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
          </div>

          <!-- Search input -->
          <div class="search-input-wrapper">
            <span class="input-prompt">$</span>
            <span class="input-cmd">grep -r</span>
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

            <!-- Results list -->
            <div v-else-if="results.length" class="results-list">
              <button
                v-for="(article, index) in results"
                :key="article._id"
                class="result-item"
                :class="{ selected: index === selectedIndex }"
                @click="handleResultClick(article)"
                @mouseenter="emit('update:query', query)"
              >
                <div class="result-main">
                  <span class="result-prefix">→</span>
                  <span class="result-title">{{ article.title }}</span>
                </div>
                <div class="result-meta">
                  <span class="result-category">{{ article.category }}</span>
                  <span class="result-date">{{ formatDate(article.date) }}</span>
                </div>
              </button>
            </div>

            <!-- Empty state -->
            <div v-else-if="query && !isLoading" class="results-empty">
              <p class="empty-output">
                <span class="output-status">0</span> matches found
              </p>
              <p class="empty-hint">Try different keywords</p>
            </div>

            <!-- Initial state -->
            <div v-else class="results-initial">
              <p class="initial-hint">
                <Icon name="ph:magnifying-glass" size="16" />
                Type to search articles...
              </p>
              <div class="keyboard-hints">
                <span class="hint"><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
                <span class="hint"><kbd>Enter</kbd> select</span>
                <span class="hint"><kbd>Esc</kbd> close</span>
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
  max-width: 560px;
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
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--text-muted);
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
}

.result-meta {
  display: flex;
  gap: 12px;
  padding-left: 20px;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.result-category {
  color: var(--syntax-keyword);
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
