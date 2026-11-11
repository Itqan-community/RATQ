# Porting: live RATQ (main) -> new design

Source of truth: live routes in `ratq/src/app` + Payload collections in `ratq/payload-backend/src/collections`.
Design routes: `src/router.tsx`. Status: `ported` | `new-only` (mocked, see MOCKED.md) | `missing` (live only, to port) | `todo` (port queued).

Data wiring rule: every ported feature reads `NEXT_PUBLIC_PAYLOAD_API_URL`. Unset = in-memory mock (local/default builds).
Beta is built with it pointing at the prod API (`api.ratq.itqan.dev`, user-approved 2026-11-08); local verification still uses a Payload from `payload-backend/docker-compose.yml`, port 5433.

| Live route | Design page | Payload collection | Tier | Status |
|---|---|---|---|---|
| `/` | Home | Resources, Announcements | LOW | ported: announcements strip (`src/lib/payloadAnnouncements.ts`, 5 tests; CTA scheme-allowlisted; verified e2e incl. hostile `javascript:` link dropped). Hero/featured content stays on the design snapshot; live has no trending data source beyond resources |
| `/resources` | Catalog | Resources | MED | ported (db8b63f; `src/lib/payloadResources.ts`, verified vs local Payload) |
| `/resources/[slug]` | ResourceDetails | Resources, Comments | MED | ported: resource data + comments (`src/lib/payloadComments.ts`, 7 tests; post + delete own; ratings not in Payload so hidden in live mode; verified e2e) |
| `/about` | About | - | LOW | ported (design copy kept) |
| `/contact` | Contact | - | LOW | ported: live mode shows old prod's real channels (connect@itqan.dev, GitHub issues, community.itqan.dev); the design's form only faked "sent", so it stays demo-only |
| `/privacy` | LegalPage `/legal/:slug` | - | LOW | ported |
| `/standards` | Standards | - | LOW | ported |
| `/docs` | `LivePages.tsx` DocsPage | - | LOW | ported (copy extracted from live messages into i18n ns `live`; verified RTL) |
| `/contributors` | `LivePages.tsx` ContributorsPage | - (static data) | LOW | ported (data copied from live `contributors-data.ts`, hand-curated there too - keep in sync; verified LTR, 27 cards). No footer link added |
| `/login`, `/register`, `/forgot-password` | SignIn, SignUp, ForgotPassword | Users | HIGH | ported (cookie session, `src/lib/payloadAuth.ts`, 10 tests, verified e2e vs local Payload; demo role switcher hidden in live mode) |
| `/reset-password`, `/verify-email`, `/oauth/callback`, `/logout` | `src/views/AuthLinkPages.tsx` (+ header sign-out) | Users | HIGH | ported (9 tests). Reset verified e2e (new pw works, old rejected, token single-use). Verify-email: backend does not enable `auth.verify`, so the server returns 500 (same as live). OAuth: callback no-code path verified; the GitHub exchange needs real GitHub credentials, untested |
| `/dashboard` | AppOverview | - | MED | ported (live-aware counts/notifications; see notifications row) |
| `/dashboard/requests` | AppRequests | AccessRequests | HIGH | ported (`src/lib/payloadRequests.ts`, 12 tests; submit via dialog, list scoped to mine; verified e2e vs local Payload) |
| `/dashboard/api-keys` | AppKeys | APIKeys | HIGH | ported (`src/lib/payloadKeys.ts`, 11 tests; server-generated key shown once, revoke = DELETE, rotate = create-then-delete; verified e2e incl. 403 path). Copy fixed to match Payload (immediate delete, plain SHA-256); verified live on beta. Known gap: sidebar badge counts are static mock |
| `/dashboard/settings` | AppSettings | Users | HIGH | ported as live parity: real name + role read-only (live settings is read-only); design-only edit/export/delete hidden in live mode |
| `/dashboard/resources`, `/developer/resources(/[slug])` | PublisherResources, PublisherResourceNew | Resources | HIGH (delete) | ported (`src/lib/payloadOwnResources.ts`, 9 tests; live create/edit form `PublisherResourceForm.tsx` creates a DRAFT, owner list incl. drafts, Publish/Unpublish/Archive/Restore, edit, cover image, doc/website URLs, delete own; create/delete verified e2e on 2026-11-08, publish/edit/cover Unverified in browser) |
| `/developer/requests`, `/developer/access` | PublisherRequests | AccessRequests | HIGH | ported (inbox + approve/reject via PATCH, server enforces owner-only/terminal states; verified e2e) |
| `/developer/comments` | ResourceDetails reviews tab | Comments | HIGH (delete) | ported (as above; no separate dashboard page) |
| `/developer/reports` | ResourceDetails report modal; ModerationDashboard | Reports | HIGH | ported (`src/lib/payloadReports.ts`, 12 tests): submit (verified e2e incl. duplicate refusal) + admin moderation list/resolve (verified e2e; design-only Suspend + demo audit log hidden in live) |
| `/developer/notifications` | AppNotifications | Notifications | MED | ported (`src/lib/payloadNotifications.ts`, 6 tests; list, mark one / all read; AppOverview + sidebar badges now live-aware; verified e2e) |
| `/developer`, `/developer/settings` | PublisherDashboard, AppSettings | - | MED | ported (dashboard shows the user's own resources + inbound requests, no borrowed "verified publisher" identity, rating stat blanked; settings: see above; verified in browser) |
| `/api/resources*` | - | Resources | MED | out of scope (frontend proxy; design calls Payload directly) |

Route guards (live mode only): `src/lib/portalAccess.ts` in `PortalLayout`: guest -> `/auth/sign-in`; non-admin on admin/review/moderation -> `/403`; app + publisher portals need login only (mirrors live `/developer`, ownership is server-side).

Design-only pages: see MOCKED.md.
