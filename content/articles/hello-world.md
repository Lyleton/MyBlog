---
title: 'Hello World - 欢迎来到我的技术博客'
description: '这是我的第一篇博客文章，介绍博客的技术栈、功能特性和图片使用示例。'
date: '2024-01-20'
category: 'Vue'
tags: ['Nuxt', 'Vue', '博客', '教程']
cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop'
featured: true
published: true
---

# Hello World

欢迎来到我的技术博客！这是基于 **Nuxt 3** 和 **@nuxt/content** 构建的个人博客系统。

::article-image{src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop" alt="代码编辑器"}
现代化的开发环境 - 一个整洁的代码编辑器是程序员的最佳伙伴
::

## 技术栈

本博客使用以下技术构建：

- **框架**: Nuxt 3 + Vue 3
- **内容管理**: @nuxt/content
- **样式**: Tailwind CSS
- **部署**: Vercel

::callout{type="info"}
本博客完全开源，你可以在 [GitHub](https://github.com/Lyleton/MyBlog) 上查看源代码。
::

## 特色功能

### 终端风格 UI

整个博客采用程序员熟悉的终端/代码编辑器风格设计：

```bash
$ cd ~/blog
$ ls ./articles
hello-world.md
vue-composition-api.md
typescript-tips.md
```

::article-image{src="https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=450&fit=crop" alt="终端界面"}
终端风格的 UI 设计 - 让程序员有宾至如归的感觉
::

### 代码高亮

支持多种语言的代码高亮：

```typescript
interface BlogPost {
  title: string
  description: string
  date: string
  tags: string[]
}

const greeting = (name: string): string => {
  return `Hello, ${name}!`
}

console.log(greeting('World'))
```

```vue
<template>
  <div class="blog-post">
    <h1>{{ post.title }}</h1>
    <p>{{ post.description }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  post: BlogPost
}>()
</script>
```

### 暗色模式

支持亮色和暗色主题切换，自动适应系统偏好。

::callout{type="tip"}
点击侧边栏的主题切换按钮，即可在亮色和暗色模式之间切换。
::

## 图片功能演示

### 使用 article-image 组件

`article-image` 组件支持图片说明文字，适合展示带描述的图片：

::article-image{src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop" alt="编程工作台"}
一个程序员的日常工作环境 - 多显示器、机械键盘和一杯咖啡
::

### 使用标准 Markdown 图片

标准的 Markdown 图片语法同样支持：

![Vue.js Logo](https://vuejs.org/images/logo.png)

### 响应式图片

所有图片都会自动适应容器宽度，在移动端也能完美显示。

## 后续计划

我将在这里分享：

1. **前端开发** - Vue/React 框架深入解析和最佳实践
2. **TypeScript** - 类型系统和高级类型技巧
3. **Node.js** - 后端开发经验和性能优化
4. **DevOps** - CI/CD、Docker 和云原生技术

::callout{type="warning"}
本博客仍在持续开发中，部分功能可能还不完善。如果你发现任何问题，欢迎在 GitHub 上提交 Issue。
::

## 写作格式参考

### 表格

| 技术 | 用途 | 版本 |
|------|------|------|
| Nuxt | 框架 | 3.x |
| Vue | UI 库 | 3.x |
| Tailwind | CSS | 3.x |
| TypeScript | 类型 | 5.x |

### 引用

> 代码是写给人看的，顺便能在机器上运行。
> — Harold Abelson

### 任务列表

- [x] 基础布局完成
- [x] 文章列表页面
- [x] 文章详情页面
- [x] 暗色模式支持
- [ ] 评论系统优化
- [ ] 站内搜索增强

---

感谢阅读，敬请期待更多内容！如果觉得有用，欢迎 Star 这个项目。
