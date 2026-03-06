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
- Use GitOps-only deployment flow for this repo.
- Canonical docs:
  - `/Users/mark/bin/documents/PIDNS-WEBSITE-SOLUTION.md`
  - `/Users/mark/bin/documents/PIDNS-GIT-WORKFLOW.md`
  - `/Users/mark/bin/documents/PIDNS-SOURCE-CONTROL-SOLUTION.md`
- Canonical release path:
  1. `hugo --minify`
  2. `pidns-promote release --mrejinet-site --dry-run --description "what changed"`
  3. `pidns-promote release --mrejinet-site --apply --description "what changed"`
- `--apply` should push to `origin/main` (`pi74`), mirror-push to `github/main` by default, and refresh peer repo.
- Do not deploy/sync this repo via ad-hoc copy methods (`cp`, `scp`, manual `rsync`, manual file drops). Escalate if GitOps tooling cannot perform a required action.

## Validation Commands
```bash
hugo --minify
pidns-promote validate --mrejinet-site
```

## MCP Routing by Language
- HTML templates and CSS (`layouts/**/*.html`, `assets/css/*.css`): use `ast-grep` first for structure-aware queries and repeated pattern edits. Use `playwright` for rendered browser validation, navigation checks, screenshots, and DOM-level verification after changes.
- Markdown content and TOML config (`content/**/*.md`, `hugo.toml`): use `rg` first. Do not default to `jcodemunch` or `cclsp` for content/config-only work in this repo.
- Current repo language mix does not justify `jcodemunch` or `cclsp` as first-line tools. Reach for them only if supported JS/TS/Python source is later added and symbol-aware navigation becomes necessary.
