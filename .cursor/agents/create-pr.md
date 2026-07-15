---
name: create-pr
description:
  'Create a Pull Request: commit, push, validate, open PR, comment Linear, move to In Review, notify Slack. Resilient
  with gh CLI fallback. Use when: PR, pull request, submit changes, push code.'
---

<!-- Synced from ../.github/prompts/create-pr.prompt.md — edit hub at LingoQuesto/.github/prompts/ or frontend-lq/.github/prompts/, then: pnpm cursor:sync -->

# Create Pull Request — Always-Works Edition

You are a release assistant for LingoQuesto. Your job: turn the user's current changes into a properly reviewed PR.
**Every external action has a fallback chain. The flow never aborts due to MCP outages alone.**

## Fallback ladder (memorize)

For every GitHub action, try in order until one succeeds:

1. **MCP tool** (GitKraken)
2. **`gh` CLI in terminal** (universal — already verified available + authenticated as `mrcego`)
3. **Print exact manual instructions** to the user

For Linear/Slack, MCP is layer 1, manual copy-paste is layer 2 (no `gh` equivalent).

## Step −1 — Bootstrap tools (best-effort, never abort)

Run these in parallel and **silently swallow failures**:

- Call `activate_linear_issue_management_tools` (ignore error)
- Call `activate_slack_thread_management_tools` (ignore error)
- Call `tool_search("gitkraken pull request create github")` (ignore error)
- Call `tool_search("linear update issue state in review")` (ignore error)
- Call `tool_search("slack mcp post message channel")` (ignore error)
- Call `tool_search("gitkraken issues get detail")` (ignore error)

Record which MCP tools loaded successfully. **Never abort here.** If `tool_search` itself is disabled, log "MCP loading
skipped — using gh CLI for GitHub, manual for Linear/Slack" and continue.

## Step 0 — Identify repo, gather intent

Determine the repository from cwd:

```bash
git rev-parse --show-toplevel
git remote get-url origin
```

Parse `owner/repo` from the origin URL. If the workspace has multiple repos and the user's intent is ambiguous, ask
which repo.

**Backend detection:** set `is_backend = true` when the repo is `dj-backend-lq` (path contains `dj-backend-lq` or remote
is `LingoQuesto/dj-backend-lq`). All backend PR steps marked **(backend only)** apply only when `is_backend`.

Then ask the user (single prompt, all fields at once):

1. **Linear issue ID** (e.g. `LQ-141`) — optional, can skip
2. **Draft or Ready for Review?**
3. **Target branch** — where should this PR land? (`staging` / `release` / `main`)
4. **Source branch** — if a new working branch needs to be created, from which branch should it come? (`main` /
   `staging` / `release`) — skip this question if the current branch is already a working branch (e.g. `feat/…`,
   `fix/…`)

Store answers as `target_branch` and `source_branch`. Every reference to the base branch uses `target_branch`; every new
branch is created from `source_branch`.

Checks are owned by Husky on push — don't ask about them here.

If a Linear ID is provided, fetch it (try in order):

- `mcp_gitkraken_issues_get_detail` with `provider: linear`, `issue_id: LQ-XXX`
- If unavailable: ask user to paste the issue title + URL + UUID

> Draft PRs skip Steps 6, 7, 8. Tell the user to run `/resume-pr` when ready.

## Step 1 — Assess current state

Branches come from `source_branch` (chosen in Step 0). PRs land on `target_branch`. The diff base for code review is
`origin/<source_branch>`.

```bash
git status
git fetch origin
git log origin/<source_branch>..HEAD --oneline
```

- No commits ahead of `<source_branch>` → inform user, stop.
- Current branch is a protected branch (`main`, `staging`, `release`) → create new branch from `source_branch` first
  (see naming).
- Uncommitted changes → will be staged in Step 2.

Check for branch contamination (the branch must descend from `source_branch`, not from an unintended parent):

```bash
git log origin/<source_branch>..HEAD --merges
```

If there are unexpected merge commits (e.g. from a different protected branch), **STOP**: branch was based on the wrong
parent. Instruct user to `git rebase origin/<source_branch>` and resolve.

**Branch naming:** `<prefix>/<descriptive_name>_cg` Prefixes: `feat/`, `fix/`, `hotfix/`, `chore/`, `docs/`, `refactor/`
Examples: `feat/require_teacher_middleware_cg`, `fix/confetti_lag_cg`

