# 公司内部 Digital Workplace（Corporate Portal）产品需求文档 PRD

| 项 | 内容 |
|---|---|
| 文档名称 | Digital Workplace / Corporate Portal PRD |
| 版本 | **v0.2（结合首版代码实现校准）** |
| 作者 | Jace（yy.peng@aftership.com） |
| 状态 | Draft — 待评审 |
| 最后更新 | 2026-06-29 |
| 关联资料 | Stitch UI 设计稿（4 屏：首页工作台 / 系统目录 / HR 部门空间 / 研发 Division Hub）；代码仓库 `jlingjace/digital-workplace` |

> **v0.2 变更说明**：v0.1 为基于 UI 设计稿的首版需求。v0.2 在保留原始需求的基础上，依据当前代码仓库（`jlingjace/digital-workplace`，commit `5ca2722`）的实际实现做了一次校准——为每个功能模块标注实现状态（✅ 已实现 / 🟡 部分实现 / ❌ 未实现），并新增「实现现状总览」「关键架构偏差」两节，以及一份反映真实进度的路线图。状态标注均以源码为依据，可追溯到具体文件。

---

## 实现现状总览（v0.2 新增）

> 结论：**仓库把 PRD 的"灵魂模块"（G1 权威公告 + 内容治理）做得非常扎实，几乎 1:1 落地；但 PRD 真正的护城河——"聚合层 / 集成 CMDB / 全员身份与 RBAC"——基本尚未建立。** 当前形态更接近「Phase 1 的公告治理子集 + 设计稿 UI 还原」，而非 PRD 设想的完整"聚合门户"。

| PRD 模块 | 状态 | 说明（含代码位置） |
|---|---|---|
| 6.2 权威公告 + 发布工作流 (G1) | ✅ | 完整状态机、按部门审批链、必读、已读回执、催读、Slack/邮件、Cron 过期 |
| 8 内容治理模型 | ✅ | Owner / 审批 / 有效期+复核(cron) / 权威标记 / 归档 / 审计字段齐全 |
| 6.3 系统目录 + 访问申请 (G2) | 🟡 | 目录与三态访问申请已实现，但**为自存 DB + import，未对接 CMDB API** |
| 6.1 个性化首页 | 🟡 | 12 列 bento UI 完成、公告流接真实数据；QuickAccess / ActionItems / Events / 计数器仍为 mock |
| 6.6 全局搜索 | 🟡 | 仅门户内 `q` 字段检索；联合搜索属 Phase 3，符合预期 |
| 6.7 通知与触达 | 🟡 | Slack/邮件分层推送已有；digest 日报/周报、Settings 订阅偏好未做 |
| 10 设计系统 | ✅ | 设计稿 token 精确还原（Logistics Orange / Hanken Grotesk / JetBrains Mono / Ink #151c27） |
| 6.4 部门空间 | ❌ | 无独立部门空间页；Department 仅作过滤标签 |
| 6.5 事业部 / 研发 Hub | ❌ | 未实现（项目看板 / 基础设施健康度 / 已连接工具等均无） |
| 7 RBAC（5 角色 + Workspace Groups） | ❌ | 仅 `ADMIN_EMAILS/ADMIN_DOMAIN` 二元白名单，无角色分层、未接 Google Groups |
| 9 集成层（CMDB/Jira SD/GitHub/CI-CD/Calendar/Notion） | ❌ | 目前为自包含应用，聚合层尚未建立 |

---

## 关键架构偏差（v0.2 新增，需独立决策）

### 偏差 1 — 认证模型与个性化前提冲突（最高优先级）

PRD 6.1 / 6.2 的个性化首页（"全员必读 + 所属部门 + 订阅主题"）和**全员**已读回执，都依赖"每个普通员工都已登录、系统知道他是谁"。

但当前实现是 **「公开浏览 + 管理员后台」** 模型：`src/lib/auth.ts` 的 `signIn` 回调里，**非 admin 用户直接被拒登录**（重定向到 `AccessDenied`），普通员工匿名读公告。这与 PRD 的 **「全员 SSO + 个性化 feed + 全员已读追踪」** 模型相矛盾——`AnnouncementRead` 表已建，但因员工不登录，实际无法对全员生效。

