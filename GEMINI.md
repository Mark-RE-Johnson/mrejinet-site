# mrejinet-site Guidance (Gemini)

## Shared Baseline (Read First)
- Apply `AGENTS.md` in this repo before using this file.
- This file adds Gemini-specific workflow guidance only.
- If instructions conflict, `AGENTS.md` wins.

## Repo Purpose
- Production website source for `mrejinet.co.uk`.

## Working Rules
- Build with Hugo before release.
- Keep content/layout/style changes scoped and verifiable.
- Use `pidns-promote --mrejinet-site` flow for cross-device sync.

## Validation Commands
```bash
hugo --minify
pidns-promote validate --mrejinet-site
```
