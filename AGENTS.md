# AGENTS.md instructions for /Users/mark/Projects/mrejinet-site

## Core Baseline (Read First)
- Apply `CORE_AGENT_RULES.md` in this repo before using this file.
- This file is the Codex-specific overlay and website repo guidance.
- If instructions conflict, `CORE_AGENT_RULES.md` wins.

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
