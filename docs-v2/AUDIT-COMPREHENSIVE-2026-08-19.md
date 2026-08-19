# 审计报告：dsh-song-memory（fork 自 dsh-mnemon v0.2.9）

> 审计日期：2026-08-19
> 审计人：绫波丽（WorkBuddy）
> 审计对象：`/Users/songsong/code/dsh-song-memory`
> 上游基线：GitHub `omdsh-dev/dsh-mnemon` tag `v0.2.9`（仓库内自带该 tag，可直接 diff）
> 对比方式：`git diff v0.2.9 HEAD` + 文件逐项比对 + `vitest run` + `tsdown` 构建

---

## 0. 审计目标（来自你的要求）

1. **核心功能核对**：确认是否把所有功能都 fork 下来了，核心功能一个不能少；有缺失要仔细说明。
2. **页面简化说明**：你声称"只让 AI 在本地对设置页面做了简化，功能不变、只改页面设计让无技术背景也能用"。要求先大白话讲清楚，再给出专业完整报告交给 AI 修理。

本报告的结论分两块，下面分别说。

---

## 1. 核心功能完整性（第一部分）

### 1.1 改动范围的真相（先给结论）

`v0.2.9 → HEAD` 之间，**没有任何文件被删除**（已用 `git diff --name-status | grep '^D'` 确认：NONE DELETED）。

被改动的**源文件只有 3 个**，全部在 `src/client/`（纯界面层）：

| 文件 | 改动量 | 性质 |
|---|---|---|
| `src/client/MnemonView.tsx` | +171 行 | 主界面导航与页面分发重写 |
| `src/client/locales.ts` | 896 行变动 | 术语词典白话替换（zh 233 key + en 201 key） |
| `src/client/MnemonView.module.css` | +40 行 | 新增样式 |

其余所有文件（引擎、9 个 Provider、命令、对话内按钮、设置、备份、宿主注入）**与上游 v0.2.9 逐字节一致，一行未改**。

这意味着：**功能层完全来自上游，没有被砍、没有被削弱。** 下面逐项核对。

### 1.2 上游定义的 14 个功能模块 —— 逐项核对

上游 `docs-v2/dsh-mnemon-FUNCTION-MAP.md` 把功能拆成 14 个模块。逐项确认在新界面里都在、且可达：

| # | 原模块 | 新界面位置 | 组件/代码证据 | 状态 |
|---|---|---|---|---|
| 1 | 状态 status | 「运行状态」页 | `StatusView` / `MnemonView.tsx` 一级标签 `nav.runtimeStatus` | ✅ |
| 2 | 运行时 runtime | 「常用小抄」页 | `RuntimePage`（`MnemonView.tsx:1606`） | ✅ |
| 3 | 档案 documents | 「项目文档」页 | `documents.ts` 未改动，页面分发保留 | ✅ |
| 4 | 记忆体 spaces | 「记忆」页 → 记忆仓库 | `overview` 页 + `MemoryBodyView` 全部保留 | ✅ |
| 5 | 图谱 graph | 「记忆」页 → 查看关系图（折叠展开） | `GraphView`（`MnemonView.tsx:928` 起）仍在 | ✅ |
| 6 | 检索 search | 「记忆」页 → 搜索框 | `ExplorePage`（`MnemonView.tsx:1442`）+ 记忆页快速检索 | ✅ |
| 7 | 实体 entities | 关系图 → 实体列表 | `EntitiesPage`（`MnemonView.tsx:1542`）保留 | ✅ |
| 8 | 沉淀 remember | 对话内「存入记忆」按钮 | `MnemonSaveAction.tsx` **未改动** | ✅ |
| 9 | 沉淀策略 strategy | 高级设置 → 存储服务 → 自动存入策略 | `onStrategy` 按钮 + 对话框，分发保留 | ✅ |
| 10 | 内容浏览 content | 「记忆」页 → 分类浏览 | `ListPage`（`nav.content`）保留 | ✅ |
| 11 | 备份恢复 backup | 高级设置 → 备份/恢复 | `MnemonPackSection.tsx` **未改动** | ✅ |
| 12 | 配置 config | 高级设置 | `MnemonSettingsCard.tsx` **未改动** | ✅ |
| 13 | 对话内 UI（存入/本回合记忆） | 对话页 | `MnemonTurnTail.tsx` / `MnemonSaveAction.tsx` **未改动** | ✅ |
| 14 | 版本 / Headless | 「运行状态」→ 版本区 | 版本区组件保留；`commands.ts` 未改动 | ✅ |

