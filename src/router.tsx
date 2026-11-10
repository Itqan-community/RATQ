// src/router.tsx
import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Skeleton } from '@/components/ui/Skeleton';

// Public Pages
import { Home as HomePage } from '@/views/Home';
import { Catalog as CatalogPage } from '@/views/Catalog';
import { ResourceDetails as ResourceDetailsPage } from '@/views/ResourceDetails';
import { Categories as CategoriesPage } from '@/views/Categories';
import { Publishers as PublishersPage } from '@/views/Publishers';
import { PublisherDetails as PublisherDetailsPage } from '@/views/PublisherDetails';
import { Standards as StandardsPage } from '@/views/Standards';
import { StandardsChecklist as StandardsChecklistPage } from '@/views/StandardsChecklist';
import { StandardsRevocations as StandardsRevocationsPage } from '@/views/StandardsRevocations';
import { Licenses as LicensesPage } from '@/views/Licenses';
import { About as AboutPage } from '@/views/About';
import RoadmapPage from '@/views/Roadmap';
import FaqPage from '@/views/Faq';
import ChangelogPage from '@/views/Changelog';
import StatusPage from '@/views/Status';
import LegalPage from '@/views/LegalPage';
import ContactPage from '@/views/Contact';
import UxStudyPage from '@/views/UxStudy';

// Interactive Resources Exploration Views
import QuranicRoadmapPage from '@/views/QuranicRoadmap';
import ProjectWizardPage from '@/views/ProjectWizard';
import TechStacksPage from '@/views/TechStacks';

// Resource Catalog Alternative Previews (Modular Showcase for CTO)
import { SectionsPreviewPage } from '@/views/previews/SectionsPreviewPage';
import { TreeExplorerPreviewPage } from '@/views/previews/TreeExplorerPreviewPage';
import TechSpecTablePreviewPage from '@/views/previews/TechSpecTablePreviewPage';

// Auth Pages
import SignInPage from '@/views/SignIn';
import SignUpPage from '@/views/SignUp';
import ForgotPasswordPage from '@/views/ForgotPassword';
import { ResetPasswordPage, VerifyEmailPage, OAuthCallbackPage, LogoutPage } from '@/views/AuthLinkPages';
import { legacyRoutes } from '@/lib/legacyRoutes';
import { DocsPage, ContributorsPage } from '@/views/LivePages';

// Developer Portal
import AppOverviewPage from '@/views/AppOverview';
import AppRequestsPage from '@/views/AppRequests';
import AppKeysPage from '@/views/AppKeys';
import AppSavedPage from '@/views/AppSaved';
import AppNotificationsPage from '@/views/AppNotifications';
import AppSettingsPage from '@/views/AppSettings';

// Publisher Portal
import PublisherDashboardPage from '@/views/PublisherDashboard';
import PublisherResourcesPage from '@/views/PublisherResources';
import PublisherResourceNewPage from '@/views/PublisherResourceNew';
import PublisherRequestsPage from '@/views/PublisherRequests';
import PublisherAnalyticsPage from '@/views/PublisherAnalytics';
import PublisherClaimPage from '@/views/PublisherClaim';
import PublisherWebhooksPage from '@/views/PublisherWebhooks';

// Reviewer Portal
import ReviewQueuePage from '@/views/ReviewQueue';
import ReviewDetailsPage from '@/views/ReviewDetails';

// Moderation Portal
import ModerationDashboardPage from '@/views/ModerationDashboard';

// Admin Portal
import AdminDashboardPage from '@/views/AdminDashboard';
import AdminUsersPage from '@/views/AdminUsers';
import AdminResourcesPage from '@/views/AdminResources';
import AdminAuditPage from '@/views/AdminAudit';
import AdminFlagsPage from '@/views/AdminFlags';