**需尽早决策**：
- 方案 A：PRD 降级——首版只追踪已登录用户（管理员/发布者），个性化暂不覆盖全员；
- 方案 B：仓库改造——开放全员 Google SSO 登录，`signIn` 不再拦截普通员工，并据此驱动个性化与已读回执。

### 偏差 2 — 系统目录走了自建路线，而非复用 CMDB

PRD 6.3 / 9 把"直接复用 CMDB"当作 G2 的根基（"无需重建维护体系、天然准确"，是 PRD 反复强调的最高 ROI 杠杆）。当前实现是自存一份 `SystemEntry` 表 + 手动 `import` 路由（`src/app/api/admin/systems/import/route.ts`）。短期可跑，但 PRD 担心的"维护腐化"正是它想用 CMDB 规避的。

**需确认**：自建目录是临时过渡，还是有意的最终方案？若长期自建，需配套 System Owner 责任制与数据复核机制。

---

## 1. 背景与问题（Why）

公司使用了大量分散的 SaaS 与自研工具（Slack、Notion、Google Drive/Docs、1Password、GitHub、HubSpot、Gong、Jira Software / Jira Service Desk，以及自研 CI/CD、CMDB、Billing、各产品管理后台等）。信息和入口的高度分散带来三类核心痛点：

- **缺乏权威发布**：公司公告、CEO Newsletter、组织架构变更目前通过邮件或 Slack 发布。IM 与邮件本质是"信息流"，新消息会把旧消息冲掉，员工关注度低、漏读率高，且没有"唯一权威版本"的概念。
- **入口分散、找不到人**：员工不清楚某个工具/系统的用途、入口在哪、负责人是谁、遇到问题该找谁。
- **知识库无权威性**：知识虽集中在 Notion，但因为缺少治理，同一关键字会搜到多篇文档，无法判断哪篇是现行有效的权威版本。

**关键判断**：以上痛点的本质不是"缺一个平台"，而是"缺一套权威信息的治理体系"。本产品的定位因此是 **"权威信息层 + 聚合门户"**，而非"又一个内容工具"。技术平台只是治理规则的载体；若治理规则不先建立，门户会在数月内退化为新的信息垃圾场。

---

## 2. 产品定位与目标（What）

### 2.1 一句话定位

公司内部的单一权威信息入口（Single Source of Truth）+ 统一服务门户：员工在这里读到唯一权威的公司信息、找到所有工具的入口与负责人、并按部门获得隔离过滤后的信息流。

### 2.2 产品目标（三者并重）

| 目标 | 说明 | 对应核心机制 | 实现状态 |
|---|---|---|---|
| **G1 权威信息发布** | 公告 / Newsletter / 组织架构变更等不再被冲掉，且有唯一权威版本 | 发布工作流 + 必读机制 + 内容/通知分离 | ✅ 已落地 |
| **G2 统一导航与服务目录** | 一站式找到工具入口、用途、负责人、"遇到问题找谁" | 系统目录（复用 CMDB 数据） | 🟡 自建版已落地，CMDB 对接未做 |
| **G3 知识治理（权威层）** | 在 Notion 之上建立"已认证权威"的索引层，解决多版本问题 | 文档权威标记 + 部门资源库 | ❌ 未实现 |

### 2.3 非目标（Non-Goals，首版明确不做）

- 不替代 Notion 作为协作/草稿编辑工具；门户做"已盖章的正式发布"，Notion 继续做协作。
- 不替代 Slack / 邮件作为即时沟通工具；二者退化为"通知触达管道"，只发标题 + 链接。
- 不在首版做跨系统的全文联合搜索（federated search）——工程量大，放到 Phase 3。
- 不做硬性信息隔离（部门间完全看不到），而是用订阅 + 个性化 feed 实现"降噪不阻断"。

---

## 3. 目标用户与角色（Who）

| 角色 | 描述 | 主要诉求 |
|---|---|---|
| 普通员工 Employee | 全体员工 | 快速读到与自己相关的权威信息、找到工具入口、完成待办 |
| 内容发布者 Publisher | HR / IT / 各部门 owner / CEO office | 发布权威公告、Newsletter、政策文件 |
| 部门管理员 Dept Admin | 各部门空间负责人 | 维护本部门空间内容、链接、文档库、团队信息 |
| 系统负责人 System Owner | 每个工具/系统的 owner | 维护系统目录条目、审批访问申请 |
| 平台管理员 Platform Admin | IT / 平台团队 | 全局权限、角色、治理策略、集成配置 |

