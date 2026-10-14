import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import DashboardPage from '@/app/dashboard/page';
import { LanguageProvider } from '@/shared/ui/i18n/LanguageContext';
import { useDeveloperRequests } from '@/hooks/useDeveloperRequests';
import { useDeveloperResources } from '@/hooks/useDeveloperResources';
import { useDeveloperAPIKeys } from '@/hooks/useDeveloperAPIKeys';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href?: string; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, email: 'a@x.com', display_name: 'Ava', role: 'developer', created_at: '' },
    loading: false,
    logout: vi.fn(),
  }),
}));

vi.mock('@/shared/ui/layout/Sidebar', () => ({
  Sidebar: () => <aside data-testid="sidebar" />,
}));

vi.mock('@/modules/developer/components/RequestCard', () => ({
  RequestCard: () => <div data-testid="request-card" />,
  RequestCardSkeleton: () => <div data-testid="request-card-skeleton" />,
}));

vi.mock('@/hooks/useDeveloperRequests', () => ({ useDeveloperRequests: vi.fn() }));
vi.mock('@/hooks/useDeveloperResources', () => ({ useDeveloperResources: vi.fn() }));
vi.mock('@/hooks/useDeveloperAPIKeys', () => ({ useDeveloperAPIKeys: vi.fn() }));

const mockedRequests = vi.mocked(useDeveloperRequests);
const mockedResources = vi.mocked(useDeveloperResources);
const mockedKeys = vi.mocked(useDeveloperAPIKeys);

function setup(locale: 'ar' | 'en' = 'en') {
  localStorage.setItem('ratq_locale', locale);
  const result = render(
    <LanguageProvider>
      <DashboardPage />
    </LanguageProvider>
  );
  act(() => {});
  return result;
}

describe('Dashboard stat cards (#350)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockedRequests.mockReturnValue({
      data: [
        { id: 1, status: 'pending' },
        { id: 2, status: 'approved' },
        { id: 3, status: 'pending' },
        { id: 4, status: 'denied' },
      ],
      isLoading: false,
    } as never);
    mockedResources.mockReturnValue({
      data: [
        { id: 1, status: 'published' },
        { id: 2, status: 'draft' },
        { id: 3, status: 'published' },
      ],
      isLoading: false,
    } as never);
    mockedKeys.mockReturnValue({ data: [{ id: 1 }, { id: 2 }], isLoading: false } as never);
  });

  it('counts published resources, own pending requests and api keys', () => {
    const { container } = setup();
    expect(screen.getByText('Your pending requests')).toBeInTheDocument();
    const values = Array.from(container.querySelectorAll('article')).map(
      (card) => card.querySelector('.text-3xl')?.textContent
    );
    // published=2, pending=2 (approved+denied excluded), keys=2
    expect(values).toEqual(['2', '2', '2', expect.anything()]);
  });

  it('labels the pending card as the user’s own requests in Arabic', () => {
    setup('ar');
    expect(screen.getByText('طلباتك المعلقة')).toBeInTheDocument();
  });

  it('shows skeletons while the counts load', () => {
    mockedRequests.mockReturnValue({ data: undefined, isLoading: true } as never);
    mockedResources.mockReturnValue({ data: undefined, isLoading: true } as never);
    mockedKeys.mockReturnValue({ data: undefined, isLoading: true } as never);
    const { container } = setup();
    expect(container.querySelectorAll('.animate-pulse.rounded').length).toBeGreaterThanOrEqual(3);
  });
});
