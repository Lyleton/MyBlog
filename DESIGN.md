# TechBlog System Design Document

## Overview

基于终端/代码编辑器风格的**个人技术博客**系统设计。

**设计原则：** 简洁、高效、零运维成本

```
┌─────────────────────────────────────────────────────────────────┐
│                        ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│   │   Content   │    │   Nuxt 3    │    │   Vercel    │        │
│   │    (.md)    │───▶│   (SSG)     │───▶│   (CDN)     │        │
│   └─────────────┘    └─────────────┘    └─────────────┘        │
│         │                   │                   │               │
│         ▼                   ▼                   ▼               │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│   │ Frontmatter │    │    Vue 3    │    │   Global    │        │
│   │  Metadata   │    │ Components  │    │   Delivery  │        │
│   └─────────────┘    └─────────────┘    └─────────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Technology Stack

### Core Framework
| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | **Nuxt 3** | Vue 的 SSG/SSR 框架，优秀 DX，自动导入 |
| UI Library | **Vue 3** (Composition API) | 响应式系统，组合式函数 |
| Language | TypeScript | 类型安全，更好的开发体验 |
| Styling | Tailwind CSS + CSS Variables | 原子化CSS，主题系统 |
| Content | **@nuxt/content v2** | 官方内容模块，Markdown + Vue 组件 |

> 💡 **技术选型说明**：选择 @nuxt/content 作为内容管理方案，它是 Vue 生态中功能最完整的解决方案：
> - 官方维护，与 Nuxt 深度集成
> - 支持 Markdown 中使用 Vue 组件（MDC 语法）
> - 内置 TypeScript 类型生成
> - 内置全文搜索（无需额外配置 FlexSearch）
> - Shiki 代码高亮零配置

### Additional Tools
| Feature | Technology | Rationale |
|---------|------------|-----------|
| Code Highlighting | Shiki (@nuxt/content 内置) | 静态生成，多主题支持 |
| Search | @nuxt/content 内置搜索 | 全文搜索，无需后端 |
| Deployment | Vercel / Netlify | 零配置，CDN 加速 |
| Dark Mode | @nuxtjs/color-mode | SSR 友好，无闪烁，系统偏好检测 |
| Comments | Giscus + @giscus/vue | GitHub Discussions，支持主题切换 |
| Image Optimization | @nuxt/image | 自动 WebP/AVIF，响应式图片 |
| Font Optimization | @nuxt/fonts | 字体子集加载，性能优化 |
| Analytics | Vercel Analytics (可选) | 内置分析，零配置 |

---

## 2. Project Structure

```
myblog/
├── app.vue                       # 根组件
├── nuxt.config.ts               # Nuxt 配置
│
├── pages/                        # 页面路由（文件即路由）
│   ├── index.vue                # 首页 /
│   ├── articles/
│   │   ├── index.vue            # 文章列表 /articles
│   │   └── [slug].vue           # 文章详情 /articles/:slug
│   ├── about.vue                # 关于页面 /about
│   ├── archives.vue             # 归档页面 /archives
│   └── search.vue               # 搜索页面 /search
│
├── layouts/                      # 布局组件
│   ├── default.vue              # 默认布局（Sidebar + Main）
│   └── error.vue                # 错误页面布局
│
├── components/                   # 组件（自动导入）
│   ├── layout/
│   │   ├── Sidebar.vue          # 左侧边栏
│   │   ├── Footer.vue           # 终端风格页脚
│   │   └── PageWrapper.vue      # 页面容器
│   │
│   ├── ui/
│   │   ├── TerminalWindow.vue   # macOS 窗口风格
│   │   ├── ArticleCard.vue      # 文章预览卡片
│   │   ├── CodeBlock.vue        # 代码高亮块
│   │   ├── FilterBar.vue        # 分类筛选
│   │   ├── Pagination.vue       # 终端风格分页
│   │   ├── SearchInput.vue      # 搜索框
│   │   ├── SkillBar.vue         # 技能进度条
│   │   ├── ThemeToggle.vue      # 主题切换
│   │   ├── Comments.vue         # Giscus 评论
│   │   ├── EmptyState.vue       # 空状态组件
│   │   └── Skeleton.vue         # 加载骨架屏
│   │
│   └── content/                  # MDC 组件（Markdown 中使用）
│       ├── Callout.vue          # 提示/警告框
│       ├── CodeTitle.vue        # 代码块标题
│       └── ArticleImage.vue     # 优化图片组件
│
├── content/                      # @nuxt/content 内容目录
│   └── articles/                # Markdown 文章
│       ├── react-concurrent.md
│       ├── vue-composition.md
│       └── ...
│
├── composables/                  # Vue 组合式函数（自动导入）
│   ├── useArticles.ts           # 文章数据获取
│   ├── useSearch.ts             # 搜索逻辑
│   └── useReadingTime.ts        # 阅读时间计算
│
├── server/                       # 服务端 API
│   └── routes/
│       ├── feed.xml.ts          # RSS feed
│       └── sitemap.xml.ts       # Sitemap
│
├── assets/
│   └── css/
│       └── main.css             # 全局样式 + CSS 变量
│
├── public/
│   ├── images/                  # 静态图片
│   └── fonts/                   # 自定义字体（可选）
│
├── scripts/                     # CLI 工具
│   ├── new-post.ts             # 创建新文章
│   └── publish.ts              # 发布草稿
│
├── types/
│   └── index.ts                 # TypeScript 类型
│
└── config/
    ├── site.ts                  # 站点配置
    └── navigation.ts            # 导航配置
```

---

## 3. Data Models

### Article Frontmatter Schema

```typescript
// types/index.ts
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

interface Article extends ParsedContent {
  // Required (Frontmatter)
  title: string;           // 文章标题
  description: string;     // 简短描述 (SEO)
  date: string;            // 发布日期 (ISO 8601)
  category: string;        // 主分类

  // Optional (Frontmatter)
  updated?: string;        // 更新日期
  tags?: string[];         // 标签列表
  cover?: string;          // 封面图片
  featured?: boolean;      // 精选文章
  published?: boolean;     // 发布状态（默认 true）

  // @nuxt/content 自动生成
  _path: string;           // 路由路径
  _id: string;             // 唯一标识
  _type: 'markdown';       // 内容类型
  body: ParsedContent;     // 解析后的内容
  excerpt?: ParsedContent; // 摘要（如果配置了）

  // 阅读时间（需要配置 reading-time remark 插件）
  readingTime?: {
    text: string;          // "5 min read"
    minutes: number;       // 5
    words: number;         // 1200
  };
}

