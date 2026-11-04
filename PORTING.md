# Porting: live RATQ (main) -> new design

Source of truth: live routes in `ratq/src/app` + Payload collections in `ratq/payload-backend/src/collections`.
Design routes: `src/router.tsx`. Status: `ported` | `new-only` (mocked, see MOCKED.md) | `missing` (live only, to port) | `todo` (port queued).

Data wiring rule: every ported feature reads `NEXT_PUBLIC_PAYLOAD_API_URL`. Unset = in-memory mock (what beta runs).
Prod API (`api.ratq.itqan.dev`) is never called by this work; verify against a local Payload (`payload-backend/docker-compose.yml`, port 5433).

| Live route | Design page | Payload collection | Tier | Status |
|---|---|---|---|---|
| `/` | Home | Resources, Announcements | LOW | todo (trending/announcements live data) |
| `/resources` | Catalog | Resources | MED | ported (db8b63f; `src/lib/payloadResources.ts`, verified vs local Payload) |
| `/resources/[slug]` | ResourceDetails | Resources, Comments | MED | ported for resource data; Comments todo |
| `/about` | About | - | LOW | ported (design copy kept) |
| `/contact` | Contact | - | LOW | ported |
| `/privacy` | LegalPage `/legal/:slug` | - | LOW | ported |
| `/standards` | Standards | - | LOW | ported |
| `/docs` | - | - | LOW | missing |
| `/contributors` | - | - (static data) | LOW | missing |
| `/login`, `/register`, `/forgot-password` | SignIn, SignUp, ForgotPassword | Users | HIGH | ported (cookie session, `src/lib/payloadAuth.ts`, 10 tests, verified e2e vs local Payload; demo role switcher hidden in live mode) |
| `/reset-password`, `/verify-email`, `/oauth/callback`, `/logout` | - | Users | HIGH | missing |
| `/dashboard` | AppOverview | - | MED | todo |
| `/dashboard/requests` | AppRequests | AccessRequests | HIGH | ported (`src/lib/payloadRequests.ts`, 12 tests; submit via dialog, list scoped to mine; verified e2e vs local Payload) |
| `/dashboard/api-keys` | AppKeys | APIKeys | HIGH | ported (`src/lib/payloadKeys.ts`, 11 tests; server-generated key shown once, revoke = DELETE, rotate = create-then-delete; verified e2e incl. 403 path). Known gaps: design copy still says rotate "keeps old key 24h" and "SHA-256 + Pepper" (Payload: immediate delete, plain SHA-256); sidebar badge counts are static mock |
| `/dashboard/settings` | AppSettings | Users | HIGH | todo |
| `/dashboard/resources`, `/developer/resources(/[slug])` | PublisherResources, PublisherResourceNew | Resources | HIGH (delete) | todo |
| `/developer/requests`, `/developer/access` | PublisherRequests | AccessRequests | HIGH | ported (inbox + approve/reject via PATCH, server enforces owner-only/terminal states; verified e2e) |
| `/developer/comments` | - | Comments | HIGH (delete) | missing |
| `/developer/reports` | ModerationDashboard | Reports | HIGH | todo |
| `/developer/notifications` | AppNotifications | Notifications | MED | ported (`src/lib/payloadNotifications.ts`, 6 tests; list, mark one / all read; AppOverview + sidebar badges now live-aware; verified e2e) |
| `/developer`, `/developer/settings` | PublisherDashboard, AppSettings | - | MED | todo |
| `/api/resources*` | - | Resources | MED | out of scope (frontend proxy; design calls Payload directly) |

Route guards (live mode only): `src/lib/portalAccess.ts` in `PortalLayout`: guest -> `/auth/sign-in`; non-admin on admin/review/moderation -> `/403`; app + publisher portals need login only (mirrors live `/developer`, ownership is server-side).

Design-only pages: see MOCKED.md.
