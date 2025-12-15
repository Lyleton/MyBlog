<script setup lang="ts">
import { siteConfig } from '~/config/site'

const { getAllArticles, getArticleStats } = useArticles()

// 获取最新文章（首页显示5篇）
const { data: articles } = await useAsyncData('home-articles', () => getAllArticles(5))

// 获取统计数据
const { data: stats } = await useAsyncData('article-stats', () => getArticleStats())

// 页面统计
const pageStats = computed(() => [
  { label: 'articles', value: stats.value?.total || 0 },
  { label: 'categories', value: stats.value?.categories || 0 },
])

// SEO
useHead({
  title: siteConfig.title,
  meta: [
    { name: 'description', content: siteConfig.description },
  ],
})
</script>

<template>
  <PageWrapper
    title="最新文章"
    subtitle="探索技术的无限可能，分享实战经验与思考"
    :stats="pageStats"
  >
    <div class="article-list">
      <ArticleCard
        v-for="article in articles"
        :key="article._id"
        :article="article"
      />
    </div>

    <!-- 查看更多 -->
    <div v-if="articles && articles.length >= 5" class="pagination">
      <NuxtLink to="/articles" class="pagination-more">
        <span class="nav-cmd">cat</span>
        <span class="nav-flag">--more</span>
        <span class="nav-arg">articles/</span>
      </NuxtLink>
    </div>
  </PageWrapper>
</template>

<style scoped>
.article-list {
  margin-bottom: 48px;
}

.pagination {
  text-align: center;
}

.pagination-more {
  display: inline-flex;
  gap: 6px;
  padding: 12px 24px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 0.9375rem;
  transition: all 0.2s ease;
}

.pagination-more:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--primary);
}

.nav-flag {
  color: var(--text-muted);
}
</style>
