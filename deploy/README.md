# 服务器部署指南

## 自动化部署流程

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Git Push   │ ──▶ │  CI 检查    │ ──▶ │  静态构建   │ ──▶ │ Rsync 部署  │
│  (main)     │     │ (lint/build)│     │ (generate)  │     │  (Caddy)    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

## 部署架构

- **构建方式**: Nuxt 3 静态生成 (`npm run generate`)
- **Web 服务器**: Caddy (自动 HTTPS)
- **部署方式**: Rsync 同步静态文件
- **触发条件**: Push 到 main 分支

## 首次配置

### 1. 配置 GitHub Secrets

在仓库 **Settings → Secrets and variables → Actions** 中添加：

| Secret 名称 | 说明 | 示例 |
|-------------|------|------|
| `SERVER_HOST` | 服务器 IP 或域名 | `123.45.67.89` |
| `SERVER_USER` | SSH 用户名 | `deploy` |
| `SERVER_SSH_KEY` | SSH 私钥 | `-----BEGIN OPENSSH...` |
| `SITE_URL` | 网站完整 URL | `https://blog.example.com` |

### 2. 服务器初始化

#### 安装 Caddy

```bash
# Debian/Ubuntu
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy

# CentOS/RHEL
sudo yum install yum-plugin-copr
sudo yum copr enable @caddy/caddy
sudo yum install caddy
```

#### 配置目录和权限

```bash
# 创建网站目录
sudo mkdir -p /var/www/myblog
sudo chown -R deploy:deploy /var/www/myblog

# 创建日志目录
sudo mkdir -p /var/log/caddy
sudo chown caddy:caddy /var/log/caddy
```

#### 配置 Caddy

```bash
# 备份原配置
sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.bak

# 使用项目配置（修改域名后）
sudo cp deploy/Caddyfile /etc/caddy/Caddyfile
sudo vim /etc/caddy/Caddyfile  # 修改 your-domain.com 为实际域名

# 验证配置
sudo caddy validate --config /etc/caddy/Caddyfile

# 重启 Caddy
sudo systemctl reload caddy
```

### 3. 配置 SSH 部署用户

```bash
# 创建部署用户
sudo useradd -m -s /bin/bash deploy

# 配置 SSH 密钥
sudo mkdir -p /home/deploy/.ssh
sudo vim /home/deploy/.ssh/authorized_keys  # 添加公钥
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo chown -R deploy:deploy /home/deploy/.ssh

# 确保用户有权写入网站目录
sudo chown -R deploy:deploy /var/www/myblog
```

## Caddyfile 配置说明

```caddyfile
your-domain.com {
    # 网站根目录 - 静态文件存放位置
    root * /var/www/myblog

    # 启用 Gzip 压缩
    encode gzip

    # 静态文件服务
    file_server

    # SPA 路由回退 - 支持客户端路由
    try_files {path} {path}.html {path}/ /index.html

    # 安全响应头
    header {
        X-Content-Type-Options "nosniff"
        X-Frame-Options "SAMEORIGIN"
        X-XSS-Protection "1; mode=block"
        Referrer-Policy "strict-origin-when-cross-origin"
    }

    # 静态资源长期缓存（1年）
    @static {
        path *.js *.css *.png *.jpg *.jpeg *.gif *.ico *.svg *.woff *.woff2
    }
    header @static Cache-Control "public, max-age=31536000, immutable"

    # RSS 和 Sitemap 缓存（1小时）
    @xml {
        path *.xml
    }
    header @xml Cache-Control "public, max-age=3600"

    # 访问日志
    log {
        output file /var/log/caddy/myblog.log
        format console
    }
}

# www 重定向到非 www（可选）
www.your-domain.com {
    redir https://your-domain.com{uri} permanent
}
```

## 日常使用

### 发布新文章

```bash
# 1. 本地编写文章
vim content/articles/my-new-post.md

# 2. 添加图片（如有）
cp images/* public/images/articles/my-new-post/

# 3. 本地预览
npm run dev

# 4. 提交并推送
git add .
git commit -m "feat: 添加新文章"
git push

# 5. 自动部署 ✨
# GitHub Actions 自动执行:
# - 代码检查 (lint)
# - 静态生成 (generate)
# - Rsync 同步到服务器
# - Caddy 自动服务新文件
```

