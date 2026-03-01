# CORE_AGENT_RULES.md

## Baseline Scope
- This file is the mandatory baseline policy for all agents in this repo.
- Overlay files are:
  - `AGENTS.md` (Codex overlay)
  - `CLAUDE.md` (Claude overlay)
  - `GEMINI.md` (Gemini overlay)
- Read this file first, then read the agent-specific overlay.
- Overlay files may add constraints but must not weaken this baseline.
- If guidance conflicts, `CORE_AGENT_RULES.md` wins.

## Search Commands (Strict)
- Always use `rg` for text search.
- Always use `rg --files` for file discovery.
- Do not use `grep` for searching unless `rg` is unavailable.
- If fallback is required, explicitly state why `rg` could not be used.
- `find` is allowed for filesystem traversal tasks that are not text search.

## MCP-First Code Intelligence Policy
- For methods/functions/symbols/call hierarchy, use MCP tools first.
- Use `cclsp` for definition/reference/rename/hover and diagnostics.
- Use `bash-intel` for Bash/Python call hierarchy and scope-aware references.
- Use `ast-grep` for structural AST queries.
- Use `rg` for plain text search or as MCP fallback when MCP cannot answer.
- If MCP health is unclear, run `/Users/mark/bin/pidns-mcp-lsp-smoketest` before deeper analysis.

## Parity and Drift Policy
- Air and Pro must maintain exact operational parity for workflow-critical behavior.
- Do not use one-host workarounds to simulate parity.
- Any symlink-based pattern is allowed only if it is documented architecture and applied identically on both clients.
- If parity breaks, fix the root cause on the outlier client, then re-validate.
