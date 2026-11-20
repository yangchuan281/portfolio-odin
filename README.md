# Dwarf Tiger · Portfolio

终端风格的多页静态个人作品集：无框架、无 CDN、无运行时依赖。Docker + Nginx 承载，
一条命令发布到自己服务器。

三个层级，逐层深入：

| 层级 | 文件 | 内容 |
|---|---|---|
| L1 | `index.html` | 欢迎页（点任意处进入）、定位、三张精选卡、技术栈九宫格、联系 |
| L2 | `projects.html` | 七个仓库分组展示，主线三个可点进案例 |
| L3 | `projects/*.html` | 单个系统：问题 → 取舍 → 故障 → 证据 → 复现 |

页面结构围绕**证据**组织：每个数字都能在本机用一条命令重跑。

```
portfolio-odin/
├── index.html                    # L1 首页
├── projects.html                 # L2 项目索引
├── projects/
│   ├── ops-pilot.html            # L3 案例（含架构图 SVG + 演练表）
│   ├── network-auto.html         # L3 案例
│   └── wecom-desk.html           # L3 案例
├── assets/
│   ├── css/style.css             # 设计令牌 + 双主题 + 响应式
│   ├── js/main.js                # 主题 / 时钟 / 揭示 / 复制 / 截图灯箱
│   ├── js/i18n.js                # 中文词典（英文在 HTML 里，全站共用）
│   ├── fonts/*.woff2             # Space Grotesk + JetBrains Mono（本地）
│   └── img/
│       ├── og.png                # 社交分享图 1200×630
│       └── evidence/             # 运行截图（webp，各带 -thumb 缩略图）
├── nginx.conf                    # gzip、缓存、安全头
├── Dockerfile
├── docker-compose.yml
├── set-domain.sh                 # 一条命令改掉全站域名（含 projects/）
├── deploy.sh                     # rsync + 远端重建
├── sitemap.xml
├── robots.txt
└── .archive/                     # 已从站点撤下的旧文件（简历），不参与构建与部署
```

---

## 1. 本地预览

```bash
cd portfolio-odin
python -m http.server 8080
```

浏览器打开 <http://localhost:8080>。没有构建步骤，改完刷新即可。

首页会先出一层欢迎页，点任意位置（或按任意键）进入。它只在首页出现，而且你从案例页
返回首页时不会再弹；直接刷新首页会重新弹一次。样式在 `style.css` §7，交互在
`main.js` 的 gate 段。

---

## 2. 页面上的数字从哪来

这一节是这份 README 里最重要的部分：别人问到任何一个数，都能当场复现。

| 页面位置 | 数字 | 复现方式 |
|---|---|---|
| Work · 统计条 | `12.8k` 行代码 / 65 模块 | `find app -name '*.py' \| wc -l`，`wc -l` 求和 |
| Work · 统计条 | `248` 测试通过 / 2 跳过 | `cd ops-pilot && .venv/Scripts/python.exe -m pytest -q` |
| Work · 统计条 | `15.8s` 坏镜像到回滚完成 | `python scripts/drill_capture.py` → `var/drill-report.json` 的 `drill1.deploy_elapsed_s` |
| DR-01 行 | 15.8s → rolled back | 同上；发布日期 `2026-11-14 21:07:53 → 21:08:08` |
| DR-02 行 | 7ms 预览 / 0 误删 | 同上 `drill2.preview.duration_ms`、`drill2.execute.duration_ms` |
| DR-03 行 | sha256 4/4 一致 | 同上 `drill3.sha_matches`、`drill3.restore_comparison[*]` |
| DR-04 行 | 5 → 1 / 12–39ms | 同上 `drill4.alert_count_total`、`drill4.burst[*].elapsed_ms` |
| 案例截图 | 仪表盘 13 资产 / 5 未恢复告警 | OpsPilot 本地库 `opspilot.db` 真实数据，非摆拍 |
| 网络案例 | 两台 VyOS `192.168.188.10 / .2` | 控制台设备清单截图 |

> 测试数字在 2026-11-18 本机实测为 **250 collected / 248 passed / 2 skipped / 0 failed**。
> 换机器或改代码后数字会变，变了就同步改页面——**不要留着旧数字**。

---

## 3. 服务器从零配置

以 **Ubuntu 22.04 / 24.04** 为例。CentOS/Rocky 把 `apt` 换成 `dnf`。

### 3.1 放行端口（两处都要做）

| 位置 | 操作 |
|---|---|
| 云厂商控制台「安全组 / 防火墙」 | 入方向放行 **22 / 80 / 443**（22 建议限制为你的常用 IP） |
| 服务器本机 ufw | `sudo ufw allow 22/tcp && sudo ufw allow 80,443/tcp && sudo ufw enable` |

只配了 ufw 而没配安全组，外部照样连不上——这是最常见的踩坑点。