// 目录项类型 (兼容 @nuxt/content TocLink)
interface TOCItem {
  id: string;
  text: string;
  depth: number;
  children?: TOCItem[];    // 嵌套子标题
}
```

### Site Configuration

```typescript
// config/site.ts
export const siteConfig = {
  name: "TechBlog",
  description: "专注于前端开发、后端架构和 DevOps 实践的技术博客",
  url: "https://techblog.example.com",

  author: {
    name: "Lyleton",
    bio: "Full-stack Developer",
    avatar: "/images/avatar.png",
    social: {
      github: "https://github.com/lyleton",
      twitter: "https://twitter.com/lyleton_dev",
      email: "hello@techblog.com",
    },
  },

  // Pagination
  postsPerPage: 8,

  // Categories with colors (参考原型图分类)
  categories: [
    { slug: "react", name: "React", color: "#61dafb" },
    { slug: "vue", name: "Vue", color: "#42b883" },
    { slug: "nodejs", name: "Node.js", color: "#68a063" },
    { slug: "typescript", name: "TypeScript", color: "#3178c6" },
    { slug: "devops", name: "DevOps", color: "#326ce5" },
    { slug: "performance", name: "Performance", color: "#e07a5f" },
  ],
}
```

### Navigation Configuration

```typescript
// config/navigation.ts
export const navigation = [
  {
    cmd: "cd",
    arg: "~/home",
    href: "/",
    label: "首页"
  },
  {
    cmd: "ls",
    arg: "./articles",
    href: "/articles",
    label: "文章"
  },
  {
    cmd: "cat",
    arg: "archives.md",
    href: "/archives",
    label: "归档"
  },
  {
    cmd: "cat",
    arg: "about.md",
    href: "/about",
    label: "关于"
  },
]
```

---

## 4. Component Specifications

### TerminalWindow.vue

```vue
<script setup lang="ts">
defineProps<{
  title: string
  status?: 'ready' | 'reading' | 'loading'
}>()
</script>

<template>
  <div class="terminal-window">
    <div class="terminal-header">
      <div class="flex gap-1.5">
        <span class="w-3 h-3 rounded-full bg-status-red" />
        <span class="w-3 h-3 rounded-full bg-status-yellow" />
        <span class="w-3 h-3 rounded-full bg-status-green" />
      </div>
      <span class="text-text-muted text-sm font-mono">{{ title }}</span>
      <span class="text-status-green text-xs">● {{ status || 'ready' }}</span>
    </div>
    <div class="terminal-body">
      <slot />
    </div>
  </div>
</template>
```

**Visual Structure:**
```
┌──────────────────────────────────────────────┐
│ ● ● ●    react-concurrent.md         ● ready │  <- Header
├──────────────────────────────────────────────┤
│                                              │
│              [slot content]                  │  <- Body
│                                              │
└──────────────────────────────────────────────┘
```

### ArticleCard.vue

```vue
<script setup lang="ts">
import type { Article } from '~/types'

defineProps<{
  article: Article
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}
</script>

<template>
  <NuxtLink :to="article._path" class="block group">
    <TerminalWindow
      :title="`${article._path.split('/').pop()}.md`"
      status="ready"
    >
      <div class="p-4">
        <h3 class="text-lg font-semibold text-text-primary group-hover:text-primary">
          > {{ article.title }}
        </h3>
        <p class="text-text-secondary mt-2 line-clamp-2">
          // {{ article.description }}
        </p>
        <div class="flex gap-4 mt-3 text-sm text-text-muted font-mono">
          <span>category: "{{ article.category }}"</span>
          <span>date: "{{ formatDate(article.date) }}"</span>
        </div>
      </div>
    </TerminalWindow>
  </NuxtLink>
</template>
```

### ThemeToggle.vue

```vue
<script setup lang="ts">
const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const isDark = computed(() => colorMode.value === 'dark')
</script>

<template>
  <button
    @click="toggleTheme"
    class="flex items-center gap-2 px-3 py-2 rounded hover:bg-bg-secondary transition-colors"
    :aria-label="isDark ? '切换到亮色模式' : '切换到暗色模式'"
  >
    <span class="text-text-muted font-mono">$ theme</span>
    <span class="text-primary font-mono">
      {{ isDark ? '--light' : '--dark' }}
    </span>
  </button>
</template>
```

### Comments.vue

```vue
<script setup lang="ts">
import Giscus from '@giscus/vue'

const colorMode = useColorMode()

const giscusTheme = computed(() =>
  colorMode.value === 'dark' ? 'dark_dimmed' : 'light'
)

const config = useRuntimeConfig()
</script>

<template>
  <TerminalWindow title="comments.md" status="ready">
    <div class="p-4">
      <ClientOnly>
        <Giscus
          :repo="config.public.giscusRepo"
          :repo-id="config.public.giscusRepoId"
          :category="config.public.giscusCategory"
          :category-id="config.public.giscusCategoryId"
          mapping="pathname"
          reactions-enabled="1"
          emit-metadata="0"
          input-position="top"
          :theme="giscusTheme"
          lang="zh-CN"
        />
        <template #fallback>
          <Skeleton class="h-64" />
        </template>
      </ClientOnly>
    </div>
  </TerminalWindow>
</template>
```

### SearchInput.vue

```vue
<script setup lang="ts">
const emit = defineEmits<{
  open: []
}>()

// 键盘快捷键 `/` 打开搜索
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
      e.preventDefault()
      emit('open')
    }
  }
  window.addEventListener('keydown', handleKeydown)
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
})
</script>

<template>
  <button
    @click="emit('open')"
    class="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-tertiary border border-border hover:border-primary/50 transition-colors text-left"
  >
    <svg class="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <span class="text-text-muted text-sm font-mono flex-1">grep -r 'search...'</span>
    <kbd class="px-1.5 py-0.5 text-xs bg-bg-secondary rounded border border-border">/</kbd>
  </button>
</template>
```

### SearchModal.vue

```vue
<script setup lang="ts">
import type { Article } from '~/types'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { searchQuery, searchResults, isSearching, search } = useSearch()
const inputRef = ref<HTMLInputElement>()
const selectedIndex = ref(0)

// 打开时聚焦输入框
watch(() => props.modelValue, (open) => {
  if (open) {
    nextTick(() => inputRef.value?.focus())
    selectedIndex.value = 0
  } else {
    searchQuery.value = ''
  }
})

// 键盘导航
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'Escape':
      emit('update:modelValue', false)
      break
    case 'ArrowDown':
      e.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, searchResults.value.length - 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
      break
    case 'Enter':
      if (searchResults.value[selectedIndex.value]) {
        navigateTo(searchResults.value[selectedIndex.value]._path)
        emit('update:modelValue', false)
      }
      break
  }
}