> **实现状态 ❌**：当前代码只区分 **admin / 非 admin** 两种身份（`ADMIN_EMAILS` 白名单或 `ADMIN_DOMAIN` 域名匹配），上述 5 个角色尚未建模。见「关键架构偏差 1」。

---

## 4. 成功指标（Success Metrics）

- **North Star**：周活跃率（WAU / 全员）≥ 70%，并稳定。
- 权威公告"必读"已读率 ≥ 95%（7 天内）。
- "遇到问题找谁/找工具入口"的 IT 工单咨询量下降 ≥ 30%。
- 关键信息（CEO Newsletter、组织架构变更、必读 Policy）100% 仅经门户发布。
- 系统目录条目覆盖率 ≥ 90%（对照 CMDB 在册系统）。

> **埋点状态 ❌**：当前代码未见任何指标埋点 / analytics 采集；上述指标尚无数据来源，需在 Phase 1 收尾时补埋点。

---

## 5. 信息架构与全局导航（IA）

以下导航结构直接对应 UI 设计稿。

- **顶部全局导航（Top Nav）**：Directory（系统目录）、Benefits、Policies、IT Support，右侧为 全局搜索、通知中心（含未读计数）、帮助、个人头像。
- **左侧主导航（Sidebar）**：Home、Departments（部门）、Divisions（事业部/研发）、Dashboards、Resources；醒目的 Submit Request（提交申请） 主按钮；底部 Settings、Support。

页面层级：

```
Home（个人工作台）
├─ Directory（系统目录 / Service Catalog）
│   └─ 分类：All Systems / IT & Engineering / HR & Benefits / Finance
├─ Departments（部门空间，按部门隔离）
│   └─ 例：Human Resources、Finance、…
├─ Divisions（事业部 / 研发 Hub）
│   └─ 例：Software Development、…
├─ Benefits / Policies（权威政策与福利专区）
└─ IT Support（工单入口）
```

> **实现状态 🟡**：已实现 `Home`、`Directory`（tools/systems）、`Announcements` 列表与详情、`Admin` 后台（`src/components/layout/` 下有 Sidebar / TopHeader / PortalShell / AdminSidebar）。`Departments`、`Divisions`、`Benefits/Policies`、`IT Support` 页面尚未实现。

---

## 6. 功能需求（按模块，对应 UI 设计稿）

### 6.1 首页 / 个人工作台（对应「Corporate Portal Home」）— 🟡 部分实现

个性化首页，登录后默认页。包含以下区块：

- **个性化问候 + 概览**：Good morning, {Name}，附两个计数器（如待处理事项数、未读公告数）。
- **Announcements（公告流）**：展示最新权威公告，带状态徽标（如 NEW / Important）、发布时间、View All。点击进入公告详情。必读公告高亮置顶。
- **Quick Access（快速访问）**：高频系统快捷入口宫格（如 Payroll、Time Off、Benefits、Learning、Teams、IT Portal），数据来自系统目录，可个性化排序。
- **Action Items（待办）**：聚合个人待办（如 Submit Expense Report — 今日到期、Annual Compliance Training — 8 天后、Complete Manager Survey — 可选），带截止时间与优先级；来源可由集成系统/手动任务推送。
- **Upcoming Events（即将到来的活动）**：如 Town Hall Meeting、Product Showcase，带日期；View All Events。
- **News & Culture（资讯与文化）**：图文卡片（如 Wellness Month、新人欢迎/People），承载软性文化内容，与硬性公告区分。

个性化规则：首页内容 = 全员必读 + 用户所属部门 + 用户订阅主题。实现"降噪不阻断"。

