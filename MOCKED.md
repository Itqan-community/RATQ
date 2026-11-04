# Mocked (new-design-only features)

These exist only in ratq-design, have no live-main equivalent, and stay on the in-memory `mockRepo` (`src/lib/supabase.ts`, `src/lib/mockData.ts`).

- Publishers directory + details (`Publishers`, `PublisherDetails`, `PublisherClaim`)
- Publisher portal (`PublisherDashboard`, `PublisherAnalytics`, `PublisherWebhooks`, `PublisherResourceNew`) except where PORTING.md maps a live equivalent
- Moderation + review (`ModerationDashboard`, `ReviewQueue`, `ReviewDetails`) except Reports (live)
- Admin (`AdminDashboard`, `AdminUsers`, `AdminResources`, `AdminFlags`, `AdminAudit`)
- Categories, Licenses, TechStacks, QuranicRoadmap, ProjectWizard, StandardsChecklist, StandardsRevocations
- Saved (`AppSaved`), Status, Changelog, Roadmap, Faq, UxStudy, previews
- Supabase-only: embeddings, SLA monitor, webhook dispatch, email-send (Netlify functions dropped)