### 3.2 登录并做基础加固

```bash
adduser odin
usermod -aG sudo odin

# 本地执行：装公钥
ssh-copy-id -p 22 odin@<你的公网IP>

# 确认能用 odin 免密登录后，再关密码登录
sudo sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

sudo apt update && sudo apt install -y fail2ban
sudo systemctl enable --now fail2ban
```

> 顺序很重要：**先确认密钥能登录，再关密码**。反过来会把你自己锁在门外。

### 3.3 安装 Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER      # 需要重新登录生效
docker --version && docker compose version
```

国内机器拉镜像慢，配 `/etc/docker/daemon.json` 加加速地址后 `sudo systemctl restart docker`。

---

## 4. 首次上线

### 第 0 步：把域名写进全站（必做）

页面里的 canonical、`og:url`、`og:image`、`sitemap.xml`、`robots.txt` 全指向
`https://YOUR-DOMAIN/`。**部署脚本会拦住占位符**，所以先跑：

```bash
# 有域名、要 HTTPS
./set-domain.sh odin.example.com

# 暂时只有公网 IP、先跑 HTTP
FORCE_HTTP=1 ./set-domain.sh 203.0.113.10
```

脚本只改站点自己的域名，**不会碰 GitHub 等外链**（跑完会打印改后的四行供核对）。
域名换了就再跑一次，它是幂等的。

### 第 1 步：推上去

```bash
SERVER_HOST=<你的公网IP> SERVER_USER=odin ./deploy.sh
```

脚本做四件事：校验元数据 → `mkdir` 目标目录 → `rsync -az --delete` 同步 →
远端 `docker compose up -d --build`。约 3–5 秒。

> 没有 rsync 时的手动等价做法：
> ```bash
> scp -r . odin@<IP>:/opt/odin-portfolio
> ssh odin@<IP> 'cd /opt/odin-portfolio && docker compose up -d --build'
> ```

### 或在服务器上从 git 拉

```bash
ssh odin@<IP>
sudo mkdir -p /opt/odin-portfolio && sudo chown $USER /opt/odin-portfolio
git clone <你的仓库地址> /opt/odin-portfolio
cd /opt/odin-portfolio && docker compose up -d --build
```

---

## 5. 验证

```bash
curl -I http://<你的公网IP>/           # 200 + Content-Type: text/html
docker compose ps                      # STATUS 应为 Up (healthy)
docker compose logs --tail=50
```

浏览器逐项过一遍：

- [ ] 首页先进欢迎页：点任意处（或任意键）进入，之后正文不再被遮挡
- [ ] 从案例页返回首页时**不再**弹欢迎页；直接刷新首页会再弹一次
- [ ] 关掉 JS 打开首页：欢迎页不出现，正文完整可见
- [ ] 首屏两个按钮：`see the evidence` 滚到作品区、`all projects` 进项目索引
- [ ] 首屏下方的项目快捷链接（`01 ops-pilot` 等）跳到对应案例，标题不被导航遮住
- [ ] 作品区三个案例：四格 `problem / trade-off / failure / result` 齐全，架构图文字不溢出
- [ ] 点任一截图能放大（`Esc` 或点空白关闭），关闭后焦点回到原缩略图
- [ ] 切换主题，浅色下架构图文字与标签仍清晰
- [ ] 手机上（F12 切设备）汉堡菜单可展开且不透明；架构图可左右滑动
- [ ] `EN / 中` 整页切换，刷新保持；切回 EN 时徽标、状态点、`<br>` 都还在
- [ ] `curl -I http://<IP>/assets/css/style.css` 返回 `no-cache, must-revalidate`
- [ ] `curl -I http://<IP>/assets/fonts/space-grotesk.woff2` 返回 `max-age=2592000`

**打不开时按这个顺序查**：安全组是否放行 80 → `sudo ufw status` → `docker compose ps`
→ `sudo ss -lntp | grep :80`（被占用就把 compose 改成 `"8080:80"`）。

---

## 6. 日常更新

```bash
SERVER_HOST=<IP> SERVER_USER=odin ./deploy.sh
```

同步是 `--delete`：本地删掉的文件服务器上也会消失，不会残留旧内容。

---

## 7. 域名 + HTTPS

容器默认占宿主 `80`。加域名时让宿主 **Caddy** 做 TLS 终结，容器退回内网端口：

**① `docker-compose.yml`**

```yaml
    ports:
      - "127.0.0.1:8080:80"     # 只监听本机，公网进不来
```

