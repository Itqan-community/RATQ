# Contributing to RATQ

RATQ is the developer marketplace at the center of the Itqan ecosystem: a place where developers discover, verify, and integrate Quranic-data resources, including libraries, SDKs, datasets, APIs, and tafsir sources.

The site runs at [ratq.itqan.dev](https://ratq.itqan.dev); [beta.ratq.itqan.dev](https://beta.ratq.itqan.dev) is the preview. All contributions target `main`. The previous frontend is preserved at the `pre-new-design-2026-11-10` tag.

This project follows Itqan's [Community-first process](https://app.notion.com/p/3a97056925c880cf98d5db323853e93a): no work happens without a GitHub Issue, and community contributors work from the same queue as the internal team.

## Setup

Requires Node 20+ and pnpm 10+.

1. Fork and clone the repo.
2. `pnpm install`
3. `pnpm dev` and open `http://localhost:3000`. With no env vars it runs on mock data, no backend needed. See `README.md` for live mode.

## Project structure

- `app/[[...slug]]/`: Next.js catch-all that hands every URL to the client router.
- `src/router.tsx`: all routes. Old live-RATQ paths redirect via `src/lib/legacyRoutes.tsx`.
- `src/views/`: one file per page.
- `src/components/`: shared UI (`ui/` atoms, `layout/` shells and portals).
- `src/lib/`: data layer. `payload*.ts` call the Payload REST API; `mockData.ts` and `supabase.ts` (the in-memory `mockRepo`) back Demo pages.
- `src/i18n/locales/{ar,en}/*.json`: translations. UI text goes through i18n, not hardcoded strings (existing pages with inline `isAr ? ... : ...` copy are tolerated, don't add more).
- `src/test/`: Vitest. `e2e/`: Playwright.
- `payload-backend/`: the CMS/API. Backend changes follow its own README and tests.

## Demo features

Pages marked **Demo / تجريبي** run on mock data and are listed in `MOCKED.md` (code: `src/lib/mockRoutes.ts`). Finishing one means adding the Payload collection in `payload-backend/`, a `src/lib/payload<Thing>.ts` adapter with tests, switching the view to it behind `isLive()`, and removing it from `MOCK_ROUTES` and `MOCKED.md`. `PORTING.md` shows how finished features were done.

## Coding standards

- Match the existing structure and conventions of surrounding files.
- Compare against typed constants (enums, role names), never display strings.
- Keep changes scoped to what the issue asks for.

## Testing

- Run `pnpm typecheck` and `pnpm test` before opening a PR. For `payload-backend/` changes, run its own test suite from that directory.
- **Tests are required when your change touches:**
  - Access control / permissions (a collection's `access` block, route guards in `src/lib/portalAccess.ts`): cover every distinct role/case (admin, owner, another user, unauthenticated), not just the happy path. See `payload-backend/src/collections/Comments.test.ts` for the expected shape.
  - A bug fix where the bug was a logic error: add a regression test that fails on the old code and passes on the new one.
  - A new helper with branching logic, or a new `src/lib/payload*.ts` adapter.
- **Tests are optional** for pure styling/markup, dependency bumps, copy/translation changes, or config-only edits. Say briefly in the PR why none was added if it isn't obvious.
- `pnpm test:e2e` (Playwright) runs against beta and is not required for PRs. Never put real credentials in specs; see `.env.example`.
- When you introduce a helper that replaces an old one, remove the old one if nothing else uses it.

## Picking an issue

Issues are labeled by difficulty (`Easy`, `Medium`, `Hard`) and by priority (`High-Priority`, `Medium-Priority`, `Low-Priority`). Pick whatever matches your available time and skill level, look for `good first issue` if you're new.

## Use of AI tools

You're welcome to use AI coding tools, but the PR is still your responsibility: understand every change, be able to explain it in review, and make sure it matches this repo's conventions rather than generic AI output. Low-effort AI-generated PRs opened without first commenting on the issue or requesting assignment will be closed.

## Pull request process

1. Open a GitHub Issue first (or pick up an existing one, look for the `good first issue` label if you're new).
2. Comment on the issue to claim it before starting work, so two people don't duplicate effort.
3. Ask to be assigned to the issue before starting work, to avoid effort duplication. Wait for a maintainer to assign you - self-assigning via GitHub's UI is automatically reverted (with a comment explaining why), it's not a way to skip the queue.
4. Branch from `main`, named `feat/{short-title}` (e.g. `feat/pagination-a11y`). This repo's CI runs a Branch Naming Check that **fails the whole PR** on any other prefix (`fix/`, `chore/`, plain branch names, etc.) - even for a small fix or a typo correction. If you forked and started on your fork's default branch, push a new `feat/{short-title}` branch instead of opening the PR from `main`.
5. Reference the issue number in your PR description.
6. Keep PRs scoped to one issue. Split unrelated changes into separate PRs.
7. A maintainer reviews within a few business days. Draft PRs are welcome for early feedback, even on incomplete work.

## Questions

Open a GitHub Issue with the `question` label, or ask in the linked community channels once available. See the [RATQ Roadmap](https://app.notion.com/p/3a97056925c8808991f9c2073cc28f25) for what's currently planned.

## Governance & Decision Making

This project follows a lightweight, community-first governance model:

- **Maintainer Roles:** Project maintainers (`@abubakr-itqan` and community leads) have direct merge rights, review pull requests, and manage issue assignments.
- **Decision Making:** Technical and design choices are discussed transparently within GitHub Issues and Pull Requests. Consensus is driven through open discussion, with final review authority held by project maintainers.
- **Code of Conduct:** All contributors and maintainers are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md).
