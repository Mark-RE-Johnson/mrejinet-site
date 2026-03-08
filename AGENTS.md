# AGENTS.md instructions for this repository

## Core Baseline (Read First)
- Apply `CORE_AGENT_RULES.md` in this repo before using this file.
- This file is the shared Codex overlay and GPT-5.4+/ChatGPT-oriented MCP guidance used across repos.
- If `AGENTS-REPO.md` exists in the repo root, read it after this file for repo-local routing, validation, and deployment rules.
- If guidance conflicts, `CORE_AGENT_RULES.md` wins, then this file, then `AGENTS-REPO.md`.

## Shared Overlay Scope
- Keep this file identical across repos.
- Put repo-specific intent, file-pattern routing, validation commands, and deployment rules in `AGENTS-REPO.md`, not here.
- Prefer repo-native docs, scripts, CI config, and package/build metadata when `AGENTS-REPO.md` or local docs point to them.

## Validation Posture
- Documentation-only changes: readability and link review are usually enough unless repo-local guidance says otherwise.
- For code, config, workflow, or asset changes: run the smallest repo-native validation that covers the touched files.
- Prefer targeted reruns or resume/from-failure controls over a fresh full rerun when the repo provides them.
- If no meaningful validation command exists, say so explicitly rather than inventing one.

## MCP Auto-Profile Rules (Codex)
- Use built-in per-agent MCP profiles via `pidns-mcp-toggle profile codex <profile> --apply`.
- Before substantial work, select profile by request intent:
  - `core` (default): local repo coding/docs/scripting with minimal MCP overhead.
  - `library`: third-party package/framework API, version, or migration tasks (keeps `context7` enabled).
  - `infra`: Home Assistant / Prometheus / infrastructure triage tasks.
  - `browser-db`: Playwright browser automation or SQLite-focused tasks.
  - `full`: only when the user explicitly requests all MCP servers.
- Treat `core` as the steady-state default for docs, coding, code review, and repo analysis. GPT-5.4+ tool search reduces schema-loading cost, but a smaller active set still lowers wrong-tool risk, approval surface, and operator overhead.
- Widen to `library`, `infra`, or `browser-db` only for the phase of work that truly needs those tools, then return to `core` when practical.
- Reserve `full` for MCP/server authoring, registration verification, end-to-end smoke work, or explicit operator request.
- Run `pidns-mcp-toggle status` before changing profile; avoid re-applying when already on target.
- If task scope changes mid-session, switch to the matching profile before continuing.
- After any profile switch (`pidns-mcp-toggle profile codex <profile> --apply`), explicitly tell the user that a new chat/session restart is recommended for MCP profile changes to take full effect.
- If you are designing a ChatGPT app/App SDK rollout to mirror a repo, prefer multiple purpose-built remote apps/tool groups that match these profiles rather than one monolithic all-tools app.

## GPT-5.4+ MCP Operating Model
- Assume tool search and stronger multi-step tool planning are available, but still keep the active tool surface as small as the task allows.
- Separate deploy/registration truth from runtime exposure: maintain the full supported catalog, but expose only the tools needed for the current phase.
- Keep read/search/fetch tools separated from write/action tools where the platform supports approvals or per-step allow-lists.
- Keep tool descriptions concise, explicit, and non-overlapping so tool search can choose reliably.
- For ChatGPT apps, treat local CLI MCP registration and ChatGPT remote apps as different delivery targets with different trust and approval surfaces.

## MCP Routing by Language / File Type
- Bash and Zsh: use `bash-intel` first for function index, scope-aware references, source graphs, and call hierarchy. Use `ast-grep` for structural shell queries. Use `cclsp` when you already have a concrete file/symbol and need definition, hover, rename, references, or diagnostics.
- Python: use `jcodemunch` first for repo-wide symbol discovery, file outlines, and source retrieval. Use `cclsp` for definition/reference/rename/hover/diagnostics. Use `bash-intel` for Python call hierarchy. Use `ast-grep` for structural queries.
- TypeScript and JavaScript: use `jcodemunch` first for symbol discovery and source extraction. Use `ast-grep` for structural queries and batch search. Use `cclsp` only if a TS/JS language server is actually configured for the repo/runtime.
- JSON, YAML, and TOML: use `ast-grep` for structural matching and `rg` for plain text search.
- Markdown, plain text, CSV, and TSV: use `rg` first. Do not pay code-intel startup or indexing cost for docs/data-only work.
- HTML and CSS: use `ast-grep` or `rg` for source inspection. Use `playwright` only when the task actually needs rendered browser validation and the active profile exposes it.
