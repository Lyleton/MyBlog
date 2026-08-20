# 服务器部署指南（Nitro 服务端版）

## 架构

```
Git Push ──▶ GitHub Actions ──▶ SSH 到服务器
                                  └─ git pull + npm ci + nuxt build + systemctl restart myblog

浏览器 ──▶ Caddy (HTTPS, 反向代理) ──▶ node .output/server/index.mjs (:3000)
                                          ├─ 页面渲染 (SSR)
                                          ├─ /api/auth/*  口令认证、签发令牌
                                          └─ /api/admin/* 文章/栏目读写 + 写后自动重建
```

- **运行方式**: Nuxt Nitro node-server（不再是静态生成）
- **Web 服务器**: Caddy 反向代理（自动 HTTPS）
- **应用目录**: `/var/www/myblog`（完整 git 仓库，重建需要源码）
- **内容编辑**: `/login` 登录后全站进入编辑模式（侧边栏、文章列表、归档、关于、文章详情均可就地编辑）；保存后自动 `nuxt build` 并由 systemd 拉起新版本（约 1-2 分钟生效，期间用旧版本服务）

> 注意：通过管理面板改的内容只存在于服务器磁盘，不进 git。下次 CI 部署
> （`git reset --hard origin/main`）会覆盖。重要内容请同时提交到仓库。

## 首次配置

### 1. 服务器初始化

```bash
# 安装 Caddy 和 Node >= 20
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy/caddy-stable.list
sudo apt update && sudo apt install caddy
# Node 20: 参考 https://github.com/nodesource/distributions 或 nvm

# 创建部署用户和应用目录（git 克隆）
sudo useradd -m -s /bin/bash deploy
sudo mkdir -p /var/www && sudo chown deploy:deploy /var/www
sudo -u deploy git clone git@github.com:lyleton/MyBlog.git /var/www/myblog

# 免密重启服务（sudoers）
echo 'deploy ALL=(root) NOPASSWD: /bin/systemctl restart myblog' | sudo tee /etc/sudoers.d/myblog
sudo mkdir -p /var/log/caddy && sudo chown caddy:caddy /var/log/caddy
```

### 2. 配置认证（带外恢复也走这一步）

```bash
cd /var/www/myblog
node scripts/hash-passphrase.mjs      # 输入管理口令，得到 scrypt:... 哈希
sudo tee /etc/myblog.env <<EOF
AUTH_SECRET=$(openssl rand -hex 32)
AUTH_PASSPHRASE_HASH=<上一步输出的哈希>
EOF
sudo chmod 600 /etc/myblog.env && sudo chown deploy /etc/myblog.env
```

忘记口令时：SSH 进来改 `/etc/myblog.env` 里的哈希再 `sudo systemctl restart myblog`。

### 3. 安装 systemd 服务和 Caddy

```bash
sudo cp deploy/myblog.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable --now myblog

sudo cp deploy/Caddyfile /etc/caddy/Caddyfile   # 先修改域名
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

### 4. GitHub Secrets

Settings → Secrets → Actions：`SERVER_HOST`、`SERVER_USER`（deploy）、`SERVER_SSH_KEY`。

## 常用命令

```bash
sudo systemctl status myblog          # 应用状态
sudo journalctl -u myblog -f          # 应用日志（含 [auth] 审计、[rebuild] 日志）
sudo systemctl restart myblog         # 重启
sudo systemctl reload caddy           # Caddy 重载配置
tail -f /var/log/caddy/myblog.log     # 访问日志
```

## 故障排查

- **网站打不开**: `systemctl status myblog` → `ss -tlnp | grep 3000` → `journalctl -u caddy`
- **登录一直失败**: 确认 `/etc/myblog.env` 已加载（改完要 restart）；触发限速后锁定 1 小时，重启应用可立即清零
- **改了内容不生效**: 看 `journalctl -u myblog` 里 `[rebuild]` 是否成功；构建失败会保留旧版本
