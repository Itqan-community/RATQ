import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import DashboardPage from '@/app/dashboard/page';
import DashboardSettingsPage from '@/app/dashboard/settings/page';
import DashboardResourcesPage from '@/app/dashboard/resources/page';
import DashboardRequestsPage from '@/app/dashboard/requests/page';
import DashboardApiKeysPage from '@/app/dashboard/api-keys/page';
import { useAuth } from '@/hooks/useAuth';
import { createMockRouter } from './test-utils/mockRouter';
import { createMockAuthContext } from './test-utils/mockAuth';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/shared/ui/layout/Sidebar', () => ({
  Sidebar: () => <aside data-testid="sidebar" />,
}));

vi.mock('@/shared/ui/i18n', () => ({
  useLanguage: () => ({ t, direction: 'rtl' }),
}));

vi.mock('@/modules/developer/components/RequestCard', () => ({
  RequestCard: () => <div data-testid="request-card" />,
  RequestCardSkeleton: () => <div data-testid="request-card-skeleton" />,
}));

vi.mock('@/hooks/useDeveloperRequests', () => ({
  useDeveloperRequests: () => ({ data: [], isLoading: false }),
}));

vi.mock('@/modules/developer/application/use-cases/list-developer-resources', () => ({
  listDeveloperResources: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/modules/developer/application/use-cases/create-developer-resource', () => ({
  createResource: vi.fn(),
}));

vi.mock('@/modules/developer/application/use-cases/update-developer-resource', () => ({
  updateResource: vi.fn(),
}));

vi.mock('@/modules/developer/application/use-cases/delete-developer-resource', () => ({
  deleteResource: vi.fn(),
}));

vi.mock('@/modules/developer/components/ResourceForm', () => ({
  ResourceForm: () => <div data-testid="resource-form" />,
}));

vi.mock('@/shared/ui/Badge', () => ({
  ResourceBadge: () => <span data-testid="resource-badge" />,
}));

// Minimal i18n tree covering every key the dashboard pages read after the
// auth guard passes (see the keys used in src/app/dashboard/*/page.tsx).
const t = {
  dashboard: {
    overview: {
      title: 'Overview title',
      activitySummary: 'Activity summary',
      welcomeBack: 'Welcome back, {{name}}',
      summary: 'Overview summary',
      nextAction: 'Next action',
      nextActionTitle: 'Next action title',
      addResource: 'Add resource',
      publishedResources: 'Published resources',
      pendingRequests: 'Pending requests',
      apiKeys: 'API keys',
      role: 'Role',
      publishedResourcesDetail: 'Published detail',
      pendingRequestsDetail: 'Pending detail',
      apiKeysDetail: 'Keys detail',
      roleDetail: 'Role detail',
      recentRequests: 'Recent requests',
      recentRequestsDetail: 'Recent requests detail',
      manageResources: 'Manage resources',
      shortcuts: 'Shortcuts',
      myResources: 'My resources',
      aboutRatq: 'About RATQ',
    },
    common: {
      welcome: 'Welcome',
      logout: 'Logout',
      published: 'Published',
      draft: 'Draft',
      saveChanges: 'Save changes',
      edit: 'Edit',
      delete: 'Delete',
    },
    requests: { noRequests: 'No requests yet' },
    side: { browseCatalog: 'Browse catalog' },
    settings: {
      badge: 'Settings badge',
      title: 'Settings title',
      subtitle: 'Settings subtitle',
      accountInfo: 'Account info',
      name: 'Name',
      role: 'Role',
      preferences: 'Preferences',
      accessNotifications: 'Access notifications',
      weeklySummary: 'Weekly summary',
    },
    resources: {
      badge: 'Resources badge',
      title: 'Resources title',
      subtitle: 'Resources subtitle',
      quickAction: 'Quick action',
      addResource: 'Add resource',
      closeForm: 'Close form',
      publishedResources: '{{count}} published resources',
      description: 'Resources description',
      viewCatalog: 'View catalog',
      empty: 'No resources yet',
      addFirst: 'Add your first resource',
      saveResource: 'Save resource',
    },
    apiKeys: {
      badge: 'API keys badge',
      title: 'API keys title',
      subtitle: 'API keys subtitle',
      securityNote: 'Security note',
      securityText: 'Security text',
      currentKeys: 'Current keys',
      createKey: 'Create key',
      active: 'Active',
    },
  },
};

