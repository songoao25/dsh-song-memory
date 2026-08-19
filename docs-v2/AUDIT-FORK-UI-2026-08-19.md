# 审计报告：dsh-song-memory 分支审计（Fork 自 dsh-mnemon v0.2.9）

- **审计对象**：`/Users/songsong/code/dsh-song-memory`
- **上游基线**：`dsh-mnemon` v0.2.9（git tag `v0.2.9`，`origin = https://github.com/omdsh-dev/dsh-mnemon.git`）
- **本地提交**：在 `v0.2.9` 之上 5 个提交（`07af29f` → `7d58fb0`），工作树干净（无未提交改动）
- **审计时间**：2026-08-19
- **方法**：`git diff v0.2.9..HEAD` 文件级比对 · 源码树完整性检查 · 术语回归测试 · `tsdown` 构建 · 14 功能模块可达性核对

---

## 一、核心功能核对结论（用户要求 1：核心功能是否全部 fork 下来、零缺失）

### 1.1 引擎 / 逻辑层：零改动，完整保留 ✅

- `src/` 下**非 `client/` 的全部文件**与上游逐字节一致：`git diff v0.2.9 HEAD -- src/` 过滤掉 `src/client/` 后无任何差异，且 `git diff ... --name-status -- src/` 中无 `D`（删除）记录。
- **9 个记忆 Provider 全部存在**（`src/providers/`）：`mnemon-native`、`openviking`、`honcho`、`mem0`、`hindsight`、`holographic`、`retaindb`、`byterover`、`supermemory`。
- **宿主注入层未触碰**：`src/client/anchor.ts`、`workspace-mount.tsx`、`sidebar-entry.ts`、`workspace-controller.ts` 均不在改动清单内。
- 结论：从引擎与宿主契约角度，上游能力 100% 继承，**没有任何功能在 fork 过程中被删减**。

### 1.2 14 个功能模块：全部存在且可达 ✅

| # | 模块（原名） | 新界面位置 | 状态 |
|---|---|---|---|
| 1 | 状态 status | 一级标签「运行状态」 | ✅ 可达 |
| 2 | 运行时 runtime | 一级标签「常用小抄」 | ✅ 可达 |
| 3 | 档案 documents | 一级标签「项目文档」 | ✅ 可达 |
| 4 | 记忆体 spaces（创建/激活/停用/归档/删除） | 「记忆」→ 概览 | ✅ 可达 |
| 5 | 图谱 graph（关系图） | 「记忆」页内折叠区「关系图」 | ✅ 可达 |
| 6 | 检索 search | 「记忆」→ 检索 | ✅ 可达 |
| 7 | 实体 entities（主题） | 「记忆」→ 实体 | ✅ 可达 |
| 8 | 沉淀 remember（存入记忆） | → 存入记忆 | ✅ 可达 |
| 9 | 沉淀策略 strategy（自动存入策略） | 「记忆」页「策略」按钮 → 对话框 | ✅ 可达 |
| 10 | 内容浏览 content | 「记忆」→ 内容 | ✅ 可达 |
| 11 | 备份恢复 backup（含导入/导出） | **设置页** `MnemonPackSection`（未改） | ✅ 可达 |
| 12 | 配置 config | **设置页** `MnemonSettingsCard`（未改） | ✅ 可达 |
| 13 | 对话内 UI（存入记忆 / 本回合记忆） | `MnemonSaveAction` / `MnemonTurnTail`（未改） | ✅ 可达 |
| 14 | 版本 / Headless（CLI） | `version-updates.ts` / `commands.ts`（未改） | ✅ 可达 |

- 导航结构见 `src/client/MnemonView.tsx`：一级标签 `PRIMARY_PAGE_TABS`（行 214–217），记忆页二级标签 `MEMORY_PAGE_TABS`（行 225–229），策略按钮与对话框（行 414、1770、2602）。
- 测试 `tests/client.spec.tsx` 中 `shows the live graph and keeps all eight workspaces reachable from four plain-language tabs`（行 315）已覆盖 8 个页面组件的可达性断言。

### 1.3 测试与构建