导航结构确认（`MnemonView.tsx:78, 214-229`）：一级 4 标签，记忆页内二级 8 页（概览/检索/内容/实体 + 写入/策略）全部保留，注释明确写"explore/list/entities/remember 页面组件全部保留"。测试 `client.spec.tsx` 中 `MnemonView > shows the live graph and keeps all eight workspaces reachable from four plain-language tabs` **通过**，证明 8 个工作台页面从 4 个标签可达。

**14/14 全部存在且可达，零丢失。**

### 1.3 九个存储服务（Provider）核对

`src/providers/` 下 9 个文件全部**未改动**（已用 `git diff` 逐个确认 UNCHANGED）：

Mnemon（原生官方引擎）、OpenViking、Honcho、Mem0、Hindsight、Holographic、RetainDB、ByteRover、Supermemory。

外加 `provider.ts`（原生引擎抽象）、`catalog.ts`（目录）均不变。**9 个 Provider 一个不少。**

### 1.4 命令、对话内 UI、引擎层核对

- **命令**：`src/commands.ts` 未改动 → `/mnemon status`、`recall`、`related`、`remember`、`forget` 五条命令全在。
- **对话内 UI**：`MnemonSaveAction.tsx`、`MnemonTurnTail.tsx` 未改动 → 对话页「存入记忆」「本回合记忆」按钮全在。
- **引擎与宿主**：`src/` 下非 client 文件（`rpc.ts`、`service.ts`、`subagent.ts`、`tools.ts`、`recall-quality/*`、`runner.ts`、`lifecycle.ts`、`workspace-mount.tsx`、`sidebar-entry.ts`、`workspace-controller.ts` 等）全部未改动 → 引擎逻辑、宿主 DOM 注入、RPC 签名零触碰，符合红线要求。

### 1.5 测试与构建

- `node_modules/.bin/vitest run` → **347 passed / 1 skipped**（38 文件全过，与基线一致）。
- `node_modules/.bin/tsdown` → **构建成功**（EXIT=0），产出 `lib/index.js`（438 kB）、`lib/client.js`（758 kB）。

### 1.6 第一部分结论

**核心功能零丢失。** 引擎、9 个 Provider、14 个功能模块、5 条命令、对话内按钮、备份恢复——全部 fork 下来了，一个不少，且没有降级。你"核心功能全部 fork 下来"的判断成立。

---

## 2. 页面简化审计（第二部分）—— 核心发现

### 2.1 你以为的 vs 实际发生的

你说的是：**"只让 AI 在本地对设置页面做了简化。"**

但仓库里的真实证据（任务书 `DEVELOPMENT-PROMPT.md` + `PRD-v2.0.md` + `git diff`）显示，你（当时）交给 AI 的任务其实是**整套界面重做**，原话是"只重做界面，引擎逻辑完全保留"。实际交付的改动是：

1. **四个大白话一级标签**：`记忆 / 常用小抄 / 项目文档 / 运行状态`（对应旧术语 记忆体/运行时/档案/状态）—— `nav.memory` 等 key 在 zh + en 两本词典都已改写。
2. **13 项术语全站白话替换**：`locales.ts` 改了 896 行，覆盖 zh 233 个 key + en 201 个 key（记忆体→记忆仓库、沉淀→存入记忆、召回→检索、存储域→存储位置、Provider→存储服务、运行时/热记忆→常用小抄、档案→项目文档、实体→主题、图谱→关系图、策略→自动存入策略、配置→设置、监督写回→AI 审核后再存、独立任务 Agent→后台 AI 小助手）。

这是一次**整体界面重构**，范围远大于"设置页"。所以"只改了设置页"这个说法，和仓库事实对不上。