const mockUser = {
  id: 1,
  email: 'dev@example.com',
  display_name: 'Test Dev',
  role: 'developer' as const,
  created_at: '2026-01-01T00:00:00Z',
};

const dashboardPages = [
  { name: '/dashboard', Component: DashboardPage },
  { name: '/dashboard/settings', Component: DashboardSettingsPage },
  { name: '/dashboard/resources', Component: DashboardResourcesPage },
  { name: '/dashboard/requests', Component: DashboardRequestsPage },
  { name: '/dashboard/api-keys', Component: DashboardApiKeysPage },
];

// A distinctive marker rendered by each page once the auth guard passes.
const pageContentMarker: Record<string, string> = {
  '/dashboard': 'Overview title',
  '/dashboard/settings': 'Settings title',
  '/dashboard/resources': 'Resources title',
  '/dashboard/requests': 'No requests yet',
  '/dashboard/api-keys': 'API keys title',
};

describe('Dashboard auth guards respect the session-loading state', () => {
  const pushMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue(createMockRouter({ push: pushMock }));
  });

  describe.each(dashboardPages)('$name', ({ name, Component }) => {
    it('TEST 1: does not redirect and keeps the loading skeleton while the session is restoring', () => {
      // This is the exact state a hard refresh passes through: AuthProvider
      // has user === null and loading === true until /users/me resolves.
      vi.mocked(useAuth).mockReturnValue(createMockAuthContext({ user: null, loading: true }));

      const { container } = render(<Component />);

      expect(pushMock).not.toHaveBeenCalled();
      // The existing skeleton/loading UI stays visible; no navigation happens.
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
      expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    });

    it('TEST 2: renders the requested subpage in place for an authenticated user', () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthContext({ user: mockUser, loading: false }));

      render(<Component />);

      expect(pushMock).not.toHaveBeenCalled();
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByText(pageContentMarker[name])).toBeInTheDocument();
    });

    it('TEST 3: redirects to /login once loading has resolved without a user', () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthContext({ user: null, loading: false }));

      render(<Component />);

      expect(pushMock).toHaveBeenCalledWith('/login');
    });

    it('TEST 4: does not navigate while the session restores and lands on the same page once restored', () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuthContext({ user: null, loading: true }));

      const { rerender } = render(<Component />);

      // Session restore in flight: no premature navigation.
      expect(pushMock).not.toHaveBeenCalled();

      // AuthProvider finished restoring the existing session.
      vi.mocked(useAuth).mockReturnValue(createMockAuthContext({ user: mockUser, loading: false }));
      rerender(<Component />);

      // The user stays on the originally requested dashboard subpage.
      expect(pushMock).not.toHaveBeenCalled();
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByText(pageContentMarker[name])).toBeInTheDocument();
    });
  });

  it('TEST 5: preserves the existing unauthenticated-redirect behavior for direct /login fallback', () => {
    // Guard still fires for genuinely unauthenticated visitors (pre-existing
    // behavior that must not regress).
    vi.mocked(useAuth).mockReturnValue(createMockAuthContext({ user: null, loading: false }));
    render(<DashboardSettingsPage />);
    expect(pushMock).toHaveBeenCalledWith('/login');

    // And the authenticated dashboard overview still renders its content.
    vi.mocked(useAuth).mockReturnValue(createMockAuthContext({ user: mockUser, loading: false }));
    render(<DashboardPage />);
    expect(screen.getByText('Overview title')).toBeInTheDocument();
    expect(screen.getByText('Welcome, Test Dev')).toBeInTheDocument();
  });
});