const close = () => emit('update:modelValue', false)
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]"
        @click.self="close"
        @keydown="handleKeydown"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50" @click="close" />

        <!-- Modal -->
        <div class="relative w-full max-w-xl bg-bg-primary rounded-xl shadow-lg border border-border overflow-hidden">
          <!-- Search Input -->
          <div class="flex items-center gap-3 px-4 py-3 border-b border-border">
            <svg class="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref="inputRef"
              v-model="searchQuery"
              type="text"
              placeholder="搜索文章..."
              class="flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-muted"
            />
            <kbd class="px-2 py-1 text-xs bg-bg-secondary rounded border border-border">ESC</kbd>
          </div>

          <!-- Results -->
          <div class="max-h-[60vh] overflow-y-auto">
            <!-- Loading -->
            <div v-if="isSearching" class="p-8 text-center">
              <div class="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>

            <!-- Results List -->
            <template v-else-if="searchResults.length > 0">
              <NuxtLink
                v-for="(result, index) in searchResults"
                :key="result._id"
                :to="result._path"
                class="block px-4 py-3 hover:bg-bg-secondary transition-colors"
                :class="{ 'bg-bg-secondary': index === selectedIndex }"
                @click="close"
              >
                <h4 class="font-medium text-text-primary">{{ result.title }}</h4>
                <p class="text-sm text-text-secondary line-clamp-1">{{ result.description }}</p>
              </NuxtLink>
            </template>

            <!-- Empty State -->
            <div v-else-if="searchQuery" class="p-8 text-center text-text-muted">
              没有找到相关文章
            </div>

            <!-- Initial State -->
            <div v-else class="p-8 text-center text-text-muted">
              输入关键词开始搜索
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
```

### Skeleton.vue

```vue
<script setup lang="ts">
defineProps<{
  class?: string
  rounded?: 'sm' | 'md' | 'lg' | 'full'
}>()
</script>

<template>
  <div
    class="animate-pulse bg-bg-tertiary"
    :class="[
      $props.class,
      {
        'rounded-sm': rounded === 'sm',
        'rounded-md': rounded === 'md' || !rounded,
        'rounded-lg': rounded === 'lg',
        'rounded-full': rounded === 'full',
      }
    ]"
  />
</template>
```

### FilterBar.vue

```vue
<script setup lang="ts">
import { siteConfig } from '~/config/site'

const props = defineProps<{
  modelValue: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const categories = siteConfig.categories
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <!-- All -->
    <button
      @click="emit('update:modelValue', null)"
      class="px-3 py-1.5 rounded-lg text-sm font-mono transition-colors"
      :class="!modelValue
        ? 'bg-primary text-white'
        : 'bg-bg-tertiary text-text-secondary hover:bg-bg-secondary'"
    >
      <span class="text-syntax-keyword">*</span>
    </button>

    <!-- Categories -->
    <button
      v-for="cat in categories"
      :key="cat.slug"
      @click="emit('update:modelValue', cat.slug)"
      class="px-3 py-1.5 rounded-lg text-sm font-mono transition-colors"
      :class="modelValue === cat.slug
        ? 'text-white'
        : 'bg-bg-tertiary text-text-secondary hover:bg-bg-secondary'"
      :style="modelValue === cat.slug ? { backgroundColor: cat.color } : {}"
    >
      {{ cat.name }}
    </button>
  </div>
</template>
```

### EmptyState.vue

```vue
<script setup lang="ts">
defineProps<{
  icon?: string
  title: string
  description?: string
}>()
</script>

<template>
  <div class="py-16 text-center">
    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-bg-tertiary mb-4">
      <Icon v-if="icon" :name="icon" class="w-8 h-8 text-text-muted" />
      <svg v-else class="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h3 class="text-lg font-medium text-text-primary mb-2">{{ title }}</h3>
    <p v-if="description" class="text-text-secondary">{{ description }}</p>
    <slot />
  </div>
</template>
```

### Callout.vue (MDC Component)

```vue
<!-- components/content/Callout.vue -->
<script setup lang="ts">
defineProps<{
  type?: 'info' | 'warning' | 'error' | 'success' | 'tip'
  title?: string
}>()

const icons = {
  info: 'heroicons:information-circle',
  warning: 'heroicons:exclamation-triangle',
  error: 'heroicons:x-circle',
  success: 'heroicons:check-circle',
  tip: 'heroicons:light-bulb',
}

const colors = {
  info: 'border-blue-500 bg-blue-500/10',
  warning: 'border-yellow-500 bg-yellow-500/10',
  error: 'border-red-500 bg-red-500/10',
  success: 'border-green-500 bg-green-500/10',
  tip: 'border-primary bg-primary/10',
}
</script>

<template>
  <div
    class="my-4 p-4 rounded-lg border-l-4"
    :class="colors[type || 'info']"
  >
    <div v-if="title" class="flex items-center gap-2 mb-2 font-medium">
      <Icon :name="icons[type || 'info']" class="w-5 h-5" />
      <span>{{ title }}</span>
    </div>
    <div class="prose-sm">
      <slot />
    </div>
  </div>
</template>
```

**Markdown 中使用 Callout：**
```markdown
::callout{type="info" title="提示"}
这是一个信息提示框。
::

::callout{type="warning"}
这是一个警告框，没有标题。
::
```

### PageWrapper.vue

```vue
<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}>()

const widthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-3xl',
  lg: 'max-w-4xl',
  xl: 'max-w-5xl',
  full: 'max-w-full',
}
</script>

<template>
  <div :class="widthClasses[maxWidth || 'lg']" class="mx-auto">
    <header v-if="title || $slots.header" class="mb-8">
      <slot name="header">
        <h1 class="text-3xl font-bold text-text-primary">{{ title }}</h1>
        <p v-if="subtitle" class="mt-2 text-text-secondary">{{ subtitle }}</p>
      </slot>
    </header>

    <slot />
  </div>
</template>
```

---

## 5. Page Routes

### Route Map

| Path | Page | Data Strategy |
|------|------|---------------|
| `/` | Homepage | SSG |
| `/articles` | Article List | SSG |
| `/articles?category=X` | Filtered List | Client filter |
| `/articles/:slug` | Article Detail | SSG |
| `/about` | About Page | SSG |
| `/archives` | Archives | SSG |
| `/search` | Search Results | CSR |
| `/feed.xml` | RSS Feed | SSG |
| `/sitemap.xml` | Sitemap | SSG |

### Composables (数据获取)

```typescript
// composables/useArticles.ts

