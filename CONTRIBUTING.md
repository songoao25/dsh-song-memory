# Contributing to dsh-song-memory

Thanks for your interest in contributing! This project is a plain-language UI
redesign fork of [`dsh-mnemon`](https://github.com/omdsh-dev/dsh-mnemon). The
engine is preserved byte-for-byte from upstream — **all changes live in
`src/client/` (UI copy, navigation, and layout)**.

## Reporting issues

- Search existing issues first to avoid duplicates.
- For bugs, include: what you did, what you expected, what happened, and your
  environment (DSH version, OS, browser).
- For security issues, **do not** open a public issue — see [SECURITY.md](./SECURITY.md).

## Code of conduct

Everyone participating in this project is expected to follow our
[Code of Conduct](./CODE_OF_CONDUCT.md).

## Development workflow

1. Fork the repository and clone your fork.
2. Create a branch: `git checkout -b <type>/<short-description>` (e.g. `fix/typo-in-settings`).
3. Install dependencies: `pnpm install`.
4. Make your changes in `src/client/`.
5. Run the full check suite: `pnpm run verify`.
6. Commit with [Conventional Commits](https://www.conventionalcommits.org/) style:
   `feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `test:`, `chore:`.
7. Open a pull request against `main` with a short description of the change
   and how it was tested.

## Notes

- `lib/` is a generated build artifact and is intentionally not committed.
- Terminology matters: the UI is deliberately plain-language. If your change
  introduces a technical term (Provider, 记忆体, 召回…), it likely does not
  belong in the user-facing UI.
- `docs/` is inherited from upstream and describes the shared engine; do not
  edit engine behavior through it.