// Error Pages
import NotFoundPage from '@/views/NotFound';
import ForbiddenPage from '@/views/Forbidden';
import ServerErrorPage from '@/views/ServerError';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageFallback: React.FC = () => (
  <div className="container mx-auto px-4 py-16 space-y-6">
    <Skeleton className="h-10 w-1/3" />
    <Skeleton className="h-32 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
    </div>
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <AppShell>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/resources" element={<CatalogPage />} />
          <Route path="/resources/roadmap" element={<QuranicRoadmapPage />} />
          <Route path="/resources/wizard" element={<ProjectWizardPage />} />
          <Route path="/resources/stacks" element={<TechStacksPage />} />
          <Route path="/stacks" element={<TechStacksPage />} />
          <Route path="/resources/stacks/tech-spec-table" element={<TechSpecTablePreviewPage />} />
          <Route path="/stacks/tech-spec-table" element={<TechSpecTablePreviewPage />} />

          {/* Resource Catalog Alternative Previews for CTO */}
          <Route path="/resources/preview-sections" element={<SectionsPreviewPage />} />
          <Route path="/resources/preview-tree-explorer" element={<TreeExplorerPreviewPage />} />

          <Route path="/resources/:slug" element={<ResourceDetailsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/publishers" element={<PublishersPage />} />
          <Route path="/publishers/:slug" element={<PublisherDetailsPage />} />
          <Route path="/standards" element={<StandardsPage />} />
          <Route path="/standards/checklist" element={<StandardsChecklistPage />} />
          <Route path="/standards/revocations" element={<StandardsRevocationsPage />} />
          <Route path="/licenses" element={<LicensesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/ux-study" element={<UxStudyPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/legal/:slug" element={<LegalPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth Routes */}
          <Route path="/auth/sign-in" element={<SignInPage />} />
          <Route path="/auth/sign-up" element={<SignUpPage />} />
          <Route path="/auth/forgot" element={<ForgotPasswordPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/contributors" element={<ContributorsPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
          <Route path="/logout" element={<LogoutPage />} />

          {/* Old live-RATQ paths -> new equivalents */}
          {legacyRoutes}

          {/* Developer Portal */}
          <Route
            path="/app"
            element={
              <PortalLayout portal="app">
                <AppOverviewPage />
              </PortalLayout>
            }
          />
          <Route
            path="/app/requests"
            element={
              <PortalLayout portal="app">
                <AppRequestsPage />
              </PortalLayout>
            }
          />
          <Route
            path="/app/keys"
            element={
              <PortalLayout portal="app">
                <AppKeysPage />
              </PortalLayout>
            }
          />
          <Route
            path="/app/saved"
            element={
              <PortalLayout portal="app">
                <AppSavedPage />
              </PortalLayout>
            }
          />
          <Route
            path="/app/notifications"
            element={
              <PortalLayout portal="app">
                <AppNotificationsPage />
              </PortalLayout>
            }
          />
          <Route
            path="/app/settings"
            element={
              <PortalLayout portal="app">
                <AppSettingsPage />
              </PortalLayout>
            }
          />

          {/* Publisher Portal */}
          <Route
            path="/publisher"
            element={
              <PortalLayout portal="publisher">
                <PublisherDashboardPage />
              </PortalLayout>
            }
          />
          <Route
            path="/publisher/resources"
            element={
              <PortalLayout portal="publisher">
                <PublisherResourcesPage />
              </PortalLayout>
            }
          />
          <Route
            path="/publisher/resources/new"
            element={
              <PortalLayout portal="publisher">
                <PublisherResourceNewPage />
              </PortalLayout>
            }
          />
          <Route
            path="/publisher/requests"
            element={
              <PortalLayout portal="publisher">
                <PublisherRequestsPage />
              </PortalLayout>
            }
          />
          <Route
            path="/publisher/analytics"
            element={
              <PortalLayout portal="publisher">
                <PublisherAnalyticsPage />
              </PortalLayout>
            }
          />
          <Route
            path="/publisher/claim"
            element={
              <PortalLayout portal="publisher">
                <PublisherClaimPage />
              </PortalLayout>
            }
          />
          <Route
            path="/publisher/webhooks"
            element={
              <PortalLayout portal="publisher">
                <PublisherWebhooksPage />
              </PortalLayout>
            }
          />

          {/* Reviewer Portal */}
          <Route
            path="/review"
            element={
              <PortalLayout portal="review">
                <ReviewQueuePage />
              </PortalLayout>
            }
          />
          <Route
            path="/review/:resourceId"
            element={
              <PortalLayout portal="review">
                <ReviewDetailsPage />
              </PortalLayout>
            }
          />

          {/* Moderation Portal */}
          <Route
            path="/moderation"
            element={
              <PortalLayout portal="moderation">
                <ModerationDashboardPage />
              </PortalLayout>
            }
          />

          {/* Admin Portal */}
          <Route
            path="/admin"
            element={
              <PortalLayout portal="admin">
                <AdminDashboardPage />
              </PortalLayout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PortalLayout portal="admin">
                <AdminUsersPage />
              </PortalLayout>
            }
          />
          <Route
            path="/admin/resources"
            element={
              <PortalLayout portal="admin">
                <AdminResourcesPage />
              </PortalLayout>
            }
          />
          <Route
            path="/admin/audit"
            element={
              <PortalLayout portal="admin">
                <AdminAuditPage />
              </PortalLayout>
            }
          />
          <Route
            path="/admin/flags"
            element={
              <PortalLayout portal="admin">
                <AdminFlagsPage />
              </PortalLayout>
            }
          />

          {/* Error Routes */}
          <Route path="/403" element={<ForbiddenPage />} />
          <Route path="/500" element={<ServerErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
};

export default AppRouter;
