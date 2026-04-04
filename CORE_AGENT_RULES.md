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

## No Bandaids Policy (Mandatory)
- Do not introduce shortcuts, bandaids, temporary shims, silent fallbacks, compatibility layers, symlink hot-fixes, or "just for now" source-selection logic.
- Prefer a hard failure that exposes the defect over a soft success that hides it.
- If a task uncovers a structural problem, pause the surrounding work and fix that problem properly before continuing.
- Do not preserve legacy command flags, deprecated options, or compatibility aliases just to avoid updating callers. Update the callers and let stale usage fail clearly.
- Do not add a second source of truth for infrastructure-critical behavior. Ambiguity is a defect, not a resilience feature.
- If a touched area already contains a fallback or masking layer, remove it as part of the fix unless the user explicitly says not to.
- The only exception is an active production emergency where service restoration cannot wait. In that case:
  - make the minimum temporary change required to restore service,
  - record it explicitly in the implementation plan as a dedicated cleanup phase,
  - and do not mark the initiative complete until the temporary measure has been removed and replaced with the proper long-term fix.

## Anti-Ambiguity Rule (Mandatory)
- Never fix ambiguity by increasing acceptance. Fix it by removing ambiguity at the point of selection.
- When a defect is caused by ambiguous, non-canonical, inferred, aliased, mirrored, fallback, cached, legacy, or otherwise alternate inputs reaching a component, fix the layer that selected or permitted that input.
- Do not repair such defects by making downstream code accept more paths, more names, more flags, more env vars, more config keys, more source roots, or more input shapes.
- Any change that broadens accepted inputs is presumed incorrect unless the architecture explicitly defines those inputs as equally canonical.
- If a proposed fix uses normalization, auto-detection, alias support, path resolution, fallback search, compatibility behavior, or "accept either X or Y", stop and treat that as a likely policy violation.

## Acceptance-Surface Check (Mandatory)
- Before editing workflow-critical logic, determine whether the patch narrows accepted inputs, preserves accepted inputs, or broadens accepted inputs.
- If the patch broadens accepted inputs, the patch is forbidden by default.
- The correct fix is expected to live at the source-selection, caller, configuration, or data-definition layer unless the operator explicitly approves an architecture change.

## Canonicality Checklist (Mandatory)
- Before implementing a workflow-critical fix, explicitly identify:
  - the single canonical source/state/input,
  - the non-canonical or ambiguous source/state/input that was also being accepted,
  - the layer that allowed the ambiguity: caller, config, resolver, parser, or consumer,
  - and whether the patch narrows, preserves, or broadens acceptance.
- If the answer is "broadens", stop and re-plan.
- If the agent cannot state the canonical source and the ambiguity-permitting layer clearly, stop and ask instead of guessing.

## Negative Regression Requirement (Mandatory)
- For ambiguity bugs, add regression coverage that proves the canonical path works and the non-canonical or ambiguous path fails clearly.
- Do not add a regression that treats acceptance of the non-canonical path as success unless that path has been explicitly promoted to canonical architecture.
- Tests for ambiguity bugs should look for hidden fallback behavior, not celebrate it.

## Search Commands (Strict)

- Agents with built-in search tools (e.g., Claude Code's `Grep`, `Glob`) MUST use those instead of invoking `rg`/`grep`/`find` via shell. The built-in tools wrap `rg` internally and are preferred by the runtime.
- Agents without built-in search tools (e.g., Codex, Gemini) MUST use `rg` for text search and `rg --files` for file discovery.
- Do not use `grep` for searching unless `rg` is unavailable. If fallback is required, explicitly state why `rg` could not be used.
- `find` is allowed for filesystem traversal tasks that are not text search, only when no built-in equivalent exists.

## MCP-First Code Intelligence Policy

- For methods/functions/symbols/call hierarchy, use MCP tools first. Fall back to text search only if MCP errors or returns no results.
- Use `cclsp` for definition/reference/rename/hover and diagnostics.
- Use `bash-intel` for Bash/Python call hierarchy and scope-aware references.
- Use `ast-grep` for structural AST queries.
- Use text search (`rg` or agent built-in equivalent) for plain text search or as MCP fallback when MCP cannot answer.
- Agents with deferred/lazy MCP tool loading (e.g., Claude Code `ToolSearch`) MUST load MCP tools on demand for semantic operations — do not skip MCP to avoid the loading step.
- Keep the deployable MCP catalog and the active runtime tool surface separate: maintain the full supported catalog for reproducibility, but keep the active profile/tool subset as small as the current task allows.
- On platforms that support tool search, lazy loading, or per-step allow-lists, prefer broad discovery plus narrow activation. Do not default to a full active MCP surface for routine work just because the client can defer schema loading.
- When a platform supports approvals or read/write tool separation, keep sensitive write/action tools behind explicit approval or a narrower task-specific surface until trust is established.
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

## Post-Test Auto-Commit Policy (Mandatory)
- After any significant task that changes repository content, create a commit automatically once validation/testing succeeds.
- Significant changes include: code, scripts, config, JSON/YAML, workflow files, and documentation updates.
- Commit messages must be explicit and outcome-oriented, describing what changed and why.
- Commit only files directly related to the change just made.
- Do not include unrelated pre-existing modified/untracked files in the same commit.
- If multiple repos are changed, commit each repo independently after its checks pass.
- If validation/testing has not passed, do not auto-commit as complete; resolve failures or report blockers first.
- Operator override is allowed: if the user explicitly requests no commit or delayed commit, follow that instruction.

## Test Recovery Discipline (Mandatory)
- After a structured or run-tracked test command fails, do not restart the entire suite by default.
- First inspect the repo-native failure summary, triage output, or emitted recovery hints before choosing a rerun strategy.
- Prefer targeted recovery controls in this order when the repo provides them:
  1. Re-run from the first failing gate, phase, or stage.
  2. Resume the previous run while preserving prior PASS/SKIP work.
  3. Re-run only the previously failing tests or gates.
- Use a fresh full rerun only when scope changed materially, the prior run state/fingerprint is unsafe or unavailable, environment/lane changed, or the user explicitly asks for a clean rerun.

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