export const useArticles = () => {
  // 获取所有文章（已发布，按日期排序）
  const getAllArticles = () => {
    return queryContent('articles')
      .where({ published: { $ne: false } })
      .sort({ date: -1 })
      .find()
  }

  // 获取单篇文章
  const getArticleBySlug = (slug: string) => {
    return queryContent('articles', slug).findOne()
  }

  // 获取分类文章
  const getArticlesByCategory = (category: string) => {
    return queryContent('articles')
      .where({ category, published: { $ne: false } })
      .sort({ date: -1 })
      .find()
  }

  // 获取标签文章
  const getArticlesByTag = (tag: string) => {
    return queryContent('articles')
      .where({ tags: { $contains: tag }, published: { $ne: false } })
      .sort({ date: -1 })
      .find()
  }

  // 分页获取文章
  const getPaginatedArticles = async (page: number, perPage: number) => {
    const skip = (page - 1) * perPage

    const [articles, total] = await Promise.all([
      queryContent('articles')
        .where({ published: { $ne: false } })
        .sort({ date: -1 })
        .skip(skip)
        .limit(perPage)
        .find(),
      queryContent('articles')
        .where({ published: { $ne: false } })
        .count()
    ])

    return {
      articles,
      totalPages: Math.ceil(total / perPage),
      currentPage: page,
    }
  }

  // 获取所有分类及数量
  const getAllCategories = async () => {
    const articles = await getAllArticles()
    const categories = new Map<string, number>()

    articles.forEach(article => {
      const count = categories.get(article.category) || 0
      categories.set(article.category, count + 1)
    })

    return Array.from(categories.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }

  return {
    getAllArticles,
    getArticleBySlug,
    getArticlesByCategory,
    getArticlesByTag,
    getPaginatedArticles,
    getAllCategories,
  }
}
```

### Search Strategy

**方案：queryContent 模糊搜索 + Pagefind 全文搜索**

```typescript
// composables/useSearch.ts
import type { Article } from '~/types'

export const useSearch = () => {
  const searchQuery = ref('')
  const searchResults = ref<Article[]>([])
  const isSearching = ref(false)

  const search = async (query: string) => {
    if (!query.trim()) {
      searchResults.value = []
      return
    }

    isSearching.value = true

    try {
      // 方案 1: queryContent 模糊匹配（适合简单场景）
      const results = await queryContent<Article>('articles')
        .where({
          $or: [
            { title: { $icontains: query } },
            { description: { $icontains: query } },
            { category: { $icontains: query } },
          ],
          published: { $ne: false }
        })
        .sort({ date: -1 })
        .limit(20)
        .find()

      searchResults.value = results
    } finally {
      isSearching.value = false
    }
  }

  // 防抖搜索
  const debouncedSearch = useDebounceFn(search, 300)

  watch(searchQuery, (query) => {
    debouncedSearch(query)
  })

  return {
    searchQuery,
    searchResults,
    isSearching,
    search,
  }
}
```

> ⚠️ **中文搜索注意事项**：`$icontains` 仅支持简单子字符串匹配，不支持分词。对于完整的中文全文搜索，推荐以下方案：

**方案 2: Pagefind（推荐 - 静态搜索索引）**

```bash
# 安装
npm install -D pagefind

# package.json scripts
"postgenerate": "pagefind --site .output/public"
```

```typescript
// composables/usePagefindSearch.ts
export const usePagefindSearch = () => {
  const searchResults = ref([])
  const isSearching = ref(false)
  let pagefind: any = null

  // 懒加载 Pagefind
  const initPagefind = async () => {
    if (!pagefind && import.meta.client) {
      pagefind = await import('/pagefind/pagefind.js')
      await pagefind.init()
    }
  }

  const search = async (query: string) => {
    if (!query.trim()) {
      searchResults.value = []
      return
    }

    isSearching.value = true
    try {
      await initPagefind()
      const results = await pagefind.search(query)
      const data = await Promise.all(
        results.results.slice(0, 10).map((r: any) => r.data())
      )
      searchResults.value = data
    } finally {
      isSearching.value = false
    }
  }

  return { searchResults, isSearching, search }
}
```

> 💡 **Pagefind 优势**：
> - 支持中文分词和全文搜索
> - 构建时生成索引，运行时零依赖
> - 体积小（~100KB），性能优秀
> - 支持过滤、排序、高亮

### Image Strategy

**图片目录结构：**
```
public/images/
├── avatar.png              # 头像
├── og/                     # OG 社交分享图
└── articles/               # 文章配图
    └── [slug]/             # 按文章组织
        ├── cover.jpg       # 封面图
        └── *.jpg           # 内容图片
```

**MDC 图片组件：**
```vue
<!-- components/content/ArticleImage.vue -->
<script setup lang="ts">
defineProps<{
  src: string
  alt: string
  caption?: string
  priority?: boolean
}>()
</script>

<template>
  <figure class="my-6">
    <NuxtImg
      :src="src"
      :alt="alt"
      :loading="priority ? 'eager' : 'lazy'"
      class="rounded-lg w-full"
      sizes="sm:100vw md:80vw lg:800px"
    />
    <figcaption v-if="caption" class="text-center text-text-muted mt-2 text-sm">
      {{ caption }}
    </figcaption>
  </figure>
</template>
```

**Markdown 中使用：**
```markdown
::article-image{src="/images/articles/vue-lifecycle/diagram.png" alt="Vue 生命周期" caption="图 1: Vue 组件生命周期"}
::
```

---

## 6. Design System

> 💡 **设计参考**：所有颜色、间距、圆角等设计变量均来自 `prototype/css/styles.css`，保持与原型图完全一致。

### CSS Variables (Light & Dark Theme)

```css
/* assets/css/main.css */
:root {
  /* ========================================
     主色调 - 珊瑚色/橙红色 (来自原型图)
     ======================================== */
  --primary: #e07a5f;
  --primary-dark: #c9674e;
  --primary-light: #fef3f0;
  --primary-rgb: 224, 122, 95;

  /* ========================================
     背景色 - 暖色调 (来自原型图)
     ======================================== */
  --bg-primary: #ffffff;
  --bg-secondary: #faf9f7;      /* 暖白色 */
  --bg-tertiary: #f5f4f1;       /* 暖灰色 */
  --bg-code: #1e1e1e;
  --bg-terminal: #282c34;

  /* ========================================
     文字颜色 (来自原型图)
     ======================================== */
  --text-primary: #2d2d2d;
  --text-secondary: #6b6b6b;
  --text-muted: #9ca3af;
  --text-inverse: #ffffff;
  --text-code: #e4e4e7;

  /* ========================================
     代码高亮 - One Dark Pro 主题
     ======================================== */
  --code-keyword: #c678dd;
  --code-string: #98c379;
  --code-comment: #5c6370;
  --code-function: #61afef;
  --code-number: #e07a5f;       /* 与主色调一致 */
  --code-class: #e5c07b;
  --code-const: #56b6c2;

  /* 语法高亮别名 */
  --syntax-keyword: #c678dd;
  --syntax-string: #98c379;
  --syntax-comment: #7f848e;
  --syntax-function: #61afef;
  --syntax-number: #d19a66;
  --syntax-operator: #56b6c2;

  /* ========================================
     状态色
     ======================================== */
  --status-green: #22c55e;
  --status-yellow: #fbbf24;
  --status-red: #ef4444;

  /* ========================================
     边框和阴影 (来自原型图)
     ======================================== */
  --border-color: #e5e5e5;
  --border-dark: #d1d1d1;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

  /* ========================================
     间距系统 (来自原型图)
     ======================================== */
  --spacing-xs: 0.25rem;    /* 4px */
  --spacing-sm: 0.5rem;     /* 8px */
  --spacing-md: 1rem;       /* 16px */
  --spacing-lg: 1.5rem;     /* 24px */
  --spacing-xl: 2rem;       /* 32px */
  --spacing-2xl: 3rem;      /* 48px */
  --spacing-3xl: 4rem;      /* 64px */

  /* ========================================
     圆角 (来自原型图)
     ======================================== */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  /* ========================================
     字体
     ======================================== */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;

  /* ========================================
     布局 (来自原型图)
     ======================================== */
  --sidebar-width: 280px;
  --content-max-width: 900px;
  --page-max-width: 1400px;
}

/* Dark Theme - 完整覆盖所有变量 */
.dark {
  /* 背景色 */
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --bg-code: #0d1117;
  --bg-terminal: #1e293b;

  /* 文字颜色 */
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --text-inverse: #0f172a;
  --text-code: #e4e4e7;

  /* 边框 */
  --border-color: #334155;
  --border-dark: #475569;

  /* 阴影 - 暗色模式使用更深的阴影 */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);

  /* 主色调调整 - 暗色背景上略微调亮 */
  --primary: #e8887a;           /* 稍微亮一点，提高对比度 */
  --primary-dark: #d67060;
  --primary-light: #3d2a26;

  /* 状态色 - 暗色背景调亮 */
  --status-green: #34d399;
  --status-yellow: #fcd34d;
  --status-red: #f87171;

  /* 代码高亮 - 保持 One Dark Pro 主题 */
  --code-keyword: #c678dd;
  --code-string: #98c379;
  --code-comment: #5c6370;
  --code-function: #61afef;
  --code-number: #e8887a;
  --code-class: #e5c07b;
  --code-const: #56b6c2;
}
```

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 主色调 - 珊瑚色 (来自原型图)
        primary: {
          DEFAULT: 'var(--primary)',        // #e07a5f
          dark: 'var(--primary-dark)',      // #c9674e
          light: 'var(--primary-light)',    // #fef3f0
        },
        // 背景色 - 暖色调 (来自原型图)
        bg: {
          primary: 'var(--bg-primary)',     // #ffffff
          secondary: 'var(--bg-secondary)', // #faf9f7 暖白
          tertiary: 'var(--bg-tertiary)',   // #f5f4f1 暖灰
          code: 'var(--bg-code)',           // #1e1e1e
          terminal: 'var(--bg-terminal)',   // #282c34
        },
        // 文字颜色 (来自原型图)
        text: {
          primary: 'var(--text-primary)',   // #2d2d2d
          secondary: 'var(--text-secondary)', // #6b6b6b
          muted: 'var(--text-muted)',       // #9ca3af
          inverse: 'var(--text-inverse)',   // #ffffff
          code: 'var(--text-code)',         // #e4e4e7
        },
        // 边框
        border: {
          DEFAULT: 'var(--border-color)',   // #e5e5e5
          dark: 'var(--border-dark)',       // #d1d1d1
        },
        // 代码高亮
        code: {
          keyword: 'var(--code-keyword)',
          string: 'var(--code-string)',
          comment: 'var(--code-comment)',
          function: 'var(--code-function)',
          number: 'var(--code-number)',
          class: 'var(--code-class)',
          const: 'var(--code-const)',
        },
        // 语法高亮别名
        syntax: {
          keyword: 'var(--syntax-keyword)',
          string: 'var(--syntax-string)',
          comment: 'var(--syntax-comment)',
          function: 'var(--syntax-function)',
        },
        // 状态色
        status: {
          green: 'var(--status-green)',
          yellow: 'var(--status-yellow)',
          red: 'var(--status-red)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      // 间距扩展 (来自原型图)
      spacing: {
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
      },
      // 圆角扩展 (来自原型图)
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
      },
      // 阴影扩展 (来自原型图)
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
      },
      // 布局尺寸
      maxWidth: {
        'content': 'var(--content-max-width)',
        'page': 'var(--page-max-width)',
      },
      width: {
        'sidebar': 'var(--sidebar-width)',
      },
    },
  },
}
```

