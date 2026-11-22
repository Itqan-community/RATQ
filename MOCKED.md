# Mocked (new-design-only features)

These exist only in ratq-design, have no live-main equivalent, and stay on the in-memory `mockRepo` (`src/lib/supabase.ts`, `src/lib/mockData.ts`).

- Publishers directory + details (`Publishers`, `PublisherDetails`, `PublisherClaim`)
- Publisher portal (`PublisherDashboard`, `PublisherAnalytics`, `PublisherWebhooks`, `PublisherResourceNew`) except where PORTING.md maps a live equivalent
- Moderation + review (`ModerationDashboard`, `ReviewQueue`, `ReviewDetails`) except Reports (live)
- Admin (`AdminDashboard`, `AdminUsers`, `AdminResources`, `AdminFlags`, `AdminAudit`)
- Categories, Licenses, TechStacks, QuranicRoadmap, ProjectWizard, StandardsChecklist, StandardsRevocations
- Saved (`AppSaved`), Status, Changelog, Roadmap, Faq, UxStudy, previews
- Supabase-only: embeddings, SLA monitor, webhook dispatch, email-send (Netlify functions dropped)

## Live-mode caveats (NEXT_PUBLIC_PAYLOAD_API_URL set)

Every production build (`next build` loads the committed `.env.production`) sets `NEXT_PUBLIC_PAYLOAD_API_URL=https://api.quran.tech/api` and the Itqan CMS URL, so beta and live run on the same prod data; `next.config.mjs` refuses a production build without it (`ALLOW_MOCK_BUILD=1` opts out). Unset (local `next dev`, vitest) = all mock. With it set:
- Resources come from BOTH sources, fetched in parallel with per-source failure tolerance (`hydrateResources`, `src/lib/payloadResources.ts`): Payload (`/resources`, paged 100/page) and Itqan CMS (`src/lib/cmsResources.ts`, `cms-<id>` slugs, en + ar fetch). One source down = the other still serves; both down = data routes (`/`, `/resources*`, `/categories`, `/publishers`) show a retry state (`ApiDownGate`) while static pages keep working. CMS CORS verified for ratq.itqan.dev and beta.ratq.itqan.dev; other origins (localhost, workers.dev previews) fail the CMS fetch and degrade to Payload only.
- `mockRepo.setLiveResources` REPLACES the list and the publishers (derived from the live resources). `DEMO_RESOURCES` is an empty array in a live build and the demo-slug fallback is gone, so no demo/snapshot resource is listed or reachable by direct slug; the "Beta Prototype" tag is hidden. Slugs the boot list lacks (`cms-N` added after boot, a source down at boot) resolve via `fetchResourceBySlug`/`useResourceDetail`. Live cards/details hide ratings and download/view counters; Home hides the featured rail and the publisher/API-key counters.
- Nav items for mock-only pages carry a Demo/تجريبي tag in live mode (`DemoBadge`, driven by `src/lib/mockRoutes.ts`; keep in sync with the list above).
- Not in Payload, so mock or hidden in live: ratings/reviews stars, downloads/usage counters, publisher entities (live resources are attributed to the community publisher), categories (derived from resource type), license objects (synthesized for non-CC licenses), rate limits, key expiry, API-key rotation grace period, itqan level (badge only), Suspend action, audit log, account edit/export/delete.
- Publisher wizard fields with no Payload column (checksum, sacred-text pledge, itqan self-audit, tech stack, readme beyond description) are dropped on submit; created resources are DRAFTs.
- API-key page copy now matches Payload (plain SHA-256, old key deleted immediately on rotate). Remaining inaccurate copy: `LegalPage.tsx` still claims a pepper and Postgres RLS; mock-only `rotating` status label still says 24h.
- Verified against local Payload and, on 2026-11-08, against api.ratq.itqan.dev from the beta origin: CORS preflight, sign-up/sign-in/bad-password/sign-out, draft create+delete, API key create+delete, unauth redirect to sign-in. A throwaway developer-role test user remains for a maintainer to delete via Payload admin. Access requests, email verification and GitHub OAuth were not exercised live.
