# CORE_AGENT_RULES.md

## Baseline Scope
- Read this mandatory baseline before the runtime overlay (`AGENTS.md`, `CLAUDE.md`, or `GEMINI.md`). Overlays may specialize it but must not weaken it; CORE wins conflicts.
- PiDNS `documents/...` references below belong to the task's bound PiDNS client checkout when doing PiDNS workspace work. From another project, read them in published `/Users/mark/bin/documents/`, not that project's directory. Choose by task ownership, never file-existence probing; this does not change code/test source-root authority.
- Keep each rule at its canonical owner. Before guidance changes, read `documents/PIDNS-AGENT-ARCHITECTURE.md`, **Persona and Instruction Layering**, in the client repo. Use the relevant runtime chapters only for runtime changes.
- Follow explicit task/action reading triggers in repo guidance. Read the relevant sections, not every linked manual. A required source that is missing or inconclusive blocks the dependent action; it does not make the rule optional.

## Simplicity and Deletion First (Mandatory)
- Solve the requested problem with the smallest coherent change at its canonical owner. Complexity is a production risk alongside correctness and security. Default to deleting, consolidating or correcting existing behavior; an incident is not permission to add machinery.
- Before adding a feature, function, config path, gate, receipt, state owner, hook, wrapper, schema, resolver, service, timer or repeated check, identify the concrete unmet need or failure, why existing behavior or valid evidence cannot satisfy it, its exact triggering inputs, and its operational, failure, maintenance and validation cost. Generic caution, hypothetical future reuse and "it is in the existing owner" do not establish value. If distinct value and net benefit are unproven, remove the proposed addition and re-plan.
- Fix defects at their source. Do not compensate for a broken caller, producer, selector or proof owner with downstream tolerance, duplicate verification or another orchestration layer. Delete superseded behavior and touched workarounds in the same scoped change; do not retain permanent parallel paths.
- A local change must not acquire unrelated repository changes, generation, proof, host wake, synchronization, deployment or convergence merely because a wrapper currently invokes them. Select necessary work from actual changed inputs at its owning boundary. Repair coupling through that owner; never bypass required authority or fail-closed checks. Unrelated workflow defects stay visible follow-up work unless repair is within the authorized scope.
- Assess the complete operator-visible command, including transitive hooks, retries, lock waits, recovery and mandatory side effects. A locally "safer" step is not justified when its aggregate cost and failure surface outweigh its concrete protection. Do not claim a speed improvement by excluding re-entry or moving required work after reported completion.
- When Mark says simplify, reduce scope or stop architecture growth, treat it as a binding design constraint. Abandon or roll back an invalidated additive draft. Renamed machinery, deferred mandatory work and cosmetic line reductions do not satisfy it. Necessary additions still need the concrete case above; follow existing authority boundaries without inventing another approval gate.
- Do not manufacture deletions, combine unrelated responsibilities or weaken required behavior to reduce counts. Review actual concepts, owners and runtime work. Report useful before/after evidence and any necessary growth concisely; ordinary preserving fixes need no separate complexity report, numerical inventory or review artifact.

## Agent Policy File Sync (Mandatory)
- Client `CORE_AGENT_RULES.md` and `AGENTS.md` are canonical; overlays reference them instead of copying shared rules. Check every top-level runtime overlay when changing policy and explain intentional differences.
- From the paired PiDNS workspace, stage runbook policy with `pidns-ai-guidance-sync policy --apply`. After finishing, use `policy --publish` from clean published client source for every validated external catalogue project's exact primary root; use `policy --check` for byte parity. The PiDNS catalogue row owns the source pair and is excluded from external targets.
- This is source maintenance, not release-owned policy distribution. `pidns-promote core-rules` is retired; never discover or auto-commit arbitrary repositories. Procedure: the guidance architecture section named above.