> 💡 **统一设计系统**：所有设计变量均来自 `prototype/css/styles.css`，确保实现与原型图完全一致。主色调为珊瑚色 (#e07a5f)，背景色为暖色调。

### Responsive Design (响应式设计)

**断点定义：**
```css
/* assets/css/main.css */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

**布局策略：**
| 断点 | 宽度 | 侧边栏行为 | 内容区域 |
|------|------|------------|----------|
| `< 768px` | Mobile | 隐藏，汉堡菜单触发 Overlay | 全宽 |
| `768px - 1024px` | Tablet | 折叠为图标栏 (64px) | 自适应 |
| `> 1024px` | Desktop | 完整显示 (280px) | 最大 900px |

**Mobile Navigation Composable：**
```typescript
// composables/useMobileMenu.ts
export const useMobileMenu = () => {
  const isOpen = ref(false)
  const isMobile = ref(false)

  const toggle = () => {
    isOpen.value = !isOpen.value
    // 打开时锁定 body 滚动
    if (isOpen.value) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }

  const close = () => {
    isOpen.value = false
    document.body.style.overflow = ''
  }

  // 监听屏幕尺寸变化
  onMounted(() => {
    const checkMobile = () => {
      isMobile.value = window.innerWidth < 768
      if (!isMobile.value) close()
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    onUnmounted(() => window.removeEventListener('resize', checkMobile))
  })

  // 路由变化时关闭菜单
  const route = useRoute()
  watch(() => route.path, () => close())

  return { isOpen, isMobile, toggle, close }
}
```

**Responsive Sidebar.vue：**
```vue
<script setup lang="ts">
import { siteConfig } from '~/config/site'
import { navigation } from '~/config/navigation'

const { isOpen, isMobile, toggle, close } = useMobileMenu()
const route = useRoute()

const isActive = (href: string) => {
  if (href === '/') return route.path === '/'
  return route.path.startsWith(href)
}
</script>

<template>
  <!-- Mobile: Hamburger Button -->
  <button
    v-if="isMobile"
    @click="toggle"
    class="fixed top-4 left-4 z-50 p-2 rounded-lg bg-bg-secondary border border-border"
    :aria-expanded="isOpen"
    aria-label="打开导航菜单"
  >
    <svg v-if="!isOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
    <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  <!-- Mobile: Overlay Backdrop -->
  <Transition name="fade">
    <div
      v-if="isMobile && isOpen"
      class="fixed inset-0 z-40 bg-black/50"
      @click="close"
    />
  </Transition>

  <!-- Sidebar -->
  <aside
    class="sidebar"
    :class="{
      'sidebar--mobile': isMobile,
      'sidebar--open': isOpen,
    }"
  >
    <!-- Profile -->
    <div class="text-center mb-6">
      <NuxtImg
        :src="siteConfig.author.avatar"
        :alt="siteConfig.author.name"
        class="w-20 h-20 rounded-full mx-auto"
        loading="lazy"
      />
      <h2 class="mt-3 text-lg font-semibold text-text-primary">
        {{ siteConfig.author.name }}
      </h2>
      <p class="text-text-muted text-sm font-mono">
        // {{ siteConfig.author.bio }}
      </p>
    </div>

    <!-- Social Links -->
    <div class="flex justify-center gap-3 mb-6">
      <a
        v-for="(url, platform) in siteConfig.author.social"
        :key="platform"
        :href="url"
        target="_blank"
        rel="noopener noreferrer"
        class="p-2 rounded hover:bg-bg-tertiary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <Icon :name="`simple-icons:${platform}`" class="w-5 h-5" />
      </a>
    </div>

    <!-- Navigation -->
    <nav class="space-y-1" aria-label="主导航">
      <NuxtLink
        v-for="item in navigation"
        :key="item.href"
        :to="item.href"
        class="nav-link min-h-[44px]"
        :class="isActive(item.href) ? 'nav-link--active' : ''"
      >
        <span class="text-syntax-keyword">{{ item.cmd }}</span>
        <span class="text-syntax-string">{{ item.arg }}</span>
      </NuxtLink>
    </nav>

    <!-- Search -->
    <div class="mt-6">
      <SearchInput />
    </div>

    <!-- Theme Toggle -->
    <div class="mt-4">
      <ThemeToggle />
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  @apply fixed top-0 left-0 h-screen bg-bg-secondary border-r border-border p-6 overflow-y-auto;
  width: var(--sidebar-width);
  z-index: 45;
  transition: transform 0.3s ease;
}

