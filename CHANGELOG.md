# Changelog

All notable changes to this project are documented here. This project adheres to
[Semantic Versioning](https://semver.org/).

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