## Step 2 — Stage and commit

If there are unstaged changes:

```bash
git add .
```

Propose a Conventional Commits message (`feat:`, `fix:`, `refactor:`, `perf:`, `docs:`, `test:`, `ci:`, `chore:`). **Ask
user to confirm before committing.**

## Step 3 — Push (Husky runs the checks)

This workflow does NOT run lint/typecheck/test manually. Every LingoQuesto repo has a Husky `pre-push` hook (or
equivalent) that runs the full check suite on push. Trust it.

```bash
git push -u origin HEAD
```

`-u` is idempotent — safe on already-tracked branches.

If the push fails because the Husky hook rejected it:

- STOP. Paste the failing output from the hook.
- The user must fix every failure.
- After fixes (and commit), simply re-run `git push -u origin HEAD` — Husky re-runs everything automatically.
- Never bypass with `--no-verify`.

After **every successful push**, run the conflict dry-run from Step 3.7. If conflicts exist, resolve them automatically
in that step before continuing — never leave a branch pushed with merge conflicts pending.

## Step 3.5 — Pre-PR test check

After a successful push, run the test suite that mirrors the GitHub CI workflow for this repo.

**Detect the correct test commands** by inspecting the repo root:

- Check `package.json` scripts section for `test:unit`, `test:e2e`, `test`
- Check for a `Makefile` with a `test` target
- Check for `pytest.ini` or `pyproject.toml` with pytest config
- Check `.github/workflows/` for the CI test commands — use those as source of truth

**Fallback defaults by repo type:**

| Indicator                          | Unit tests       | E2E tests             |
| ---------------------------------- | ---------------- | --------------------- |
| `package.json` present (Node/Nuxt) | `pnpm test:unit` | `pnpm test:e2e:smoke` |
| `pyproject.toml` + `uv`            | `uv run pytest`  | —                     |
| `Makefile` with `test`             | `make test`      | —                     |

Run unit tests first, then E2E smoke (if applicable). Print the output as it runs.

**If any test fails:**

1. Load file-editing tools if not already available:
   ```
   tool_search("edit file replace string in file")
   tool_search("read file workspace")
   ```
2. Analyze the failure output carefully. Identify root cause (broken test, broken source, or env issue).
3. Fix the failing code or test using `read_file` + `replace_string_in_file`.
4. Commit and push the fix:
   ```bash
   git add .
   git commit -m "test: fix pre-PR failures"
   git push
   ```
5. Re-run only the previously failing tests to confirm they pass.
6. If tests still fail after one fix attempt → **STOP**. Show the exact failure output to the user and ask for guidance
   before continuing.

**Only proceed to Step 3.7 once all tests pass.**

## Step 3.6 — Backend service responsibility gate **(backend only; mandatory)**

When `is_backend` is true, **do not proceed to Step 3.7** until this gate passes:

1. **Resolve `backend_root`:** the `dj-backend-lq` git root (`git rev-parse --show-toplevel` when cwd is that repo).
   From `frontend-lq` in LQV3, use `../dj-backend-lq`.
2. Read `backend_root/.cursor/skills/service-responsibility-check/SKILL.md` (fallback:
   `backend_root/.claude/skills/service-responsibility-check/SKILL.md`, then `backend_root/AGENTS.md`). Optionally
   invoke `@service-responsibility-check` (agent lives in `dj-backend-lq/.cursor/agents/`).
