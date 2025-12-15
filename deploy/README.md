# 服务器部署指南

## 目录结构

```
deploy/
├── docker-compose.yml  # Docker 编排
├── nginx.conf          # Nginx 配置
├── .env.example        # 环境变量示例
├── .env                # 环境变量 (需创建)
└── ssl/                # SSL 证书 (需创建)
    ├── fullchain.pem
    └── privkey.pem
```

## 部署步骤

### 1. 上传部署文件

```bash
# 将 deploy 目录上传到服务器
scp -r deploy/ user@your-server:/opt/myblog/
```

### 2. 配置环境变量

```bash
cd /opt/myblog
cp .env.example .env
vim .env  # 修改 SITE_URL
```

### 3. 配置 SSL 证书

**方式 A: 使用 Let's Encrypt (推荐)**

```bash
# 安装 certbot
apt install certbot

# 获取证书 (需先启动 HTTP 服务)
certbot certonly --webroot -w /var/www/certbot -d your-domain.com

# 复制证书
mkdir -p ssl
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/
cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/
```

**方式 B: 使用已有证书**

```bash
mkdir -p ssl
cp /path/to/your/fullchain.pem ssl/
cp /path/to/your/privkey.pem ssl/
```

### 4. 启动服务

```bash
# 拉取镜像并启动
docker compose pull
docker compose up -d

# 查看状态
docker compose ps
docker compose logs -f
```

## 常用命令

```bash
# 查看日志
docker compose logs -f app
docker compose logs -f nginx

# 重启服务
docker compose restart

# 更新镜像
docker compose pull
docker compose up -d

# 停止服务
docker compose down
```

## 证书自动续期

```bash
# 添加 crontab 任务
crontab -e

# 每月 1 日凌晨 3 点自动续期
0 3 1 * * certbot renew --quiet && docker compose -f /opt/myblog/docker-compose.yml restart nginx
```

## 无 SSL 临时部署

如果暂时没有 SSL 证书，可以使用仅 HTTP 配置：

1. 修改 `nginx.conf`，注释掉 443 server 块
2. 将 80 端口的重定向改为直接代理

```nginx
# 修改 80 端口 server 块
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://app;
        # ... 其他代理配置
    }
}
```