**② 装 Caddy**

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy
```

**③ `/etc/caddy/Caddyfile`**

```
odin.example.com {
    encode zstd gzip
    reverse_proxy 127.0.0.1:8080
}
```

```bash
sudo systemctl reload caddy
```

**④ 把站点指向新域名并重新发布**

```bash
./set-domain.sh odin.example.com     # 默认 https
./deploy.sh
```

前置条件：A 记录已指向该 IP、安全组放行 443。Caddy 自动签发并续期证书。
启用 HTTPS 后回到 `nginx.conf` 把 HSTS 那行取消注释。

---

## 8. 上线后加固清单（按优先级）

1. **SSH 只认密钥** —— 已在 §3.2 完成，收益最大。
2. **fail2ban 保持运行** —— `sudo fail2ban-client status sshd` 能看到封禁记录。
3. **系统自动安全更新** —— `sudo apt install -y unattended-upgrades`。
4. **镜像跟着更新** —— 每月 `docker compose pull && docker compose up -d --build`。
5. **备份就一个目录** —— `/opt/odin-portfolio` 即全部资产，`tar czf` 打包即可。
6. **日志别无限涨** —— compose 里已限制 `max-size=10m / max-file=3`。

---

## 9. 中英双语怎么维护

右上角 `EN / 中` 切换，选择记在 `localStorage` 的 `odin-lang`，刷新保持。

**英文**在各页 HTML 里，是唯一事实来源：首次加载缓存原文，切回英文原样还原。
`i18n.js` 被五个页面共用，词典键统一以 `idx.` / `p1.` / `p2.` / `p3.` 前缀区分层级。

**中文**在 `assets/js/i18n.js` 的 `ZH` 词典，键名与 `data-i18n` 一致：

```html
<!-- 纯文本 -->
<p data-i18n="c1.problem">A bad deploy meant SSHing in at night…</p>

<!-- 含标签必须用 -html 版本 -->
<h2 data-i18n-html="about.h2">Reliability is a feature.<br>I'm learning…</h2>
```

```js
'c1.problem': '发布砸了，意味着半夜 SSH 上去、凭记忆猜上一个镜像 tag。',
```

**有意不翻译**：shell 命令、`release/*` 标记、技术栈九宫格里的 `os.shell` / `web.api`
这类 key、chips 里的工具名、架构图里的英文标签（`health gate`、`dry-run`）。
这些是代码痕迹不是文案。

**两个坑**：

1. 别把 `data-i18n` 挂到**含子元素**的容器上——脚本整体替换 `innerHTML`，会连徽标一起抹掉。
   标题与徽标要各挂一个 key（见 `c1.title` 与 `c1.pill`）。
2. `<html lang>` 会跟着切换，CSS 里 `html[lang="zh"]` 的字号/行高微调靠它生效。

**加完新文案怎么自检**：切到中文后，凡是与英文原文完全相同的节点就是漏译的键。

---

## 10. 上线前必须处理的

| 位置 | 当前值 | 说明 |
|---|---|---|
| 全站域名 | `https://YOUR-DOMAIN/` | 跑 `./set-domain.sh 你的域名`，否则 `deploy.sh` 拒绝发布 |
| 三个主线项目 | **私有仓库** | `ops-pilot` 已推送到 `github.com/yangchuan281/ops-pilot`（私有），页面标了"源码暂为私有，可申请查看"；`itsm-platform` 等仍未公开。转公开后把 `projects/ops-pilot.html` 里 `class="case__repo"` 那个 `<a>` 换成仓库链接即可 |
| `assets/img/og.png` | 占位图 | 想换就换 1200×630，文件名保持不变 |
| 邮箱 | `18295659278@163.com` | 每页的联系按钮、复制终端和 `mailto` 里都有 |

改完全文搜一遍 `YOUR-DOMAIN` 和 `EDIT`，确认没有漏网的占位符。

## 11. 已知短板（写在这里，不藏在心里）

- **主线项目仓库未公开**：`ops-pilot` 已推上 GitHub 但仍是**私有**（147 文件 / 22.8k 行），
  所以访客点不到源码，页面上只剩站内截图 + 演练数字。把仓库转公开是补上这个缺口的最后一步，
  转完改一下 `projects/ops-pilot.html` 里 `case__repo` 那一行即可。
- **OpsPilot 的 K8s 部分是 fake 驱动**：发布状态机与门禁逻辑是真的，但没在真实集群上跑过；
  页面上照实写了 `fake K8s driver`。
- **架构图是手绘 SVG**：与代码同步靠人肉，改架构时记得改图。
- **截图会过期**：改版 OpsPilot 后要重截 `assets/img/evidence/*.webp`（含 `-thumb`）。

---

## 12. 命令备忘

```bash
# 改域名 + 发布
./set-domain.sh odin.example.com
SERVER_HOST=odin.example.com SERVER_USER=odin ./deploy.sh

# 看日志
ssh odin@<IP> 'cd /opt/odin-portfolio && docker compose logs -f --tail=100'

# 重启 / 停止
ssh odin@<IP> 'cd /opt/odin-portfolio && docker compose restart'
ssh odin@<IP> 'cd /opt/odin-portfolio && docker compose down'

# 本地预览
python -m http.server 8080
```
