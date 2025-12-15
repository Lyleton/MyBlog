# TechBlog 分阶段实施方案

基于 MVP (最小可行产品) 原则的迭代实施路线图。

## 概述

### MVP 原则

1. **每阶段可交付** - 每个阶段结束都有可运行、可验证的功能
2. **核心优先** - 优先实现核心价值功能，延后锦上添花特性
3. **持续可部署** - 每个阶段都应该是可部署的状态

### 阶段依赖图

```
Phase 0 (基础骨架)
    │
    ▼
Phase 1 (核心布局 + 404页面)
    │
    ▼
Phase 2 (文章内容 + TOC) ─── ✨ MVP 达成
    │
    ├─────────────┬─────────────┐
    ▼             │             ▼
Phase 3          │          Phase 5
(响应式)         │          (SEO部署)
    │             │             │
    ▼             │             │
Phase 4 ─────────┘             │
(搜索，依赖 Phase 3 的 EmptyState)
    │                          │
    └──────────────────────────┘
               │
               ▼
          Phase 6
         (可选增强)
```

**依赖说明**：
- Phase 0→1→2：必须顺序执行
- Phase 3 和 Phase 5：可从 Phase 2 并行开始
- Phase 4：需要 Phase 3 的 EmptyState 组件
- Phase 6：所有前置阶段完成后可选实施

### 里程碑总览

| 里程碑 | 完成阶段 | 状态 | 预计时间 |
|--------|----------|------|----------|
| 🏗️ 可运行项目 | Phase 0 | 技术验证 | 1.5-2h |
| 📄 可浏览首页 | Phase 1 | 骨架完成 | 2-2.5h |
| ✨ **MVP 达成** | Phase 2 | 核心功能 | 2-3h |
| 📱 移动端可用 | Phase 3 | 体验提升 | 1.5h |
| 🔍 功能完整 | Phase 4 | 搜索可用 | 1.5-2h |
| 🚀 **可上线** | Phase 5 | 生产就绪 | 2h |
| ⭐ 满血版本 | Phase 6 | 锦上添花 | 2h+ |

---

## Phase 0: 项目初始化与基础骨架

### 目标
建立可运行的 Nuxt 3 项目框架，配置完整的开发环境。

### 前置条件
- Node.js >= 18.0.0
- npm >= 9.0.0
- VS Code + Vue - Official 扩展

### 交付物清单

```
myblog/
├── package.json              # 依赖定义
├── nuxt.config.ts            # Nuxt 核心配置
├── app.vue                   # 根组件
├── tailwind.config.js        # Tailwind 配置（完整设计系统）
├── tsconfig.json             # TypeScript 配置
│
├── assets/
│   └── css/
│       └── main.css          # CSS 变量系统（亮/暗主题）
│
├── types/
│   └── index.ts              # Article, TOCItem 类型定义
│
├── config/
│   ├── site.ts               # 站点配置（名称、作者、分类）
│   └── navigation.ts         # 导航配置（终端命令风格）
│
├── content/
│   └── articles/
│       └── hello-world.md    # 示例文章
│
└── public/
    └── images/
        └── avatar.png        # 头像占位图
```

### 详细步骤

#### Step 1: 初始化项目
```bash
# 创建 Nuxt 项目
npx nuxi@latest init myblog
cd myblog

# 安装核心依赖
npm install @nuxt/content @nuxtjs/tailwindcss @nuxtjs/color-mode @nuxt/image @nuxt/fonts @nuxt/icon
```

