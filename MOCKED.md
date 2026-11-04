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

Deployed beta runs with it UNSET (all mock). With it set:
- Catalog/Home still include the design's static snapshot of beta resources (`src/lib/betaResources.ts`) and demo resources alongside live Payload ones; only `payload_*` ids are real. Actions on non-live resources (access request, report, comment, key, delete) show an error instead of faking success.
- Not in Payload, so mock or hidden in live: ratings/reviews stars, downloads/usage counters, publisher entities (live resources are attributed to the community publisher), categories (derived from resource type), license objects (synthesized for non-CC licenses), rate limits, key expiry, API-key rotation grace period, itqan level (badge only), Suspend action, audit log, account edit/export/delete.
- Publisher wizard fields with no Payload column (checksum, sacred-text pledge, itqan self-audit, tech stack, readme beyond description) are dropped on submit; created resources are DRAFTs.
- Design copy that is inaccurate against Payload (see PORTING.md, API keys row) is unchanged.
- Verified only against a local Payload; never against api.ratq.itqan.dev (shared by beta and prod).
