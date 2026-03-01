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
