---
title: 'Docker 入门到实践'
description: '从零开始学习 Docker，掌握容器化部署的核心概念和常用命令。'
date: '2024-01-10'
category: 'DevOps'
tags: ['Docker', 'DevOps', '容器化']
featured: false
published: true
---

# Docker 入门到实践

Docker 是现代应用部署的标准工具。本文带你快速入门。

## 核心概念

### 镜像 (Image)

镜像是一个只读模板，包含运行应用所需的所有内容。

```bash
# 拉取镜像
docker pull node:20-alpine

# 查看本地镜像
docker images

# 删除镜像
docker rmi node:20-alpine
```

### 容器 (Container)

容器是镜像的运行实例。

```bash
# 运行容器
docker run -d --name my-app -p 3000:3000 node:20-alpine

# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 停止容器
docker stop my-app

# 删除容器
docker rm my-app
```

## Dockerfile

Dockerfile 定义如何构建镜像：

```dockerfile
# 基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["npm", "start"]
```

### 多阶段构建

```dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

## Docker Compose

管理多容器应用：

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://db:5432/myapp
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_PASSWORD=secret
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 常用命令

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f app

# 停止所有服务
docker-compose down

# 重新构建
docker-compose build --no-cache

# 查看服务状态
docker-compose ps
```

## 最佳实践

### 1. 使用 .dockerignore

```
node_modules
npm-debug.log
.git
.env
*.md
```

### 2. 最小化镜像大小

```dockerfile
# 使用 alpine 基础镜像
FROM node:20-alpine

# 只安装生产依赖
RUN npm ci --only=production

# 清理缓存
RUN npm cache clean --force
```

### 3. 不要以 root 运行

```dockerfile
# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 切换用户
USER nextjs
```

### 4. 健康检查

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

## 常见问题

### 容器内访问宿主机

```bash
# Linux
docker run --add-host=host.docker.internal:host-gateway ...

# macOS/Windows 自动支持 host.docker.internal
```

### 查看容器日志

```bash
# 实时日志
docker logs -f container_name

# 最近 100 行
docker logs --tail 100 container_name
```

### 进入容器 Shell

```bash
docker exec -it container_name sh
```

## 总结

Docker 核心命令速查：

| 命令 | 用途 |
|------|------|
| `docker build` | 构建镜像 |
| `docker run` | 运行容器 |
| `docker ps` | 查看容器 |
| `docker logs` | 查看日志 |
| `docker exec` | 执行命令 |
| `docker-compose up` | 启动服务 |

掌握这些基础，你就可以开始容器化之旅了！
