<script setup lang="ts">
import { siteConfig } from '~/config/site'

const route = useRoute()
const slug = route.params.slug as string

const { getArticleBySlug, getAdjacentArticles } = useArticles()

// 获取文章内容
const { data: article, error } = await useAsyncData(
  `article-${slug}`,
  () => getArticleBySlug(slug),
)

// 获取相邻文章
const { data: adjacent } = await useAsyncData(
  `adjacent-${slug}`,
  () => getAdjacentArticles(`/articles/${slug}`),
)

// 404 处理
if (error.value || !article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article Not Found',
  })
}

// 格式化日期
const formattedDate = computed(() => {
  if (!article.value?.date) return ''
  return new Date(article.value.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

// 获取 TOC
const toc = computed(() => {
  return article.value?.body?.toc?.links || []
})

// SEO
useHead({
  title: `${article.value?.title} | ${siteConfig.name}`,
  meta: [
    { name: 'description', content: article.value?.description },
    { property: 'og:title', content: article.value?.title },
    { property: 'og:description', content: article.value?.description },
    { property: 'og:type', content: 'article' },
    { property: 'article:published_time', content: article.value?.date },
  ],
})
</script>

<template>
  <div class="article-page">
    <article class="article">
      <!-- 文章头部 -->
      <header class="article-header">
        <div class="article-meta-top">
          <NuxtLink :to="`/articles?category=${article?.category}`" class="article-category">
            {{ article?.category }}
          </NuxtLink>
          <span class="article-date">{{ formattedDate }}</span>
        </div>

        <h1 class="article-title">{{ article?.title }}</h1>

        <p class="article-description">{{ article?.description }}</p>

        <div class="article-info">
          <span v-if="article?.tags?.length" class="article-tags">
            <span class="info-label">tags:</span>
            <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
          </span>
        </div>
      </header>

      <!-- 文章目录 -->
      <aside v-if="toc.length" class="article-toc">
        <TableOfContents :links="toc" />
      </aside>

      <!-- 文章内容 -->
      <div class="article-content prose">
        <ContentRenderer v-if="article" :value="article" />
      </div>

      <!-- 评论区 -->
      <Comments />

      <!-- 文章底部 -->
      <footer class="article-footer">
        <!-- 上一篇/下一篇 -->
        <nav v-if="adjacent" class="article-nav">
          <NuxtLink
            v-if="adjacent.prev"
            :to="adjacent.prev._path"
            class="nav-link prev"
          >
            <span class="nav-label">
              <span class="nav-cmd">cd</span>
              <span class="nav-arg">../prev</span>
            </span>
            <span class="nav-title">{{ adjacent.prev.title }}</span>
          </NuxtLink>
          <div v-else />

          <NuxtLink
            v-if="adjacent.next"
            :to="adjacent.next._path"
            class="nav-link next"
          >
            <span class="nav-label">
              <span class="nav-cmd">cd</span>
              <span class="nav-arg">../next</span>
            </span>
            <span class="nav-title">{{ adjacent.next.title }}</span>
          </NuxtLink>
        </nav>
      </footer>
    </article>
  </div>
</template>

<style scoped>
.article-page {
  max-width: 800px;
  margin: 0 auto;
}

.article-header {
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border-color);
}

.article-meta-top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  font-family: var(--font-mono);
  font-size: 0.875rem;
}

.article-category {
  padding: 4px 12px;
  background-color: var(--primary-light);
  color: var(--primary);
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.article-category:hover {
  background-color: var(--primary);
  color: white;
}

.article-date {
  color: var(--text-muted);
}

.article-title {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-primary);
  margin: 0 0 16px 0;
}

.article-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.article-info {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
}

.article-tags {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label {
  color: var(--syntax-keyword);
}

.tag {
  padding: 2px 8px;
  background-color: var(--bg-tertiary);
  border-radius: 4px;
  color: var(--text-secondary);
}

.article-toc {
  margin-bottom: 32px;
}

.article-content {
  margin-bottom: 64px;
}

.article-footer {
  padding-top: 32px;
  border-top: 1px solid var(--border-color);
}

.article-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.nav-link {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  border-color: var(--primary);
  background-color: var(--bg-tertiary);
}

.nav-link.next {
  text-align: right;
}

.nav-label {
  display: flex;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
}

.nav-link.next .nav-label {
  justify-content: flex-end;
}

.nav-title {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.9375rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Dark mode */
:root.dark .article-category {
  background-color: var(--bg-tertiary);
}
</style>
