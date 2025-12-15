<script setup lang="ts">
import type { Article } from '~/types'

interface Props {
  article: Article
}

const props = defineProps<Props>()

const fileName = computed(() => {
  const slug = props.article._path?.split('/').pop() || 'article'
  return `${slug}.md`
})

const formattedDate = computed(() => {
  return new Date(props.article.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
})
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
              <span class="meta-value">{{ formattedDate }}</span>
            </span>
          </div>
        </div>
      </TerminalWindow>
    </NuxtLink>
  </article>
</template>

<style scoped>
.article-card {
  margin-bottom: 24px;
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
