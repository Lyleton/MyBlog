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
- **管理认证**: 静态口令 + 限速 + 无状态令牌，零外部依赖
- **全站编辑模式**: 登录后文章/关于页左写右预览分栏编辑，列表与归档就地增删改

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
├── deploy/              # Caddy / systemd / 部署文档
├── layouts/             # 页面布局
├── pages/               # 页面路由 (含 login、articles/new)
├── public/              # 静态资源
├── scripts/             # 运维脚本 (生成口令哈希)
├── server/
│   ├── api/             # 认证与内容管理 API
│   ├── routes/          # 服务端路由 (RSS, Sitemap, 便携令牌)
│   └── utils/           # 服务端工具 (auth, content)
└── types/               # TypeScript 类型定义
```

## 写作指南

### 创建新文章

**方式一：Web 编辑（推荐）**

登录 `/login` 后，在 `/articles` 页点击"新增文章"，左侧写 Markdown、右侧实时预览，保存后自动重建生效。文章列表、归档、关于页同样支持就地编辑。

**方式二：本地文件**

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

# 管理认证（服务端，勿提交真实值）
# 生成口令哈希: node scripts/hash-passphrase.mjs
AUTH_PASSPHRASE_HASH=scrypt:<salt>:<hash>
# 令牌签名密钥: openssl rand -hex 32
AUTH_SECRET=
```

## 管理认证

- 访问 `/login` 输入管理口令；5 次失败锁 1 小时，锁定返回通用错误
- 登录成功后全站进入编辑模式（会话 cookie 30 天）
- 便携令牌：`/?pt=<token>` 或 `/auth/portable?pt=<token>` 一次性换会话
- 忘记口令：SSH 修改服务器上 `/etc/myblog.env` 的 `AUTH_PASSPHRASE_HASH` 后重启服务
- 内容保存后自动 `nuxt build` 并由 systemd 拉起新版本（约 1-2 分钟生效）

## 部署

### Caddy + SSH 部署 (推荐)

站点以 Nuxt Nitro node-server 运行，Caddy 反向代理（自动 HTTPS）。代码变更后 SSH 到服务器更新：

```
SSH 服务器 → git pull + npm ci + nuxt build → sudo systemctl restart myblog
```

通过 Web 编辑模式修改的内容保存后自动重建，无需手动部署。

#### 配置步骤

**1. 服务器首次配置**

```bash
# 安装 Caddy 和 Node >= 20，克隆仓库到 /var/www/myblog
sudo cp deploy/Caddyfile /etc/caddy/Caddyfile   # 修改域名
sudo cp deploy/myblog.service /etc/systemd/system/
sudo tee /etc/myblog.env <<EOF                  # 认证配置
AUTH_SECRET=$(openssl rand -hex 32)
AUTH_PASSPHRASE_HASH=$(node scripts/hash-passphrase.mjs)
EOF
sudo systemctl enable --now myblog && sudo systemctl reload caddy
```

**2. 日常发布**

```bash
ssh deploy@server 'cd /var/www/myblog && git pull && npm ci && npm run build && sudo systemctl restart myblog'
```

详细说明参见 [deploy/README.md](deploy/README.md)

## License

MIT
