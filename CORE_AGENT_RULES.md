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

## Agent Policy File Sync (Mandatory)
- Shared policy lives here. Runtime overlays (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`) and repo-local overlays (`AGENTS-REPO.md`) should reference this file instead of duplicating full shared rules.
- The client copies of `CORE_AGENT_RULES.md` and `AGENTS.md` are the canonical shared-policy source. The paired runbook and every validated external catalogue project's exact primary root are targets; the PiDNS catalogue row owns the source pair and is excluded from the external set. Check byte parity with `pidns-ai-guidance-sync policy --check`; stage the paired runbook with `policy --apply` from a PiDNS dev workspace, finish that workspace, then publish resumable external policy-only commits with `policy --publish` from clean published client source.
- `pidns-promote core-rules` is retired. Policy synchronization is a source-maintenance operation, not a release operation, and must never discover or auto-commit arbitrary repositories.
- When updating shared policy, check every top-level agent policy file in the same change and update either the canonical rule here or the affected overlay pointer/override.
- If an overlay intentionally differs by runtime or repo, state the reason in the commit message or nearby docs so future agents do not "fix" the difference by guessing.

## Dev Workspace Gate (Mandatory)
- Live release roots are not feature-work scratchpads:
  - `/Users/mark/bin`
  - `/Users/mark/PiDNS/runbook-src`
- If a task clearly requires PiDNS feature code, capability shards, deploy tooling, tests, workflow scripts, documentation edits, or unpublished deploy proof, move straight into a dev workspace. Do not spend a turn proving that the live-root gate will block.

```bash
pidns-dev-workspace list
pidns-dev-workspace create <name>
```

- If the workspace already exists, use `pidns-dev-workspace create --reuse <name>` or `pidns-dev-workspace attach <name>`.
- Use `pidns-dev-workspace preflight --mode feature --path "$PWD"` only when the current path or edit scope is ambiguous and you need the tool to classify it before editing.
- Once in a workspace, confirm state as needed:

```bash
pidns-dev-workspace status <name>
```

- Feature work, documentation edits, and unpublished deploy testing must happen under `/Users/mark/.pidns/dev/<name>/bin` and `/Users/mark/.pidns/dev/<name>/runbook-src`.
- `apply_patch` has no working-directory parameter. For dev workspace edits, patch headers must use absolute workspace paths such as `/Users/mark/.pidns/dev/<name>/bin/...` or `/Users/mark/.pidns/dev/<name>/runbook-src/...`; do not rely on shell `cwd` or relative filenames.
- After every `apply_patch` batch in workspace work, run `git -C /Users/mark/bin status --short` and `git -C /Users/mark/PiDNS/runbook-src status --short`. The live roots must remain clean unless Mark explicitly requested an operator-approved hotfix or release/promote housekeeping.
- If live roots changed accidentally, stop and revert only your own just-applied live-root edits after confirming there were no pre-existing user changes, then reapply with absolute workspace paths.
- If a live root is already dirty, do not add more changes there or use it as a fallback. Report the dirty state and resolve, finish, commit, remove, or ask about the existing work before continuing.
- Before creating another workspace, run `pidns-dev-workspace list`; normal `create` reports open managed workspaces and continues. Use `create --reuse <name>` or `attach <name>` when resuming existing work.
- Use `pidns-dev-workspace deploy` / `verify` for unpublished deploys. Do not fall back to normal `pidnsq cap deploy --apply` when a workspace deploy is blocked.
- When test/canary cannot prove a cap change, run `pidnsq cap proof-surface --cap <cap>` and use the named proof path first. If no unpublished proof path is adequate, finish and release the workspace, then deploy published source through the normal production lane. Do not make normal workspace deploy accept raw hosts, and do not bypass with lower-level `pidnsq`, `--incident-host-proof`, or `PIDNS_CAP_PROMOTE_VALIDATE=0`.
- Use `pidns-dev-workspace finish --apply --release --description "<description>"` from inside the workspace to run its own read-only preflight, hand tested commits back to live `main`, publish the result, and then remove the workspace. `finish --dry-run` is an optional preview, not a mandatory duplicate gate. Do not hand-roll long Git merge recipes. Use plain `finish --apply` only when intentionally batching a separate reviewed `pidns-promote release`.
- `pidns-promote release` publishes committed live `main`. It reports dirty/ahead dev workspaces as follow-up work, but isolated dev workspaces do not block the release queue.
- Direct edits in the live roots are allowed only for explicit operator-approved hotfixes or release/promote housekeeping. Docs-only edits are not a live-root exception. When in doubt, stop and ask; do not quietly continue on `main`.
- The live-root `pre-commit` hook enforces this by blocking unmarked live-root commits, including docs-only commits. If it blocks, move the work into a dev workspace; do not bypass it with `git commit --no-verify` unless Mark explicitly instructs an emergency override.

## Development Job Continuity (Optional)
- One ordinary operator prompt is sufficient. Never ask Mark to paste a generic control block, policy preamble, status dump, or preparatory command. Load canonical policy from the versioned files named above.
- `pidns-job` is an optional, small continuation note for long-running work, handoff, multiple sessions, campaigns, or work with several independently resumable steps. Short self-contained workspace work does not require one; a job may be started later if scope grows.
- Keep only the literal request, objective, non-goals, workspace and scope references, concise checklist, accepted decisions, blockers, current state, next action, relevant heads, and timestamps. Update it at milestones or handoff, not after every command or commit.
- A continuation note is never proof, mutation authority, release admission, measurement eligibility, or a workspace-lifecycle gate. Missing, stale, corrupt, or unwritable job state must be reported but cannot overturn valid Git, runner, merge, publication, or Health results.
- Commits remain local and fast. The post-commit hook performs no proof, network publication, or per-commit WIP push. Use explicit `pidns-job checkpoint` or `handoff` only when a normal job branch or Git bundle is useful for recovery.
- Checkpoint age is advisory. Elapsed time never invalidates source proof or blocks validation.
- Before continuing an explicit `DEVJOB-*` reference, run `pidns-job resume <id>` and use its literal request, objective, invariants, current state, and next action. Git and workspace truth remain recoverable even when the note is unavailable.
- Destructive workspace abandonment still requires verified recoverable Git or rescue-bundle state before deletion; continuation metadata is not the safety owner.

## No Bandaids Policy (Mandatory)
- Do not introduce shortcuts, bandaids, temporary shims, silent fallbacks, compatibility layers, symlink hot-fixes, or "just for now" source-selection logic.
- Prefer a hard failure that exposes the defect over a soft success that hides it.
- If a task uncovers a structural problem, classify it through the development-loop scope boundary below. Structural does not automatically mean current-scope, but it never permits a bandaid or hidden fallback.
- Do not preserve legacy command flags, deprecated options, or compatibility aliases just to avoid updating callers. Update the callers and let stale usage fail clearly.
- Do not add a second source of truth for infrastructure-critical behavior. Ambiguity is a defect, not a resilience feature.
- If a touched area already contains a fallback or masking layer, remove it as part of the fix unless the user explicitly says not to.
- The only exception is an active production emergency where service restoration cannot wait. In that case:
  - make the minimum temporary change required to restore service,
  - record it explicitly in the implementation plan as a dedicated cleanup phase,
  - and do not mark the initiative complete until the temporary measure has been removed and replaced with the proper long-term fix.

## Vendor Source Immutability (Mandatory)
- Do not patch, rewrite, monkeypatch, or hotfix vendor-managed source checkouts during deployment.
- If vendor code is wrong, either update upstream, pin or roll back the vendor version, or create an explicit maintained fork/package.
- Normal convergence must never mutate vendor source files. Documented generated install artifacts may be restored to their vendor `HEAD` state, but source files must fail if dirty.
- Any exception requires all of the following before implementation: named incident, expiry date, upstream issue or PR link, dedicated cleanup regression, and explicit operator approval.

## Anti-Ambiguity Rule (Mandatory)
- Never fix ambiguity by increasing acceptance. Fix it by removing ambiguity at the point of selection.
- When a defect is caused by ambiguous, non-canonical, inferred, aliased, mirrored, fallback, cached, legacy, or otherwise alternate inputs reaching a component, fix the layer that selected or permitted that input.
- Do not repair such defects by making downstream code accept more paths, more names, more flags, more env vars, more config keys, more source roots, or more input shapes.
- Any change that broadens accepted inputs is presumed incorrect unless the architecture explicitly defines those inputs as equally canonical.
- If a proposed fix uses normalization, auto-detection, alias support, path resolution, fallback search, compatibility behavior, or "accept either X or Y", stop and treat that as a likely policy violation.

## Source Root Ownership (Mandatory)
- In a dev workspace or test process, `PIDNS_BIN_DIR` is the exact client checkout and `PIDNS_RUNBOOK_BASE` is its exact paired runbook checkout. Workspace preparation and `pidns-test-run` own those bindings; child tests and commands must consume them without rediscovery, rewriting, sibling probing, or live-root fallback.
- Runner-only tests must require the canonical variables. Tests intentionally supported outside the runner must use the existing `tests/lib/pidns-test-workspace-context.sh`; do not add another resolver. Synthetic fixtures set only the canonical pair for source selection.
- `PIDNS_CLIENT_REPO` and `PIDNS_RUNBOOK_SRC` are release/restore destination inputs owned by the command that performs that operation. They must not become workspace or test source authority, appear in `workspace.env`, or be exported through a process tree. Pass release destinations to `pidns-promote` with `--client-repo` and `--runbook-src`.
- Workspace and runner boundaries must clear destination variables and legacy source aliases before binding the canonical pair. Do not add a new alias, fallback, environment variable, resolver, symlink, receipt, proof, schema, contract, or service to work around source-root ambiguity.

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
- For jcodemunch local repositories, first load/use `list_repos`. If the target local path or workspace is missing or stale, load/call `index_folder` with that local path. Use `index_repo` only for GitHub owner/repo strings or GitHub URLs; seeing `index_repo` first in deferred tool search is not evidence that local indexing is unsupported.
- Keep the deployable MCP catalog and the active runtime tool surface separate: maintain the full supported catalog for reproducibility, but keep the active profile/tool subset as small as the current task allows.
- On platforms that support tool search, lazy loading, or per-step allow-lists, prefer broad discovery plus narrow activation. Do not default to a full active MCP surface for routine work just because the client can defer schema loading.
- When a platform supports approvals or read/write tool separation, keep sensitive write/action tools behind explicit approval or a narrower task-specific surface until trust is established.
- Do not run MCP health/profile/status checks at thread start, after context compaction, or as routine preflight.
- If an actual MCP tool failure or registration symptom makes MCP health unclear, run `/Users/mark/bin/pidns-mcp-lsp-smoketest` before deeper MCP-dependent analysis.

## Service Access and Secrets Policy
- For any task requiring credentials, API tokens, usernames/passwords, or secret material, consult `/Users/mark/bin/documents/PIDNS-SERVICE-ACCESS.md` first.
- Treat `/Users/mark/bin/documents/PIDNS-SERVICE-ACCESS.md` as the canonical service-access registry for secret retrieval workflows.
- Use the documented retrieval commands from the registry (for example, `pidns-vault get ...`) instead of inventing lookup paths or hardcoding secrets.
- Do not store, echo, commit, or paste secret values into repo files, logs, or responses unless explicitly required by the operator for a secure handoff.
- If the registry has no entry for a required service, or retrieval fails, stop guessing and surface the gap clearly so the operator can update access metadata.

## Privileged Command Boundary (Mandatory)
- SSH and sudo use are non-interactive. Do not run plain `sudo`, `sudo -v`, `sudo -l`, or sudo probes that can invite a password prompt.
- Use `sudo -n` only when a repo doc, manifest row, console/Agent Ops command policy, or named helper lane already authorizes that exact command for the target host/user.
- Do not discover sudoers by trying root-owned helpers. A denied sudo attempt is a security signal and log noise, not harmless exploration.
- If a `sudo -n` command returns password-required, not-allowed, or NOPASSWD mismatch, stop after the first failure; record the host, user, and exact command, then fix/request the missing sudoers lane through source/manifest workflow.
- Prefer non-root evidence surfaces first: Loki, Prometheus, console/status APIs, and managed status commands. Use root helpers only through documented lanes.
- Privileged SSH dispatch must use `pidns-ssh --authority-ref <policy-entry> <user@host> --remote-argv /usr/bin/sudo -n <absolute-reviewed-command> [exact args...]`. The dispatcher must match inventory host/user, exact argv, non-interactive sudo shape, and the source-controlled policy entry before SSH. Native free-form privileged exceptions are not allowed.

## Complexity Budget and Simplify-First Decision (Mandatory)
- Complexity is a production risk equal to correctness and security risk, but an increase in complexity is not automatically forbidden.
- Before choosing an additive design, including a new feature, function, code/config path, service, timer, schema, receipt, framework, authority surface, or validation gate, apply this sequence within the affected boundary:
  1. Inventory existing behavior, configuration, and ownership, including duplicate and near-duplicate implementations.
  2. Remove duplication and simplify the existing design first where doing so preserves required behavior.
  3. Identify the residual problem that consolidation or simplification cannot solve.
  4. Add something only when it provides distinct, measurable value worth its operational, failure, maintenance, and validation cost.
  5. Record the direct before/after delta so the trade-off is visible; an increase is evidence to assess, not an automatic rejection.
- Prefer deletion, consolidation, or clean extension of the existing canonical owner. Do not create a parallel owner or source of truth merely because a separate component is easier to add.
- Do not manufacture deletions, combine unrelated responsibilities, or weaken required behavior merely to reduce counts.
- A user instruction to simplify, reduce scope, or stop architecture growth makes the sequence above mandatory and raises the burden of proof; it is not a blanket ban on justified additions.
- Record the before/after change in production lines of code, files, concepts, and runtime components, together with the residual problem and expected value, in the task conversation; do not create a metric ledger, receipt, or other enforcement artifact.
- If distinct value, non-duplication, or reasonable net benefit cannot be demonstrated, stop and re-plan. Explicit operator approval is still required when another policy or the task boundary requires it; an increase alone does not create that requirement.
- Repeated course correction means abandon or roll back an invalidated draft, not keep refining the same assumption.
- Non-causal or silent gates are defects in the proof system. Remove or repair them at that layer; do not use them to justify further application complexity.

## Development-Loop Scope and Publication Boundary (Mandatory)
- Use one common loop: request or audit -> choose scope, shape, and actual risk -> one managed workspace -> planner-selected runner proof on one clean terminal HEAD -> reversible commit(s) -> one compatible publication -> boundary-specific runtime/final audit where needed.
- The supported shapes are `single_boundary`, `multi_boundary`, and `campaign`. Campaign is grouping and scheduling over the common loop, not a separate controller. Child identity is retained; one waiting group does not block unrelated ready work.
- Authorization follows the operator's useful task scope, not component or finding count. A request to fix or remediate a named scope authorizes ordinary source edits, planner proof, causal commits, one compatible release, and final validation for that scope. Ask again only for material expansion, destructive action, lifecycle/identity change, data-loss risk, or a genuinely new exceptional privileged/high-risk boundary.
- Keep reversible causal commits even when changes share one compatible publication. Split publication only for a real incompatible deployment or safety boundary.
- Measurement is passive and non-blocking. A missing or corrupt metric, scorecard, ledger row, continuation note, or historical artifact means `not_measured`; it cannot change operational exit status.
- Every retained gate must be causal to a concrete failure at its owning boundary and emit an actionable diagnostic when it fails: workspace identity/cleanliness/ancestry, exact privileged argv, destructive or high-risk authority, terminal proof, release receipt, canary/runtime proof, or final audit. A silent gate or one selected by an unrelated change is a proof-system defect; remove or repair it instead of adding application complexity or policy exceptions.

## Suspendable Host Policy
- Some PiDNS servers are explicitly allowed to auto-suspend and may be asleep when an agent or command reaches for them.
- Do not abandon, misclassify, or work around an unreachable suspendable host as a generic SSH/network failure until `pidns-power` has been used.
- Before planned work against a known suspend+Wake-on-LAN host, run `pidns-power ensure-awake <host>`; for longer sessions use `pidns-power ensure-awake <host> --hold-minutes <minutes> --reason "<why>"` or `pidns-power auto-suspend-pause <host> --minutes <minutes> --reason "<why>"`.
- For SSH/SCP command paths, prefer `pidns-ssh` or tooling that uses it; it is inventory-gated and wakes only hosts explicitly marked suspend+WOL capable. Use `--wake` when the next operation should proactively wake before the first SSH attempt.
- Hosts without explicit `hosts.json` power metadata must not be WOL-poked or treated as managed sleep targets.

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

## Validation Workflow (Mandatory)
- The planner maps every changed path to a concrete risk boundary and selects one ordered, deduplicated command set. The runner executes that set and owns one PASS manifest bound to the exact clean terminal client HEAD and paired runbook HEAD.
- Run `pidns-test-run --explain --changed <path>` to inspect selection, `pidns-test-run --changed <path>` for focused feedback, and `pidns-test-run --terminal --changed <path>` only on the final clean committed heads. Use `--bucket <id>` only for one registered focused boundary.
- Do not copy planner commands into an ad hoc proof path or substitute a familiar runner. Raw `pytest` or `python -m pytest` is forbidden unless the planner selected that exact command.
- During iteration, rerun only boundaries whose source changed. On the final HEAD, run the complete selected terminal plan once; a new commit invalidates the manifest and requires the complete terminal plan again.
- Pre-push and finish reuse the same current manifest only when its repository identities, exact heads, boundaries, and commands cover their request. They do not copy, seal, upgrade, or re-adjudicate it.
- `pidns-test-quick --pre-commit`, `pidns-test-run --release-confidence`, `pidns-test-quick --full`, all-cap smoke, and all-cap baseline compare remain explicit broad diagnostics. They are not a second release authority.
- After failure, use the repo's first-failure, resume, only-failed, or from-gate recovery when valid. Start a fresh broad run only after relevant source/runtime scope changed or Mark explicitly requested it.
- A new or renamed path that is unclassified, a stale PASS accepted for a new head, or a missing recovery route is a validation-workflow defect. Fix it with a planner/runner regression and regenerate the test matrix in the same branch.

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
