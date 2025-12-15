<script setup lang="ts">
const colorMode = useColorMode()

// 动态导入 Giscus，仅在客户端加载
const Giscus = defineAsyncComponent(() => import('@giscus/vue'))

// Giscus 配置 - 需要从 https://giscus.app/ 获取
// 1. 确保你的 GitHub 仓库是公开的
// 2. 安装 Giscus GitHub App: https://github.com/apps/giscus
// 3. 在仓库启用 Discussions 功能
// 4. 访问 https://giscus.app/ 获取配置参数

interface Props {
  repo?: `${string}/${string}`
  repoId?: string
  category?: string
  categoryId?: string
}

const props = withDefaults(defineProps<Props>(), {
  // 默认配置 - 请替换为你自己的配置
  repo: 'example/example-repo' as `${string}/${string}`,
  repoId: 'your-repo-id',
  category: 'Announcements',
  categoryId: 'your-category-id',
})

// 根据主题切换 Giscus 主题
const giscusTheme = computed(() => {
  return colorMode.value === 'dark' ? 'dark_dimmed' : 'light'
})
</script>

<template>
  <div class="comments-section">
    <div class="comments-header">
      <span class="comments-prompt">$</span>
      <span class="comments-cmd">cat</span>
      <span class="comments-arg">./comments.md</span>
    </div>

    <div class="comments-container">
      <ClientOnly>
        <Giscus
          :repo="props.repo"
          :repo-id="props.repoId"
          :category="props.category"
          :category-id="props.categoryId"
          mapping="pathname"
          reactions-enabled="1"
          emit-metadata="0"
          input-position="top"
          :theme="giscusTheme"
          lang="zh-CN"
          loading="lazy"
        />
        <template #fallback>
          <div class="comments-loading">加载评论中...</div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.comments-section {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--border-color);
}

.comments-header {
  display: flex;
  gap: 6px;
  margin-bottom: 24px;
  font-family: var(--font-mono);
  font-size: 0.9375rem;
}

.comments-prompt {
  color: var(--text-muted);
}

.comments-cmd {
  color: var(--syntax-keyword);
}

.comments-arg {
  color: var(--syntax-string);
}

.comments-container {
  background-color: var(--bg-secondary);
  border-radius: 8px;
  padding: 16px;
}

.comments-loading {
  padding: 24px;
  text-align: center;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.875rem;
}

/* Override Giscus styles to match theme */
:deep(.giscus) {
  max-width: 100%;
}

:deep(.giscus-frame) {
  border: none;
}
</style>
