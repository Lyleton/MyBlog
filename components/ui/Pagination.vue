<script setup lang="ts">
import type { PaginationData } from '~/types'

interface Props {
  pagination: PaginationData
  baseUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  baseUrl: '/articles',
})

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

const pageNumbers = computed(() => {
  const { currentPage, totalPages } = props.pagination
  const pages: (number | string)[] = []

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    if (currentPage > 3) {
      pages.push('...')
    }
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) {
      pages.push('...')
    }
    pages.push(totalPages)
  }

  return pages
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.pagination.totalPages) {
    emit('page-change', page)
  }
}
</script>

<template>
  <nav v-if="pagination.totalPages > 1" class="pagination" aria-label="分页导航">
    <div class="pagination-info">
      <span class="nav-cmd">cat</span>
      <span class="nav-flag">--page</span>
      <span class="nav-value">{{ pagination.currentPage }}</span>
      <span class="nav-sep">/</span>
      <span class="nav-total">{{ pagination.totalPages }}</span>
    </div>

    <div class="pagination-controls">
      <button
        class="page-btn"
        :disabled="!pagination.hasPrev"
        aria-label="上一页"
        @click="goToPage(pagination.currentPage - 1)"
      >
        <span class="nav-cmd">prev</span>
      </button>

      <div class="page-numbers">
        <template v-for="page in pageNumbers" :key="page">
          <span v-if="page === '...'" class="page-ellipsis">...</span>
          <button
            v-else
            class="page-num"
            :class="{ active: page === pagination.currentPage }"
            :aria-current="page === pagination.currentPage ? 'page' : undefined"
            @click="goToPage(page as number)"
          >
            {{ page }}
          </button>
        </template>
      </div>

      <button
        class="page-btn"
        :disabled="!pagination.hasNext"
        aria-label="下一页"
        @click="goToPage(pagination.currentPage + 1)"
      >
        <span class="nav-cmd">next</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 48px;
  font-family: var(--font-mono);
}

.pagination-info {
  display: flex;
  gap: 6px;
  font-size: 0.875rem;
}

.nav-flag {
  color: var(--text-muted);
}

.nav-value {
  color: var(--primary);
  font-weight: 600;
}

.nav-sep {
  color: var(--text-muted);
}

.nav-total {
  color: var(--text-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn {
  padding: 8px 16px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: var(--bg-tertiary);
  border-color: var(--primary);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-num {
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-num:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--primary);
}

.page-num.active {
  background-color: var(--primary);
  border-color: var(--primary);
  color: white;
}

.page-ellipsis {
  min-width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}
</style>
