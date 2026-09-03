import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { RESOURCE_TYPES } from '@/shared/constants/resource-types';
import { LanguageProvider } from '@/shared/ui/i18n/LanguageContext';
import DeveloperResourcesPage from '@/app/developer/resources/page';

const mockUseDeveloperResources = vi.fn();
vi.mock('@/hooks/useDeveloperResources', () => ({
  useDeveloperResources: (...args: unknown[]) => mockUseDeveloperResources(...args),
}));

function renderWithProvider(ui: React.ReactElement) {
  const result = render(<LanguageProvider>{ui}</LanguageProvider>);
  act(() => {});
  return result;
}

describe('DeveloperResourcesPage — type filter (src/app/developer/resources/page.tsx:10)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDeveloperResources.mockReturnValue({ data: [], isLoading: false });
    localStorage.setItem('ratq_locale', 'en');
  });

  it('renders All + 16 type options (17) with English labels', () => {
    renderWithProvider(<DeveloperResourcesPage />);
    expect(screen.getByRole('option', { name: 'All Types' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Recitation' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Tajweed' })).toBeInTheDocument();

    const values = screen.getAllByRole('option').map((o) => (o as HTMLOptionElement).value);
    expect(values).toContain(''); // All
    for (const t of RESOURCE_TYPES) expect(values).toContain(t);
  });

  it('switches labels to Arabic when locale is ar', () => {
    localStorage.setItem('ratq_locale', 'ar');
    renderWithProvider(<DeveloperResourcesPage />);
    expect(screen.getByRole('option', { name: 'كل الأنواع' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'تلاوة' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'تجويد' })).toBeInTheDocument();
  });

  it('keeps correct typing — selecting a CMS type updates filter', () => {
    renderWithProvider(<DeveloperResourcesPage />);
    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];
    const typeSelect = selects[1]; // second select is type filter
    fireEvent.change(typeSelect, { target: { value: 'mushaf' } });
    expect(typeSelect.value).toBe('mushaf');
  });

  it('filters client-side: selecting mushaf hides other types', () => {
    mockUseDeveloperResources.mockReturnValue({
      data: [
        {
          id: 1,
          name: 'Recitation A',
          slug: 'rec-a',
          type: 'recitation',
          status: 'published',
          total_downloads: 0,
          license: 'MIT',
          itqan_badge: false,
        },
        {
          id: 2,
          name: 'Library B',
          slug: 'lib-b',
          type: 'library',
          status: 'published',
          total_downloads: 0,
          license: 'MIT',
          itqan_badge: false,
        },
      ],
      isLoading: false,
    });
    renderWithProvider(<DeveloperResourcesPage />);
    expect(screen.getByText('Recitation A')).toBeInTheDocument();
    expect(screen.getByText('Library B')).toBeInTheDocument();

    const typeSelect = screen.getAllByRole('combobox')[1] as HTMLSelectElement;
    fireEvent.change(typeSelect, { target: { value: 'recitation' } });

    expect(screen.getByText('Recitation A')).toBeInTheDocument();
    expect(screen.queryByText('Library B')).not.toBeInTheDocument();
  });
});