## Dev Workspace Gate (Mandatory)
- `/Users/mark/bin` and `/Users/mark/PiDNS/runbook-src` are live release roots, not scratchpads. PiDNS feature code, capability shards, deployment tooling, tests, workflow scripts, documentation and unpublished proof belong in `/Users/mark/.pidns/dev/<name>/bin` and its paired `runbook-src`.
- Before that work, read `documents/PIDNS-DEV-WORKSPACE-WORKFLOW.md` in the client repo. Run `pidns-dev-workspace list`, then create, reuse (`create --reuse <name>`) or attach the workspace. Do not first prove the live-root guard blocks. Use `preflight --mode feature --path` only for ambiguous scope/path; use `status` when state needs checking.
- `apply_patch` has no cwd parameter: use absolute workspace patch paths. After each patch batch, check `git -C /Users/mark/bin status --short` and `git -C /Users/mark/PiDNS/runbook-src status --short`. If an accidental live edit occurred, stop, distinguish pre-existing changes, revert only your own new edit and reapply in the workspace. Do not add work to dirty live roots or use them as fallback; resolve or ask about the existing state.
- Unpublished deployment uses `pidns-dev-workspace deploy` / `verify`. If test/canary is insufficient, run `pidnsq cap proof-surface --cap <cap>` and use its named proof path. If none is adequate, finish/release first and deploy published source through the normal production lane. Never bypass the workspace guard with normal `pidnsq cap deploy --apply`, raw hosts, lower-level `pidnsq`, `--incident-host-proof`, or `PIDNS_CAP_PROMOTE_VALIDATE=0`.
- Close ready work through `pidns-dev-workspace finish --apply --release --description "<description>"` inside the workspace; it owns preflight, tested-head handback, publication and removal. Dry-run is optional, not a duplicate mandatory gate. Do not hand-roll merge recipes. Plain `finish --apply` is only for intentionally batching a separate reviewed `pidns-promote release`.
- Normal create reports existing workspaces; inspect/reuse the relevant one instead of hiding unfinished work. Dirty/ahead isolated workspaces remain visible follow-up work, but do not block release of committed live `main`.
- Direct live-root edits require an explicit operator-approved hotfix or release/promote housekeeping; docs have no exception. If authority is unclear, stop and ask. A live-root pre-commit rejection means move into a workspace; `git commit --no-verify` requires Mark's explicit emergency override.

## Development Job Continuity (Optional)
- One ordinary prompt is enough; never request pasted policy, status dumps or generic control blocks. `pidns-job` is optional for long-running work, handoffs, campaigns or independently resumable steps, and may also be introduced later if scope grows.
- Keep its note to the literal request, objective/non-goals, workspace/scope, concise checklist, decisions, blockers, current/next action, heads and timestamps. Update at milestones or handoff, not per command/commit.
- A continuation note is never proof, mutation/release authority, measurement eligibility or a lifecycle gate. Report missing/stale/corrupt/unwritable notes without overruling valid Git, runner, publication or Health evidence. Age never invalidates source proof.
- Before acting on an explicit `DEVJOB-*`, run `pidns-job resume <id>` and use its request, objective, invariants, state and next action; Git/workspace truth remains recoverable if the note is defective.
- Commits stay local and fast; post-commit performs no proof, publication or WIP push. Use explicit checkpoint/handoff only for useful recovery. Destructive abandonment still requires verified recoverable Git or rescue-bundle state, not a continuation note.

## No Bandaids Policy (Mandatory)
- Do not add temporary shims, silent fallbacks, compatibility layers, symlink hot-fixes or provisional source selectors. Expose defects instead of hiding them; keep one source of truth for infrastructure-critical behavior.
- Update callers rather than preserving deprecated flags/options/aliases. Remove touched masking/fallback behavior unless the user says otherwise. Structural findings follow the development-loop scope boundary; structural does not automatically mean in scope.
- The sole exception is an active production emergency that cannot wait: make the minimum restoration change, record a dedicated cleanup phase and do not claim completion until the temporary measure is replaced by the proper fix.

## Vendor Source Immutability (Mandatory)
- Do not patch, rewrite, monkeypatch, or hotfix vendor-managed source checkouts during deployment.
- If vendor code is wrong, either update upstream, pin or roll back the vendor version, or create an explicit maintained fork/package.
- Normal convergence must never mutate vendor source files. Documented generated install artifacts may be restored to their vendor `HEAD` state, but source files must fail if dirty.
- Any exception requires all of the following before implementation: named incident, expiry date, upstream issue or PR link, dedicated cleanup regression, and explicit operator approval.

## Anti-Ambiguity Rule (Mandatory)
- Fix ambiguity where the selector/caller/configuration/data admitted it, not by increasing downstream acceptance. Do not accept additional paths, names, flags, environment variables, keys, roots or shapes unless the architecture explicitly makes them equally canonical.
- Normalization, auto-detection, aliases, path resolution, fallback search, compatibility or "accept either" fixes are presumed violations: stop and re-plan.

## Source Root Ownership (Mandatory)
- In a dev workspace or test process, `PIDNS_BIN_DIR` is the exact client checkout and `PIDNS_RUNBOOK_BASE` is its exact paired runbook checkout. Workspace preparation and `pidns-test-run` own those bindings; child tests and commands must consume them without rediscovery, rewriting, sibling probing, or live-root fallback.
- Runner-only tests must require the canonical variables. Tests intentionally supported outside the runner must use the existing `tests/lib/pidns-test-workspace-context.sh`; do not add another resolver. Synthetic fixtures set only the canonical pair for source selection.
- `PIDNS_CLIENT_REPO` and `PIDNS_RUNBOOK_SRC` are release/restore destination inputs owned by the command that performs that operation. They must not become workspace or test source authority, appear in `workspace.env`, or be exported through a process tree. Pass release destinations to `pidns-promote` with `--client-repo` and `--runbook-src`.
- Workspace and runner boundaries must clear destination variables and legacy source aliases before binding the canonical pair. Do not add a new alias, fallback, environment variable, resolver, symlink, receipt, proof, schema, contract, or service to work around source-root ambiguity.

