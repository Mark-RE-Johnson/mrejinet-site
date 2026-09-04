# AGENTS.md instructions for this repository

## Core Baseline
- Apply `CORE_AGENT_RULES.md` first. It owns shared safety, dev workspace, privileged command, anti-ambiguity, MCP, and validation policy.
- Planner selection and the runner's exact-terminal-HEAD PASS manifest own development proof; this overlay must not invent a parallel proof sequence.
- This file is the Codex overlay for GPT-5.4+/ChatGPT-oriented MCP behavior.
- If `AGENTS-REPO.md` exists, read it after this file for repo-local routing, validation, and deployment notes.
- If guidance conflicts, `CORE_AGENT_RULES.md` wins, then this file, then `AGENTS-REPO.md`.
- When a prompt contains a `DEVJOB-*` reference, run `pidns-job resume <id>` before acting, read current canonical policy rather than requesting pasted instructions, and show the literal request, objective, current state, and next action. A continuation-note defect is advisory; Git/workspace truth remains recoverable.

## Overlay Scope
- Keep this shared Codex overlay consistent across repos; repo-specific facts belong in `AGENTS-REPO.md`.
- Keep repo-specific routing and deployment facts in `AGENTS-REPO.md`.
- Keep shared policy canonical in `CORE_AGENT_RULES.md`; do not copy whole shared sections here just to restate them.
- Prefer repo-native docs, scripts, CI config, and package/build metadata when repo-local docs point to them.

## Codex Project MCP Surface
- A trusted local project loads the versioned `.codex/config.toml` from its deliberate primary folder. Exact project servers and primary-folder identity belong in `AGENTS-REPO.md`.
- The project file owns only portable MCP enable/disable overrides. User-level Codex config remains the authority for commands, URLs, environment, credentials, and registrations.
- Reviewed local-project definitions keep app-owned `node_repl` enabled because the Browser and Chrome plugins require it. Computer Use remains a separate plugin surface and must not appear as a project `mcp_servers` override.
- Project config does not select named user profiles. ChatGPT Projects and secondary local-project folders do not discover this file.
- Global `pidns-mcp-toggle` profiles remain useful registration/deployment vocabulary for other agents, but global Codex profile switching is not reliable task routing and must not drive a handoff.
- A different Codex MCP set requires a reviewed project-local definition and a genuinely new trusted local task. Do not mutate a global profile and claim that a spawned task inherited it.
- Do not run MCP status checks at task start, after context compaction, or as routine preflight. Check observed tool availability only when it is material.

## Codex Plugin Loadout
- Keep ordinary Codex threads lean. Specialist plugins such as Cloudflare, iOS, Google workspace, Gmail, Sentry, Documents, Spreadsheets, Presentations, and Codex Security should stay disabled by default unless the task explicitly needs them.
- Plugin changes affect newly started tasks, not an already-loaded task. Do not combine plugin changes with an unverified MCP-profile handoff claim.

## GPT-5.4+ MCP Operating Model
- Assume tool search and stronger multi-step planning are available, but keep the active tool surface as small as the task allows.
- Separate deploy/registration truth from runtime exposure: maintain the full supported catalog, expose only what the current phase needs.
- Keep read/search/fetch tools separated from write/action tools where approvals or allow-lists are available.
- Keep tool descriptions concise, explicit, and non-overlapping so tool search can choose reliably.
- For ChatGPT apps, treat local CLI MCP registration and ChatGPT remote apps as different delivery targets with different trust and approval surfaces.

## Codex Native vs MCP
- Prefer native Codex capabilities when they clearly beat MCP: `exec_command` + `rg` for plain-text/file search, built-in `web` for broad web research, and shell `git` for normal repo-local Git work.
- Prefer MCP when the capability is semantic or domain-specific: `cclsp`, `bash-intel`, `ast-grep`, and `jcodemunch` for code intelligence; `playwright`, `sqlite`, `prometheus`, and `homeassistant-*` for specialized systems.
- Treat `fetch` as secondary to built-in `web` for broad internet research. Use `fetch` for deterministic single-URL retrieval or workflows that require that MCP server.
- Treat `context7` as higher priority than generic web search for package/framework API docs when the active profile exposes it.
- Treat `pidns-docs` as the preferred read-only MCP for cross-repo or allowlisted local documentation lookup. Use `rg` first for a known local repo/path.
- Prefer `jcodemunch` over `pidns-docs` `scope="all"` for indexed code/text search in repos with an existing jcodemunch index.
- For jcodemunch local repositories, start with `list_repos`; if the target local path is missing or stale, use `index_folder`. Use `index_repo` only for GitHub owner/repo strings or GitHub URLs.

## File-Type Routing
- Bash/Zsh: use `bash-intel` first for function index, source graph, call hierarchy, and scope-aware references; use exact-name/paginated index discovery and pass the selected absolute definition file/line when a function name has duplicates. Duplicate-name incoming calls are potential name-based callers because runtime source order cannot be resolved statically. Use `ast-grep` for structural shell queries; use `cclsp` for concrete definition/hover/diagnostics.
- Python: use `jcodemunch` first for repo-wide symbol discovery, outlines, and source retrieval; use `cclsp` for definition/reference/rename/hover/diagnostics; use `bash-intel` for call hierarchy.
- TypeScript/JavaScript: use `jcodemunch` first for symbol discovery/source extraction and `ast-grep` for structural queries; use `cclsp` only if a TS/JS language server is configured.
- JSON/YAML/TOML: use `ast-grep` for structural matching and `rg` for plain text.
- Markdown/plain text/CSV/TSV: use `rg` first for current-workspace docs/data; use `pidns-docs` only for cross-repo or allowlisted local lookup.
- HTML/CSS: use `ast-grep` or `rg` for source inspection; use browser automation only when rendered behavior matters.
