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
- Website development and publication are temporarily unavailable during the
  Phase 5 break-before-make cutover. Read-only inspection and local builds are
  allowed; do not edit, commit, push, or publish website source.
- The old `pidns-promote release --mrejinet-site` route, direct `git push`, and
  manual `wrangler deploy` are no longer accepted development or publication
  paths. Do not use aliases or ad-hoc copy/sync commands to bypass the cutover.
- Development resumes only after the `mrejinet-site` project row is published
  in the shared development-workspace catalogue. The admitted
  `pidns-dev-workspace` journey and its typed GitOps adapter will then be the
  sole authority.
- If the shared workflow is unavailable, stop and report the gap. Do not restore
  the retired route implicitly.

## Repo-Specific MCP Routing
- `/Users/mark/Projects/mrejinet-site` is the deliberate primary folder for the website Codex project.
- Its `.codex/config.toml` enables `ast-grep`, `context7`, `pidns-docs`, and app-owned `node_repl`; the other registered code-intelligence, data, monitoring, Home Assistant, and Computer Use servers stay disabled.
- HTML templates and CSS (`layouts/**/*.html`, `assets/css/*.css`): use `ast-grep` first for structure-aware queries and repeated pattern edits. Use `playwright` for rendered browser validation, navigation checks, screenshots, and DOM-level verification after changes.
- Markdown content and TOML config (`content/**/*.md`, `hugo.toml`): use `rg` first. Do not default to `jcodemunch` or `cclsp` for content and config-only work in this repo.
- Current repo language mix does not justify `jcodemunch` or `cclsp` as first-line tools. Reach for them only if the repo later adds supported JS, TS, or Python source that needs symbol-aware navigation.
