import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { CatalogContent } from '@/app/resources/CatalogContent';
import { LanguageProvider } from '@/shared/ui/i18n/LanguageContext';

const mockUseResources = vi.fn();
let mockSearchParams = new URLSearchParams();
const mockPush = vi.fn();

vi.mock('@/hooks/useResources', () => ({
  useResources: (...args: unknown[]) => mockUseResources(...args),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/resources',
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

function renderWithProvider(ui: React.ReactElement) {
  localStorage.setItem('ratq_locale', 'en');
  const result = render(<LanguageProvider>{ui}</LanguageProvider>);
  act(() => {});
  return result;
}

function makeResource(id: number) {
  return {
    id,
    name: `Resource ${id}`,
    slug: `resource-${id}`,
    source: 'ratq',
    source_url: null,
    type: 'library',
    description: 'desc',
    short_description: 'short desc',
    documentation_url: null,
    github_url: null,
    license: 'MIT',
    itqan_badge: false,
    status: 'published',
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
    version: null,
    github_stats: null,
    total_downloads: 0,
    downloads: 0,
  };
}

describe('CatalogContent pagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it('requests page 1 by default when no page param is present', () => {
    mockUseResources.mockReturnValue({ data: { count: 0, next: null, previous: null, results: [] }, error: undefined, isLoading: false });
    renderWithProvider(<CatalogContent />);
    expect(mockUseResources).toHaveBeenCalledWith({
      page: 1,
      page_size: 12,
      type: undefined,
      license: undefined,
      search: '',
    });
  });

  it('reads the page number from the page query param', () => {
    mockSearchParams = new URLSearchParams('page=3');
    mockUseResources.mockReturnValue({ data: { count: 30, next: null, previous: null, results: [makeResource(1)] }, error: undefined, isLoading: false });
    renderWithProvider(<CatalogContent />);
    expect(mockUseResources).toHaveBeenCalledWith({
      page: 3,
      page_size: 12,
      type: undefined,
      license: undefined,
      search: '',
    });
  });

  it('falls back to page 1 for an invalid page param', () => {
    mockSearchParams = new URLSearchParams('page=not-a-number');
    mockUseResources.mockReturnValue({ data: { count: 0, next: null, previous: null, results: [] }, error: undefined, isLoading: false });
    renderWithProvider(<CatalogContent />);
    expect(mockUseResources).toHaveBeenCalledWith({
      page: 1,
      page_size: 12,
      type: undefined,
      license: undefined,
      search: '',
    });
  });

  it('reads the search query param', () => {
    mockSearchParams = new URLSearchParams('search=quran');

    mockUseResources.mockReturnValue({
      data: { count: 0, next: null, previous: null, results: [] },
      error: undefined,
      isLoading: false,
    });

    renderWithProvider(<CatalogContent />);

    expect(mockUseResources).toHaveBeenCalledWith({
      page: 1,
      page_size: 12,
      type: undefined,
      license: undefined,
      search: 'quran',
    });
  });

  it('renders pagination controls when there is more than one page of results', () => {
    mockUseResources.mockReturnValue({
      data: { count: 30, next: '/api/resources?page=2', previous: null, results: [makeResource(1)] },
      error: undefined,
      isLoading: false,
    });
    renderWithProvider(<CatalogContent />);
    expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
  });

  it('does not render pagination controls when results fit on one page', () => {
    mockUseResources.mockReturnValue({
      data: { count: 1, next: null, previous: null, results: [makeResource(1)] },
      error: undefined,
      isLoading: false,
    });
    renderWithProvider(<CatalogContent />);
    expect(screen.queryByRole('navigation', { name: /pagination/i })).not.toBeInTheDocument();
  });

  it('does not render pagination controls in the empty state', () => {
    mockUseResources.mockReturnValue({ data: { count: 0, next: null, previous: null, results: [] }, error: undefined, isLoading: false });
    renderWithProvider(<CatalogContent />);
    expect(screen.queryByRole('navigation', { name: /pagination/i })).not.toBeInTheDocument();
  });
});

describe("CatalogContent accessibility", () => {
    it("provides an accessible name for the catalog search input", () => {
        mockUseResources.mockReturnValue({
            data: { count: 0, next: null, previous: null, results: [] },
            error: undefined,
            isLoading: false,
        });

        renderWithProvider(<CatalogContent />);

        expect(
            screen.getByRole("textbox", { name: "Search resources" }),
        ).toBeInTheDocument();
    });
});

describe('CatalogContent result count message', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it('does not show the count message while loading', () => {
    mockUseResources.mockReturnValue({ data: undefined, error: undefined, isLoading: true });

    renderWithProvider(<CatalogContent />);

    expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
    expect(screen.queryByText(/results for/)).not.toBeInTheDocument();
  });

  it('does not show the count message on error', () => {
    mockUseResources.mockReturnValue({
      data: undefined,
      error: new Error('failed'),
      isLoading: false,
    });

    renderWithProvider(<CatalogContent />);

    expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
    expect(screen.queryByText(/results for/)).not.toBeInTheDocument();
  });

  it('shows the total count only when there is no search term', () => {
    mockUseResources.mockReturnValue({
      data: {
        count: 47,
        next: null,
        previous: null,
        results: Array.from({ length: 12 }, (_, i) => makeResource(i + 1)),
      },
      error: undefined,
      isLoading: false,
    });

    renderWithProvider(<CatalogContent />);

    expect(screen.getByText('Showing 12 of 47 resources')).toBeInTheDocument();
  });

  it('shows the page count, total count and search term when a search matches', () => {
    mockSearchParams = new URLSearchParams('search=quran');
    mockUseResources.mockReturnValue({
      data: {
        count: 47,
        next: null,
        previous: null,
        results: Array.from({ length: 12 }, (_, i) => makeResource(i + 1)),
      },
      error: undefined,
      isLoading: false,
    });

    renderWithProvider(<CatalogContent />);

    expect(screen.getByText('Showing 12 of 47 resources for "quran"')).toBeInTheDocument();
  });

  it('shows a zero results message when a search matches nothing', () => {
    mockSearchParams = new URLSearchParams('search=zzzz');
    mockUseResources.mockReturnValue({
      data: { count: 0, next: null, previous: null, results: [] },
      error: undefined,
      isLoading: false,
    });

    renderWithProvider(<CatalogContent />);

    expect(screen.getByText('0 results for "zzzz"')).toBeInTheDocument();
  });
});