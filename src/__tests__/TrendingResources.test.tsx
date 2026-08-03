import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import TrendingResources from '@/components/resources/TrendingResources';
import { LanguageProvider } from '@/i18n/LanguageContext';

const mockUseTrendingResources = vi.fn();

vi.mock('@/hooks/useTrendingResources', () => ({
  useTrendingResources: () => mockUseTrendingResources(),
}));

function renderWithProvider(ui: React.ReactElement) {
  // Set locale to English before rendering so i18n texts match English
  localStorage.setItem('ratq_locale', 'en');
  const result = render(<LanguageProvider>{ui}</LanguageProvider>);
  // Flush React effects (LanguageProvider reads locale from localStorage in useEffect)
  act(() => {});
  return result;
}

describe('TrendingResources', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when no resources and not loading', () => {
    mockUseTrendingResources.mockReturnValue({
      resources: [],
      isLoading: false,
      error: null,
      period: '30d',
      setPeriod: vi.fn(),
      periods: ['7d', '30d', 'all-time'],
    });

    const { container } = renderWithProvider(<TrendingResources />);
    expect(container.innerHTML).toBe('');
  });

  it('renders skeleton while loading', () => {
    mockUseTrendingResources.mockReturnValue({
      resources: [],
      isLoading: true,
      error: null,
      period: '30d',
      setPeriod: vi.fn(),
      periods: ['7d', '30d', 'all-time'],
    });

    renderWithProvider(<TrendingResources />);
    const skeletonCards = document.querySelectorAll('.animate-pulse');
    expect(skeletonCards.length).toBe(3);
  });

  it('renders 3 trending cards with data', () => {
    mockUseTrendingResources.mockReturnValue({
      resources: [
        { id: 1, name: 'Resource A', slug: 'resource-a', type: 'api', description: 'Desc A', version: '1.0', license: 'MIT', downloads: 1000 },
        { id: 2, name: 'Resource B', slug: 'resource-b', type: 'sdk', description: 'Desc B', version: '2.0', license: 'Apache', downloads: 800 },
        { id: 3, name: 'Resource C', slug: 'resource-c', type: 'library', description: 'Desc C', version: '1.5', license: 'MIT', downloads: 600 },
      ],
      isLoading: false,
      error: null,
      period: '30d',
      setPeriod: vi.fn(),
      periods: ['7d', '30d', 'all-time'],
    });

    renderWithProvider(<TrendingResources />);
    expect(screen.getByText('Resource A')).toBeInTheDocument();
    expect(screen.getByText('Resource B')).toBeInTheDocument();
    expect(screen.getByText('Resource C')).toBeInTheDocument();
    expect(screen.getByText('1k')).toBeInTheDocument();
  });

  it('shows period toggle buttons', () => {
    mockUseTrendingResources.mockReturnValue({
      resources: [
        { id: 1, name: 'Resource A', slug: 'resource-a', type: 'api', description: 'Desc', version: '1.0', license: 'MIT', downloads: 1000 },
      ],
      isLoading: false,
      error: null,
      period: '30d',
      setPeriod: vi.fn(),
      periods: ['7d', '30d', 'all-time'],
    });

    renderWithProvider(<TrendingResources />);
    expect(screen.getByText('7 days')).toBeInTheDocument();
    expect(screen.getByText('30 days')).toBeInTheDocument();
    expect(screen.getByText('All-time')).toBeInTheDocument();
  });

  it('switches period on click', () => {
    const mockSetPeriod = vi.fn();
    mockUseTrendingResources.mockReturnValue({
      resources: [
        { id: 1, name: 'Resource A', slug: 'resource-a', type: 'api', description: 'Desc', version: '1.0', license: 'MIT', downloads: 1000 },
      ],
      isLoading: false,
      error: null,
      period: '30d',
      setPeriod: mockSetPeriod,
      periods: ['7d', '30d', 'all-time'],
    });

    renderWithProvider(<TrendingResources />);
    fireEvent.click(screen.getByText('7 days'));
    expect(mockSetPeriod).toHaveBeenCalledWith('7d');
  });

  it('highlights active period', () => {
    mockUseTrendingResources.mockReturnValue({
      resources: [
        { id: 1, name: 'Resource A', slug: 'resource-a', type: 'api', description: 'Desc', version: '1.0', license: 'MIT', downloads: 1000 },
      ],
      isLoading: false,
      error: null,
      period: '7d',
      setPeriod: vi.fn(),
      periods: ['7d', '30d', 'all-time'],
    });

    renderWithProvider(<TrendingResources />);
    const buttons = document.querySelectorAll('button[role="tab"]');
    expect(buttons[0]).toHaveClass('bg-[var(--accent-primary)]');
  });
});