> **实现状态 🟡**：`src/app/page.tsx` 已按设计稿搭好 12 列 bento 栅格，`AnnouncementsFeed` 接真实 DB 数据；但 `QuickAccessGrid` / `ActionItemsList` / `UpcomingEventsCard` 当前为硬编码 mock，欢迎语计数器（`pendingCount`/`urgentCount`）也是写死的（代码内有 `TODO: wire to /api/me/stats`）。个性化（按部门/订阅过滤）依赖全员登录，受「架构偏差 1」阻塞。News & Culture 区块未实现。

### 6.2 权威公告与发布（G1 核心）— ✅ 已实现

这是平台的灵魂模块，需求重点不在"编辑器"，而在治理 + 触达：

- **内容类型**：公司公告、CEO Newsletter、组织架构变更、政策更新、部门/事业部公告。
- **发布工作流**：草稿 → 审批（按内容类型配置审批人/审批链）→ 发布 → 归档。
- **必读与已读回执**：发布时可标记 必读。必读公告对目标受众强提醒，并记录已读回执，发布者可查看未读名单并催读。
- **内容/通知分离（解决"被冲掉"）**：门户是内容唯一的家；发布后向 Slack / 邮件只推送标题 + 链接的通知，把人导回门户阅读。
- **生命周期治理**：每条内容必须有 Owner 和 有效期/复核日期；到期自动提醒 owner 复核或归档，避免内容腐化。
- **受众定向**：可面向全员 / 指定部门 / 指定群组发布，与部门隔离机制联动。
- **版本与权威标记**：发布即"盖章"为权威版本，历史版本可追溯。

> **实现状态 ✅**：几乎完整落地。
> - 状态机 `DRAFT → PENDING_APPROVAL → PUBLISHED → ARCHIVED → EXPIRED`（`prisma/schema.prisma`）
> - 工作流路由：`submit` / `approve` / `reject` / `archive` / `remind`（`src/app/api/admin/announcements/[id]/*`）
> - 按部门配置审批链：`ApprovalConfig` 模型 + `/api/admin/approval-config`
> - 必读 `isMandatory` + 已读回执 `AnnouncementRead`（唯一约束 `[announcementId, userId]`）+ 催读 `remind`
> - 内容/通知分离：`src/lib/notifications/slack.ts`（频道推送"标题+摘要+链接"按钮 + 按邮箱查人发 DM）、`email.ts`
> - 生命周期：`expiresAt` + Vercel Cron `/api/cron/expire-announcements`（每日 0 点，`CRON_SECRET` 鉴权，自动置 EXPIRED）
> - 审计字段：`submittedAt` / `approvedByEmail` / `approvedAt` / `rejectionReason`
>
> **缺口**：受众定向目前仅到"部门"粒度（`Department` 枚举），尚无"指定群组"；版本/历史版本追溯未实现（仅有 `updatedAt`，无版本快照）。

### 6.3 系统目录 / Service Directory（G2 核心，对应「Internal Directory」）— 🟡 部分实现

最高 ROI 模块：直接复用公司自研 CMDB 作为数据源（系统、负责人、用途、入口链接已在 CMDB 持续维护），无需重建一套维护体系，且天然保证准确。

- **顶部能力卡**：Single Sign-On (SSO)、Service Desk、Finance Systems 等聚合入口；Need new access? Request 申请按钮。
- **分类筛选**：All Systems / IT & Engineering / HR & Benefits / Finance 等标签页（分类映射 CMDB 中的系统归类）。
- **系统卡片**：每个工具/系统一张卡片，包含：名称、图标、用途简述；状态（Active / Connected / 未接入）；负责人 Owner（"遇到问题找谁"的核心字段，来自 CMDB）；访问入口链接；访问申请按钮（Request Access / Approved / Connected 三态）。
- **访问申请流**：员工点击 Request Access → 路由到 system owner 审批 / 或对接 Jira Service Desk 工单 → 状态回写卡片。
- **示例系统**：Jira Service Management、Internal Slack、Enterprise Gmail、AWS Console、Adobe Creative Cloud、HubSpot CRM、Figma 等。
- **新平台推广位**：用于上线新系统时的引导卡（设计稿中的 "New Platform / Logistics Portal"）。