#### Step 2: 配置 nuxt.config.ts
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true,

  // 引入全局 CSS
  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/icon',
  ],

  content: {
    highlight: {
      theme: {
        default: 'one-dark-pro',
        dark: 'one-dark-pro',
        light: 'github-light',
      },
    },
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  fonts: {
    google: {
      families: ['Inter:400,500,600,700', 'JetBrains Mono:400,500'],
    },
    defaults: {
      subsets: ['latin', 'latin-ext'],
    },
  },

  // SSG 预渲染配置
  nitro: {
    prerender: {
      routes: ['/feed.xml', '/sitemap.xml'],
      crawlLinks: true,
    },
  },

  typescript: {
    strict: true,
  },

  devtools: { enabled: true },
})
```

#### Step 3: 配置 Tailwind 设计系统
```typescript
// tailwind.config.ts
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: 'var(--primary)', dark: 'var(--primary-dark)', light: 'var(--primary-light)' },
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          code: 'var(--bg-code)',
          terminal: 'var(--bg-terminal)',
        },
        text: { primary: 'var(--text-primary)', secondary: 'var(--text-secondary)', muted: 'var(--text-muted)' },
        border: { DEFAULT: 'var(--border-color)' },
        status: { green: 'var(--status-green)', yellow: 'var(--status-yellow)', red: 'var(--status-red)' },
        syntax: { keyword: 'var(--syntax-keyword)', string: 'var(--syntax-string)' },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
    },
  },
}
```

#### Step 4: 创建 CSS 变量系统
```css
/* assets/css/main.css */
:root {
  /* 主色调 */
  --primary: #e07a5f;
  --primary-dark: #c9674e;
  --primary-light: #fef3f0;

  /* 背景色 */
  --bg-primary: #ffffff;
  --bg-secondary: #faf9f7;
  --bg-tertiary: #f5f4f1;
  --bg-code: #f8f8f8;
  --bg-terminal: #faf9f7;

  /* 文字色 */
  --text-primary: #2d2d2d;
  --text-secondary: #6b6b6b;
  --text-muted: #9ca3af;

  /* 边框和阴影 */
  --border-color: #e5e5e5;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

  /* 状态色 */
  --status-green: #22c55e;
  --status-yellow: #fbbf24;
  --status-red: #ef4444;

  /* 语法高亮 */
  --syntax-keyword: #c678dd;
  --syntax-string: #98c379;

  /* 字体 */
  --font-sans: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* 布局 */
  --sidebar-width: 280px;
}

.dark {
  /* 暗色模式主色调 - 使用更亮的珊瑚色 */
  --primary: #e8887a;

  /* 背景色 */
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --bg-code: #0d1117;
  --bg-terminal: #1e293b;

  /* 文字色 */
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;

  /* 边框和阴影 */
  --border-color: #334155;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);

  /* 状态色 - 暗色模式下稍亮 */
  --status-green: #34d399;
  --status-yellow: #fcd34d;
  --status-red: #f87171;
}
```

#### Step 5: 创建 app.vue 根组件
```vue
<!-- app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

#### Step 6: 创建类型定义和配置文件
- `types/index.ts` - Article, TOCItem 接口
- `config/site.ts` - 站点配置
- `config/navigation.ts` - 导航配置
- `content/articles/hello-world.md` - 示例文章

### 验收标准

- [ ] `npm run dev` 启动成功，无报错
- [ ] `npm run typecheck` 类型检查通过
- [ ] 访问 `localhost:3000` 显示基本页面
- [ ] Tailwind CSS 类生效（检查背景色、字体）
- [ ] CSS 变量生效（检查 DevTools 中�� computed styles）
- [ ] 示例文章能通过 queryContent 查询

### 验证命令

```bash
# 启动开发服务器
npm run dev

# 类型检查
npm run typecheck

# 验证 content 模块
# 访问 http://localhost:3000/_content/query?_path=/articles/hello-world
```

### 调试技巧

```bash
# 使用 Nuxt DevTools (浏览器中按 Shift+Alt+D)
# - 查看组件树和状态
# - 检查路由配置
# - 分析性能

# Content 模块调试端点
http://localhost:3000/_content/query              # 查询所有内容
http://localhost:3000/_content/query?_path=/articles  # 按路径筛选
http://localhost:3000/_content/cache              # 查看缓存状态
```

---

## Phase 1: 核心布局与首页

### 目标
实现完整的页面布局和首页文章列表，呈现终端风格 UI。

### 前置条件
- Phase 0 完成

### 交付物清单

```
新增/修改：
├── layouts/
│   └── default.vue           # 主布局（Sidebar + Main）
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.vue       # 左侧边栏（桌面版）
│   │   ├── Footer.vue        # 终端风格页脚
│   │   └── PageWrapper.vue   # 页面内容容器
│   │
│   └── ui/
│       ├── TerminalWindow.vue  # 核心：macOS 窗口风格
│       ├── ArticleCard.vue     # 文章预览卡片
│       └── ThemeToggle.vue     # 主题切换按钮
│
├── pages/
│   ├── index.vue             # 首页（文章列表）
│   └── [...slug].vue         # 404 错误页面
│
├── composables/
│   └── useArticles.ts        # 文章数据获取（getAllArticles, getArticleBySlug）
│
└── content/articles/         # 扩充到 3 篇示例文章
    ├── hello-world.md
    ├── vue-composition-api.md
    └── typescript-tips.md
```

### 详细步骤

