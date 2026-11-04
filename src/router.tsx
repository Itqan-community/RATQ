// src/router.tsx
import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Skeleton } from '@/components/ui/Skeleton';

// Public Pages
import { Home as HomePage } from '@/pages/Home';
import { Catalog as CatalogPage } from '@/pages/Catalog';
import { ResourceDetails as ResourceDetailsPage } from '@/pages/ResourceDetails';
import { Categories as CategoriesPage } from '@/pages/Categories';
import { Publishers as PublishersPage } from '@/pages/Publishers';
import { PublisherDetails as PublisherDetailsPage } from '@/pages/PublisherDetails';
import { Standards as StandardsPage } from '@/pages/Standards';
import { StandardsChecklist as StandardsChecklistPage } from '@/pages/StandardsChecklist';
import { StandardsRevocations as StandardsRevocationsPage } from '@/pages/StandardsRevocations';
import { Licenses as LicensesPage } from '@/pages/Licenses';
import { About as AboutPage } from '@/pages/About';
import RoadmapPage from '@/pages/Roadmap';
import FaqPage from '@/pages/Faq';
import ChangelogPage from '@/pages/Changelog';
import StatusPage from '@/pages/Status';
import LegalPage from '@/pages/LegalPage';
import ContactPage from '@/pages/Contact';
import UxStudyPage from '@/pages/UxStudy';

// Interactive Resources Exploration Views
import QuranicRoadmapPage from '@/pages/QuranicRoadmap';
import ProjectWizardPage from '@/pages/ProjectWizard';
import TechStacksPage from '@/pages/TechStacks';

// Resource Catalog Alternative Previews (Modular Showcase for CTO)
import { SectionsPreviewPage } from '@/pages/previews/SectionsPreviewPage';
import { TreeExplorerPreviewPage } from '@/pages/previews/TreeExplorerPreviewPage';
import TechSpecTablePreviewPage from '@/pages/previews/TechSpecTablePreviewPage';

// Auth Pages
import SignInPage from '@/pages/SignIn';
import SignUpPage from '@/pages/SignUp';
import ForgotPasswordPage from '@/pages/ForgotPassword';

// Developer Portal
import AppOverviewPage from '@/pages/AppOverview';
import AppRequestsPage from '@/pages/AppRequests';
import AppKeysPage from '@/pages/AppKeys';
import AppSavedPage from '@/pages/AppSaved';
import AppNotificationsPage from '@/pages/AppNotifications';
import AppSettingsPage from '@/pages/AppSettings';

// Publisher Portal
import PublisherDashboardPage from '@/pages/PublisherDashboard';
import PublisherResourcesPage from '@/pages/PublisherResources';
import PublisherResourceNewPage from '@/pages/PublisherResourceNew';
import PublisherRequestsPage from '@/pages/PublisherRequests';
import PublisherAnalyticsPage from '@/pages/PublisherAnalytics';
import PublisherClaimPage from '@/pages/PublisherClaim';
import PublisherWebhooksPage from '@/pages/PublisherWebhooks';

// Reviewer Portal
import ReviewQueuePage from '@/pages/ReviewQueue';
import ReviewDetailsPage from '@/pages/ReviewDetails';

// Moderation Portal
import ModerationDashboardPage from '@/pages/ModerationDashboard';

// Admin Portal
import AdminDashboardPage from '@/pages/AdminDashboard';
import AdminUsersPage from '@/pages/AdminUsers';
import AdminResourcesPage from '@/pages/AdminResources';
import AdminAuditPage from '@/pages/AdminAudit';
import AdminFlagsPage from '@/pages/AdminFlags';

// Error Pages
import NotFoundPage from '@/pages/NotFound';
import ForbiddenPage from '@/pages/Forbidden';
import ServerErrorPage from '@/pages/ServerError';

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