> **实现状态 🟡**：目录与访问申请已实现，但数据源不符 PRD。
> - `SystemEntry` 模型（分类 `category`、状态 `status`、`isQuickAccess`、owner 字段、软删除 `deletedAt`）
> - 访问申请三态流 `AccessRequest`（`PENDING/APPROVED/REJECTED`）：`/api/portal/systems/[id]/request-access` + `/api/admin/access-requests/[id]/approve|reject`
> - 批量导入：`/api/admin/systems/import`
> - 此外另有一个更简单的 `Tool` 模型 + `/api/tools`（疑似早期版本，与 `SystemEntry` 功能重叠，**建议收敛为一个模型**）
>
> **缺口**：①**未对接 CMDB**——数据自存 + 手动导入（见「架构偏差 2」）；②访问申请未对接 Jira Service Desk；③顶部能力卡 / 新平台推广位未实现。

### 6.4 部门空间（对应「Human Resources」部门落地页）— ❌ 未实现

每个部门一个独立空间，实现信息隔离与降噪。以 HR 为例：部门 Hero + 关键统计；重点横幅（如 Open Enrollment）；Department Announcements（本部门范围公告）；In-Department Links（本部门高频系统入口）；Meet the Team（部门人员卡片）；Resources & Policies（文档与政策库，承载 G3 知识权威层）。

> **实现状态 ❌**：无独立部门空间页面。`Department` 枚举（`ALL/PEOPLE/FINANCE/GTM/ENGINEERING/IT`）目前仅作为公告/工具的过滤标签使用，未承载"空间"概念。属 Phase 2。

### 6.5 事业部 / 研发 Hub（对应「Software Development」Division 页）— ❌ 未实现

面向研发/事业部的聚合工作台：Hero；Active Projects（进度条 + 截止，对接 Jira）；Dev Documentation；Connected Tools（GitHub/Jira/Slack 连接状态）；Team Calendar（对接 Google Calendar）；Division Announcements；Infrastructure Health（CI/CD 状态，对接自研 CI/CD）。

> **实现状态 ❌**：完全未实现。该页验证的"部门空间与事业部 Hub 共用一套可配置区块模板（公告/链接/文档/团队/看板）"能力，是 Phase 2 的核心工程，需先抽象出区块模板系统。

### 6.6 全局搜索 — 🟡 部分实现

- 首版：搜索范围限门户自身内容（公告、系统目录、部门文档登记项、人员），优先返回标记为"权威"的结果。
- Phase 3：扩展为跨 Notion / Jira / Drive 的联合搜索。

> **实现状态 🟡**：公告与工具 API 支持 `q` 参数做 DB 层 title/content/author 检索，但无统一全局搜索入口、无"权威优先"排序、不含人员检索。联合搜索（Phase 3）未做，符合预期。

### 6.7 通知与触达策略（贯穿全局）— 🟡 部分实现

- 门户为内容的"家"，Slack / 邮件 / 站内通知为触达管道。
- 通知分层：必读（强提醒 + 已读追踪）/ 一般（站内 + 摘要）。
- 支持邮件/Slack 日报或周报 digest，把订阅范围内的更新聚合推送，减少打扰。
- 用户可在 Settings 管理订阅与通知偏好。

> **实现状态 🟡**：Slack（频道推送 + DM 催读）与邮件已实现；必读强提醒/已读追踪已实现。**digest 日报/周报、站内通知中心、Settings 订阅偏好均未实现。**

---

## 7. 权限与角色模型（RBAC）— ❌ 未实现（仅二元白名单）

- 身份与组织架构直接映射 Google Workspace（OIDC/SAML SSO + Groups），不自建一套组织/群组体系。
- 权限维度：内容可见性（全员 / 部门 / 群组）× 角色能力（读 / 发布 / 审批 / 管理）。
- 部门隔离通过 Google Workspace 群组 + 内容受众标签实现，默认"软隔离"（跨部门重要信息仍可见，如全员 HR 公告）。

> **实现状态 ❌**：当前仅有 Google OAuth 登录 + `ADMIN_EMAILS/ADMIN_DOMAIN` 二元白名单（`src/lib/auth.ts`、`src/lib/admin-auth.ts` 的 `requireAdmin()`）。未接入 Google Workspace Groups，无"可见性 × 能力"矩阵，无 Publisher/Dept Admin/System Owner 角色分层。这是 PRD 与实现差距最大的模块之一。

---