## Acceptance-Surface Check (Mandatory)
- Before workflow-critical edits, classify acceptance as narrowing, preserving or broadening. Broadening is forbidden by default and requires explicit operator approval of the architecture change; fix source selection/callers/configuration/data instead.

## Canonicality Checklist (Mandatory)
- State the single canonical input/state, the ambiguous alternative, the admitting layer (caller/config/resolver/parser/consumer), and the acceptance classification. If it broadens, stop and re-plan; if ownership or ambiguity is unclear, stop and ask.

## Negative Regression Requirement (Mandatory)
- For ambiguity bugs, prove the canonical path succeeds and the ambiguous/non-canonical path fails. Test for hidden fallbacks; never turn their acceptance into the expected result without explicit promotion to canonical architecture.

## Search Commands (Strict)
- Use native file/text search when available (Claude `Grep`/`Glob`); otherwise use `rg` and `rg --files` (Codex/Gemini). Use `grep` only if `rg` is unavailable and disclose the fallback. Use `find` only for non-text traversal without a native equivalent.

## MCP-First Code Intelligence Policy
- Use MCP first for semantic symbol/definition/reference/call-hierarchy work; fall back to text search only on error or no useful result. Use text search directly for plain text.
- `cclsp` owns definition/reference/rename/hover/diagnostics, `bash-intel` Bash/Python hierarchy and scoped references, and `ast-grep` structural queries. Runtime overlays select the language-specific route.
- Load deferred tools on demand; do not skip required semantic tools to avoid discovery. For local jcodemunch, start with `list_repos`, then `index_folder` for a missing/stale exact local path. `index_repo` is for GitHub names/URLs only; a discovery result showing only that tool is a search miss, not missing local support.
- Keep the deployable catalog complete and active tools narrow. Use discovery/allow-lists and read/write separation where supported; broad discovery does not justify full routine activation. Keep sensitive actions behind the applicable approval or task-specific surface.
- Do not run MCP health/profile/status checks at task start, after compaction or as routine preflight. An actual tool/registration failure justifies `/Users/mark/bin/pidns-mcp-lsp-smoketest` before deeper MCP-dependent analysis.

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
- Automatically commit significant related code, config, scripts, workflow or documentation changes after their validation succeeds, using outcome-oriented messages. Commit each changed repo independently, only task-owned files; preserve pre-existing work. If checks fail, resolve/report rather than committing as complete. Respect an explicit no-commit or delayed-commit request.

## Test Recovery Discipline (Mandatory)
- After a structured/run-tracked failure, inspect native summaries/triage first. Prefer the valid first-failing gate, resume, only-failed or from-gate path and preserve prior PASS/SKIP work. A fresh full run needs materially changed scope, unsafe source/runtime fingerprint, a changed environment/lane or an explicit user request; never restart the suite by default.

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
- Ground material factual/operational claims in trusted docs, commands or APIs and cite the evidence. If evidence is absent, stale, conflicting or inconclusive, retrieve it or state uncertainty; do not invent an answer.
- Use precise task constraints. Reason internally for non-trivial work; for high-impact conclusions, draft, check the material claims against sources, then revise or downgrade confidence. Use grounding/consistency checks where available.
- Where the model supports those controls, use low temperature (0.0–0.3) for factual tasks. Where tooling supports meaningful confidence scores, use 0–10; below 7 or with weak evidence, flag for review or say you do not know.
- For high-impact work, use one bounded generator + skeptic review before delivery. Include the simplicity decision when adding a mechanism, materially changing authority or workflow, or when Mark requests simplification. Review the proposed artifact and necessary evidence; identify a concrete defect or conclude the review. Do not duplicate the investigation, require ceremonial counting, create a separate complexity-review gate, or reopen unchanged accepted decisions. Re-review only materially changed decisions or unresolved findings. Complete required review before delivery or explicitly state residual risks.
- Reuse unchanged source evidence and valid proof, but refresh live state when stale or before consequential action. Missing context after compaction can require a targeted reread; neither elapsed time nor compaction alone justifies repeating the full investigation.
- Budget pressure never authorizes skipped safeguards or proof. Account for coordinator, reviewer, retries and reporting in an agreed budget; reserve room for completion and surface an insufficient remainder before more discretionary work. If required work cannot fit, report it incomplete. Measurements remain passive under the development-loop policy.
