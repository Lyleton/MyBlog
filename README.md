# TechBlog

一个基于 Nuxt 3 的现代化技术博客，采用终端/代码编辑器风格设计。

## 特性

- **终端风格 UI**: macOS 窗口样式、代码高亮主题
- **深色/浅色主题**: 支持系统偏好自动切换
- **响应式设计**: 适配桌面、平板、移动端
- **Markdown 支持**: 基于 @nuxt/content，支持 MDC 语法
- **全文搜索**: 快捷键 `Cmd/Ctrl + K` 唤起搜索
- **分类筛选**: 按分类浏览文章
- **SEO 优化**: Open Graph、Twitter Cards、结构化数据
- **RSS 订阅**: 自动生成 feed.xml
- **Sitemap**: 自动生成 sitemap.xml
- **评论系统**: 集成 Giscus (基于 GitHub Discussions)

## 技术栈

- [Nuxt 3](https://nuxt.com/) - Vue.js 框架
- [@nuxt/content](https://content.nuxt.com/) - 内容管理
- [@nuxtjs/tailwindcss](https://tailwindcss.nuxtjs.org/) - CSS 框架
- [@nuxtjs/color-mode](https://color-mode.nuxtjs.org/) - 主题切换
- [@nuxt/image](https://image.nuxt.com/) - 图片优化
- [@nuxt/icon](https://nuxt.com/modules/icon) - 图标
- [Giscus](https://giscus.app/) - 评论系统

## 开始使用

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 项目结构

```
myblog/
├── assets/css/          # 全局样式
├── components/
│   ├── content/         # 内容组件 (Callout, ArticleImage)
│   ├── layout/          # 布局组件 (Sidebar, Footer)
│   └── ui/              # UI 组件 (ArticleCard, Pagination...)
├── composables/         # 组合式函数
├── config/              # 站点配置
├── content/
│   ├── about.md         # 关于页面
│   └── articles/        # 博客文章 (Markdown)
├── deploy/              # Caddy 服务器部署配置
├── layouts/             # 页面布局
├── pages/               # 页面路由
├── public/              # 静态资源
├── server/routes/       # 服务端路由 (RSS, Sitemap)
└── types/               # TypeScript 类型定义
```

## 写作指南

### 创建新文章

在 `content/articles/` 目录下创建 `.md` 文件：

```markdown
---
title: 文章标题
description: 文章描述
date: 2024-01-15
category: 前端开发
tags:
  - Vue
  - TypeScript
cover: /images/cover.jpg
published: true
---

文章正文...
```

### Frontmatter 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 文章标题 |
| description | string | 是 | 文章描述 |
| date | string | 是 | 发布日期 (YYYY-MM-DD) |
| category | string | 是 | 分类 |
| tags | string[] | 否 | 标签列表 |
| cover | string | 否 | 封面图片路径 |
| published | boolean | 否 | 是否发布 (默认 true) |
| updated | string | 否 | 更新日期 |

### MDC 组件

**Callout 提示框**

```markdown
::callout{type="info"}
这是一条信息提示
::

::callout{type="warning"}
这是一条警告提示
::
```

**文章图片**

```markdown
::article-image{src="/images/example.jpg" alt="示例图片"}
图片说明文字
::
```

## 配置

### 站点配置

编辑 `config/site.ts`：

```typescript
export const siteConfig = {
  name: 'TechBlog',
  description: '专注于前端开发的技术博客',
  url: 'https://your-domain.com',
  author: {
    name: 'Your Name',
    email: 'your@email.com',
    github: 'https://github.com/username',
  },
}
```

### 评论系统

1. 在 GitHub 仓库启用 Discussions
2. 安装 [Giscus App](https://github.com/apps/giscus)
3. 访问 [giscus.app](https://giscus.app/) 获取配置
4. 更新 `components/ui/Comments.vue` 或设置环境变量

### 环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

配置项：

```env
NUXT_PUBLIC_SITE_URL=https://your-domain.com
NUXT_PUBLIC_GISCUS_REPO=username/repo
NUXT_PUBLIC_GISCUS_REPO_ID=your-repo-id
NUXT_PUBLIC_GISCUS_CATEGORY=Announcements
NUXT_PUBLIC_GISCUS_CATEGORY_ID=your-category-id
```

## 部署

### Vercel (推荐)

项目已包含 `vercel.json` 配置，直接导入到 Vercel 即可。

### Caddy + GitHub Actions (推荐)

项目集成了 CI/CD 流程，推送代码后自动部署：

```
Git Push → CI 检查 → 静态构建 → Rsync 同步 → Caddy 服务
```

#### 配置步骤

**1. 配置 GitHub Secrets**

在仓库 Settings → Secrets 中添加：

| Secret | 说明 |
|--------|------|
| `SERVER_HOST` | 服务器 IP 或域名 |
| `SERVER_USER` | SSH 用户名 |
| `SERVER_SSH_KEY` | SSH 私钥 |
| `SITE_URL` | 网站完整 URL |

**2. 服务器首次配置**

```bash
# 安装 Caddy
sudo apt install caddy  # Debian/Ubuntu

# 创建网站目录
sudo mkdir -p /var/www/myblog
sudo chown deploy:deploy /var/www/myblog

# 配置 Caddy (修改域名)
sudo cp deploy/Caddyfile /etc/caddy/Caddyfile
sudo vim /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

**3. 日常发布**

```bash
git add content/articles/new-post.md
git commit -m "feat: 新文章"
git push  # 自动部署 ✨
```

详细说明参见 [deploy/README.md](deploy/README.md)

### 静态部署

```bash
npm run generate  # 生成静态文件
```

生成的文件在 `.output/public` 目录，可部署到任何静态托管服务。

## License

MIT