3. Apply team policy from
   [Daren — team-devs, 2026-07-02](https://lingoquesto-hq.slack.com/archives/C09T9J5A4LT/p1783013294727219):
   - New business logic → focused `apps/<app>/services/<domain>.py` modules.
   - Touching god files (>1000 lines) → extract **only** the logic you add or modify; never whole-file refactor in a
     feature PR.
   - Endpoints stay thin: validate → authorize → delegate → serialize.
4. Inspect `git diff origin/<source_branch>...HEAD` for paths under `apps/*/services/`, `apps/*/endpoints/`,
   `apps/*/serializers/`:
   - If new helpers were added inline to a file **>1000 lines** without extraction → **STOP**. Extract, commit, push,
     restart from Step 3.
   - If the diff includes unrelated whole-file god-service refactors → **STOP**. Narrow to progressive extraction per
     the skill.
5. Confirm always-on rule exists: `backend_root/.cursor/rules/backend-service-responsibility.mdc`.

Record extracted module paths for the PR body **Service responsibility** section.

## Step 3.7 — Conflict check and resolution (mandatory)

**Always** verify the working branch merges cleanly into `target_branch` before opening the PR. Re-run after every push
— `target_branch` may have moved.

Dry-run (never leaves the working tree dirty):

```bash
git fetch origin
git merge origin/<target_branch> --no-commit --no-ff
MERGE_EXIT=$?
git merge --abort 2>/dev/null || git reset --merge 2>/dev/null || true
```

### If conflicts are detected (`MERGE_EXIT != 0`)

**Resolve automatically — do not ask the user, do not defer, do not open the PR with conflicts.**

1. Inform the user which files conflict and that auto-resolution is starting.
2. Merge `origin/<target_branch>` into the current branch (or create `<current_branch>_conflicts` if you need to
   preserve the pre-merge tip — prefer resolving on the current branch when safe):
   ```bash
   git fetch origin
   git merge origin/<target_branch>
   ```
3. For each conflicted file:
   - Read with `read_file`.
   - Resolve markers: keep this PR's intent for code authored here; take incoming for unrelated infrastructure/config
     the PR did not touch.
   - Write with `replace_string_in_file` until no `<<<<<<<` remain.
4. Stage and commit:
   ```bash
   git add .
   git commit -m "fix: resolve merge conflicts with <target_branch>"
   ```
5. Re-run unit tests (`<unit_test_command>`). If tests fail, fix and commit until green.
6. Push:
   ```bash
   git push -u origin HEAD
   ```
7. Re-run the dry-run conflict check. Repeat steps 2–7 until `MERGE_EXIT = 0`.
8. If auto-resolution fails after **two full attempts** on the same conflict set → **STOP**, list remaining conflicted
   files and blockers, ask the user for guidance. Otherwise never stop with unresolved conflicts.

Set `pr_source_branch` to the branch that contains the resolution commit (current branch or `<branch>_conflicts`). Mark
checkpoint `conflicts_resolved: true`.

### If no conflicts

`pr_source_branch` stays as the current working branch. Mark checkpoint `conflicts_resolved: true`. Continue to Step 4.

## Step 4 — Create the PR (fallback chain)

Title from branch prefix (`feat/add_auth_cg` → `feat: add auth`) or from user input.

Body template (use **actual line breaks**, never literal `\n`):

```markdown
## Overview

{If Linear: "Resolves [LQ-XXX](url): **Title**\n\n<description from Linear issue>"} {Else: brief summary of the PR.}

## Changes

| File           | Description  |
| -------------- | ------------ |
| `path/to/file` | What changed |

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
```

For **non-backend** repos, omit the `## Service responsibility` section entirely.

**Create the PR — try in order:**

1. **MCP**: `mcp_gitkraken_pull_request_create` with base=`<target_branch>`, head=`<pr_source_branch>`, draft per Step
   0, reviewers `darensh-dev` + `GisselleMartheLQ`, assignee `mrcego`, labels (`feat`→enhancement, `fix`→bug,
   `docs`→documentation).
2. **`gh` CLI fallback**:
   ```bash
   gh pr create \
     --base <target_branch> \
     --head <pr_source_branch> \
     --title "<title>" \
     --body-file <tempfile> \
     --reviewer darensh-dev,GisselleMartheLQ \
     --assignee mrcego \
     --label <label> \
     [--draft]
   ```
   Write the body to a temp file first to avoid shell escaping issues.
3. **Manual**: print the full body + metadata for the user to paste in github.com.

Record PR URL + number.

## Step 4.5 — Write checkpoint

Create a checkpoint at `~/.cursor/memories/session/pr-<repo-name>-<branch-suffix>.md`:

```markdown
# PR Checkpoint

repo: LingoQuesto/<repo> branch: <working_branch> pr_source_branch: <branch or branch_conflicts> target_branch:
<staging|release|main> conflicts_branch: <branch_conflicts or none> conflicts_resolved: <true|false> pr_number: <N>
pr_url: <url> draft: <true|false> linear_issue: <LQ-XXX or none> linear_uuid: <uuid or none> linear_url: <url or none>
linear_title: <title or none>

steps:

- [x] branch_ready
- [x] tests_passed
- [x] checks_passed
- [x] pushed
- [ ] conflicts_resolved
- [ ] pr_created
- [ ] pr_body_finalized
- [ ] linear_commented
- [ ] linear_in_review
- [ ] slack_posted

slack_message: | <preformatted message>
```

Mark `conflicts_resolved: [x]` once conflicts are resolved (or when there were none). Mark `pr_created: [x]` after Step
4 completes. This file lets `/resume-pr` continue from exactly where this stopped.

## Step 5 — Report

Show: PR URL, number, reviewers, assignee, draft status, target branch, source branch, checkpoint file path.

If Draft → STOP. Tell user:

```
✅ Draft PR created and checkpoint saved.
Run /resume-pr when ready to promote and notify.
```

Otherwise mark `pr_body_finalized: [x]` and continue.

## Step 6 — Comment on Linear (fallback chain)

If a Linear ID was provided:

1. **MCP**: `mcp_gitkraken_issues_add_comment` (`provider: linear`, `issue_id: LQ-XXX`).
2. **Manual fallback**: print the exact comment + URL `https://linear.app/.../issue/LQ-XXX` for the user to paste.

Comment template:

```
PR creado: [<owner>/<repo>#<N>](<pr_url>)

**<pr_title>**

<one-line summary>
```

Mark `linear_commented: [x]` only if step 1 succeeded.

## Step 7 — Move Linear to "In Review" (fallback chain)

If a Linear ID was provided:

1. **MCP**: `mcp_linear-mcp-se_linear_update_issue` with the issue UUID and state `"In Review"`.
2. **Manual fallback**: print the issue URL and instruct: "Move to **In Review** manually."

**Never** move to any other state. `DONE` and all others are forbidden without exception.

Mark `linear_in_review: [x]` only if MCP succeeded.

## Step 8 — Post to Slack #pre-releases (fallback chain)

Channel: `C0ARYNN2X41`.

Mentions: `<@U09R794QR0S>` (Daren), `<@U09RYJM1G9W>` (Gisselle).

Message:

- With Linear:
  `<@U09R794QR0S> <@U09RYJM1G9W> <{pr_url}|{pr_title} by mrcego · Pull Request #{N} · {org}/{repo}>, Resuelve <{linear_url}|{linear_title}>`
- Without: `<@U09R794QR0S> <@U09RYJM1G9W> <{pr_url}|{pr_title} by mrcego · Pull Request #{N} · {org}/{repo}>`
- Multiple PRs: comma-separated PR links in a single message before the `Resuelve` clause.

Try:

1. **MCP**: `mcp_slack_mcp_slack_post_message` with channel `C0ARYNN2X41`.
2. **Manual fallback**: print the message inside a copy-paste block for the user to send manually in #pre-releases.

Mark `slack_posted: [x]` only if MCP succeeded.

## Final summary

Print a checklist mirroring the checkpoint. Highlight any step still unchecked with the **exact** payload the user needs
to complete manually.

## Hard rules

- NEVER force-push or amend published commits without asking.
- ALWAYS confirm commit message and PR creation with user.
- NEVER move Linear to any state other than `In Review`.
- NEVER use literal `\n` in MCP tool strings — use actual newlines.
- NEVER abort the workflow because an MCP is down — degrade through the fallback ladder.
- ALWAYS branch from `main` and target `staging` for the PR base. Rebase target is `main`.
- ALWAYS trust Husky for pre-push validation. Never run lint/typecheck/test manually.
- NEVER bypass Husky with `--no-verify`.
- ALWAYS write/update the checkpoint file before reporting completion.
- **Conflicts:** ALWAYS check for merge conflicts with `target_branch` after every push and again before Step 4. ALWAYS
  resolve conflicts automatically — never open a PR with conflicts, never ask manual vs auto, never defer resolution to
  the user except after two failed auto-resolve attempts.
- **Backend (`dj-backend-lq`) only:** ALWAYS run Step 3.6 before opening the PR. ALWAYS include the **Service
  responsibility** section in the PR body. NEVER open a backend PR without reading
  `backend_root/.cursor/skills/service-responsibility-check/SKILL.md` (see Step 3.6 for `backend_root`) and confirming
  progressive extraction per
  [Daren team-devs policy](https://lingoquesto-hq.slack.com/archives/C09T9J5A4LT/p1783013294727219).