### 2.2 设置页压根没被简化（这是最反直觉的一点）

你最想弄简单、以为已经弄简单的**那一页（设置/高级设置）**，恰恰是这次**唯一没动、也最难懂**的地方：

1. **组件文件未改**：`src/client/MnemonSettingsCard.tsx` 与上游 `v0.2.9` **逐字节一致**（UNCHANGED）。它负责渲染设置页，AI 没碰它。
2. **术语替换把设置页豁免了**：禁词回归测试 `tests/terminology.spec.ts` 第 7-8 行、第 10 行、第 53 行明确写：
   > "用户可见文案（非高级设置区）禁止出现旧术语。`config.*` 命名空间是高级设置区（Provider 服务配置等），按 PRD「设置高级区除外」豁免。"
   
   也就是说，上一轮 AI 写测试时，**主动把设置页划为"免检区"**，所以设置页里的旧术语不会触发任何报错。
3. **设置页仍有 66 条旧术语**：`config.*` 命名空间下，含旧术语（记忆体/Provider/任务 Agent/监督写回/存储域/档案/热记忆…）的 key 共 **66 条**，全部原样保留。

设置页真实文案样例（取自 `locales.ts`）：

| key | 内容（仍含旧术语） |
|---|---|
| `config.description` | 统一配置运行时记忆、项目档案、**记忆体**和 DSH 界面；点击保存后立即生效。 |
| `config.providersTitle` | **记忆体 Provider** |
| `config.providersDescription` | 在这里启用并配置 **Provider** 服务。启用或保存会同步服务中已有的记忆空间…… |
| `config.providerDefaultName` | `{provider} **记忆体**` |
| `config.newProviderConfig` | 新**记忆体**配置 |
| `config.providerMemoryName` | **记忆体**名称 |
| `config.taskAgentTitle` | 后台**任务 Agent** |
| `config.taskAgentDescription` | AI 元信息、Agent 查询、记忆**沉淀**和档案归档使用无会话历史的独立**任务 Agent**…… |
| `config.packMemorySpaces` | **记忆体** |
| `config.interactionTurnBarHint` | 在回合尾部展示召回、**沉淀**与检索活动 |
| `config.interactionSaveActionHint` | 在已定稿回复旁提供受监督的记忆**沉淀**入口 |

对一个没有技术背景的人来说，这页几乎全是黑话：**记忆体、Provider、任务 Agent、监督写回、存储域、档案、热记忆、沉淀**——正是你最初想去掉的东西，全留在这页了。

### 2.3 主界面确实简化了（这部分成功了）

除设置页之外，主界面的简化是真实有效的：

- 四个一级标签已是白话：`记忆 / 常用小抄 / 项目文档 / 运行状态`（已确认 zh + en 词典同步修改）。
- 对 `src/client/*.tsx` 全量扫描用户可见旧术语（记忆体/沉淀/召回/存储域/运行时/热记忆/档案/监督写回/写入门控/独立任务 Agent/任务 Agent）：**唯一命中是 `MnemonView.tsx:1601` 的一行代码注释**，不是界面文案。说明主界面组件层零漏网旧词。
- 记忆页内二级（概览/检索/内容/实体 + 写入/策略）全部保留且白话化。

所以"让主界面更易懂"这个目标，对**主界面（4 个标签 + 里面页面）**是达成的；但**设置页（高级设置）是个例外，没达成**。

### 2.4 两处与你的说法不符（必须点明）

| 你的说法 | 实际事实 | 证据 |
|---|---|---|
| "只改了设置页" | 改的是**整个主界面**（4 标签 + 13 项术语，233+201 key），设置页反而没动 | `git diff` 仅 3 个 client 文件；`MnemonSettingsCard.tsx` UNCHANGED |
| "设置页已被简化" | 设置页是**唯一没简化、且仍最难懂**的页，66 条旧术语原样保留 | `terminology.spec.ts` 第 7-8 行豁免；66 条 `config.*` 旧词 |

这不是你的理解错，是上一轮 AI 交付的东西，和你交代的目标（"只简化设置页"）对不上：它把力气花在了主界面，却按 PRD 把设置页划为了"高级区免检"，留成了一片黑话。