#### Step 1: 创建核心 UI 组件

**TerminalWindow.vue** - 终端窗口风格容器
- macOS 红黄绿按钮
- 标题栏显示文件名
- 状��指示器

**ArticleCard.vue** - 文章卡片
- 使用 TerminalWindow 包装
- 显示标题、描述、分类、日期
- hover 效果

**ThemeToggle.vue** - 主题切换
- 终端命令风格 `$ theme --dark`
- 切换亮/暗模式

#### Step 2: 创建布局组件

**Sidebar.vue** - 左侧边栏
- 头像和简介
- 社交链接图标
- 终端命令风格导航
- 搜索入口（占位）

**Footer.vue** - 页脚
- 终端风格输出
- `$ whoami` 显示介绍
- `$ ls ./links/` 显示链接

**PageWrapper.vue** - 页面容器
- 统一的页面标题和副标题
- 终端风格页面统计
- 内容区域插槽

**default.vue** - 主布局
- Sidebar 固定左侧
- Main 内容区域
- Footer 底部

#### Step 3: 创建首页

**pages/index.vue**
- 使用 PageWrapper 包装
- 页面标题和统计
- 文章列表（ArticleCard）
- "查看更多" 链接

#### Step 4: 创建 404 错误页面

**pages/[...slug].vue**
- 捕获所有未匹配路由
- 终端风格错误提示 `$ cat: file not found`
- 返回首页链接

#### Step 5: 创建 composables

**useArticles.ts**
- `getAllArticles(limit?)` - 获取所有文章（支持限制数量）
- `getArticleBySlug(slug)` - 获取单篇文章

### 验收标准

- [ ] `npm run typecheck` 类型检查通过
- [ ] 首页显示 3 篇文章卡片
- [ ] 终端风格 UI（红黄绿按钮、代码字体）
- [ ] 侧边栏导航可点击
- [ ] 亮/暗主题切换正常
- [ ] 头像和社交链接显示
- [ ] 访问不存在路径显示 404 页面

### 验证要点

```
视觉检查清单：
✓ 终端窗口有红黄绿按钮
✓ 文章卡片显示 .md 文件名
✓ 导航使用 `cd`, `ls`, `cat` 命令风格
✓ 主色调为珊瑚色 #e07a5f
✓ 背景为暖白色 #faf9f7
```

---

## Phase 2: 文章详情与内容渲染

### 目标
实现文章详情页和完整的 Markdown 渲染，**达成 MVP**。

### 前置条件
- Phase 1 完成

### 交付物清单

```
新增/修改：
├── pages/
│   └── articles/
│       ├── index.vue         # 文章列表页（带分页）
│       └── [slug].vue        # 文章详情页
│
├── components/
│   ├── ui/
│   │   ├── Pagination.vue    # 终端风格分页
│   │   ├── Skeleton.vue      # 加载骨架屏
│   │   └── TableOfContents.vue # 文章目录导航
│   │
│   └── content/
│       ├── callout.vue       # 提示/警告框（MDC 组件需小写）
│       └── article-image.vue # 优化图片（MDC 组件需小写）
│
├── composables/
│   └── useArticles.ts        # 扩展：getArticlesPaginated(page, perPage)
│
└── content/articles/         # 扩充到 5+ 篇文章
```

### 详细步骤

#### Step 1: 创建文章列表页
- 分页显示文章
- 页码终端风格 `cat --page 2`
- 空状态处理

#### Step 2: 创建文章详情页
- 文章元信息（日期、分类、阅读时间）
- Markdown 内容渲染（使用 `<ContentRenderer>`）
- 使用 Skeleton 显示加载状态
- 上一篇/下一篇导航

#### Step 3: 创建文章目录组件
**TableOfContents.vue**
- 从文章 body.toc 提取标题
- 当前阅读位置高亮（Intersection Observer）
- 点击跳转到对应标题

#### Step 4: 创建 MDC 组件
注意：MDC 组件必须使用小写命名，放在 `components/content/` 目录下

**callout.vue** - 提示/警告框
```vue
<!-- 使用方式：::callout{type="info"} 内容 :: -->
```

**article-image.vue** - 优化图片
```vue
<!-- 使用方式：::article-image{src="/images/demo.png" alt="描述"} :: -->
```

#### Step 5: 创建辅助组件
- Pagination - 分页
- Skeleton - 骨架屏（用于异步加载状态）

### 验收标准

