# 部署手册

这套 playbook 的作用：把服务器从「空 Ubuntu」变成「能跑这个站点的入口层」，
且**可重复执行、结果一致**。原来手工敲的那二十几条命令，现在是一条 `ansible-playbook site.yml`。

覆盖四件事：

1. 基础环境（时区、基础包、ufw 放行 22/80/443）
2. Docker（走腾讯云内网镜像源，避开 `get.docker.com` 被 reset 的问题）
3. 宿主 Nginx（证书落盘、站点配置、reload）
4. 幂等校验（已满足的状态不产生变更，重复执行安全）

## 它管什么，不管什么

| 管 | 不管 |
|---|---|
| 宿主机的软件状态 | 容器内的静态文件（那是镜像的事） |
| Nginx 站点配置与证书 | 域名解析（DNSPod 控制台） |
| 防火墙 ufw | 腾讯云安全组（控制台） |
| Docker daemon 配置 | 站点内容部署（`docker compose --build`） |

最后一行是关键：这个 playbook **不部署站点内容**。它保证的是"服务器具备上线条件"，
内容更新走另一条路径（手工 `docker compose up -d --build`，或以后的 CI）。

## 目录结构

```
deploy/
├── ansible.cfg
├── inventory.ini              # 目标主机
├── site.yml                   # 总入口，三个 role 依次执行
├── group_vars/web.yml         # 域名 / HSTS / 证书路径，唯一需要改的地方
├── certs/                     # 证书源（私钥不入 git）
└── roles/
    ├── base/                  # 时区、基础包、ufw
    ├── docker/                # 镜像源、docker-ce、daemon.json
    └── edge/                  # 证书、Nginx 配置、reload、上游探测
```

## 前置条件

### 1 · SSH 密钥登录（必做）

现在服务器是密码登录，Ansible 用密码需要 `-k -K` 手工输入，且每次都要输。
先做成密钥：

```powershell
# 本机 PowerShell：没有密钥就先生成
ssh-keygen -t ed25519 -C "odin@laptop"

# 把公钥传到服务器（这一步还要输密码）
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh ubuntu@122.152.193.140 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

# 验证免密（不该再提示密码）
ssh ubuntu@122.152.193.140 "echo ok"
```

免密通过之后再关服务器的密码登录（顺序不能反，否则锁死自己在门外）：

```bash
sudo sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart ssh
```

### 2 · 证书文件就位

把证书放进 `deploy/certs/`，**文件名必须固定**为：

```
deploy/certs/fullchain.pem     ← 腾讯云下载的 xxx_bundle.crt
deploy/certs/privkey.pem       ← 对应的 xxx.key
```

`certs/.gitignore` 已经忽略全部内容，私钥不会被提交。

### 3 · Ansible 运行环境

Ansible 只能在类 Unix 环境跑，Windows 需要容器或子系统。三条路，按省事程度排序：

| 方式 | 前提 | 适合 |
|---|---|---|
| **WSL2** | Windows 10 2004+ / 11 | 长期维护，一次装好一直能用 |
| **Docker** | 本机装了 Docker Desktop | 不想装子系统，用完即走 |
| **GitHub Actions** | 仓库已托管 | 完全不占本地环境（见下节） |

## 执行

### 方式一 · WSL2

```bash
# WSL 里首次安装
sudo apt update && sudo apt install -y ansible

# 进到 playbook 目录（WSL 访问 D 盘用 /mnt/d）
cd /mnt/d/my_repo/portfolio-odin/deploy

# 先干跑，只看会改什么，不动服务器
ansible-playbook site.yml --check --diff

# 确认无误后真跑
ansible-playbook site.yml
```

### 方式二 · Docker

```powershell
cd D:\my_repo\portfolio-odin\deploy
docker run --rm -it -v "${PWD}:/work" -v "$env:USERPROFILE\.ssh:/root/.ssh:ro" -w /work alpine/ansible:latest ansible-playbook site.yml
```

`--check` 同理加在 `ansible-playbook` 后面。

### 方式三 · GitHub Actions

仓库托管后，用 `workflow_dispatch` 手动触发，跑在 GitHub 的 Ubuntu runner 上，
SSH 私钥放 Secrets。**这条路需要先把代码入库**，见文末「待办」。

## 日常操作

### 换证书（每 90 天一次）

```bash
# 1. 新证书覆盖到 deploy/certs/ 的两个固定文件名
# 2. 只重刷入口层，不碰 Docker 和基础包
ansible-playbook site.yml --tags edge
```

`--tags` 目前没打标签，暂时用全量执行（幂等，不会改动已满足项）。等需要时再补
`tags: edge` 到 edge role 的每个 task 上。

### 只改 HSTS 或域名

改 `group_vars/web.yml` 里的值，重跑 `site.yml`。模板变更会自动触发 `reload nginx`。

### 验证

```bash
curl -sI https://lowtighter.icu | head -6
curl -sI https://lowtighter.icu | grep -i strict-transport
echo | openssl s_client -connect lowtighter.icu:443 -servername lowtighter.icu 2>/dev/null | openssl x509 -noout -subject -dates
```

playbook 跑完也会自己报告上游容器状态：`upstream 127.0.0.1:8080 -> HTTP 200`。
如果是 `HTTP 000`，说明容器没起，那是内容部署的问题，不是入口层的问题。

## 回滚

| 场景 | 做法 |
|---|---|
| 改了配置想撤销 | `git revert` 对应提交后重跑 playbook |
| playbook 执行中失败 | ufw 的 SSH 规则在最前面放行，不会把连接切断；已完成的 role 保持生效 |
| Nginx 配置错误导致无法 reload | playbook 里 `nginx -t` 在 reload 之前执行，校验失败会中断且不 reload |
| 想彻底退回 HTTP | 停掉宿主 nginx，`docker-compose.yml` 端口改回 `80:80`，`docker compose up -d` |

## 已知限制

- **只支持 Debian/Ubuntu**。`apt`、`ufw`、`systemd` 都是硬编码的；换 CentOS 要改 `base` role。
- **单机**。没有做多主机编排、滚动发布、负载均衡。
- **不管理腾讯云安全组**。控制台的入站规则要手工配，这是云厂商 API 的边界。
- **不签证书**。证书由腾讯云购买，playbook 只负责分发；自动续期（certbot / acme.sh）未接入。

## 待办

- [ ] `portfolio-odin` 尚未纳入 Git（`git ls-files` 计数为 0），CI/CD 无法触发
- [ ] 建仓库后补 `.github/workflows/deploy.yml`
- [ ] edge role 补 tag，支持 `--tags edge` 单独执行
- [ ] 证书到期告警（剩余 < 14 天）
