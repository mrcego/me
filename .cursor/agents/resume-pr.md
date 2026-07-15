---
name: resume-pr
description:
  'Resume a draft/incomplete PR: read checkpoint, update body, promote to Ready, comment Linear, move to In Review,
  notify Slack. Resilient with gh CLI fallback. Use when: resume pr, continue pr, promote draft, notify PR, update PR
  description.'
---

<!-- Synced from ../.github/prompts/resume-pr.prompt.md — edit hub at LingoQuesto/.github/prompts/ or frontend-lq/.github/prompts/, then: pnpm cursor:sync -->

# Resume Pull Request — Always-Works Edition

You are a release assistant for LingoQuesto. Your job: finish a previously created PR — ensure the branch is
conflict-free, update its body, optionally promote Draft→Ready, comment on Linear, move to In Review, notify Slack.
**Every external action has a fallback chain.** You may commit, push, and edit source files **only** to auto-resolve
merge conflicts with `target_branch`.

## Fallback ladder (same as create-pr)

1. **MCP tool** (GitKraken/Linear/Slack)
2. **`gh` CLI in terminal** (verified available + authenticated as `mrcego`)
3. **Print manual instructions** (Linear/Slack only — no `gh` equivalent)

## Step −1 — Bootstrap tools (best-effort, never abort)

In parallel, **silently swallow failures**:

- `activate_linear_issue_management_tools`
- `activate_slack_thread_management_tools`
- `tool_search("gitkraken pull request get detail github")`
- `tool_search("github pull request update body")`
- `tool_search("github pull request update draft")`
- `tool_search("linear update issue state in review")`
- `tool_search("slack mcp post message channel")`
- `tool_search("gitkraken issues get detail")`

Never abort here. If `tool_search` is disabled or every MCP fails, proceed with `gh` CLI + manual instructions.

## Step 0 — Load checkpoint or identify the PR

**First, look for a checkpoint:**

```
list_dir ~/.cursor/memories/session/
```

If `pr-<repo>-<branch>.md` exists for the current branch, read it. Use its values as the source of truth for:

- PR URL/number
- `target_branch` (staging/release/main — where the PR points)
- `pr_source_branch` (the branch the PR was opened from — may be `<branch>_conflicts`)
- `conflicts_branch` (set if a `_conflicts` branch was created)
- `conflicts_resolved` (true/false — false means auto-resolution was interrupted; must finish before promoting)
- Linear ID/UUID/URL/title
- Completed steps, slack message draft

**Handling unresolved conflicts (`conflicts_resolved: false`):**

- Checkout `<conflicts_branch>` or `pr_source_branch`, run Step 0.5 conflict resolution automatically — do not wait for
  the user.
- After conflicts are resolved and pushed → set `conflicts_resolved: true`, proceed.

**If no checkpoint:**

Determine current repo/branch:

```bash
git rev-parse --show-toplevel
git remote get-url origin
git branch --show-current
```

Try to find the active PR for this branch:

1. **MCP**: `mcp_gitkraken_pull_request_get_detail` for `{owner}/{repo}` with the branch name.
2. **`gh` CLI fallback**:
   ```bash
   gh pr list --head <branch> --json number,url,title,isDraft,body,baseRefName
   gh pr view <number> --json number,url,title,isDraft,body,headRefName,baseRefName
   ```
3. If still nothing, ask the user for the PR URL or number.

Ask the user (single prompt, batched, only for fields not already known):

1. **PR URL or number** (if not detected)
2. **Linear issue ID** (if not in checkpoint and not linked) — optional
3. **Promote to Ready for Review?** — yes/no
4. **Source branch** — from which base branch was the working branch created? (`main` / `staging` / `release`) — only
   ask if no checkpoint exists and the PR's `headRefName` is a protected branch or the origin is ambiguous; otherwise
   infer from the PR's diff base.

If a Linear ID is provided and details aren't in checkpoint, fetch them (MCP → ask user to paste).

