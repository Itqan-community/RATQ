# Notion stories: "RATQ New Design"

Source for the community board. One story per Demo group (routes in `src/lib/mockRoutes.ts`; a vitest check fails if a route has no story here). Create them in Notion with the "RATQ V3" template, one toggle per story.

**Shared "Done when"** (every story): Payload collection added in `payload-backend/` with access-control tests, `src/lib/payload<Thing>.ts` adapter with tests, the view reads it behind `isLive()`, and the route is removed from `MOCK_ROUTES` and `MOCKED.md`. Pattern: see `PORTING.md`.

| # | Story | Routes | Notes |
|---|---|---|---|
| 1 | Publishers directory, details and claim flow | `/publishers`, `/publisher/claim` | Needs a Publishers collection; live resources are all attributed to the community publisher today |
| 2 | Publisher analytics | `/publisher/analytics` | Needs usage/view counters (not in Payload) |
| 3 | Publisher webhooks | `/publisher/webhooks` | Needs webhook storage plus a dispatcher (Supabase-only today) |
| 4 | Review queue and review details | `/review` | Payload has no review step; resources are created as DRAFT |
| 5 | Admin console (users, resources, flags, audit) | `/admin` | Audit log needs a collection; suspend action missing |
| 6 | Categories | `/categories` | Derived from resource type today |
| 7 | Licenses | `/licenses` | License objects are synthesized for non-CC licenses |
| 8 | Tech stacks | `/resources/stacks` | Wizard tech-stack field is dropped on submit |
| 9 | Quranic roadmap | `/resources/roadmap` | Static data today |
| 10 | Project wizard | `/resources/wizard` | Checksum, pledge and self-audit fields have no column |
| 11 | Standards checklist | `/standards/checklist` | |
| 12 | Standards revocations | `/standards/revocations` | |
| 13 | Saved resources | `/app/saved` | Needs a per-user saves collection |
| 14 | Status page and changelog | `/status`, `/changelog` | |
| 15 | Roadmap, FAQ and UX study | `/roadmap`, `/faq`, `/ux-study` | Content pages; may move to i18n or CMS rather than a collection |

Not stories (live limits, tracked in `MOCKED.md`): ratings, download counters, rate limits, key expiry, account edit/export/delete.
