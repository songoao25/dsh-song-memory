# AGENTS.md — guidance for AI coding agents

This file helps AI agents (and humans) work in this repository safely and
consistently.

## What this project is

`dsh-song-memory` is a UI-redesign fork of `dsh-mnemon` v0.2.9: a three-tier
memory plugin for DeepSeek Harness. **The engine is preserved byte-for-byte
from upstream.** All intentional changes live in `src/client/` — UI copy,
navigation, and layout, following Apple HIG principles (plain language, no
jargon).

## Hard rules

- Do **not** modify engine/host behavior outside `src/client/` without an
  explicit decision recorded in the project docs.
- The user-facing UI must stay plain-language. Do not reintroduce jargon
  (Provider, 记忆体, 召回…) into the four main tabs.
- `lib/` is a generated artifact — never commit it.
- `docs-v2/` and `DEVELOPMENT-PROMPT.md` are internal, local-only. Never add
  them to git (see `.gitignore`).

## Commands

- `pnpm install` — install dependencies.
- `pnpm run verify` — full gate: typecheck + tests + deterministic build +
  headless profile check + package check. Run before every commit.
- `pnpm test` — Vitest only.

## Commit conventions

- Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `style:`,
  `test:`, `chore:`, `revert:`).
- Release cadence: update `package.json` version, CHANGELOG.md, git tag, and
  GitHub Release together (the four-piece sync).
