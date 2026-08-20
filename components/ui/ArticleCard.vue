<script setup lang="ts">
import type { Article } from '~/types'

interface Props {
  article: Article
}

const props = defineProps<Props>()

const { authed } = useAuth()

const fileName = computed(() => {
  const slug = props.article._path?.split('/').pop() || 'article'
  return `${slug}.md`
})

const filePath = computed(() => `articles/${fileName.value}`)

const goEdit = () => navigateTo(`${props.article._path}?edit=1`)

async function remove() {
  if (!confirm(`删除文章「${props.article.title}」？`)) return
  await $fetch('/api/admin/articles', { method: 'DELETE', query: { path: filePath.value } })
  window.location.reload()
}
</script>

<template>
  <article class="article-card">
    <NuxtLink :to="article._path" class="article-link">
      <TerminalWindow :title="fileName" status="ready">
        <div class="article-content">
          <h3 class="article-title">{{ article.title }}</h3>
          <p class="article-excerpt">{{ article.description }}</p>
          <div class="article-meta">
            <span class="meta-item">
              <span class="meta-key">category:</span>
              <span class="meta-value">{{ article.category }}</span>
            </span>
            <span class="meta-item">
              <span class="meta-key">date:</span>
              <span class="meta-value">{{ formatDate(article.date) }}</span>
            </span>
          </div>
        </div>
      </TerminalWindow>
    </NuxtLink>
    <div v-if="authed" class="card-actions">
      <button class="card-action" @click="goEdit">✎ 编辑</button>
      <button class="card-action danger" @click="remove">✕ 删除</button>
    </div>
  </article>
</template>

<style scoped>
.article-card {
  position: relative;
  margin-bottom: 24px;
}

.card-actions {
  position: absolute;
  right: 16px;
  bottom: 12px;
  display: flex;
  gap: 12px;
  z-index: 1;
  transition: transform 0.3s ease;
}

/* 与 TerminalWindow 悬浮动画同步抬升 */
.article-card:hover .card-actions {
  transform: translateY(-2px);
}

.card-action {
  padding: 2px 8px;
  border: none;
  border-radius: 4px;
  background-color: var(--bg-tertiary);
  color: var(--text-muted);
  font-size: 0.8125rem;
  cursor: pointer;
}

.card-action:hover {
  color: var(--primary);
}

.card-action.danger:hover {
  color: #e06c75;
}

.article-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.article-content {
  padding: 8px 0;
}

.article-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  line-height: 1.4;
  transition: color 0.2s ease;
}

.article-link:hover .article-title {
  color: var(--primary);
}

.article-excerpt {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
}

.meta-item {
  display: flex;
  gap: 4px;
}

.meta-key {
  color: var(--syntax-keyword);
}

.meta-value {
  color: var(--syntax-string);
}
</style>
