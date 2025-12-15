<script setup lang="ts">
import { siteConfig } from '~/config/site'

const route = useRoute()
const router = useRouter()

const { getArticlesPaginated, getAllCategories, getArticlesByCategory } = useArticles()

// 获取当前页码和分类
const currentPage = computed(() => {
  const page = Number(route.query.page) || 1
  return Math.max(1, page)
})

const currentCategory = computed(() => {
  return (route.query.category as string) || ''
})

// 获取所有分类
const { data: categories } = await useAsyncData(
  'all-categories',
  () => getAllCategories(),
)

// 获取文章（支持分类筛选）
const { data, pending, error } = await useAsyncData(
  `articles-${currentCategory.value}-${currentPage.value}`,
  async () => {
    if (currentCategory.value) {
      const articles = await getArticlesByCategory(currentCategory.value)
      // 手动分页
      const perPage = 8
      const start = (currentPage.value - 1) * perPage
      const end = start + perPage
      const totalPages = Math.ceil(articles.length / perPage)
      return {
        articles: articles.slice(start, end),
        pagination: {
          currentPage: currentPage.value,
          totalPages,
          totalItems: articles.length,
          perPage,
          hasNext: currentPage.value < totalPages,
          hasPrev: currentPage.value > 1,
        },
      }
    }
    return getArticlesPaginated(currentPage.value, 8)
  },
  { watch: [currentPage, currentCategory] },
)

// 处理分类变化
const handleCategoryChange = (category: string) => {
  router.push({
    query: {
      ...route.query,
      category: category || undefined,
      page: undefined, // 重置页码
    },
  })
}

// 处理分页变化
const handlePageChange = (page: number) => {
  router.push({ query: { ...route.query, page } })
}

// SEO
useHead({
  title: currentCategory.value
    ? `${currentCategory.value} 文章 | ${siteConfig.name}`
    : `文章列表 | ${siteConfig.name}`,
  meta: [
    { name: 'description', content: currentCategory.value
      ? `${currentCategory.value} 分类下的所有技术文章`
      : '所有技术文章列表',
    },
  ],
})
</script>

<template>
  <PageWrapper
    :title="currentCategory ? `${currentCategory} 文章` : '所有文章'"
    :subtitle="currentCategory ? `${currentCategory} 分类下的所有技术文章` : '按时间倒序排列的所有技术文章'"
    :stats="[
      { label: 'total', value: data?.pagination.totalItems || 0 },
      { label: 'page', value: `${currentPage}/${data?.pagination.totalPages || 1}` },
    ]"
  >
    <!-- 分类筛选 -->
    <FilterBar
      v-if="categories?.length"
      :categories="categories"
      :model-value="currentCategory"
      @update:model-value="handleCategoryChange"
    />

    <!-- 加载状态 -->
    <div v-if="pending" class="loading">
      <div v-for="i in 4" :key="i" class="skeleton-card">
        <Skeleton height="200px" />
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      <TerminalWindow title="error.log" status="error">
        <p>加载文章失败，请稍后重试</p>
      </TerminalWindow>
    </div>

    <!-- 文章列表 -->
    <template v-else-if="data">
      <div v-if="data.articles.length" class="article-list">
        <ArticleCard
          v-for="article in data.articles"
          :key="article._id"
          :article="article"
        />
      </div>

      <!-- 空状态 -->
      <EmptyState
        v-else
        :title="currentCategory ? `没有 ${currentCategory} 分类的文章` : '暂无文章'"
        :message="currentCategory ? '试试其他分类或查看全部文章' : '文章正在准备中，敬请期待'"
      />

      <!-- 分页 -->
      <Pagination
        v-if="data.articles.length"
        :pagination="data.pagination"
        @page-change="handlePageChange"
      />
    </template>
  </PageWrapper>
</template>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.skeleton-card {
  border-radius: 12px;
  overflow: hidden;
}

.article-list {
  margin-bottom: 24px;
}

.error {
  max-width: 500px;
  margin: 64px auto;
  text-align: center;
}
</style>
