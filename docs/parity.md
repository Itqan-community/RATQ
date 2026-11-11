# Parity: old prod (RATQ `main`) vs new design

Audited 2026-11-11. Old routes = every `page.tsx` under `ratq/src/app` (30). Collections = `ratq/payload-backend/src/collections`. Detail per feature: `PORTING.md`.

## Routes (30 of 30 resolve, none hit the 404)

| Old route | New destination | How |
|---|---|---|
| `/`, `/resources`, `/resources/[slug]`, `/about`, `/contact`, `/standards`, `/docs`, `/contributors` | same path | native route |
| `/reset-password`, `/verify-email`, `/oauth/callback` | same path | native route (query string kept) |
| `/logout` | same path, then `/` | native `LogoutPage` |
| `/login`, `/register`, `/forgot-password` | `/auth/sign-in`, `/auth/sign-up`, `/auth/forgot` | redirect |
| `/privacy` | `/legal/privacy` | redirect |
| `/dashboard`, `/dashboard/requests`, `/dashboard/api-keys`, `/dashboard/settings` | `/app`, `/app/requests`, `/app/keys`, `/app/settings` | redirect |
| `/dashboard/resources`, `/developer/resources` | `/publisher/resources` | redirect |
| `/developer`, `/developer/requests`, `/developer/access` | `/publisher`, `/publisher/requests` | redirect |
| `/developer/resources/[slug]` | `/resources/[slug]` | redirect |
| `/developer/comments` | `/publisher/resources` | redirect (reviews live on the resource page) |
| `/developer/reports` | `/moderation` | redirect |
| `/developer/notifications`, `/developer/settings` | `/app/notifications`, `/app/settings` | redirect |

Enforced by `src/test/legacyRoutes.test.tsx` and `e2e/public.spec.ts`.

## Collections (8 of 9 covered; Media is a gap)

| Collection | Frontend adapter |
|---|---|
| Users | `payloadAuth.ts` |
| Resources | `payloadResources.ts`, `payloadOwnResources.ts` |
| AccessRequests | `payloadRequests.ts` |
| APIKeys | `payloadKeys.ts` |
| Comments | `payloadComments.ts` |
| Reports | `payloadReports.ts` |
| Notifications | `payloadNotifications.ts` |
| Announcements | `payloadAnnouncements.ts` |
| Media | **none: gap.** Old `ResourceForm` uploads a cover image (`POST /media`, then `image` id on the resource) |

## Owner-resource gaps: implemented 2026-11-11, UI Unverified

Decisions: draft on create + owner Publish/Unpublish/Archive/Restore buttons; edit page; cover image (alt = resource name); `documentation_url` and `website_url`. Adapter: `src/lib/payloadOwnResources.ts` (54 tests). UI: `PublisherResourceForm.tsx` (live-mode create + edit, wizard stays for mock mode) and status/edit buttons in `PublisherResources.tsx`. Not exercised in a browser or against the real API (localhost is CORS-blocked; needs a deploy to beta and a throwaway account). Caveat: old upload sent no `alt`, which `Media` requires, so it likely failed on old prod too.

Original findings. Old prod API layer (`ratq/src/modules/developer/infrastructure/resources-api.ts` + `ResourceForm.tsx`) supports four things the new `payloadOwnResources.ts` does not:

1. **Cover image upload** (Media collection).
2. **Edit own resource** (`PATCH /resources/:id`). New design has create + delete only.
3. **Publish** (`status: 'published'` accepted by the API). New wizard always sends `draft` (deliberate, see `PORTING.md`), so a new-design user cannot publish; old prod may allow it. Confirm what the old UI actually sent, and whether Resources access control allows owner self-publish.
4. **`documentation_url`** field is not sent by the wizard.

Not yet confirmed: whether the old UI exposes these routes to users today (the old list page is read-only; the form is used from the `[slug]` page).

## Known regressions vs old prod (intentional, documented)

- Ratings, download/view counters, publisher entities, categories and license objects are not in Payload: hidden or derived in live mode.
- Wizard fields with no Payload column are dropped on submit (`MOCKED.md`).

## Unverified (no real credentials or backend config)

- GitHub OAuth code exchange.
- Email verification (backend does not enable `auth.verify`; live returns 500 too).
- Self-request flow (requesting access to your own resource).
- Write flows against prod via Playwright: key create/revoke is scripted in `e2e/write.spec.ts` but not run (needs `E2E_EMAIL` / `E2E_PASSWORD`). Draft create/delete and access request were verified manually on 2026-11-08 only.

## Landing checklist (plan step 8)

- Replace `.github/workflows/frontend-tests.yml` (npm, branches main/beta) with `ci.yml` (pnpm, main/develop); widen `ci.yml` branches if the team keeps `beta`.
- Keep `payload-backend/`, `deploy-backend.yml` (deploys on push to `beta`), governance files, CODE_OF_CONDUCT.
- `git diff main -- payload-backend/` must be empty.
