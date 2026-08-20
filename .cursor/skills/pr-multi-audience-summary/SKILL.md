---
name: pr-multi-audience-summary
description: Draft concise Slack announcements for pull requests with separate PM, QA, and DevOps sections. Use when the user asks for a PR announcement, multi-audience PR summary, release-note style update, or channel-ready change brief with CI and test specifics.
disable-model-invocation: true
---

# PR Multi-Audience Summary

## Purpose

Draft a single Slack announcement for a PR that serves PM, QA, and DevOps readers in one short message.

## Inputs to Gather (Required)

- PR title, number, and link
- PR description and changed files
- Check runs / CI results
- Test evidence from the PR diff and checks (what was verified, counts only if explicitly available)

Do not invent counts, percentages, or verification claims.

## Workflow

1. Read the PR and checks first; extract only verifiable facts.
2. Capture:
   - User/business impact in plain language
   - QA-relevant test coverage and verification details
   - DevOps-relevant scope, infra/config impact, and CI status
3. If a requested metric is unavailable, write `Not reported in PR/checks`.
4. Produce one short Slack message in the required structure below.

## Required Slack Output Format

Keep the full message short enough for one screen. Use exactly these 3 sections and then the PR link.

### Section 1 — PM (plain business language)

`*PM Update*`
- What changed: <plain-language outcome>
- Why it matters: <business/customer impact>

### Section 2 — QA (test coverage)

`*QA Update*`
- Verified: <tests/checks that ran and what they validated>
- Test counts: <exact numbers from PR/checks or "Not reported in PR/checks">
- Gaps/Risks for QA: <known unverified areas, if any>

### Section 3 — DevOps (scope + CI)

`*DevOps Update*`
- Scope: <services/modules/config/deploy surface touched>
- CI: <check names and pass/fail state from PR checks>
- Operational notes: <migrations, env vars, rollout, or "None reported">

### Final line

`PR: <full PR URL>`

## Writing Rules

- Use only facts sourced from PR content and check results.
- Never invent test totals, pass counts, or coverage percentages.
- If data is missing, say `Not reported in PR/checks`.
- Keep bullets short and specific.
- Avoid jargon in PM section; keep technical detail in DevOps section.
- End with the PR link on its own line.

## Optional Data-Collection Hints

- Read PR metadata and changed files before drafting.
- Read CI/check output before stating verification status.
- Prefer explicit check names over generic phrases like "CI passed".
