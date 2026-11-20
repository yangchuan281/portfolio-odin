/* ═══════════════════════════════════════════════════════════════
   Dwarf Tiger — bilingual layer (en ⇄ zh)

   English lives in the markup and is cached on first run, so it
   stays the single source of truth: edit index.html for English,
   edit the dictionary below for Chinese. Only the Chinese strings
   are duplicated here.

   Deliberately NOT translated: shell commands, git refs, the YAML
   block, tech chips, release/* tags and the labels inside the
   architecture diagrams. Those are artefacts, not prose — a
   terminal that speaks Chinese reads like a mistake.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var KEY = 'odin-lang';

  var ZH = {
    /* ── document ─────────────────────────────────────────── */
    'doc.title': '矮脚虎 — 网络工程 · 平台与 DevOps',
    'doc.desc': '矮脚虎——网络工程大三在读，方向是平台工程与 DevOps。三个系统、四份故障演练，每个数字背后都有一条能重跑的命令。',

    /* ── a11y / nav ───────────────────────────────────────── */
    'a11y.skip': '跳到正文',
    'brand.name': '矮脚虎',
    'hero.name': '矮脚虎',

    'nav.about': '关于',
    'nav.work': '作品',
    'nav.repos': '仓库',
    'nav.stack': '技术栈',
    'nav.contact': '联系',
    'nav.talk': '聊聊',

    /* ── welcome gate (home page only) ───────────────────── */
    'gate.title': '欢迎来到矮脚虎的空间',
    'gate.sub': '一个网络与平台工程的实验场，东西都摆在明处',
    'gate.enter': '点击任意位置进入',

    /* ── labels (shared by strip, id card, contact, cases) ── */
    'label.status': '状态',
    'label.base': '位置',
    'label.focus': '方向',
    'label.since': '起始',
    'label.uid': '账号',
    'label.role': '角色',
    'label.tz': '时区',
    'label.exp': '实践',
    'label.reply': '回复',
    'label.problem': '问题',
    'label.tradeoff': '取舍',
    'label.fail': '故障',
    'label.result': '结果',
    'label.injected': '注入方式',
    'label.measured': '实测',
    'label.repro': '复现',

    /* ── hero ─────────────────────────────────────────────── */
    'hero.lead': '服务台、监控、网络自动化——三套系统从<span class="nb">设计</span>到<span class="nb">上线</span>，<br>坏过什么、还缺什么，案例里都写着。',
    'jump.k': '案例直达',
    'hero.cta.work': '看证据',
    'hero.cta.all': '全部项目',
    'hero.status': '正在寻找机会',
    'hero.base': '中国 · UTC+08',
    'hero.focus': '平台工程 / DevOps',
    'hero.since': '2024 年至今',

    /* ── identity card ────────────────────────────────────── */
    'id.label': '身份卡',
    'id.badge': '开放机会',
    'id.role': '平台工程',
    'id.base': '中国',
    'id.exp': '自建系统 · 2024 年至今',
    'id.status': '正在寻找机会',

    /* ── about ────────────────────────────────────────────── */
    'about.h2': '可靠性本身就是功能。<br>我正在学着把它做进去。',
    'about.sub': '没有十年企业级交付经验——只有几个我从头做到尾的系统，以及那些我故意弄坏它们、看看到底会发生什么的演练。',
    'about.p1': '我学的是网络工程。关于「系统怎么跑起来」的大部分认知，来自我真做过的三样东西：一个管资产、巡检、告警和发布的 FastAPI 控制面；一个通过 SSH 操作真实路由器的 Flask 控制台；一个把提问变成工单的企业微信服务台。',
    'about.p2': '我在意的是那些不体面的部分：一条跳不过去的审批链、一次不需要人按的回滚、一份能告诉我「从昨天到现在改了什么」的 diff。文档是交付物的一部分——这一页上每个数字背后都有一条命令。',
    'about.p1.h': '用一次故障来证明',
    'about.p1.b': '没在我面前坏过的功能，就是我没弄懂的功能。四次故意注入的故障，证据都留着。',
    'about.p2.h': '第二次就自动化',
    'about.p2.b': '第一次是学习，第二次写成脚本，第三次该是一条谁都不用惦记的流水线。',
    'about.p3.h': '写下来',
    'about.p3.b': '没人讲得清的系统，没人接得住。写运维手册，比事后考古便宜得多。',

    /* ── work ─────────────────────────────────────────────── */
    'work.h2': '三个系统，以及它们坏在哪里。',
    'work.sub': '每一条都按同一个结构写：问题、我做的取舍、哪里坏了或还缺什么，以及最后落下来的数字。',

    /* case 1 — ops-pilot */
    'c1.pill': '已交付',
    'c1.title': 'OpsPilot——运维控制面',
    'c1.lede': '资产 → 巡检 → 告警 → Runbook → 发布 → 审计，串成一条能从空库重放一遍的闭环。FastAPI、Celery、PostgreSQL，21 张表，7 个检查器。',
    'c1.problem': '发布砸了，意味着半夜 SSH 上去、凭记忆猜上一个镜像 tag。告警来了没有资产上下文、没有责任人，恢复步骤只存在某个人脑子里。',
    'c1.tradeoff': '不重写 Prometheus 和 Kubernetes，而是包在它们外面：接 Alertmanager Webhook，补上原本缺失的审批链、审计和回滚。用一套 fake K8s 驱动，让整条流程离线也能跑通。',
    'c1.fail': '演练 DR-01 故意推了一个坏镜像：健康门禁抓到副本未就绪、重启次数超限，15.8 秒内自动回滚。演练还挖出三个真缺陷——回滚可能循环到另一个坏镜像、危险动作永远无法被确认、dry-run 被标成失败。',
    'c1.result': '250 条测试（248 通过 / 2 跳过），55 项对着运行中服务的端到端验收，四份演练记录——里面的数字取自原始 JSON，不是我事后总结的。',
    'c1.repo': '源码暂为私有，可申请查看',
    'c1.cap': 'Cron 触发巡检，分布式锁防止重跑，结果要么落一行记录，要么生成一条带指纹的告警；发布过不了门禁就自己回滚，并把证据 JSON 留下。',
    'c1.shot1': '发布详情 · 已回滚',
    'c1.shot2': '仪表盘 · 真实数据',
    'c1.shot3': '巡检 · 7 个驱动',
    'c1.drills.cap': '故障演练——数字取自 var/drill-report.json',
    'c1.d1.a': '故意推坏镜像',
    'c1.d2.a': '日志膨胀，磁盘打满',
    'c1.d3.a': '备份 + 恢复',
    'c1.d4.a': '告警风暴，5 条相同',

    /* case 2 — network auto console */
    'c2.pill': '公开仓库',
    'c2.title': 'Network Auto Console——给真实路由器做配置版本',
    'c2.lede': '一个 Flask 控制台：通过 SSH 登进 VyOS / Cisco / 华为，把每次运行的配置存成一个版本，并把 CDP / LLDP 发现的拓扑画出来。',
    'c2.problem': '实验室两台路由器，全靠手工 SSH 改配置。等到路由不通了，唯一重要的问题却答不上来：跟上次好用的时候相比，到底改了什么？',
    'c2.tradeoff': '同步 SSH 加 SQLite，而不是消息队列加任务调度。两台到二十台设备，这个规模是对的；边界我写在文档里，而不是等生产环境来告诉我。',
    'c2.fail': '配置备份读不出来就等于没备，所以用 difflib 做 diff。还有两处解析缺陷没修、写在文档里：LLDP 分支因为 split 把标签一起吃掉，导致本地接口恒为空；CDP 会丢掉没有管理地址的邻居。',
    'c2.result': '16 个源文件、4 个模块，一套覆盖 Cisco IOS/XE、华为、VyOS 和 Linux 的设备清单。跑在实验室两台真实 VyOS 上——下面那张截图就是那个清单。',
    'c2.cap': '按设备类型选命令；同一条 SSH 会话，一路喂给配置版本，另一路喂给邻居发现和利用率采集。',
    'c2.shot1': '设备清单 · 两台真实 VyOS',
    'c2.link.code': '解析器源码 ↗',

    /* case 3 — wecom service desk */
    'c3.pill': '公开仓库',
    'c3.title': '企业微信 IT 服务台——从一个提问到一张工单',
    'c3.lede': '基于企业微信自建应用：AI 回答 → 转人工 → 排队 → 工程师会话 → 评分，工单和它的状态机在过程中生成。',
    'c3.problem': 'IT 请求都发到当班人的私聊里：没有队列、没有记录，也判断不出一句回答到底有没有解决问题——而同样五个问题每周都来一遍。',
    'c3.tradeoff': '一台 MySQL 加 cron 重试，而不是上消息队列。我真正怕的失败是重复建单，所以 ITSM 适配器带幂等键：重试不会开出第二张工单。',
    'c3.fail': '早期版本把用户输入原样写进消息表——包括密码和手机号。现在消息体落库前先脱敏，并且每次状态流转（转人工、接单、转交、结束、评分）都写一行 operation_log。',
    'c3.result': '一个服务里五个子系统——问答、排队、评分、知识库、统计——外加一个 ITSM 适配器：没配端点时降级为纯本地，核心业务零依赖。交付形态是 Docker Compose 加三份 Kubernetes 清单。',
    'c3.cap': '转人工是最有意思的那条边：它要建工单、通知队列、再向外同步，每一步有自己的重试和幂等规则。',
    'c3.link.k8s': 'K8s 清单 ↗',
    'c3.link.docs': '部署文档 ↗',

    /* case 4 — itsm platform */
    'c4.pill': '私有仓库',
    'c4.title': 'ITSM 运维平台——资产、凭据、证书、工单只有一本账',
    'c4.lede': '资产台账、AES-256-GCM 凭据保险箱、证书到期、采集事实，以及会自己开单的告警。',
    'c4.problem': '内网跑在四本账上，谁也不认谁：一张 Excel 设备表、一个没人认领的密码文件、记在某人日历里的证书到期日，以及活在私聊里的工单。',
    'c4.tradeoff': '用 Node 22 自带的 <code>http</code> 和 <code>node:sqlite</code>，不是 Express 加 PostgreSQL。整站靠 <code>node server.js</code> 起在内网离线机器上——不用建私有 npm 源、不用装依赖，周日也不用爬起来打补丁。',
    'c4.fail': '服务依赖、网段与地址治理、可达性分析、策略健康度这四项，交付形态是菜单加一段说明，而不是一张装作空着的表。后面没有假数据，只是那条链还没接。',
    'c4.repo': '私有——想要访问可以找我要',
    'c4.cap': '采集器上报事实，检测器把事实变成告警，告警可以转成工单，两者互相绑定——告警没解除就关工单会被拒绝。',

    'link.repo': '仓库 ↗',
    'link.readme': '说明文档 ↗',

    'stat.1': '行应用代码<br>65 个模块',
    'stat.2': '条测试通过<br>2 跳过，0 失败',
    'stat.3': '份故障演练<br>都能重放',
    'stat.4': '坏镜像到<br>完成回滚',
    'stat.note': '2026-11-18 在本机实测。复现命令就写在上面那个案例里。',

    'work.all': '全部八个仓库 →',

    /* ── repos ────────────────────────────────────────────── */
    'repos.h2': '其余的东西，都公开。',
    'repos.sub': '小工具和课程作业。公开、可克隆，规模也照实说。',
    'repo.1.d': '网络自动化控制台：配置备份与 diff、拓扑发现、利用率曲线。',
    'repo.2.d': '企业微信 IT 服务台：AI 问答、转人工排队、评分、工单状态机。',
    'repo.3.d': '企业微信工单机器人：知识库问答，带工单闭环校验。',
    'repo.4.d': 'Go 写的图书管理后端——课程作业，但路由、鉴权和表结构都是真的。',
    'repo.5.d': '数据库课设与建表练习——上面那些表结构背后的基本功。',
    'repo.6.tag': '静态站',
    'repo.6.d': '手写 HTML/CSS、字体自托管、容器里的 Nginx。不算作品，只是外面这层壳。',
    'repos.note': '上面三个系统里，两个在私有仓库。这一格里全是公开的——而案例里的数字来自能在一台笔记本上跑起来的命令，不是一份总结。',

    /* ── stack ────────────────────────────────────────────── */
    'stack.h2': '工具链，写清楚。',
    'stack.sub': '真正会伸手去用的东西，不是愿望清单。这里每一项都在某个跑着的系统里。',
    'sg.os': '系统与命令行',
    'sg.lang': '编程语言',
    'sg.web': '接口与前端',
    'sg.delivery': '交付',
    'sg.runtime': '运行时',
    'sg.observe': '可观测性',
    'sg.network': '网络',
    'sg.data': '数据',
    'sg.security': '安全',
    'sg.os.d': '东西都跑在这儿：Debian 加 bash。',
    'sg.lang.d': 'Python 干活，SQL 问数。',
    'sg.web.d': '小服务，前面配一张表单或一个命令行。',
    'sg.delivery.d': '从一次提交到一个跑着的进程，中间不插人手。',
    'sg.runtime.d': '凌晨三点撑着进程的那一层。',
    'sg.observe.d': '在别人发邮件之前，先知道它挂了。',
    'sg.network.d': '这才是专业对口的部分。',
    'sg.data.d': '一套 schema、真做迁移，需要时加队列。',
    'sg.security.d': '密码用 scrypt 哈希、凭据用 AES-256-GCM 封起来、角色真的能拦住一个请求。',

    /* ── contact ──────────────────────────────────────────── */
    'contact.h2': '要发布的东西<br>能一直站得住吗？',
    'contact.sub': '正在寻找平台、DevOps 或 SRE 方向的机会。如果你在管实验环境、管线，或者一条老是崩的流水线——我想听听。',
    'contact.email': '发邮件',
    'contact.base': '中国',
    'contact.reply': '24 小时内',
    'contact.copied': '✓ 已复制到剪贴板',

    /* ── index page (L2) ──────────────────────────────────── */
    'idx.title': '作品 — 矮脚虎',
    'idx.desc': '八个仓库：三个有完整案例的系统、一个网络工具、一个机器人、两份课程作业，外加这一页本身。有公开链接的都放出来了。',
    'idx.h2': '八个仓库，三个有分量。',
    'idx.sub': '下面这三个系统各有一份完整案例：问题是什么、我放弃了什么、还缺什么，以及最后落下来的数字。其余的更小，也照实标明。',
    'idx.k1': '个系统<br>有完整案例和边界说明',
    'idx.k2': '条自动化测试<br>在最大的那个里',
    'idx.k3': '次注入故障<br>证据都留着',
    'idx.k4': '个仓库<br>未标注即为公开',
    'idx.g1': '系统 · 从头做到尾',
    'idx.g2': '工具、作业，以及外面这层壳',
    'idx.files': '个源文件',
    'idx.subsystems': '个子系统',
    'idx.selfhost': '自托管',
    'idx.note': '第一组三个系统里，ops-pilot 和 itsm-platform 在私有仓库，案例页上都有邮件链接，想要访问可以找我要。这里没有占位仓库——案例页上出现的每个数字，生成它的命令就印在同一页。',

    'pcard.go': '读案例',
    'pcard.ext': '在 GitHub 上查看',
    'pnav.all': '全部项目',
    'pnav.next': '下一个 →',
    'pnav.prev': '上一个',
    'pnav.back': '回到列表 →',
    'label.scale': '规模',
    'label.repo': '仓库',

    /* ═══════════════════════════════════════════════════════
       L3 · ops-pilot
       ═══════════════════════════════════════════════════════ */
    'p1.title': 'ops-pilot — 运维控制面 · 矮脚虎',
    'p1.desc': '案例：OpsPilot，一个 FastAPI 运维控制面——21 张表、7 个检查器、发布状态机，以及四次故意注入的故障演练。250 条测试通过 248 条，坏镜像 15.8 秒自动回滚。',
    'p1.role': '独立完成——设计、实现、演练',
    'p1.loc': '行 · 65 个模块',
    'p1.repo': '私有',
    'p1.k1': '张表<br>一套 schema，Alembic 迁移',
    'p1.k2': '个 REST 端点<br>从资产到审计',
    'p1.k3': '条测试通过<br>2 跳过，0 失败',
    'p1.k4': '坏镜像从发布<br>到完成回滚',
    'p1.f1': '张表，一套 schema',
    'p1.f2': '条测试通过，2 跳过',
    'p1.f3': '坏镜像 → 完成回滚',
    'p1.h.context': '一次夜间发布，没有回头路。',
    'p1.context.p2': '我给自己划的边界很窄：保留 Prometheus，保留 Kubernetes，只在外面补上原本缺的东西——一条跳不过去的审批链、每次状态变更都落一行的审计、一次不需要有人醒着的回滚。',
    'p1.h.design': '包住这些工具，而不是重写它们。',
    'p1.h.fail': '我故意推了一个坏镜像。',
    'p1.fail.p2': '三个缺陷都是改掉，而不是绕过去：回滚前先记录来源镜像；审批令牌在动作执行前校验，而不是之后；dry-run 结果单独存状态，不再被当成失败。',
    'p1.h.evidence': '这是跑着的界面，不是效果图。',
    'p1.evidence.sub': '控制台的三页，连的是灌过种子数据的 PostgreSQL——和生成演练报告是同一次运行。点任意一张看大图。',
    'p1.h.repro': '上面每个数字都有一条命令。',
    'p1.repro.p': '仓库目前是私有的，我还在整理提交历史，但演练报告、测试记录和控制台都在同一台机器上。想要访问可以找我要只读邀请——下面这三条命令就是这一页数字的来源。',
    'p1.bounds.h': '范围边界——它不是什么',
    'p1.bounds.1': '单机 Docker Compose，不是高可用集群。它是一个实验环境的控制面，规模也按这个来。',
    'p1.bounds.2': '巡检任务超过自己的间隔就被跳过，不会排队——这把锁不负责积压。',
    'p1.bounds.3': 'Kubernetes 驱动只覆盖 Deployment 的镜像更新、rollout 状态、Pod、事件和回滚，不做任意清单 apply。',
    'p1.bounds.4': '告警接入按 Alertmanager 的 Webhook 结构解析；换别的发送方要写一个小适配器。',

    /* ═══════════════════════════════════════════════════════
       L3 · network-auto
       ═══════════════════════════════════════════════════════ */
    'p2.title': 'network-auto — 给真实路由器做配置版本 · 矮脚虎',
    'p2.desc': '案例：一个 Flask 控制台，把 Cisco、华为、VyOS 的每次运行配置存成版本、做 diff，并把 CDP / LLDP 发现的拓扑画出来。两处解析缺陷写在文档里，没有藏。',
    'p2.role': '独立完成——实现并在实验室跑通',
    'p2.modules': '个模块',
    'p2.k1': '个源文件<br>四个模块',
    'p2.k2': '个厂商系列<br>一套设备清单',
    'p2.k3': '台真实 VyOS<br>就在截图后面',
    'p2.k4': '个 Jinja 模板<br>没有 SPA，没有构建',
    'p2.f1': '个源文件，4 个模块',
    'p2.f2': '个厂商系列',
    'p2.f3': '台真实路由器在后面',
    'p2.h.context': '故障之后唯一重要的问题。',
    'p2.context.p2': '所以这个控制台先只做一件事：登进去、抓运行配置、连同时刻和设备存成一个版本。diff 视图、拓扑图、CPU 曲线，全都建在这份快照上。',
    'p2.h.design': '同步、无趣，但规模正好。',
    'p2.h.fail': '两处解析缺陷，我选择留着并写明。',
    'p2.fail.p2': '我没有把这两处糊过去：拓扑页上缺失的本地端口显示成 <code>—</code>，没有管理地址的 CDP 邻居会计数但不画出来。一张安静撒谎的图，比一张有洞的图更糟。',
    'p2.h.evidence': '这份设备清单不是摆拍。',
    'p2.evidence.sub': '实验室网里两台 VyOS，192.168.188.10 和 .2，走 22 端口。控制台、源码和生成拓扑的那个解析器都是公开的。',
    'p2.bounds.h': '已知边界——写在这里，而不是等你自己发现',
    'p2.bounds.1': 'LLDP 解析器按 <code>"Local Intf:"</code> 切分，标签被一起吃掉，所以 LLDP 边的 <code>local_port</code> 恒为空。',
    'p2.bounds.2': '不宣告管理地址的 CDP 邻居会从拓扑里丢掉。',
    'p2.bounds.3': 'SSH 是同步的：一台慢设备会阻塞正在抓它的那个请求。实验室够用，一千台就不对。',
    'p2.bounds.4': '只对着两台 VyOS 和厂商命令手册验证过，没有在本机对 Cisco / 华为实体机跑过。',

    /* ═══════════════════════════════════════════════════════
       L3 · wecom service desk
       ═══════════════════════════════════════════════════════ */
    'p3.title': 'wecom service desk — 从一个提问到一张工单 · 矮脚虎',
    'p3.desc': '案例：自建企业微信 IT 服务台——AI 回答、转人工、带优先级的 FIFO 队列、工程师会话、评分。五个子系统、一台 MySQL、带幂等键的 ITSM 适配器。',
    'p3.role': '独立完成——服务端、控制台、部署',
    'p3.k1': '个子系统<br>从问答到统计',
    'p3.k2': '台 MySQL<br>链路上没有消息队列',
    'p3.k3': '份 K8s 清单<br>config、deployment、service',
    'p3.k4': '篇部署文档<br>含企业微信后台配置',
    'p3.f1': '个子系统在一个服务里',
    'p3.f2': '台 MySQL，无消息队列',
    'p3.f3': '份 Kubernetes 清单',
    'p3.h.context': '每周五个问题，一个都没留下记录。',
    'p3.context.p2': '我想要的是 IT 部门早就在用的那种笨形状：先给答案，答案不够好就换人，工单不管对话顺不顺利都得存在。',
    'p3.h.design': '转人工才是最要紧的那条边。',
    'p3.h.fail': '第一个版本把用户输入原样记了下来。',
    'p3.fail.p2': '从那一刻起，「能跑」就不够了：服务台握着和它所支撑的系统一样的秘密，所以该改的是那张表，不是聊天窗口。',
    'p3.h.evidence': '这里的东西都在明面上。',
    'p3.evidence.sub': '服务、控制台、建表脚本和三份部署文档都在同一个公开仓库里。这一页没有仪表盘截图，因为没有一个可以指给你看的演示租户——代码和部署文档就是证据。',
    'p3.bounds.h': '范围边界——它不做什么',
    'p3.bounds.1': '一台 MySQL，没有消息队列：队列表不可达时，转人工会先积压，而不是切到别处。',
    'p3.bounds.2': '知识库按配置的条目回答，不是读你整个 wiki 的通用大模型。',
    'p3.bounds.3': 'ITSM 适配器只认一种端点结构；换厂商要写新的适配器，改配置不行。',
    'p3.bounds.4': '在企业微信测试企业里验证过，没跑过生产流量。',

    /* ═══════════════════════════════════════════════════════
       L3 · itsm platform
       ═══════════════════════════════════════════════════════ */
    'p4.title': 'itsm-platform — 资产、凭据、证书、工单只有一本账 · 矮脚虎',
    'p4.desc': '案例：一个装在企业内网的 ITSM 运维平台。27 张表、AES-256-GCM 凭据保险箱、采集器上报的事实、会自己开单的告警。Node 22 原生 http 加 node:sqlite，运行时零第三方依赖。',
    'p4.h1': 'ITSM 运维平台——资产、凭据、证书、<br>工单只有一本账',
    'p4.role': '独立完成——设计、实现，以及之后那轮审查整改',
    'p4.tables': '张表',
    'p4.modules': '个路由模块',
    'p4.views': '个页面',
    'p4.repo': '私有',
    'p4.k1': '张表<br>一套 schema，44 个索引',
    'p4.k2': '条用例通过<br>零失败',
    'p4.k3': '个运行时依赖<br>Node 22 基础镜像',
    'p4.k4': '类告警<br>定时检测',
    'p4.f1': '张表，一套 schema',
    'p4.f2': '条用例通过，零失败',
    'p4.f3': '个运行时依赖',
    'p4.h.context': '四本账，一本都对不上。',
    'p4.context.p2': '所以这个平台只留一本：设备、凭据、证书、工单在同一套 schema 里，每次写操作都留一行审计。重点不是表单——是这四本账再也没法各走各的：工单知道自己的告警，告警知道自己的设备，设备知道自己在哪个机柜的第几 U、占哪个地址。',
    'p4.h.design': '刻意无趣：一个进程、一个文件、不用装。',
    'p4.design.p2': '代价写在明处：单节点，不横向扩展。数据访问集中在 <code>src/modules/*</code>，将来换 PostgreSQL 是一项有边界的活，不是重写。',
    'p4.h.fail': '四个菜单写着「未启用」，就是字面意思。',
    'p4.fail.p2': '剩下的缺口写在 README 里，而不是塞进一个没人看的更新日志：没有短信、没有 LDAP 实时登录（只做导入）、没有工单附件、不做多租户；出站通知是「尽力投递 + 退避重试」，不是至少一次。',
    'p4.bounds.h': '已知边界——写在这里，而不是等你自己发现',
    'p4.bounds.1': '单节点跑 SQLite：给一个内网团队几百人用，不是集群。要多节点先换 PostgreSQL。',
    'p4.bounds.2': '上面那四个菜单项是刻意留的占位——页面解释缺口，而不是列出一堆空行。',
    'p4.bounds.3': 'LDAP 只做导入：账号带着一次性初始密码进来，登录时从不去目录里做 Bind。',
    'p4.bounds.4': '对着灌了种子数据的库和测试套件验证过，没在生产内网里跑过真实的凭据轮换和真实审计。',
    'p4.h.evidence': '这一页每个数字都是一条命令。',
    'p4.evidence.sub': '仓库是私有的，所以这一页只靠一次运行就能验的东西：测试套件、两道 CI 闸门、一套能数清楚的 schema，以及零警告的 lint 预算。',
    'p4.repro.p': '想要访问可以找我要只读邀请。下面这四行就是这一页数字的来源，跑在这台笔记本上，除了 Node 22 什么都没装。',

    /* ── footer ───────────────────────────────────────────── */
    'foot.meta': '手写 · 架在自己的 VPS 上',
    'foot.email': '邮箱',
    'foot.top': '回到顶部 ↑'
  };

  /* Cache the English source on first run. */
  function cache(root) {
    var nodes = root.querySelectorAll('[data-i18n], [data-i18n-html]');
    Array.prototype.forEach.call(nodes, function (el) {
      el.__en = el.innerHTML;
    });

    var docs = root.querySelectorAll('[data-i18n-doc]');
    Array.prototype.forEach.call(docs, function (el) {
      el.__en = el.tagName === 'TITLE' ? el.textContent : el.getAttribute('content');
    });
  }

  function applyDoc(lang) {
    var docs = document.querySelectorAll('[data-i18n-doc]');
    Array.prototype.forEach.call(docs, function (el) {
      var k = el.getAttribute('data-i18n-doc');
      var v = (lang === 'zh' && ZH[k]) ? ZH[k] : el.__en;
      if (v == null) return;
      if (el.tagName === 'TITLE') el.textContent = v;
      else el.setAttribute('content', v);
    });
  }

  function apply(lang) {
    if (lang !== 'zh') lang = 'en';

    var nodes = document.querySelectorAll('[data-i18n], [data-i18n-html]');
    Array.prototype.forEach.call(nodes, function (el) {
      var key = el.getAttribute('data-i18n') || el.getAttribute('data-i18n-html');
      var val = (lang === 'zh' && ZH[key]) ? ZH[key] : el.__en;
      if (val != null) el.innerHTML = val;
    });

    applyDoc(lang);

    document.documentElement.setAttribute('lang', lang);

    var btns = document.querySelectorAll('.langbtn [data-lang]');
    Array.prototype.forEach.call(btns, function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-lang') === lang);
    });

    var btn = document.getElementById('langBtn');
    if (btn) btn.setAttribute('aria-label', lang === 'zh' ? 'Switch to English / 切换到英文' : '切换到中文 / Switch to Chinese');

    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  function init() {
    cache(document);

    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    apply(saved === 'zh' ? 'zh' : 'en');

    function toggle() {
      apply(document.documentElement.getAttribute('lang') === 'zh' ? 'en' : 'zh');
    }

    var btn = document.getElementById('langBtn');
    if (btn) btn.addEventListener('click', toggle);

    /* The gate covers the page, so it needs its own switch. The click must
       not reach the gate — any other click there is what opens the site. */
    var gateBtn = document.getElementById('gateLang');
    if (gateBtn) {
      gateBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggle();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
