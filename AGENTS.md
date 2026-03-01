# AGENTS.md instructions for /Users/mark/Projects/mrejinet-site

## Core Baseline (Read First)
- Apply `CORE_AGENT_RULES.md` in this repo before using this file.
- This file is the Codex-specific overlay and website repo guidance.
- If instructions conflict, `CORE_AGENT_RULES.md` wins.

## Repo Intent
- Hugo static site for `mrejinet.co.uk`.
- Source includes content, layouts, assets, and deploy metadata.

## Build and Validation
```bash
hugo --minify
hugo server --buildDrafts
```

## Sync and Promote
- Use `pidns-promote release --mrejinet-site` once configured.
- Keep Air/Pro working copies aligned through Git promotion workflow.