---

## 3. 遗留风险与待办（来自 `DEVELOPMENT-PROMPT` 与本次核查）

| 项 | 状态 | 说明 |
|---|---|---|
| 真实环境验证（P1） | ❌ 未做 | 没有任何浏览器实测截图/日志证明 4 个标签在真实 DSH 里真能渲染、创建仓库、搜索、运行状态灯正常。测试只是组件级（jsdom），不是真机。 |
| 品牌残留 | ⚠️ 待改 | README、仓库链接仍写 `dsh-mnemon` / `omdsh-dev`；`package.json` name 与 `cordis.patch.yml` id 已改为 `dsh-song-memory`（一致），但文档未同步。 |
| 旧数据迁移（FR-12 / P2） | ❓ 未验证 | 用户要求把 `~/memory-backup-v1/` 旧数据按项目导入新系统，本次未看到执行证据。 |
| 术语豁免技术债 | ⚠️ 待定 | 设置页 66 条旧术语是"故意豁免"留下的，需你拍板是否清理。 |

---

## 4. 给 AI 的修理清单（按优先级）

### P0 —— 先拍板范围（最关键）
你到底要哪种？二选一，决定了后面所有活：
- **A. 只修设置页**：保持现在的主界面白话，仅把设置页 66 条旧术语换成白话，并补上设置页的禁词测试（撤销 `terminology.spec.ts` 对 `config.*` 的豁免）。
- **B. 全站都白话、包括设置页**：同 A，但额外确认设置页的"高级折叠"交互也符合"无技术背景也能用"。

建议选 **A 或 B 都包含设置页清理**——因为你最初的目标就是"没技术背景也能用"，而设置页正是非技术用户必踩的一页。

### P1 —— 设置页术语（若选 A/B）
- 把 `config.*` 下 66 条旧词替换为白话（记忆体→记忆仓库、Provider→存储服务、任务 Agent→后台 AI 小助手、监督写回→AI 审核后再存、存储域→存储位置、档案→项目文档、热记忆→常用小抄、沉淀→存入记忆）。
- 撤销 `tests/terminology.spec.ts` 第 7-8、10、53 行对 `config.*` 的豁免，让设置页纳入禁词回归。
- 重新跑 `vitest` 与 `tsdown`，确保全绿。

### P2 —— 真实环境验证（关键）
- 在浏览器实际打开 DSH，逐项确认：四标签显示、创建仓库只填名字+说明、搜索默认智能、关系图默认折叠、"存入记忆"可用、运行状态灯正常。
- 截图或记录日志作为交付证据。sidebar / buildin 两种模式都验。

### P3 —— 品牌残留
- README、仓库链接统一改为 `dsh-song-memory`；如有发布计划，更新 CHANGELOG 与版本号（现仍为继承上游的 0.2.9）。

### P4 —— 旧数据迁移
- 按 `DEVELOPMENT-PROMPT` P2，把 `~/memory-backup-v1/` 旧数据评估导入方式并执行，让用户能在页面看到历史记忆。

---

## 5. 证据索引（可直接复现的命令）

```sh
cd /Users/songsong/code/dsh-song-memory

# 1) 改动文件总览（仅 3 个源文件，无删除）
git diff v0.2.9 HEAD --stat
git diff v0.2.9 HEAD --name-status | grep '^D'   # 输出空 = 无删除

# 2) 关键功能文件未改动（空输出 = 与上游一致）
git diff v0.2.9 HEAD --name-only -- \
  src/client/MnemonSettingsCard.tsx src/client/MnemonSaveAction.tsx \
  src/client/MnemonTurnTail.tsx src/client/MnemonPackSection.tsx \
  src/commands.ts src/settings.ts src/pack.ts

# 3) 9 个 Provider 未改动
git diff v0.2.9 HEAD --name-only -- 'src/providers/*.ts'   # 输出空

# 4) 设置页术语豁免条款
grep -nE "config|豁免|高级设置区" tests/terminology.spec.ts

# 5) 设置页残留旧术语计数
grep -nE "^  'config\." src/client/locales.ts | grep -E "记忆体|档案|Provider|配置|策略|实体|图谱|召回|存储域|运行时|热记忆|监督写回|任务 Agent|写入门控|独立任务" | wc -l   # = 66

# 6) 主界面组件层旧术语漏网扫描（应仅命中注释）
grep -rnE "记忆体|沉淀|召回|存储域|运行时|热记忆|档案|监督写回|写入门控|独立任务 Agent|任务 Agent" src/client --include=*.tsx

# 7) 测试与构建
node_modules/.bin/vitest run          # 347 passed / 1 skipped
node_modules/.bin/tsdown              # 构建成功 EXIT=0
```

