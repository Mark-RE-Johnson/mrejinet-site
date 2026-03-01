# mrejinet-site — Claude Instructions

## Shared Baseline (Read First)
- Apply `CORE_AGENT_RULES.md` in this repo before using this file.
- This file adds Claude-specific workflow guidance only.
- If instructions conflict, `CORE_AGENT_RULES.md` wins.

## Scope
- Path: `/Users/mark/Projects/mrejinet-site`
- Stack: Hugo, HTML templates, CSS, Markdown content.

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
