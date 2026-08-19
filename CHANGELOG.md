# Changelog

All notable changes to this project are documented here. This project adheres to
[Semantic Versioning](https://semver.org/).

---

## [2.1.2] — 2026-08-19

### Changed (settings page layout, Apple HIG-aligned)

- **Section order**: core settings first — 记忆范围 → 存储服务 → 备份与迁移 →
  后台助手 → 对话界面 → 展示形态 → 来源与命名 (About last).
- **Origin & naming note moved to the bottom** of the settings page (About /
  attribution zone per Apple HIG).
- **Backup & migration** promoted from an embedded block to its own section.
- **Background assistant (model routing)** now lives in a collapsible panel
  (expanded by default).
- Native store row label: `mnemon` → `song memory` in the providers list.

---

## [2.2.0] — 2026-08-19

### Added / Changed (UI, Apple HIG-aligned)

- **Memory system page next to the conversation overview**: the built-in
  conversation-area tab (信息概览旁的记忆系统页) is now the **default display
  mode** (`displayMode: buildin`); it was previously hidden behind the sidebar
  default.
- **Settings page renamed to 记忆系统** (was 记忆系统设置), matching the
  sidebar / tab label — one name everywhere.
- **Display option de-jargoned**: 展示形态 → 记忆页面位置, options
  Sidebar/Buildin → 侧边栏 / 对话区标签页 (en: Built-in tab, typo fixed).
- **Plain-language renames**: 常用小抄 → 常用信息, 检索 → 搜索,
  记忆范围 → 存储位置, 记忆仓库存储服务 → 存储服务, 对话界面 → 对话中显示,
  备份与迁移 → 备份.
- **Turn bar labeled 记忆系统 · 本回合记忆**.

---

## [2.1.1] — 2026-08-19

### Added

- **Settings-page origin & naming note**: the settings page now states that
  song memory is a UI-redesign fork of `dsh-mnemon` (MIT, © 2026
  dsh-external contributors) and explains that `~/.mnemon`, the `mnemon` CLI
  and the `.mnemonpack` format keep their upstream technical names for data and
  backup compatibility.

### Changed (UI / wording only)

- Status page native-store label: `mnemon 存储服务状态` → `song memory 原生存储状态`
  (zh) / `Song Memory native storage status` (en).

---

## [2.1.0] — 2026-08-19

Plain-language **settings page** and full **song memory** rebrand. Engine still
untouched — all changes are user-visible wording only.

### Changed (UI / wording only)

- **Settings page (config.\*) de-jargoned**: 记忆体 → 记忆仓库, Provider → 存储服务 /
  模型服务, 任务 Agent → 后台助手, 监督写回 → 自动保存, 存储域 → 存储范围, 档案 → 资料,
  配置 → 设置, etc. (zh + en). The terminology regression test no longer exempts
  `config.*`.
- **Product renamed to song memory**: the visible brand `Mnemon` → `song memory`
  (zh) / `Song Memory` (en) across navigation, overview, documents, graph, status,
  settings, and tool-facing copy (`guidance.ts`, `tools.ts`). Internal identifiers
  (`mnemon_*` tool ids, `mnemon.db`, `.mnemonpack`, `mnemon` CLI, `Mnemon Native`)
  are deliberately unchanged.

---

## [2.0.0] — 2026-08-19

This release is a **UI-only redesign fork** of [`dsh-mnemon`](https://github.com/omdsh-dev/dsh-mnemon)
v0.2.9. The engine is **unchanged** from upstream — every capability, all 9 memory
providers, the host injection layer, commands, conversation UI, and Headless/CLI
surface are preserved byte-for-byte. Only `src/client/` was reworked.

### Redesigned (UI / wording only)

- **Four plain-language top-level tabs** replaced the old technical labels:
  - 记忆 (Memory) — was 记忆体 / 检索 / 图谱 / 内容 / 实体 / 沉淀策略
  - 常用小抄 (Runtime / personal cheat-sheet) — was 运行时
  - 项目文档 (Documents) — was 档案
  - 运行状态 (Status / runtime & diagnostics) — was 状态
- Inside 记忆: 概览 / 检索 / 内容 / 实体 + 存入记忆 (was 写入) + 策略. The smart /
  guided recall mode is **on by default**.
- **「存入记忆」unified save flow**: one button (or "帮我记住…") lets the AI decide
  worthiness, routing, and dedup — no technical choices required for everyday saves.
- **Jargon cleanup**: terms like 记忆体 / 沉淀 / 召回 / Provider / 存储域 were
  replaced with plain Chinese across the main UI (advanced/settings area retains
  upstream wording by design).
- **No feature loss**: all 14 upstream feature modules remain reachable from the
  four plain tabs. Functionality is identical to upstream; only the interface was
  reworded.

### Unchanged (inherited from dsh-mnemon v0.2.9)

- Engine, logic layer, and host contract — byte-for-byte identical to upstream.
- 9 memory providers: Mnemon, OpenViking, Honcho, Mem0, Hindsight, Holographic,
  RetainDB, ByteRover, Supermemory.
- Commands (`/mnemon status`, `recall`, `related`, `remember`, `forget`) and the
  conversation UI (本回合记忆 / 存入记忆) are intact.

### Quality status

- Tests: **347 passed / 1 skipped** (matches upstream baseline).
- Build: clean (`tsdown` succeeds, `lib/index.js` + `lib/client.js` produced).

### Notes

- Package renamed to `dsh-song-memory` (v2.0.0); published to
  `github.com/songoao25/dsh-song-memory`.
- Engine documentation under `docs/` is inherited from upstream and describes the
  shared, unchanged engine.

---

## [0.2.9] — upstream baseline

`dsh-song-memory` v2.0.0 is forked from `dsh-mnemon` v0.2.9. See the upstream
release notes for the engine's history prior to this fork.
