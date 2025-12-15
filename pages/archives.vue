<script setup lang="ts">
import { siteConfig } from '~/config/site'
import type { Article } from '~/types'

const { getAllArticles } = useArticles()

// 获取所有文章
const { data: articles } = await useAsyncData(
  'all-articles-archive',
  () => getAllArticles(),
)

// 按年月分组文章
const groupedArticles = computed(() => {
  if (!articles.value) return {}

  const groups: Record<string, Record<string, Article[]>> = {}

  articles.value.forEach((article) => {
    const date = new Date(article.date)
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')

    if (!groups[year]) {
      groups[year] = {}
    }
    if (!groups[year][month]) {
      groups[year][month] = []
    }
    groups[year][month].push(article)
  })

  return groups
})

// 获取排序后的年份列表
const sortedYears = computed(() => {
  return Object.keys(groupedArticles.value).sort((a, b) => Number(b) - Number(a))
})

// 获取月份名称
const getMonthName = (month: string) => {
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  return months[parseInt(month) - 1]
}

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

// SEO
useHead({
  title: `归档 | ${siteConfig.name}`,
  meta: [
    { name: 'description', content: '按时间归档的所有文章' },
  ],
})
</script>

<template>
  <PageWrapper
    title="文章归档"
    subtitle="按时间线浏览所有文章"
    :stats="[
      { label: 'total', value: articles?.length || 0 },
      { label: 'years', value: sortedYears.length },
    ]"
  >
    <div class="archives-page">
      <!-- 归档时间线 -->
      <div v-if="sortedYears.length" class="archives-timeline">
        <div v-for="year in sortedYears" :key="year" class="year-group">
          <!-- 年份标题 -->
          <div class="year-header">
            <span class="year-prompt">$</span>
            <span class="year-cmd">ls</span>
            <span class="year-arg">./{{ year }}/</span>
          </div>

          <!-- 月份分组 -->
          <div
            v-for="month in Object.keys(groupedArticles[year]).sort((a, b) => Number(b) - Number(a))"
            :key="`${year}-${month}`"
            class="month-group"
          >
            <div class="month-header">
              <span class="month-name">{{ getMonthName(month) }}</span>
              <span class="month-count">({{ groupedArticles[year][month].length }})</span>
            </div>

            <!-- 文章列表 -->
            <ul class="article-list">
              <li
                v-for="article in groupedArticles[year][month]"
                :key="article._id"
                class="article-item"
              >
                <span class="article-date">{{ formatDate(article.date) }}</span>
                <NuxtLink :to="article._path" class="article-link">
                  <span class="article-title">{{ article.title }}</span>
                </NuxtLink>
                <span class="article-category">{{ article.category }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <EmptyState
        v-else
        title="暂无文章"
        message="文章正在准备中，敬请期待"
      />
    </div>
  </PageWrapper>
</template>

<style scoped>
.archives-page {
  max-width: 800px;
}

.archives-timeline {
  position: relative;
}

.year-group {
  margin-bottom: 48px;
}

.year-group:last-child {
  margin-bottom: 0;
}

.year-header {
  display: flex;
  gap: 6px;
  padding: 12px 16px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 1.125rem;
  margin-bottom: 24px;
}

.year-prompt {
  color: var(--text-muted);
}

.year-cmd {
  color: var(--syntax-keyword);
}

.year-arg {
  color: var(--primary);
  font-weight: 600;
}

.month-group {
  margin-left: 24px;
  margin-bottom: 24px;
  padding-left: 24px;
  border-left: 2px solid var(--border-color);
}

.month-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.month-name {
  font-weight: 600;
  color: var(--text-primary);
}

.month-count {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.article-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.article-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
}

.article-date {
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.article-link {
  flex: 1;
  min-width: 0;
}

.article-title {
  color: var(--text-primary);
  transition: color 0.2s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.article-link:hover .article-title {
  color: var(--primary);
}

.article-category {
  flex-shrink: 0;
  padding: 2px 8px;
  background-color: var(--bg-tertiary);
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

@media (max-width: 600px) {
  .month-group {
    margin-left: 12px;
    padding-left: 16px;
  }

  .article-item {
    flex-wrap: wrap;
    gap: 8px;
  }

  .article-category {
    order: 1;
  }

  .article-link {
    width: 100%;
    order: 2;
  }
}
</style>