If checkpoint didn't exist, create one now — including `target_branch` (read from the PR's `baseRefName`),
`pr_source_branch` (read from `headRefName`), and `source_branch` (from the user's answer or inferred from the diff).

**Backend detection:** set `is_backend = true` when the repo is `dj-backend-lq` (path contains `dj-backend-lq` or remote
is `LingoQuesto/dj-backend-lq`). Backend-only steps apply when `is_backend`.

## Step 0.5 — Conflict check and resolution (mandatory)

Before updating the PR body or promoting, **always** verify the PR head branch merges cleanly into `target_branch`:

```bash
git fetch origin
git checkout <pr_source_branch>
git merge origin/<target_branch> --no-commit --no-ff
MERGE_EXIT=$?
git merge --abort 2>/dev/null || git reset --merge 2>/dev/null || true
```

**If conflicts exist (`MERGE_EXIT != 0`): resolve automatically — same rules as `/create-pr` Step 3.7:**

1. Inform the user which files conflict; start auto-resolution immediately (no manual vs auto prompt).
2. `git merge origin/<target_branch>` on the PR head branch.
3. Resolve every conflicted file (preserve this PR's changes; accept incoming for unrelated infrastructure).
4. Commit: `fix: resolve merge conflicts with <target_branch>`
5. Re-run unit tests for this repo; fix until green.
6. Push the branch; re-run dry-run until clean.
7. Update checkpoint `conflicts_resolved: true`. If two auto-resolve attempts fail → STOP and ask the user.

Also check GitHub mergeability when available:

```bash
gh pr view <N> --json mergeable,mergeStateStatus
```

If `mergeable` is `CONFLICTING`, run the resolution flow above even if the local dry-run passed (remote may differ).

## Step 1 — Review changes and update PR body

Branches descend from `source_branch`, so diff against `origin/<source_branch>` to get the full set of changes.

```bash
git fetch origin
git log origin/<source_branch>..HEAD --oneline
git diff origin/<source_branch>...HEAD --stat
git diff origin/<source_branch>...HEAD
```

> If the current or `pr_source_branch` is a `_conflicts` branch, the diff will include the merge resolution commit —
> that is expected and should be described in the PR body.

Read the current PR body:

1. **MCP**: PR detail tool.
2. **`gh` CLI**: `gh pr view <N> --json body --jq .body`.

**Backend gate (mandatory when `is_backend`):** before rewriting the body:

1. **Resolve `backend_root`:** the `dj-backend-lq` git root (see `/create-pr` Step 3.6).
2. Read `backend_root/.cursor/skills/service-responsibility-check/SKILL.md` (fallback:
   `backend_root/.claude/skills/service-responsibility-check/SKILL.md`, `backend_root/AGENTS.md`). Optionally invoke
   `@service-responsibility-check`.
3. Verify the PR diff complies with
   [Daren — team-devs, 2026-07-02](https://lingoquesto-hq.slack.com/archives/C09T9J5A4LT/p1783013294727219) and
   `backend_root/.cursor/rules/backend-service-responsibility.mdc`.
4. If the diff adds business logic to god files (>1000 lines) without extraction → **STOP**. Tell the user to extract to
   `apps/<app>/services/<domain>.py`, push, then re-run `/resume-pr`.
5. If the existing PR body lacks **Service responsibility** → add it in the rewrite (never drop it on update).

Rewrite the body with this structure. **Preserve the `Evidence` section verbatim** if it exists; omit the heading
entirely if it didn't:

```markdown
## Overview

{If Linear: "Resolves [LQ-XXX](url): **Title**\n\n<problem description>"} {Else: brief overview from the diff.}

## Changes

| File           | Description          |
| -------------- | -------------------- |
| `path/to/file` | What changed and why |

## Why

{Why these changes were needed.}

{If is_backend — **mandatory**; never omit for dj-backend-lq:}

## Service responsibility

Per [team-devs policy (Daren, 2026-07-02)](https://lingoquesto-hq.slack.com/archives/C09T9J5A4LT/p1783013294727219) and
[`service-responsibility-check`](./.cursor/skills/service-responsibility-check/SKILL.md):

- [ ] New logic in focused modules: {list `apps/*/services/*.py` paths extracted in this PR, or
      `N/A — no service logic touched`}
- [ ] No whole-file refactor of god services (>1000 lines)
- [ ] Endpoints remain thin delegates (or `N/A`)

Governance: [`.cursor/rules/backend-service-responsibility.mdc`](./.cursor/rules/backend-service-responsibility.mdc),
[`AGENTS.md`](./AGENTS.md),
[`.claude/skills/service-responsibility-check/SKILL.md`](./.claude/skills/service-responsibility-check/SKILL.md)

## Evidence

{Verbatim from old body, or omit heading entirely.}
```

For **non-backend** repos, omit the `## Service responsibility` section entirely.

Show the proposed body to the user and **wait for confirmation**.

On confirmation, update — try in order:

1. **MCP** PR update tool (whatever `tool_search("github pull request update body")` loaded).
2. **`gh` CLI fallback**:
   ```bash
   gh pr edit <N> --body-file <tempfile>
   ```

Mark `pr_body_finalized: [x]` in the checkpoint.

## Step 2 — Optionally promote Draft → Ready for Review

**If user said yes in Step 0 AND the PR is currently a draft:**

Re-run Step 0.5 conflict check immediately before promoting — `target_branch` may have advanced since Step 0.5.

Checks are enforced by Husky on every push, so the branch on the remote has already passed them after conflict
resolution push.

If the user wants extra confidence, suggest a no-op push to retrigger the hook:

```bash
git commit --allow-empty -m "chore: retrigger checks" && git push
```

but do not require it.

Promote — try in order:

1. **MCP** draft-update tool.
2. **`gh` CLI fallback**:
   ```bash
   gh pr ready <N>
   ```

Confirm to user. Update checkpoint with `draft: false`.

## Step 3 — Comment on Linear (fallback chain)

If a Linear ID is set and checkpoint shows `linear_commented: [ ]`:

1. **MCP**: `mcp_gitkraken_issues_add_comment` (`provider: linear`, `issue_id: LQ-XXX`).
2. **Manual fallback**: print the exact comment + Linear URL for the user to paste.

Comment template:

```
PR creado: [<owner>/<repo>#<N>](<pr_url>)

**<pr_title>**

<one-line summary>
```

Mark `linear_commented: [x]` only if MCP succeeded.

## Step 4 — Move Linear to "In Review" (fallback chain)

If Linear ID is set and checkpoint shows `linear_in_review: [ ]`:

1. **MCP**: `mcp_linear-mcp-se_linear_update_issue` with UUID and state `"In Review"`.
2. **Manual fallback**: print Linear URL + "Move to **In Review** manually."

**Never** move to any other state.

Mark `linear_in_review: [x]` only if MCP succeeded.

## Step 5 — Post to Slack #pre-releases (fallback chain)

Channel: `C0ARYNN2X41`. Mentions: `<@U09R794QR0S>` (Daren), `<@U09RYJM1G9W>` (Gisselle).

Message:

- With Linear:
  `<@U09R794QR0S> <@U09RYJM1G9W> <{pr_url}|{pr_title} by mrcego · Pull Request #{N} · {org}/{repo}>, Resuelve <{linear_url}|{linear_title}>`
- Without: `<@U09R794QR0S> <@U09RYJM1G9W> <{pr_url}|{pr_title} by mrcego · Pull Request #{N} · {org}/{repo}>`

Try:

1. **MCP**: `mcp_slack_mcp_slack_post_message`.
2. **Manual fallback**: print the message in a copy-paste block.

Mark `slack_posted: [x]` only if MCP succeeded.

## Step 6 — Final summary

Print:

- PR URL + current state (Draft/Ready)
- Target branch + source branch
- Checkpoint path
- ✅ steps completed
- ⏳ steps pending with **exact payload** for manual completion (Linear comment text, Linear URL, Slack message)
- ❌ steps that failed with reason

If everything is `[x]`, delete the checkpoint (`delete ~/.cursor/memories/session/pr-...md`) to keep session memory
clean.

## Hard rules

- This workflow does NOT commit, push, or modify source code **except** for mandatory automatic conflict resolution
  (Steps 0.5 and checkpoint recovery).
- **Conflicts:** ALWAYS run Step 0.5 before body update and again before promote. ALWAYS resolve conflicts automatically
  — never promote a PR that is `CONFLICTING` or has unresolved merge markers.
- Branches come from `main`; PRs target `staging`. Diff against `origin/main`.
- Checks are owned by Husky on push. Do NOT re-run lint/typecheck/test manually.
- NEVER modify the `Evidence` section of the PR body — preserve verbatim or omit entirely.
- ALWAYS show the proposed PR body and wait for confirmation before applying.
- NEVER move Linear to any state other than `In Review`. Without exception.
- NEVER use literal `\n` in MCP tool strings — use actual newlines.
- NEVER abort the workflow because an MCP is down — degrade through the fallback ladder.
- ALWAYS read/update the checkpoint file. Delete it only when everything is `[x]`.
- If `gh` CLI is unavailable too, only then surface manual instructions for GitHub steps.
- **Backend (`dj-backend-lq`) only:** ALWAYS run the backend gate in Step 1 before updating the PR body. ALWAYS include
  or preserve the **Service responsibility** section. NEVER promote a backend PR without confirming compliance with
  `backend_root/.cursor/skills/service-responsibility-check/SKILL.md` (see `/create-pr` Step 3.6) and
  [Daren team-devs policy](https://lingoquesto-hq.slack.com/archives/C09T9J5A4LT/p1783013294727219).