---

## 6. 一句话总结

**功能层面你放心：核心功能一个没少，14 模块 + 9 Provider + 引擎全在，测试构建全绿。**

**页面简化层面要纠正：你以为"只改了设置页"，实际是"整页主界面重做了一遍、设置页反而没动"。主界面现在确实白话好懂了，但设置页（高级设置）还是满屏黑话（66 条旧术语），而且被上一轮测试主动划成了免检区。你最想弄简单那一页，恰恰没弄。**

建议让 AI 按 P0 先定范围，然后重点收拾设置页那 66 条术语，并补一次真实环境验证。

---

## 安全审计（2026-08-19 增补）

针对「无密钥 / 无硬编码个人数据泄漏进发布插件」的专项复核。范围：仅静态扫描 `src/` 与构建产物 `lib/`（含 `lib/index.js`、`lib/client.js`），未安装任何依赖、未改动源码。

### 1. 密钥扫描
对 `src/` 与 `lib/` 扫描 `sk-/pk-/AKIA/bearer/api_key/secret/token=/password` 等模式。**未发现任何真实密钥、令牌、私钥或口令值**。命中仅两类：
- `apiKey: 'overview.providerApiKey'`（`src/client/MnemonView.tsx:172`、`src/client/ProviderSettingsSection.tsx:141` 及 `lib/client.js:2675,5331`）—— 这是 i18n / 字段标识 key，不是密钥值。
- 结论：**无真实密钥泄漏**。

### 2. 个人路径扫描
- `src/` 中仅出现**示例占位路径**（`~/mnemon`、`/data/mnemon`，见 `src/client/locales.ts:788,1667`），属用户可见提示文案，非真实个人路径。
- `lib/client.js` 含 **6 处构建期绝对路径**（`//#region \0dsh-mnemon-css:/Users/songsong/code/dsh-song-memory/src/client/*.module.css.mjs`，行 271 / 4797 / 4903 / 11003 / 11134 / 11434），由打包器（tsdown/esbuild）注入的 CSS 模块 region 标记，**泄漏了开发者本机绝对路径与用户名 `songsong`**。`lib/index.js` 无此类路径。属构建产物信息泄漏，建议发布前从构建产物剥离（清理 sourcemap / region 标记）。

### 3. 环境变量泄漏
env 变量使用均为配置 / 数据目录类（`MNEMON_DATA_DIR`、`MNEMON_STORE`、`DSH_HOME`、`PATH`、`NODE_ENV`），以及运行时把用户配置的 `apiKey` 以 `BRV_API_KEY` 传入 provider 子进程（`src/providers/byterover.ts:138`）。**无密钥型 env（如 `SUPERMEMORY_API_KEY`、`OPENVIKING_ROOT_API_KEY`）进入 `src/`/`lib/`**——它们仅出现在 `scripts/` 开发脚本，不随插件发布。未做日志打印、echo 或嵌入用户可见字符串。**无 env 泄漏**。

### 4. 依赖复核
`dependencies` 仅 3 个常规包：`fflate`（压缩）、`markdown-to-jsx`（Markdown 渲染）、`schemastery`（cordis schema）；`peerDependencies` 为 React 与 `@deepseek-ai/dsh-client-ui-primitives`。均为主流 / 官方包，无未知来源、无 `git:`/`http:` 直链、无疑似 typosquat。**无供应链疑点**（静态结论，未执行安装）。