- [ ] `npm run typecheck` 类型检查通过
- [ ] 文章列表页分页正常（每页 8 篇）
- [ ] 点击文章进入详情页
- [ ] Markdown 渲染正确
- [ ] 代码高亮（One Dark Pro 主题）
- [ ] MDC callout 组件可用
- [ ] 文章目录显示且可点击跳转
- [ ] 加载状态显示骨架屏

### 验证要点

```bash
# 访问文章列表
http://localhost:3000/articles

# 访问文章详情
http://localhost:3000/articles/hello-world

# 测试 MDC 组件
在文章中使用 ::callout{type="info"} 语法
```

---

## Phase 3: 分类筛选与响应式

### 目标
实现分类筛选功能和完整的移动端适配。

### 前置条件
- Phase 2 完成

### 交付物清单

```
新增/修改：
├── components/
│   ├── ui/
│   │   ├── FilterBar.vue     # 分类筛选栏
│   │   └── EmptyState.vue    # 空状态组件（也被 Phase 4 搜索使用）
│   │
│   └── layout/
│       └── Sidebar.vue       # 更新：响应式 + 汉堡菜单
│
├── layouts/
│   └── default.vue           # 更新：移动端布局
│
├── composables/
│   ├── useMobileMenu.ts      # 移动端菜单状态
│   └── useArticles.ts        # 扩展：getArticlesByCategory(category)
│
└── pages/articles/
    └── index.vue             # 更新：集成筛选
```

### 详细步骤

#### Step 1: 创建分类筛选组件
- FilterBar 显示所有分类
- 点击筛选文章
- 支持 URL 参数 `?category=vue`

#### Step 2: 实现移动端响应式
- useMobileMenu composable
- 汉堡菜单按钮
- 侧边栏 Overlay 效果
- 点击遮罩关闭

#### Step 3: 更新布局
- 断点：768px 移动端，1024px 桌面端
- 平板：侧边栏折叠为图标
- 移动端：侧边栏完全隐藏

### 验收标准

- [ ] `npm run typecheck` 类型检查通过
- [ ] 分类筛选功能正常
- [ ] URL 参数保持筛选状态
- [ ] 移动端汉堡菜单可用
- [ ] 侧边栏滑出/关闭动画流畅
- [ ] 所有触摸目标 >= 44px
- [ ] 三种断点布局正确
- [ ] 筛选无结果时显示 EmptyState

### 验证要点

```
响应式测试：
✓ 桌面 (>1024px): 完整侧边栏
✓ 平板 (768-1024px): 折叠侧边栏
✓ 移动 (<768px): 汉堡菜单

分类测试：
✓ /articles?category=vue 显示 Vue 文章
✓ 点击分类按钮 URL 更新
✓ 无结果显示空状态
```

---

## Phase 4: 搜索与静态页面

### 目标
实现搜索功能和关于、归档等静态页面。

### 前置条件
- Phase 2 完成
- Phase 3 完成（需要 EmptyState 组件用于搜索无结果状态）

### 交付物清单

```
新增/修改：
├── components/
│   └── ui/
│       ├── SearchInput.vue   # 搜索触发器（显示快捷键提示）
│       └── SearchModal.vue   # 搜索模态框（使用 EmptyState）
│
├── pages/
│   ├── about.vue             # 关于页面
│   └── archives.vue          # 归档页面
│
├── composables/
│   └── useSearch.ts          # 搜索逻辑（search, results, isLoading）
│
├── content/
│   └── about.md              # 关于页面内容
│
└── layouts/
    └── default.vue           # 集成搜索模态框
```

### 详细步骤

#### Step 1: 创建搜索组件
- SearchInput - 搜索触发器，显示快捷键提示
- SearchModal - 模态框，键盘导航支持

#### Step 2: 创建搜索逻辑
**useSearch.ts**
```typescript
// 提供的方法和状态
export const useSearch = () => {
  const query = ref('')
  const results = ref<Article[]>([])
  const isLoading = ref(false)

  // 防抖搜索（300ms）
  const search = useDebounceFn(async (q: string) => {
    // 使用 queryContent().where().$icontains 模糊匹配
  }, 300)

  return { query, results, isLoading, search }
}
```

#### Step 3: 创建静态页面
- about.vue - 关于页面
- archives.vue - 归档页面（按年月分组）

#### Step 4: 集成搜索
- 全局快捷键 `/`
- Sidebar 中的搜索入口

### 验收标准

