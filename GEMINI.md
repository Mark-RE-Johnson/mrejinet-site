# mrejinet-site Guidance (Gemini)

## Shared Baseline (Read First)
- Apply `CORE_AGENT_RULES.md` in this repo before using this file.
- This file adds Gemini-specific workflow guidance only.
- If instructions conflict, `CORE_AGENT_RULES.md` wins.

## Repo Purpose
- Production website source for `mrejinet.co.uk`.

## Working Rules
- Build with Hugo before release.
- Keep content/layout/style changes scoped and verifiable.
- Website development and publication are temporarily unavailable during the
  Phase 5 break-before-make cutover. Read-only inspection and local builds are
  allowed; do not edit, commit, push, or publish website source.
- Canonical docs:
  - `/Users/mark/bin/documents/PIDNS-WEBSITE-SOLUTION.md`
  - `/Users/mark/bin/documents/PIDNS-GIT-WORKFLOW.md`
  - `/Users/mark/bin/documents/PIDNS-SOURCE-CONTROL-SOLUTION.md`
- `pidns-promote release --mrejinet-site`, direct `git push`, manual
  `wrangler deploy`, and ad-hoc copy/sync are retired as accepted paths.
- Resume only after the shared development-workspace catalogue admits this
  project. If that workflow is unavailable, stop and escalate; do not restore
  or bypass the old route.

## Validation Commands
```bash
hugo --minify
```

## MCP Routing by Language
- HTML templates and CSS (`layouts/**/*.html`, `assets/css/*.css`): use `ast-grep` first for structure-aware queries and repeated pattern edits. Use `playwright` for rendered browser validation, navigation checks, screenshots, and DOM-level verification after changes.
- Markdown content and TOML config (`content/**/*.md`, `hugo.toml`): use `rg` first. Do not default to `jcodemunch` or `cclsp` for content/config-only work in this repo.
- Current repo language mix does not justify `jcodemunch` or `cclsp` as first-line tools. Reach for them only if supported JS/TS/Python source is later added and symbol-aware navigation becomes necessary.