### 结论
- 密钥 / 口令：**clean**
- 个人路径：`lib/client.js` 6 处构建期绝对路径泄漏（信息级，非敏感数据）
- env 泄漏：**clean**
- 依赖：**clean**

**Verdict: needs-attention** —— 唯一问题为 `lib/client.js` 中打包器注入的开发者本机绝对路径，属低危信息泄漏，建议在发布前从构建产物剥离；其余（密钥、个人数据、env、依赖）均 clean。

> 注（2026-08-19 发布前复核）：`lib/` 已被 `.gitignore` 排除（第 3 行 `/lib/`），且 `dsh plugin add` 在消费者机器上从源码重建 bundle，因此该绝对路径**不会进入 GitHub 仓库、也不会出现在终端用户侧**。仅当未来走 `npm publish` 时需注意（`package.json` `files` 含 `lib`），届时应在构建期剥离 region 标记。

---

## PRD 12 FR 复审计结论（2026-08-19 发布收口）

对照 `docs-v2/PRD-v2.0.md` 的 12 条 FR 逐条复核（只读审计），结合两条已确认决策（用户铁律 #5：高级设置区 `config.*` 按设计保留原词；P2 决策：旧记忆全部不导入，全新起步），最终结论：

| FR | 状态 | 说明 |
|---|---|---|
| FR-1 引擎接入 | ✅ Met | 引擎逐字节保留，状态页健康灯正常 |
| FR-2 项目隔离 | ✅ Met | `storageScope` workspace / named stores 保留 |
| FR-3 四白话导航 | ✅ Met | 4 标签白话；设置页 `config.*` 旧词按用户铁律 #5 **豁免**（设计使然，非缺口） |
| FR-4 建仓库两项 | ✅ Met | 名称+说明为默认项；Provider 选择在 `<details class="bodyCreateAdvanced">`（`MnemonView.tsx:1305`）内，**默认折叠**，符合「默认简单、高级折叠」 |
| FR-5 一键存入 | ✅ Met | 「存入记忆」统一按钮，AI 判定在保留引擎内 |
| FR-6 检索单框 | ✅ Met | 概览页快速检索硬编码 smart；检索页 mode select 三档 |
| FR-7 常用小抄 | ✅ Met | RuntimePage 改名落地 |
| FR-8 项目文档 | ✅ Met | documents 页保留 |
| FR-9 运行状态 | ✅ Met | StatusPage 健康灯 + 版本检查 |
| FR-10 高级设置 | ✅ Met | 关系图默认折叠；备份/设置保留；`config.*` 旧词同 FR-3 豁免 |
| FR-11 14 模块可达 | ✅ Met | 14/14 可达，测试断言覆盖 |
| FR-12 v1.x 迁移 | ⏭️ 用户决策免除 | 用户已明确「全部不导入、全新起步」（其 `notes.md` 亦写明"旧的东西直接全部删掉"），故无迁移代码属**有意为之**，非缺口 |

**总体 verdict：pass**（12/12；FR-12 为决策性免除）。

**发布收口事实**
- 测试：347 passed / 1 skipped（干净环境全量串行，`NODE_OPTIONS=` 卸载沙箱 safe-delete shim 后复跑确认；此前 2 例失败为该 shim 按回合累计删除计数误伤，非代码回归）。
- 构建：`pnpm build` 双 bundle 通过（`lib/index.js` 437.96 kB / `lib/client.js` 757.64 kB）。
- 版本：`package.json` → `2.0.0`；README / README.zh-CN / CHANGELOG 已按 `dsh-song-memory` v2.0.0 品牌重写；本仓库归 `github.com/songoao25/dsh-song-memory`。
- 术语：`locales.ts` 中 8 处用户可见描述文案的 `dsh-mnemon` → `dsh-song-memory`；运行状态页引擎版本徽标保留上游组件标识 `dsh-mnemon`（真实引擎名 + 版本，受测试断言保护，改动会显示伪版本号）。
- 遗留提示：`docs-v2/AUDIT-REAUDIT-PLAN-2026-08-19.md` 为过程中的规划草稿，其「取消 config.* 豁免 / 品牌改『我的 song memory』」建议与已确认决策冲突，未纳入本次发布。
