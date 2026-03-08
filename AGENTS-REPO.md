# AGENTS-REPO.md instructions for /Users/mark/Projects/mrejinet-site

Read this file after `AGENTS.md`. This file holds repo-local guidance for the website repo.

## Repo Intent
- Hugo static site for `mrejinet.co.uk`.
- Source includes content, layouts, assets, and deploy metadata.

## Task Routing (Read Before Acting)
- `/Users/mark/bin/documents/PIDNS-WEBSITE-SOLUTION.md` for deployment mode and Cloudflare behavior.
- `/Users/mark/bin/documents/PIDNS-GIT-WORKFLOW.md` for promote/release command semantics.
- `/Users/mark/bin/documents/PIDNS-SOURCE-CONTROL-SOLUTION.md` for canonical `pidns-promote` flow details.

## Build and Validation
```bash
hugo --minify
hugo server --buildDrafts
```

## Deployment Discipline (GitOps)
- Active deployment mode is GitOps-only for site content: commit/push in `mrejinet-site`, then let Cloudflare auto-deploy from `main`.
- Canonical release sequence:
  1. `hugo --minify`
  2. `pidns-promote release --mrejinet-site --dry-run --description "what changed"`
  3. `pidns-promote release --mrejinet-site --apply --description "what changed"`
- `--apply` is expected to push to `origin/main` (`pi74`), mirror-push to `github/main` by default, and refresh the peer repo working copy.
- Do not use ad-hoc deployment paths (`cp`, `scp`, manual `rsync`, manual file drops) for this repo. If a required path is missing from GitOps tooling, escalate the workflow gap.

## Repo-Specific MCP Routing
- HTML templates and CSS (`layouts/**/*.html`, `assets/css/*.css`): use `ast-grep` first for structure-aware queries and repeated pattern edits. Use `playwright` for rendered browser validation, navigation checks, screenshots, and DOM-level verification after changes.
- Markdown content and TOML config (`content/**/*.md`, `hugo.toml`): use `rg` first. Do not default to `jcodemunch` or `cclsp` for content and config-only work in this repo.
- Current repo language mix does not justify `jcodemunch` or `cclsp` as first-line tools. Reach for them only if the repo later adds supported JS, TS, or Python source that needs symbol-aware navigation.