### 手动触发部署

在 GitHub 仓库 **Actions** 页面，选择 **Deploy** workflow，点击 **Run workflow**。

## 目录结构

```
服务器端:
/var/www/myblog/          # 网站根目录
├── index.html            # 首页
├── articles/             # 文章页面
├── _nuxt/                # 静态资源
├── images/               # 图片资源
├── rss.xml               # RSS 订阅
└── sitemap.xml           # 站点地图

/etc/caddy/
└── Caddyfile             # Caddy 配置

/var/log/caddy/
└── myblog.log            # 访问日志
```

## 常用命令

### Caddy 管理

```bash
# 查看状态
sudo systemctl status caddy

# 重启服务
sudo systemctl restart caddy

# 重新加载配置（不中断服务）
sudo systemctl reload caddy

# 验证配置
sudo caddy validate --config /etc/caddy/Caddyfile

# 查看日志
sudo journalctl -u caddy -f
tail -f /var/log/caddy/myblog.log
```

### 文件管理

```bash
# 查看部署文件
ls -la /var/www/myblog/

# 手动清理（慎用）
rm -rf /var/www/myblog/*

# 检查磁盘使用
du -sh /var/www/myblog/
```

## 回滚

由于使用静态部署，回滚需要重新构建历史版本：

```bash
# 1. 本地切换到目标版本
git checkout <commit-hash>

# 2. 构建静态文件
npm run generate

# 3. 手动上传（或推送到临时分支触发部署）
rsync -avz --delete .output/public/ user@server:/var/www/myblog/
```

或者使用 Git 回滚：

```bash
# 回滚到上一个版本
git revert HEAD
git push

# GitHub Actions 自动重新部署
```

## 故障排查

### 部署失败

1. 检查 GitHub Actions 日志
2. 检查 Secrets 配置是否正确
3. 验证服务器 SSH 连接：
   ```bash
   ssh -i ~/.ssh/deploy_key deploy@your-server
   ```

### 网站无法访问

```bash
# 检查 Caddy 状态
sudo systemctl status caddy

# 检查端口监听
sudo ss -tlnp | grep -E ':80|:443'

# 检查防火墙
sudo ufw status
# 或
sudo firewall-cmd --list-all

# 检查文件权限
ls -la /var/www/myblog/
```

### SSL 证书问题

Caddy 会自动获取和续期 Let's Encrypt 证书。如有问题：

```bash
# 查看 Caddy 日志
sudo journalctl -u caddy | grep -i cert

# 检查 DNS 解析
dig your-domain.com

# 手动触发证书获取
sudo caddy run --config /etc/caddy/Caddyfile
```

### 页面 404

```bash
# 检查文件是否存在
ls -la /var/www/myblog/

# 检查 try_files 配置
cat /etc/caddy/Caddyfile | grep try_files

# 确保 index.html 存在
cat /var/www/myblog/index.html | head -20
```

## 性能优化建议

### 1. 启用 HTTP/2（Caddy 默认支持）

Caddy 默认启用 HTTP/2，无需额外配置。

### 2. 配置 CDN（可选）

如使用 Cloudflare：
- 启用 Proxy 模式
- 配置缓存规则
- 启用 Brotli 压缩

### 3. 监控

```bash
# 使用 GoAccess 分析日志
goaccess /var/log/caddy/myblog.log -o report.html --log-format=COMBINED

# 或配置 Grafana + Prometheus
```

## 与 Docker 部署对比

| 特性 | 静态部署 (Caddy) | Docker 部署 |
|------|------------------|-------------|
| 资源占用 | 低 (~10MB) | 中 (~100MB+) |
| 部署速度 | 快 (秒级) | 中 (分钟级) |
| 配置复杂度 | 简单 | 中等 |
| HTTPS | 自动 | 需配置 |
| 扩展性 | 有限 | 灵活 |
| 适用场景 | 静态博客 | 动态应用 |

对于静态博客，Caddy 直接部署是更轻量、更简单的选择。