- `node_modules/.bin/vitest run` → **347 passed / 1 skipped**（38 文件，达到 DEVELOPMENT-PROMPT 基线）。
- `node_modules/.bin/tsdown` → `lib/index.js`（437.96 kB）与 `lib/client.js`（757.83 kB）均构建成功。
- `tests/terminology.spec.ts`（2 项）通过。

### 1.4 核心功能结论

**核心功能已完整 fork，零缺失。** 引擎、宿主契约、9 个 Provider、14 个功能模块、对话内入口、Headless/CLI 全部保留并可从界面到达。无功能层面的丢失。

---

## 二、界面简化核对结论（用户要求 2：只简化设置页、功能不变）——重要偏差

### 2.1 实际改动范围 ≠ "只改设置页"

实际改动文件（`git diff v0.2.9 HEAD --stat`）：

| 文件 | 改动量 | 性质 |
|---|---|---|
| `src/client/MnemonView.tsx` | 171 行 | 导航重构（4 个白话标签 + 记忆页二级入口） |
| `src/client/locales.ts` | 896 行 | 用户可见词典术语全量替换 |
| `src/client/MnemonView.module.css` | 40 行 | 样式 |
| `tests/client.spec.tsx` | 503 行 | 重写为 4 标签 + 14 模块可达性断言 |
| `tests/terminology.spec.ts` | 新增 86 行 | 禁词回归 |
| `package.json` / `cordis.patch.yml` / `pnpm-workspace.yaml` / `tsdown.config.ts` | 小改 | 改名与构建配置 |
| `docs-v2/*` | 新增 | 设计文档 |

本质是两件事：① **一级导航收敛为 4 个白话标签**（记忆 / 常用小抄 / 项目文档 / 运行状态）；② **用户可见词典术语全白话化**（记忆体→记忆仓库、沉淀→存入记忆、召回→检索 等）。这是一次**全站导航与日常词汇的重构**，并非"只改设置页"。

### 2.2 "设置页"本身没有被改 —— 这是最需要你注意的事实

- 承载设置页的组件 `src/client/MnemonSettingsCard.tsx`（内含模块 11 备份恢复 + 模块 12 配置）**与上游逐字节一致，不在任何改动清单内**。
- 同一个文件里渲染的 `MnemonPackSection`（备份/导入导出）、`ProviderSettingsSection`（Provider 配置）也都未改。
- 术语回归测试 `tests/terminology.spec.ts` **显式豁免了 `config.*` 命名空间**（见第 10 行 `ADVANCED_PREFIX = 'config.'`，第 56、73 行 `if (key.startsWith(ADVANCED_PREFIX)) continue`）。因此设置页仍保留 `Provider`、`任务 Agent`、`监督写回`、`存储域`、`记忆体`、`档案` 等技术词，而测试不会拦截。

### 2.3 设置页残留旧术语量化（直接证据）

对 `src/client/locales.ts` 中 `config.*` 命名空间筛查，含旧术语（记忆体 / 档案 / Provider / 配置 / 策略 / 实体 / 图谱 / 召回 / 存储域 / 运行时 / 热记忆 / 监督写回 / 任务 Agent）的条目共 **66 条**。示例：

- `config.description`：'统一配置运行时记忆、项目档案、**记忆体**和 DSH 界面…'（行 684）
- `config.providersTitle`：'**记忆体 Provider**'（行 707）
- `config.taskAgentTitle` / `config.taskAgentProvider` 等：含"**任务 Agent**"
- 其余大量 `config.provider*`、`config.saveScopeBeforeProviders` 等含英文 "Provider"

> 说明：这些并不违反当前 PRD（PRD 把 `config.*` 高级设置区列为"术语豁免"）。但它们**直接违反你本人"把设置页也弄得简单、全白话"的目标**。

### 2.4 与你的目标的直接冲突

- **你的目标**：功能不变 + 只简化设置页 + 全白话更易入门（无技术背景也能用）。
- **实际交付**：设置页**未简化**（仍是全站最 jargon 的一块）；简化落在了主工作区导航和日常词汇上；且因 PRD 豁免条款，设置页的术语测试本就不会报错。
- **一句话**：你最想简化的那一页，恰恰没动；动的是你没提的主界面。