- [ ] `npm run typecheck` 类型检查通过
- [ ] 按 `/` 打开搜索模态框
- [ ] 实时搜索结果显示（防抖 300ms）
- [ ] 键盘导航（↑↓ Enter Esc）
- [ ] 点击结果跳转
- [ ] 搜索无结果显示 EmptyState
- [ ] 关于页面内容正确
- [ ] 归档页面按年月分组

### 验证要点

```
搜索测试：
✓ 输入关键词显示匹配结果
✓ 按 ↑↓ 选择结果
✓ 按 Enter 跳转
✓ 按 Esc 关闭
✓ 点击遮罩关闭

页面测试：
✓ /about 显示关于内容
✓ /archives 显示归档列表
```

---

## Phase 5: SEO、RSS 与部署

### 目标
完成 SEO 优化，添加 RSS 和评论功能，部署上线。

### 前置条件
- Phase 2 完成
- **Giscus 准备工作**：
  1. GitHub 仓库开启 Discussions 功能
  2. 安装 Giscus GitHub App: https://github.com/apps/giscus
  3. 获取 Giscus 配置参数: https://giscus.app/
- **部署准备**：
  1. GitHub 仓库已推送代码
  2. Vercel/Netlify 账号已注册
  3. 自定义域名已购买（可选）

### 交付物清单

```
新增/修改：
├── server/
│   └── routes/
│       ├── feed.xml.ts       # RSS Feed
│       └── sitemap.xml.ts    # Sitemap
│
├── components/
│   └── ui/
│       └── Comments.vue      # Giscus 评论（需安装 @giscus/vue）
│
├── pages/articles/
│   └── [slug].vue            # 更新：SEO meta
│
├── nuxt.config.ts            # 更新：SEO 配置
│
├── public/
│   ├── robots.txt            # 搜索引擎规则
│   └── favicon.ico           # 网站图标
│
├── vercel.json               # 部署配置
├── .env.example              # 环境变量模板
└── .env                      # 环境变量（不提交）
```

### 详细步骤

#### Step 1: 实现 RSS 和 Sitemap
- server/routes/feed.xml.ts
- server/routes/sitemap.xml.ts

#### Step 2: SEO 优化
- useSeoMeta 设置页面元数据
- Open Graph 标签
- Twitter Cards

#### Step 3: 添加评论功能
```bash
# 安装 Giscus Vue 组件
npm install @giscus/vue
```

**Comments.vue 组件**
```vue
<script setup lang="ts">
import Giscus from '@giscus/vue'

const colorMode = useColorMode()
</script>

<template>
  <Giscus
    repo="你的用户名/你的仓库名"
    repo-id="从 giscus.app 获取"
    category="Announcements"
    category-id="从 giscus.app 获取"
    mapping="pathname"
    :theme="colorMode.value === 'dark' ? 'dark' : 'light'"
    lang="zh-CN"
  />
</template>
```

#### Step 4: 部署准备
- vercel.json 配置
- 环境变量设置
- robots.txt

#### Step 5: 部署
- 连接 GitHub 仓库
- Vercel 自动部署
- 自定义域名（可选）

### 验收标准

- [ ] `npm run typecheck` 类型检查通过
- [ ] `npm run build` 构建成功
- [ ] /feed.xml 返回有效 RSS
- [ ] /sitemap.xml 返回有效 Sitemap
- [ ] 文章页 Open Graph 元数据正确
- [ ] Giscus 评论加载成功
- [ ] Vercel 部署成功
- [ ] 页面可公网访问
- [ ] Lighthouse 性能评分 > 90

### 验证要点

```bash
# RSS 验证
curl https://your-domain.com/feed.xml

# Sitemap 验证
curl https://your-domain.com/sitemap.xml

# OG 验证
# 使用 https://www.opengraph.xyz/ 测试

# Lighthouse
# Chrome DevTools > Lighthouse > 运行
```

---

## Phase 6: 可选增强功能

### 目标
实现锦上添花的增强功能。

### 交付物清单（可选择性实现）

```
├── components/ui/
│   ├── ReadingProgress.vue   # 阅读进度条
│   ├── FloatingTOC.vue       # 浮动目录（桌面端右侧固定）
│   └── CopyButton.vue        # 代码复制按钮
│
├── composables/
│   └── usePagefindSearch.ts  # Pagefind 中文搜索
│
├── scripts/
│   ├── new-post.ts           # CLI: 创建文章
│   └── publish.ts            # CLI: 发布草稿
│
└── 性能优化
    ├── 图片懒加载
    ├── 字体子集
    └── Lighthouse 优化
```

