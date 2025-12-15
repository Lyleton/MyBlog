---
title: 'Node.js 生产环境最佳实践'
description: '从错误处理到性能优化，全面介绍 Node.js 生产环境部署的最佳实践。'
date: '2025-12-15'
category: 'Node.js'
tags: ['Node.js', '后端', '最佳实践']
featured: false
published: true
---

# Node.js 生产环境最佳实践

将 Node.js 应用部署到生产环境需要考虑很多因素。本文总结了关���的最佳实践。

## 错误处理

### 全局错误处理

```typescript
// 未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  // 记录日志后优雅退出
  process.exit(1)
})

// 未处理的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})
```

### Express 错误中间件

```typescript
// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)

  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message
  })
})
```

## 日志管理

使用结构化日志便于分析：

```typescript
import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

// 生产环境不输出到控制台
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }))
}
```

## 性能优化

### 使用集群模式

```typescript
import cluster from 'cluster'
import os from 'os'

const numCPUs = os.cpus().length

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`)

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`)
    cluster.fork() // 重启 worker
  })
} else {
  // Workers 可以共享任何 TCP 连接
  app.listen(3000)
  console.log(`Worker ${process.pid} started`)
}
```

### 启用 Gzip 压缩

```typescript
import compression from 'compression'

app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false
    }
    return compression.filter(req, res)
  },
  level: 6, // 压缩级别 1-9
}))
```

## 安全措施

### Helmet 中间件

```typescript
import helmet from 'helmet'

app.use(helmet())
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 限制每个 IP 100 个请求
  message: 'Too many requests, please try again later.',
})

app.use('/api/', limiter)
```

## 健康检查

```typescript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

app.get('/ready', async (req, res) => {
  try {
    // 检查数据库连接等
    await db.ping()
    res.status(200).json({ ready: true })
  } catch (error) {
    res.status(503).json({ ready: false })
  }
})
```

## 环境变量管理

```typescript
// config.ts
import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
})

export const config = envSchema.parse(process.env)
```

## 优雅关闭

```typescript
const server = app.listen(3000)

const gracefulShutdown = async () => {
  console.log('Received shutdown signal')

  server.close(() => {
    console.log('HTTP server closed')
  })

  // 关闭数据库连接
  await db.close()

  // 清理其他资源
  process.exit(0)
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
```

## 总结

生产环境部署清单：

- ✅ 全局错误处理
- ✅ 结构化日志
- ✅ 集群模式 / PM2
- ✅ Gzip 压缩
- ✅ 安全中间件
- ✅ Rate Limiting
- ✅ 健康检查端点
- ✅ 环境变量验证
- ✅ 优雅关闭

遵循这些最佳实践，可以显著提高 Node.js 应用的稳定性和安全性！
