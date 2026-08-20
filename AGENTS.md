# AI Agents Instructions

Packages:

- `pkgs/core`: The core `date-fns` package.
- `pkgs/utc`: The `@date-fns/utc` package that provides the `UTCDate` class.
- `pkgs/tz`: The `@date-fns/tz` package that provides the `TZDate` class along with time zone utility functions.

## Repository Scope and Remotes

- This repository's writable remote is `origin` -> `https://github.com/georgvs/cursor-date-fns.git`.
- Canonical upstream is `upstream` -> `https://github.com/date-fns/date-fns.git`.
- The old fork `https://github.com/georgvs/date-fns` is out of scope for agents and should not be used for history or PR context.
- Bootstrap remotes before work if needed: `./scripts/setup-remotes.sh`.

## I18n

When working with locales, see the contributing instructions `pkgs/core/docs/i18nContributionGuide.md`.

Often I18n PR authors forget to update the locale snapshots; do it by running `mise //pkgs/core:gen/locales/snapshots`.

## PRs

When working on a PR, use the `gh` CLI to switch to the branch: `gh pr checkout <pr_number>`.

For historical PR discussion context, treat `date-fns/date-fns` as the source of truth. API-based PR history tooling is planned separately and is not implemented in this repository yet.

If there are uncommitted changes, return to the human and ask for the next steps.

Often PRs are outdated and need to be rebased on the latest `main`. When explicitly requested, make sure `main` is up to date, switch to the PR branch, and then `git rebase main`. Don't push, and always mention that a rebase was done when reporting back to the human.

When the request task is done, report back to the human with a summary of what was done. Don't commit or push any changes unless explicitly requested.

## Git

Don't do any Git operations unless explicitly requested or this file instructs you to do so.

## Preferred Validation Commands

- Types: `mise //:types`
- Lint: `mise //:lint`
- Unit tests: `mise //pkgs/core:test/unit`
- Time zone tests (for date/tz changes): `mise //pkgs/core:test/tz`
- Locale snapshots (for locale work): `mise //pkgs/core:test/locales`

`CONTRIBUTING.md` may lag behind current monorepo tasks in places; prioritize `mise` tasks and CI workflow commands.