/* Mobile: Off-canvas sidebar */
.sidebar--mobile {
  transform: translateX(-100%);
}

.sidebar--mobile.sidebar--open {
  transform: translateX(0);
}

/* Tablet: Collapsed sidebar */
@media (min-width: 768px) and (max-width: 1023px) {
  .sidebar {
    width: 64px;
    padding: 1rem 0.5rem;
  }

  .sidebar:hover {
    width: var(--sidebar-width);
    padding: 1.5rem;
  }
}

/* Desktop: Full sidebar */
@media (min-width: 1024px) {
  .sidebar {
    position: sticky;
    transform: none;
  }
}

.nav-link {
  @apply flex items-center gap-2 px-3 py-2 rounded font-mono text-sm transition-colors;
  @apply text-text-secondary hover:bg-bg-tertiary;
}

.nav-link--active {
  @apply bg-primary/10 text-primary;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

**Responsive Layout (default.vue)：**
```vue
<script setup lang="ts">
const { isMobile } = useMobileMenu()
</script>

<template>
  <div class="page-wrapper">
    <Sidebar />

    <main
      class="main-content"
      :class="{ 'main-content--mobile': isMobile }"
    >
      <slot />
    </main>
  </div>
</template>

<style scoped>
.page-wrapper {
  @apply flex min-h-screen bg-bg-primary;
}

.main-content {
  @apply flex-1 p-6 lg:p-8;
  margin-left: var(--sidebar-width);
  max-width: calc(100vw - var(--sidebar-width));
}

/* Mobile: Full width */
.main-content--mobile {
  margin-left: 0;
  max-width: 100vw;
  padding-top: 4rem; /* Space for hamburger button */
}

/* Tablet: Adjust for collapsed sidebar */
@media (min-width: 768px) and (max-width: 1023px) {
  .main-content {
    margin-left: 64px;
    max-width: calc(100vw - 64px);
  }
}

/* Desktop: Standard layout */
@media (min-width: 1024px) {
  .main-content {
    margin-left: var(--sidebar-width);
  }
}
</style>
```

### Color Contrast (颜色对比度)

> ⚠️ **可访问性注意**：主色调 #e07a5f 在白色背景上的对比度约为 3.1:1，不满足 WCAG AA 标准（要求 4.5:1）。

**使用指南：**
| 颜色用途 | 是否符合 AA | 建议 |
|----------|-------------|------|
| 主色作为大标题 (≥18px bold) | ✅ 符合 (3:1) | 可用 |
| 主色作为正文文本 | ❌ 不符合 | 避免，使用 --text-primary |
| 主色作为按钮背景 + 白色文字 | ✅ 符合 | 可用 |
| 主色作为装饰/强调 | ✅ 可用 | 非信息传达场景 |
| 主色 hover/focus 状态 | ✅ 可用 | 配合其他视觉指示 |

**安全使用主色的方式：**
```css
/* ✅ 正确：作为背景，配合白色文字 */
.btn-primary {
  background: var(--primary);
  color: white;  /* 对比度 ~4.6:1 ✅ */
}

/* ✅ 正确：作为边框或装饰 */
.card:hover {
  border-color: var(--primary);
}

/* ❌ 避免：作为小文字颜色 */
.small-text {
  color: var(--primary);  /* 对比度不足 */
}

/* ✅ 替代方案：使用加深的主色 */
.text-primary-accessible {
  color: var(--primary-dark);  /* #c9674e, 对比度 ~4.8:1 ✅ */
}
```

---

## 7. SEO & Performance

### SEO Checklist

- [x] Dynamic meta tags per page
- [x] Open Graph images
- [x] Twitter Cards
- [x] JSON-LD structured data
- [x] Sitemap generation
- [x] RSS feed
- [x] Canonical URLs
- [x] robots.txt

### Performance Targets

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| TTI | < 3.5s |

### Optimization Strategies

1. **Static Generation**: `nuxt generate` 预渲染所有页面
2. **Image Optimization**: @nuxt/image 自动 WebP/AVIF
3. **Font Optimization**: @nuxt/fonts 子集加载
4. **Code Splitting**: Nuxt 自动代码分割
5. **CDN Caching**: Vercel/Netlify Edge Network

### Performance Implementation Details

**1. 字体优化**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // @nuxt/fonts v1.x 配置语法
  fonts: {
    google: {
      families: [
        'Inter:400,500,600,700',
        'JetBrains Mono:400,500',
      ],
    },
    defaults: {
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
    },
  },
})
```

**2. 组件懒加载**
```vue
<!-- 评论组件 - 客户端渲染，懒加载 -->
<ClientOnly>
  <LazyComments :slug="article._path" />
  <template #fallback>
    <Skeleton class="h-64" />
  </template>
</ClientOnly>

<!-- 搜索模态框 - 用户交互时才加载 -->
<LazySearchModal v-if="showSearch" @close="showSearch = false" />
```

**3. 预加载关键资源**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://giscus.app' },
      ],
    },
  },
})
```

**4. 构建时间优化**
- @nuxt/content 使用增量编译
- Nuxt 3 基于 Vite，构建速度快
- 仅在内容变更时重新生成页面

### Accessibility (可访问性)

**键盘导航支持：**
| 快捷键 | 功能 |
|--------|------|
| `Tab` | 切换焦点 |
| `Enter/Space` | 激活按钮/链接 |
| `Escape` | 关闭模态框 |
| `/` | 打开搜索 |
| `t` | 切换主题 |

**ARIA 标签：**
```vue
<nav aria-label="主导航">
<main id="main-content" aria-label="文章内容">
<aside aria-label="侧边栏">

<!-- 跳过导航链接 -->
<a href="#main-content" class="sr-only focus:not-sr-only">
  跳转到主要内容
</a>
```

**颜色对比度：**
- 正文文本对比度 ≥ 4.5:1 (WCAG AA)
- 大标题对比度 ≥ 3:1
- 使用 WebAIM Contrast Checker 验证