## 8. 内容治理模型（成败关键，需独立评审）— ✅ 大体实现

| 治理项 | 规则 | 实现状态 |
|---|---|---|
| Owner | 每条内容（公告/文档/系统条目）必须有明确 owner | ✅ `authorName` / `ownerName` |
| 审批 | 按内容类型配置审批链（如组织架构变更需 HR + CEO office） | 🟡 按"部门"配置审批人（`ApprovalConfig`），尚无"按内容类型/多级链" |
| 有效期 / 复核 | 内容设有效期或复核周期，到期自动提醒 owner 复核或归档 | ✅ `expiresAt` + Cron 自动 EXPIRED（但"提醒 owner 复核"未做，目前直接置过期） |
| 权威标记 | 发布即认证为权威版本，搜索/展示优先；草稿在 Notion | 🟡 `status=PUBLISHED` 即权威；"搜索优先权威"未做 |
| 归档 | 过期内容自动进入归档区，不在主流中露出但可检索 | ✅ `ARCHIVED` / `EXPIRED` 状态 |
| 审计 | 关键内容（政策、组织变更）保留发布与变更审计记录 | 🟡 有审批审计字段；无完整变更历史/版本快照 |

---

## 9. 技术架构概览（完全自研路线）

本产品本质是 **门户 + 集成层（aggregation layer）**，价值在聚合而非重造数据。

- **身份认证**：Google Workspace SSO（OIDC/SAML），统一登录与组织映射。— 🟡 已接 Google OAuth，未接 Workspace Groups
- **数据源集成**：
  - 系统目录 / 负责人 ← CMDB（核心杠杆，直接 API 复用）；— ❌ 自建替代
  - 工单 / 访问申请 ← Jira Service Desk / 自研 ITSM；— ❌ 自建内部审批
  - 研发数据 ← GitHub、Jira、自研 CI/CD；— ❌ 未做
  - 日历 ← Google Calendar；— ❌ 未做
  - 文档原文 ← Notion / Google Drive（链接 + 元数据登记）。— ❌ 未做
- **内容服务**：自研发布 CMS（公告/Newsletter/文档登记 + 审批 + 版本 + 权限）。— ✅ 公告部分已实现（无版本快照）
- **通知服务**：与 Slack / 邮件集成，做分层推送与 digest。— 🟡 推送已做，digest 未做
- **搜索服务**：首版仅索引门户自身内容；Phase 3 引入联合搜索。— 🟡 DB 层检索

**当前技术栈（实测）**：Next.js 14（App Router）/ TypeScript / PostgreSQL + Prisma 6 / NextAuth v4 + Google OAuth（JWT session）/ Tailwind CSS / dompurify（富文本净化）/ Vercel（含 Cron）/ Jest。

**自研需重点投入/易低估的三处成本**：① 身份与细粒度内容权限；② 联合搜索（建议后置）；③ 长期维护（每个被集成系统的 API 变更都需跟进）。

---

## 10. 非功能需求（NFR）

- **性能**：首页首屏加载 < 2s；集成数据采用缓存 + 异步刷新，避免被下游系统拖慢。— ⬜ 未验证/未做缓存层
- **可用性**：门户不可用不应阻断员工访问底层系统（入口为直链）。目标可用性 ≥ 99.9%。— ✅ 入口为直链
- **安全**：SSO 强制；最小权限；敏感内容审计；遵循公司安全评审流程。— 🟡 SSO 有，富文本经 dompurify 净化；细粒度权限/审计待补
- **多端**：响应式，支持桌面与移动端（移动端 4 列栅格，桌面 12 列、最大内容宽 1280px）。— 🟡 已用 Tailwind 响应式栅格，移动端待验证
- **国际化**：支持中英文（团队多语言环境）。— ❌ 未做 i18n 框架（界面文案中英混用）
- **设计系统**：遵循设计稿 token —— 主色 Logistics Orange #a63c00/#ff6000，Ink Navy 文字 #151c27；字体 Hanken Grotesk（正文）+ JetBrains Mono（ID/时间戳）；卡片 1px 边框 + 16px 圆角、低对比阴影。— ✅ `tailwind.config.ts` 已精确落地全套 token

---

