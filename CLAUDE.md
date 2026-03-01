# mrejinet-site — Claude Instructions

## Shared Baseline (Read First)
- Apply `CORE_AGENT_RULES.md` in this repo before using this file.
- This file adds Claude-specific workflow guidance only.
- If instructions conflict, `CORE_AGENT_RULES.md` wins.

## Scope
- Path: `/Users/mark/Projects/mrejinet-site`
- Stack: Hugo, HTML templates, CSS, Markdown content.
- Deployment reference docs:
  - `/Users/mark/bin/documents/PIDNS-WEBSITE-SOLUTION.md`
  - `/Users/mark/bin/documents/PIDNS-GIT-WORKFLOW.md`
  - `/Users/mark/bin/documents/PIDNS-SOURCE-CONTROL-SOLUTION.md`

## Commands
```bash
hugo server --buildDrafts
hugo --minify
pidns-promote release --mrejinet-site --dry-run --description "what changed"
pidns-promote release --mrejinet-site --apply --description "what changed"
```

## Constraints
- Keep layouts and content deterministic and buildable by Hugo.
- Preserve security headers/redirects under `static/`.
- Site deployment is GitOps-only: push through `pidns-promote release --mrejinet-site`, then Cloudflare deploys from `main`.
- `--apply` should publish to `origin/main` (`pi74`), mirror-push to `github/main` by default, and refresh peer working copy.
- Do not use ad-hoc deploy/sync paths for this repo (`cp`, `scp`, manual `rsync`, manual file drops). If workflow tooling cannot represent the needed deploy, stop and escalate.