### 功能说明

#### 阅读进度条
- 页面顶部固定
- 滚动时更新进度
- 主色调样式

#### 浮动目录 (FloatingTOC.vue)
- 文章详情页右侧固定
- 当前阅读位置高亮（Intersection Observer）
- 点击跳转到对应标题
- 响应式：仅在宽屏显示（>1280px）

> 注意：Phase 2 已实现内联 TOC，此组件为桌面端增强体验

#### 代码复制按钮
- 代码块右上角
- 点击复制到剪贴板
- 复制成功反馈

#### Pagefind 搜索
- 构建时生成索引
- 支持中文分词
- 全文搜索

#### CLI 工具
- `npm run new-post "标题"` - 创建文章模板
- `npm run publish slug` - 发布草稿

---

## 附录

### A. 每阶段预计时间

| 阶段 | 预计时间 | 累计时间 | 说明 |
|------|----------|----------|------|
| Phase 0 | 1.5-2h | 1.5-2h | 包含调试配置时间 |
| Phase 1 | 2-2.5h | 3.5-4.5h | 多个核心组件 |
| Phase 2 | 2-3h | 5.5-7.5h | **MVP 达成** |
| Phase 3 | 1.5h | 7-9h | 响应式相对独立 |
| Phase 4 | 1.5-2h | 8.5-11h | 依赖 Phase 3 |
| Phase 5 | 2h | 10.5-13h | **生产就绪** |
| Phase 6 | 2h+ | 12.5h+ | 可选增强 |

> **注意**：时间估算包含编码、调试和验证。首次使用 Nuxt 3 可能需要额外时间熟悉框架。

### B. 常见问题

**Q: 某阶段失败如何回滚？**
A: 每个阶段开始前建议 `git checkout -b phase-N`，失败可回到上一阶段分支。

**Q: 可以跳过某些阶段吗？**
A: Phase 0-2 必须顺序完成。Phase 3 和 Phase 5 可并行。Phase 4 依赖 Phase 3。

**Q: MVP 后多久可以上线？**
A: Phase 2 完成即可 MVP 上线。建议至少完成 Phase 5 再正式发布。

**Q: 如何调试 @nuxt/content？**
A: 使用 `/_content/query` 端点调试内容查询，详见 Phase 0 调试技巧章节。

### C. 回滚策略

```bash
# 创建阶段分支
git checkout -b phase-0
# ... 完成阶段 ...
git add . && git commit -m "Phase 0: 项目初始化"

# 合并到主分支
git checkout main
git merge phase-0

# 如需回滚
git revert HEAD  # 回滚最后一次提交
# 或
git reset --hard phase-0  # 硬回滚到某阶段
```

### D. 性能基准

| 指标 | Phase 2 目标 | Phase 5 目标 |
|------|--------------|--------------|
| LCP | < 3.0s | < 2.5s |
| FID | < 150ms | < 100ms |
| CLS | < 0.15 | < 0.1 |
| Lighthouse | > 80 | > 95 |

### E. 自动化测试建议（可选）

虽然本实施方案以手动验收为主，但建议在 Phase 5 后添加基础 E2E 测试：

```bash
# 安装 Playwright
npm install -D @playwright/test
npx playwright install
```

**基础测试用例** (`tests/e2e/basic.spec.ts`)：
```typescript
import { test, expect } from '@playwright/test'

test('首页加载', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/TechBlog/)
  await expect(page.locator('.article-card')).toHaveCount(3)
})

test('文章详情页', async ({ page }) => {
  await page.goto('/articles/hello-world')
  await expect(page.locator('h1')).toBeVisible()
  await expect(page.locator('.table-of-contents')).toBeVisible()
})

test('搜索功能', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('/')
  await expect(page.locator('.search-modal')).toBeVisible()
})

test('404 页面', async ({ page }) => {
  await page.goto('/not-exist-page')
  await expect(page.locator('text=not found')).toBeVisible()
})
```

---

## 快速参考

### 启动命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 预览生产版本
npm run preview

# 生成静态站点
npm run generate

# 类型检查
npm run typecheck
```

### 关键文件

| 功能 | 文件路径 |
|------|----------|
| Nuxt 配置 | `nuxt.config.ts` |
| Tailwind 配置 | `tailwind.config.ts` |
| CSS 变量 | `assets/css/main.css` |
| 站点配置 | `config/site.ts` |
| 类型定义 | `types/index.ts` |
| 文章目录 | `content/articles/` |