---

## 三、需要 AI 修理的问题清单（按优先级）

### P0 — 目标对齐（必须先和你确认，否则 AI 无法闭环）
- **歧义**：你描述"只改设置页"，但仓库实际是"全站导航 + 词典白话化、设置页豁免"。两套目标不一致。
- **待你拍板**：到底要 (A) 仅简化设置页 / (B) 全站简化且设置页也白话化 / (C) 维持现状（设置页作为高级区保留术语）。选 (B) 才符合你最初"全白话、无技术背景也能用"的诉求。

### P1 — 设置页术语未落地（若选 B）
- **问题**：`config.*` 66 条仍含旧术语；`terminology.spec.ts` 豁免 `config.*`，无法拦截回归。
- **修复步骤**：
  1. 取消或收窄 `tests/terminology.spec.ts` 第 10、56、73 行的 `config.*` 豁免（或新增独立的 `config.*` 禁词用例）。
  2. 在 `src/client/locales.ts` 的 `config.*` 命名空间逐条替换为白话（建议映射：记忆体→记忆仓库、Provider→存储服务、任务 Agent→后台 AI 小助手、监督写回→AI 审核后再存、存储域→存储位置、档案→项目文档、配置→设置、策略→自动存入策略）。
  3. 同步核对 `MnemonSettingsCard.tsx` / `ProviderSettingsSection.tsx` / `MnemonPackSection.tsx` 中**硬编码**（非 `t(...)`）的可见字符串，确保无漏网旧词。
  4. 重跑 `vitest run`，确保 347+ 通过且禁词测试覆盖 `config.*`。

### P2 — 品牌 / 元数据残留（不影响功能，影响发布）
- `package.json` 的 `repository.url` / `homepage` / `bugs.url` 仍指向 `omdsh-dev/dsh-mnemon`。
- `README.md` 标题仍为 `dsh-mnemon`、徽章写 `v0.2.9`、所有 demo 链接指向 `omdsh-dev/dsh-mnemon`。
- **修复**：改为 song-memory 自有信息（或确认本项目暂不对外发布，则可暂缓）。

### P3 — 真机验证缺口
- DEVELOPMENT-PROMPT 的 P1（浏览器实测：4 标签、创建仓库只填名字+说明、搜索默认智能、图谱默认隐藏、存入记忆可用、运行状态健康灯、sidebar/buildin 两模式）未在任何提交中体现验证证据。审计报告**无法确认真实渲染**。
- **建议**：在 DSH web profile 实测并截图，作为交付证据。

### P3 — 旧记忆导入（DEVELOPMENT-PROMPT P2 待办）
- `~/memory-backup-v1/` 旧数据尚未导入新系统。用户需能在页面看到历史记忆才算闭环。

---

## 四、验证证据附录

- 改文件清单：`git diff v0.2.9 HEAD --stat`（14 文件，1533 增 / 696 删）。
- 引擎未动：`git diff v0.2.9 HEAD -- src/` 过滤 `src/client` 后为空。
- 测试：`vitest run` 347 passed / 1 skipped。
- 构建：`tsdown` 成功（lib/index.js、lib/client.js）。
- 改名一致：`package.json` `name = dsh-song-memory`；`cordis.patch.yml` `id/name = dsh-song-memory`。
- 术语豁免代码：`tests/terminology.spec.ts` 第 10、56、73 行。
- 设置页组件未改：`MnemonSettingsCard.tsx` 不在 diff 清单；`git diff v0.2.9 HEAD -- src/client/MnemonSettingsCard.tsx` 为空。
- 设置页旧术语计数：`src/client/locales.ts` 中 `config.*` 含旧术语条目 = 66。

---

## 五、给你的下一步建议（非技术口径）

1. 先决定 P0 的三种范围之一（推荐 B：全站都白话，包括设置页）。
2. 把本报告交给 AI，让它按 P1 把设置页的 66 条旧术语替换成白话，并补上 `config.*` 的禁词测试。
3. 让 AI 补 P3 的真机截图，确认页面真的能跑。
4. 品牌信息（README/仓库链接）等发布前再改也不迟。