## 11. 分阶段路线图（v0.2 已按实际进度校准）

### Phase 1 — MVP（进度约 60–70%）

| 项 | 状态 |
|---|---|
| 系统目录（接 CMDB）+ "找谁/找入口" | 🟡 自建版完成，CMDB 对接 **待办** |
| 权威公告发布 + 必读/已读回执 + Slack/邮件通知（内容/通知分离） | ✅ 完成 |
| 个性化首页（公告 + Quick Access + Action Items） | 🟡 UI 完成，Quick Access/Action Items 数据 **待接真实源** |
| Google SSO | 🟡 仅 admin 登录，全员 SSO **待决策**（架构偏差 1） |

**Phase 1 收尾待办清单（v0.2 建议）**：
1. 决策并落地认证模型（架构偏差 1）；
2. 接 CMDB 或确认自建（架构偏差 2）；
3. 把首页 Quick Access / Action Items / 计数器接真实数据源（`/api/me/stats` 等）；
4. 收敛 `Tool` 与 `SystemEntry` 两套重叠模型；
5. 补全 Phase 1 成功指标埋点；
6. 补回完整的 Prisma 基线迁移（当前仓库只有 delta 迁移 `20260609000000_announcement_workflow`，缺初始建表迁移，新环境无法 `migrate deploy`，只能 `db push`）。

### Phase 2 — 扩展（未启动）

- 部门空间 + 事业部 Hub（可配置区块模板）
- 订阅与个性化 feed、通知 digest
- CEO Newsletter、组织架构变更专题
- 文档权威层登记（Resources & Policies）
- RBAC 角色分层 + Google Workspace Groups

### Phase 3 — 深化（未启动）

- 跨系统联合搜索（Notion/Jira/Drive）
- 研发 Hub 深度集成（CI/CD 健康度、项目看板）
- 数据看板 Dashboards

---

## 12. 采用率策略（决定项目存活）

- **强制锚点**：将门户设为浏览器/办公默认首页或 Slack 必经入口。
- **唯一发布源**：CEO Newsletter、组织架构变更、必读 Policy 一律只在门户发布，邮件/Slack 仅发通知链接，制造"非来不可的理由"。

---

## 13. 风险与未决问题（Open Questions）

1. **【新增·最高优先级】** 认证模型方向：全员 SSO vs 公开浏览？直接决定个性化与全员已读回执能否成立（架构偏差 1）。
2. **【新增】** 系统目录是接 CMDB 还是长期自建？若自建需配套 owner 责任制与复核（架构偏差 2）。
3. **【新增】** 仓库缺初始 Prisma 迁移，需补回基线迁移以支持干净部署。
4. CMDB 当前数据完整度与字段（用途、负责人、入口链接）是否足以直接驱动系统目录？需做一次数据盘点。
5. 必读已读回执是否涉及合规/隐私（员工行为追踪）？需与法务/HR 确认。
6. 部门空间内容由谁维护、如何保证不腐化？需配套 Dept Admin 责任制与复核机制。
7. 与现有 Notion 知识库的边界与迁移策略：哪些内容"上升"为门户权威层？
8. Action Items 的数据来源（哪些系统可推送待办）需逐一确认集成可行性。
9. 移动端优先级与原生 App 需求。

---

## 附录 A：设计稿 ↔ 模块对应表

| UI 设计稿界面 | 对应 PRD 模块 | 实现状态 |
|---|---|---|
| Corporate Portal Home | 6.1 首页/个人工作台、6.2 公告、6.7 通知 | 🟡 |
| Internal / System Directory | 6.3 系统目录（CMDB 驱动）、7 权限 | 🟡 |
| Human Resources（部门落地页） | 6.4 部门空间、8 内容治理 | ❌ |
| Software Development（Division Hub） | 6.5 事业部/研发 Hub、9 技术集成 | ❌ |

---

## 附录 B：版本历史

| 版本 | 日期 | 变更 |
|---|---|---|
| v0.1 | 2026-06-08 | 基于 UI 设计稿首版需求 |
| v0.2 | 2026-06-29 | 结合代码仓库（commit `5ca2722`）校准实现状态；新增「实现现状总览」「关键架构偏差」；按实际进度更新路线图与未决问题 |
