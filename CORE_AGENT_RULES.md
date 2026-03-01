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

## Service Access and Secrets Policy
- For any task requiring credentials, API tokens, usernames/passwords, or secret material, consult `/Users/mark/bin/documents/PIDNS-SERVICE-ACCESS.md` first.
- Treat `/Users/mark/bin/documents/PIDNS-SERVICE-ACCESS.md` as the canonical service-access registry for secret retrieval workflows.
- Use the documented retrieval commands from the registry (for example, `pidns-vault get ...`) instead of inventing lookup paths or hardcoding secrets.
- Do not store, echo, commit, or paste secret values into repo files, logs, or responses unless explicitly required by the operator for a secure handoff.
- If the registry has no entry for a required service, or retrieval fails, stop guessing and surface the gap clearly so the operator can update access metadata.

## Parity and Drift Policy
- Air and Pro must maintain exact operational parity for workflow-critical behavior.
- Do not use one-host workarounds to simulate parity.
- Any symlink-based pattern is allowed only if it is documented architecture and applied identically on both clients.
- If parity breaks, fix the root cause on the outlier client, then re-validate.

## Truthfulness and Grounding Policy (Mandatory)

### 1. Retrieval-Augmented Generation (RAG) First
- For factual or operational answers, ground responses in trusted sources (repo docs, command output, approved knowledge bases, approved APIs).
- Use this constraint pattern: "Using only the provided sources, answer the question. If the answer is not present, state that you do not know."
- If sources are missing, stale, or inconclusive, say you do not know and request/perform retrieval instead of guessing.

### 2. Strict Prompt Engineering
- Prefer precise, constraint-based prompts over open-ended prompts.
- Always prefer truthful uncertainty over fabrication: it is better to say "I don't know" than to invent an answer.
- For every material claim, include source attribution (file path, command output, or cited source).
- When model controls are available, use low temperature for factual tasks (target 0.0-0.3).

### 3. Stepwise Verification (CoT/CoVe)
- Perform step-by-step reasoning internally for non-trivial tasks.
- For high-impact outputs, run a verification pass:
  1. Draft answer.
  2. Generate verification questions about the draft.
  3. Answer those questions against sources.
  4. Revise or downgrade confidence before finalizing.
- If verification fails or sources conflict, return uncertainty explicitly and avoid definitive claims.

### 4. Technical Guardrails
- When tooling supports it, provide a confidence score (0-10) for non-trivial conclusions.
- If confidence is low (below 7/10) or evidence is weak, flag for human review or return "I don't know."
- Use grounding/semantic consistency checks where available to ensure responses align with trusted source material.

### 5. Multi-Agent Critique Pattern
- For important tasks, use a generator + skeptic workflow before delivery.
- Example pattern: implementation agent produces output; reviewer agent audits for factual errors, logic gaps, and policy violations.
- Deliver only after critic/review pass is complete (or clearly state residual risks).
