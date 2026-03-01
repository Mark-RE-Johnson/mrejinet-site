# AGENTS.md instructions for /Users/mark/Projects/mrejinet-site

## Shared Baseline Policy
- This file is the mandatory baseline for all agents in this repo.
- `CLAUDE.md` and `GEMINI.md` may add tool-specific guidance, but must not weaken this policy.
- If guidance conflicts, follow `AGENTS.md` first.

## Repo Intent
- Hugo static site for `mrejinet.co.uk`.
- Source includes content, layouts, assets, and deploy metadata.

## MCP-First Code Intelligence Policy
- For methods/functions/symbols/call hierarchy, use MCP tools first.
- Use `cclsp` for definition/reference/rename/hover and diagnostics.
- Use `bash-intel` for Bash/Python call hierarchy and scope-aware references.
- Use `ast-grep` for structural AST queries.
- Use `rg` for plain text search or as MCP fallback when MCP cannot answer.
- If MCP health is unclear, run `/Users/mark/bin/pidns-mcp-lsp-smoketest` before deeper analysis.

## Search Commands (Strict)
- Always use `rg` for text search.
- Always use `rg --files` for file discovery.
- Do not use `grep` for searching unless `rg` is unavailable.
- If fallback is required, explicitly state why `rg` could not be used.
- `find` is allowed for filesystem traversal tasks that are not text search.

## Build and Validation
```bash
hugo --minify
hugo server --buildDrafts
```

## Sync and Promote
- Use `pidns-promote release --mrejinet-site` once configured.
- Keep Air/Pro working copies aligned through Git promotion workflow.
