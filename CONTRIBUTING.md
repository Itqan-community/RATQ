# Contributing to RATQ

RATQ is the developer marketplace at the center of the Itqan ecosystem: a place where developers discover, verify, and integrate Quranic-data resources, including libraries, SDKs, datasets, APIs, and tafsir sources.

This repo's `main` branch is a Next.js/TypeScript rebuild in active development, previewable at [beta.ratq.itqan.dev](https://beta.ratq.itqan.dev) and [ratq.itqan.dev](https://ratq.itqan.dev). The product itself is still pre-launch (per the roadmap) even though `main` is now the source of truth for the codebase. All contributions target `main`. (The old static-wiki version of this repo is preserved on the `old_main` branch for reference.)

This project follows Itqan's [Community-first process](https://app.notion.com/p/3a97056925c880cf98d5db323853e93a): no work happens without a GitHub Issue, and community contributors work from the same queue as the internal team.

## Setup

1. Fork and clone the repo (`main` is checked out by default).
2. `npm install`
3. Copy `.env.example` to `.env.local` and adjust if needed (defaults work for local development against mock data).
4. `npm run dev` and open `http://localhost:3000`.

## Project structure

The codebase is organized by domain, DDD-style:

- `src/app/`: Next.js App Router pages. Kept thin, routes import from `modules/` rather than holding logic themselves.
- `src/modules/{resources,developer,auth}/`: one folder per domain, each with:
  - `domain/`: framework-free logic (value objects, policy/ranking services) - only added where a real rule exists, not for every module.
  - `application/use-cases/`: one function per operation, called by hooks. Thin wrappers around infrastructure are fine for plain CRUD; anything with a real rule to apply calls into `domain/`.
  - `infrastructure/`: the actual data-source layer. `modules/resources/infrastructure/repositories/` is the resource data-source layer specifically - each source (RATQ's own mock data, the CMS integration, Payload) normalizes into the shared `Resource` type. Adding a new data source means adding one file here, see `ratq-native.ts` and `cms.ts` for the pattern.
  - `components/`: feature-specific UI for that domain.
- `src/shared/`: cross-cutting code used by more than one module - `infrastructure/` (token storage, Payload config, error parsing, edge cache), `ui/` (design-system atoms, global layout chrome, i18n), `utils/`.
- `src/shared/ui/i18n/`: Arabic/English translation strings (`messages/ar.json`, `messages/en.json`). UI text should go through the `t.*`/`useTranslations()` object, not hardcoded strings.
- `src/hooks/`: client-side hooks that call into a module's use-cases (e.g. `useResources.ts` calls `modules/resources/application/use-cases/*`). Stay top-level rather than living inside a module, since some are consumed across domains.
- `src/types/`: shared, generic TypeScript definitions (e.g. `resource.ts`).

Note: `src/app/dashboard/*` and `src/app/developer/*` currently overlap (both have their own resource/API-key/request pages) - this predates the module restructure and is tracked separately, not a pattern to copy.

## Coding standards

- Match the existing structure and conventions of surrounding files - a new domain rule goes in that module's `domain/`, not inline in a component.
- New UI text goes through `src/shared/ui/i18n/messages/{ar,en}.json`, not inline hardcoded strings.
- Keep changes scoped to what the issue asks for.

## Testing

- Run `npm test` (watch mode) or `npm run test:run` (single run) before opening a PR.
- New components/hooks should have a test where practical, see `src/__tests__/` for existing examples and conventions.
- Bug fixes should include a regression test where practical.

## Linting

- Run `npm run lint` before opening a PR.
- This repo currently has some pre-existing lint errors, tracked as good-first-issues rather than fixed all at once. If `npm run lint` reports errors in files unrelated to your change, that's expected, just make sure your own change doesn't introduce new ones.

## Picking an issue

Issues are labeled by difficulty (`Easy`, `Medium`, `Hard`) and by priority (`High-Priority`, `Medium-Priority`, `Low-Priority`). Pick whatever matches your available time and skill level, look for `good first issue` if you're new.

## Use of AI tools

You're welcome to use AI coding tools, but the PR is still your responsibility: understand every change, be able to explain it in review, and make sure it matches this repo's conventions rather than generic AI output. Low-effort AI-generated PRs opened without first commenting on the issue or requesting assignment will be closed.

## Pull request process

1. Open a GitHub Issue first (or pick up an existing one, look for the `good first issue` label if you're new).
2. Comment on the issue to claim it before starting work, so two people don't duplicate effort.
3. Ask to be assigned to the issue before starting work, to avoid effort duplication.
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