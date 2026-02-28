# AGENTS.md instructions for /Users/mark/Projects/mrejinet-site

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