---

## 8. Content Management Workflow

### Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  CONTENT PUBLISHING PIPELINE                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────┐ │
│   │  Local   │    │  GitHub  │    │  Vercel  │    │  CDN │ │
│   │  Edit    │───▶│   Repo   │───▶│  Build   │───▶│ Live │ │
│   └──────────┘    └──────────┘    └──────────┘    └──────┘ │
│        │               │               │               │    │
│        ▼               ▼               ▼               ▼    │
│   Markdown        Webhook触发      静态生成        全球分发  │
│   本地预览        自动检测变更     nuxt generate   1-3分钟   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Daily Publishing Workflow

| Step | Command | Description |
|------|---------|-------------|
| 1 | `npm run new-post "标题"` | 创建文章模板 |
| 2 | Edit in VS Code | 撰写 Markdown 内容 |
| 3 | `npm run dev` | 本地预览效果 |
| 4 | Set `published: true` | 标记为可发布 |
| 5 | `npm run deploy` | 提交并部署 |

### Article Template (Markdown + MDC)

```markdown
---
title: "文章标题"
description: "SEO 描述，150字以内"
date: 2024-01-20
category: vue
tags:
  - vue
  - composition-api
  - frontend
featured: false
published: false
cover: /images/articles/cover.jpg
---

文章摘要内容...

## 第一章节

正文内容...

::callout{type="info"}
提示框组件示例
::

## 代码示例

```typescript
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
```

## 图片示例

::article-image{src="/images/articles/vue-hooks/diagram.png" alt="Vue 组合式函数" caption="图 1: 组合式函数工作流程"}
::
```

### CLI Scripts

```typescript
// scripts/new-post.ts
import fs from 'fs'
import path from 'path'
import { format } from 'date-fns'

interface NewPostOptions {
  title: string
  category?: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

function createPost({ title, category = 'vue' }: NewPostOptions) {
  const date = format(new Date(), 'yyyy-MM-dd')
  const slug = slugify(title)
  const filename = `${slug}.md`
  const filepath = path.join(process.cwd(), 'content/articles', filename)

  const template = `---
title: "${title}"
description: ""
date: ${date}
category: ${category}
tags: []
featured: false
published: false
---

在这里开始写作...

## 介绍

## 正文

## 总结
`

  fs.writeFileSync(filepath, template, 'utf-8')
  console.log(`✅ Created: ${filepath}`)
  return filepath
}

// CLI Entry
const title = process.argv[2]
if (!title) {
  console.error('Usage: npm run new-post "文章标题"')
  process.exit(1)
}
createPost({ title })
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "new-post": "tsx scripts/new-post.ts",
    "publish": "tsx scripts/publish.ts",
    "deploy": "git add . && git commit -m 'content: update articles' && git push"
  }
}
```

### 开发环境

**VS Code 扩展（推荐）：**
- **Vue - Official** (原 Volar) - Vue 3 语法支持、类型检查、IDE 功能
- **Prettier** - 代码格式化
- **Tailwind CSS IntelliSense** - Tailwind 样式自动补全
- **MDC** - Markdown Components 语法支持
- **ESLint** - 代码规范检查

---

## 9. Nuxt Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // 启用 SSG
  ssr: true,

  // 模块
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/icon',          // 原 nuxt-icon，现已更名
  ],

  // @nuxt/content 配置
  content: {
    highlight: {
      theme: {
        default: 'one-dark-pro',
        dark: 'one-dark-pro',
        light: 'github-light',
      },
      langs: ['typescript', 'javascript', 'vue', 'vue-html', 'bash', 'json', 'markdown', 'css'],
    },
    markdown: {
      toc: { depth: 3 },
      anchorLinks: true,
    },
  },

  // 颜色模式配置
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  // 图片优化
  image: {
    format: ['webp', 'avif'],
    quality: 80,
  },

  // 字体优化 (@nuxt/fonts v1.x)
  fonts: {
    google: {
      families: ['Inter:400,500,600,700', 'JetBrains Mono:400,500'],
    },
    defaults: {
      subsets: ['latin', 'latin-ext'],
    },
  },

  // 运行时配置
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://techblog.example.com',
      giscusRepo: process.env.NUXT_PUBLIC_GISCUS_REPO,
      giscusRepoId: process.env.NUXT_PUBLIC_GISCUS_REPO_ID,
      giscusCategory: process.env.NUXT_PUBLIC_GISCUS_CATEGORY,
      giscusCategoryId: process.env.NUXT_PUBLIC_GISCUS_CATEGORY_ID,
    },
  },

  // 静态生成配置
  nitro: {
    prerender: {
      routes: ['/sitemap.xml', '/feed.xml'],
    },
  },

  // TypeScript
  typescript: {
    strict: true,
  },

  // 开发工具
  devtools: { enabled: true },
})
```

---

## 10. Implementation Roadmap

### Phase 1: Foundation
- [ ] Initialize Nuxt 3 project
- [ ] Configure Tailwind CSS with design system (CSS 变量统一)
- [ ] Set up @nuxt/content
- [ ] Create base layout components (Sidebar, Footer)
- [ ] Dark mode - @nuxtjs/color-mode + ThemeToggle 组件
- [ ] Error handling pages (error.vue)

### Phase 2: Core Features
- [ ] Article list page with pagination
- [ ] Article detail page with @nuxt/content rendering
- [ ] Code highlighting with Shiki (内置)
- [ ] Category/tag filtering

### Phase 3: Enhancement
- [ ] Search functionality (@nuxt/content 内置搜索)
- [ ] About page
- [ ] Archives page
- [ ] RSS feed & Sitemap
- [ ] Comments - Giscus 集成
- [ ] Image optimization (NuxtImg 组件)

### Phase 4: Polish
- [ ] SEO optimization
- [ ] Performance tuning (字体优化、组件懒加载)
- [ ] Accessibility (键盘导航、ARIA 标签)
- [ ] Deploy to Vercel/Netlify
- [ ] Custom domain setup

### Future Enhancements (可选)
- [ ] Reading progress bar
- [ ] Series/Collection feature
- [ ] Newsletter subscription

---

## 11. File Examples

### Example Markdown Article

```markdown
---
title: "深入理解 Vue 3 Composition API"
description: "Vue 3 的组合式 API 彻底改变了我们组织组件逻辑的方式，本文深入探讨其设计理念和最佳实践"
date: 2024-01-18
category: vue
tags:
  - vue
  - vue-3
  - composition-api
  - frontend
featured: true
published: true
---

Vue 3 的 Composition API 是一个重要里程碑...

## 什么是 Composition API

::callout{type="info"}
Composition API 是一组基于函数的 API，让我们能够更灵活地组织组件逻辑。
::

```typescript
import { ref, computed, onMounted } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const doubled = computed(() => count.value * 2)

  const increment = () => count.value++
  const decrement = () => count.value--

  return { count, doubled, increment, decrement }
}
```

## 总结

Composition API 代表了 Vue 组件开发的重大进化...
```

---

## 12. Deployment

### Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "nuxt generate",
  "outputDirectory": ".output/public",
  "framework": "nuxtjs"
}
```

### Netlify Configuration

```toml
# netlify.toml
[build]
  command = "nuxt generate"
  publish = ".output/public"

[[headers]]
  for = "/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Environment Variables

```env
# .env.example (公开配置模板)
NUXT_PUBLIC_SITE_URL=https://techblog.example.com

# Giscus Comments (从 https://giscus.app 获取)
# 注：这些值是公开的，可以放在 .env 中
NUXT_PUBLIC_GISCUS_REPO=username/myblog
NUXT_PUBLIC_GISCUS_REPO_ID=R_xxx
NUXT_PUBLIC_GISCUS_CATEGORY=Comments
NUXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxx
```

> 💡 **环境变量说明**：`NUXT_PUBLIC_*` 前缀的变量会暴露给客户端，适合公开配置。敏感信息（如 API 密钥）应使用不带 `PUBLIC` 的变量名，仅在服务端可用。

### Server Routes (RSS & Sitemap)

**RSS Feed 实现：**
```typescript
// server/routes/feed.xml.ts
import { serverQueryContent } from '#content/server'
import { siteConfig } from '~/config/site'

export default defineEventHandler(async (event) => {
  const articles = await serverQueryContent(event, 'articles')
    .where({ published: { $ne: false } })
    .sort({ date: -1 })
    .limit(20)
    .find()

  const baseUrl = siteConfig.url

  const rssItems = articles.map((article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}${article._path}</link>
      <guid>${baseUrl}${article._path}</guid>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <description><![CDATA[${article.description}]]></description>
      <category>${article.category}</category>
    </item>
  `).join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${baseUrl}</link>
    <description>${siteConfig.description}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`

  setResponseHeader(event, 'content-type', 'application/xml')
  return rss
})
```

**Sitemap 实现：**
```typescript
// server/routes/sitemap.xml.ts
import { serverQueryContent } from '#content/server'
import { siteConfig } from '~/config/site'

export default defineEventHandler(async (event) => {
  const articles = await serverQueryContent(event, 'articles')
    .where({ published: { $ne: false } })
    .find()

  const baseUrl = siteConfig.url

  // 静态页面
  const staticPages = ['/', '/articles', '/about', '/archives']

  const staticUrls = staticPages.map((page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>${page === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('')

  // 文章页面
  const articleUrls = articles.map((article) => `
  <url>
    <loc>${baseUrl}${article._path}</loc>
    <lastmod>${article.updated || article.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${articleUrls}
</urlset>`

  setResponseHeader(event, 'content-type', 'application/xml')
  return sitemap
})
```

### Giscus 配置步骤

1. 在 GitHub 仓库启用 Discussions
2. 安装 [giscus app](https://github.com/apps/giscus)
3. 访问 [giscus.app](https://giscus.app) 获取配置
4. 将配置填入环境变量

---

## Summary

**个人技术博客**设计文档，采用终端/代码编辑器风格，**Vue 3 技术栈**。

### 技术栈
| 核心 | 技术 |
|------|------|
| Framework | **Nuxt 3** |
| UI Library | **Vue 3** (Composition API) |
| Content | **@nuxt/content v2** |
| Styling | Tailwind CSS (CSS 变量统一) |
| Search | queryContent + **Pagefind** (中文支持) |
| Comments | Giscus (@giscus/vue) |
| Icons | **@nuxt/icon** |
| Deployment | Vercel / Netlify |

### 设计系统 (来自 prototype/)
| 设计元素 | 值 | 说明 |
|----------|-----|------|
| 主色调 | **#e07a5f** | 珊瑚色/橙红色 |
| 背景色 | #faf9f7 / #f5f4f1 | 暖色调 |
| 文字色 | #2d2d2d / #6b6b6b | 深灰/中灰 |
| 代码主题 | One Dark Pro | 深色终端风格 |
| 字体 | Inter / JetBrains Mono | 系统字体 + 等宽字体 |
| 布局宽度 | 280px / 900px / 1400px | 侧边栏/内容/页面 |

### 响应式断点
| 断点 | 宽度 | 侧边栏行为 |
|------|------|------------|
| Mobile | < 768px | 隐藏，汉堡菜单 |
| Tablet | 768-1024px | 折叠为 64px |
| Desktop | > 1024px | 完整 280px |

### 设计优先级
1. **简洁高效** - Git-based 工作流，CLI 脚本自动化
2. **零运维成本** - 纯静态，无需数据库或后端服务
3. **开发者体验** - TypeScript, 热更新, Vue DevTools
4. **性能优先** - SSG 预渲染, CDN 全球分发, 组件懒加载
5. **可访问性** - 键盘导航, ARIA 标签, 触摸友好 (44px)

### 技术栈迁移 (v2.0: React → Vue)
- ✅ Next.js 14 → **Nuxt 3**
- ✅ React → **Vue 3** (Composition API)
- ✅ MDX + Velite → **@nuxt/content v2**
- ✅ next-themes → **@nuxtjs/color-mode**
- ✅ @giscus/react → **@giscus/vue**
- ✅ next/image → **@nuxt/image**
- ✅ FlexSearch → **Pagefind** (中文全文搜索)

### 设计系统对齐 (v2.1)
- ✅ 主色调：**珊瑚色 #e07a5f** (来自 prototype/)
- ✅ 背景色：**暖色调** #faf9f7 / #f5f4f1
- ✅ 文字色：**深灰色** #2d2d2d / #6b6b6b
- ✅ 间距系统：xs/sm/md/lg/xl/2xl/3xl
- ✅ 圆角系统：sm(4px)/md(8px)/lg(12px)/xl(16px)
- ✅ 阴影系统：sm/md/lg (来自原型图)
- ✅ Dark Mode：完整变量覆盖

### 文档修订 (v2.2)
- ✅ 修正 Search API：queryContent + Pagefind
- ✅ 修正 @nuxt/fonts 配置语法 (v1.x)
- ✅ 添加中文搜索解决方案
- ✅ 添加响应式设计规格
- ✅ 补充缺失组件：SearchModal, FilterBar, EmptyState, Callout, etc.
- ✅ 完善 Dark Mode CSS 变量
- ✅ 添加颜色对比度指南 (WCAG AA)
- ✅ 修正 Icon 模块：nuxt-icon → @nuxt/icon
- ✅ 添加 RSS/Sitemap 服务端路由实现
- ✅ 修正类型定义：Article, TOCItem
- ✅ 添加 Mobile Navigation (useMobileMenu)

### Vue 方案优势
- **更简洁的内容管理**：@nuxt/content 集成度更高
- **组件自动导入**：Nuxt 自动导入，无需手动 import
- **更好的 DX**：Vue DevTools + Nuxt DevTools
- **官方模块生态**：所有核心模块由 Nuxt 团队维护
- **中文搜索**：Pagefind 支持中文分词和全文搜索
