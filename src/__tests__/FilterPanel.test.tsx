import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { FilterPanel } from '@/modules/resources/components/FilterPanel';
import { LanguageProvider } from '@/shared/ui/i18n/LanguageContext';

let mockSearchParams = new URLSearchParams();
const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/resources',
  useRouter: () => ({ push: mockPush }),
}));

function renderWithProvider(ui: React.ReactElement) {
  localStorage.setItem('ratq_locale', 'en');
  const result = render(<LanguageProvider>{ui}</LanguageProvider>);
  act(() => {});
  return result;
}

describe('FilterPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it('renders all 16 type filter buttons with translated labels (including CMS types)', () => {
    renderWithProvider(<FilterPanel />);
    expect(screen.getByRole('button', { name: 'Library' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Recitation' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mushaf' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tajweed' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Translation' })).toBeInTheDocument();
    // 16 type buttons + license buttons
    expect(
      screen.getAllByRole('button', {
        name: /Library|SDK|Dataset|API|Tafsir|Audio|PDF|JSON|Recitation|Mushaf|Program|Linguistic|Translation|Font|Search|Tajweed/,
      }),
    ).toHaveLength(16);
  });

  it('pushes a CMS type filter (e.g. recitation) onto the URL', () => {
    renderWithProvider(<FilterPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Recitation' }));
    expect(mockPush).toHaveBeenCalledWith('/resources?type=recitation', { scroll: false });
  });

  it('pushes a type filter onto the URL when a type is selected', () => {
    renderWithProvider(<FilterPanel />);

    fireEvent.click(screen.getByRole('button', { name: 'Library' }));

    expect(mockPush).toHaveBeenCalledWith('/resources?type=library', { scroll: false });
  });

  it('removes the type filter when the active type is clicked again', () => {
    mockSearchParams = new URLSearchParams('type=library');
    renderWithProvider(<FilterPanel />);

    fireEvent.click(screen.getByRole('button', { name: 'Library' }));

    expect(mockPush).toHaveBeenCalledWith('/resources?', { scroll: false });
  });

  it('combines type and license filters when both are active', () => {
    mockSearchParams = new URLSearchParams('type=library');
    renderWithProvider(<FilterPanel />);

    fireEvent.click(screen.getByRole('button', { name: 'MIT' }));

    expect(mockPush).toHaveBeenCalledWith('/resources?type=library&license=MIT', { scroll: false });
  });

  it('resets the page param when a filter changes', () => {
    mockSearchParams = new URLSearchParams('page=3');
    renderWithProvider(<FilterPanel />);

    fireEvent.click(screen.getByRole('button', { name: 'Library' }));

    expect(mockPush).toHaveBeenCalledWith('/resources?type=library', { scroll: false });
  });

  it('clears all active filters when "Clear all" is clicked', () => {
    mockSearchParams = new URLSearchParams('type=library&license=MIT');
    renderWithProvider(<FilterPanel />);

    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));

    expect(mockPush).toHaveBeenCalledWith('/resources?', { scroll: false });
  });

  it('does not show "Clear all" when no filters are active', () => {
    renderWithProvider(<FilterPanel />);
    expect(screen.queryByRole('button', { name: 'Clear all' })).not.toBeInTheDocument();
  });

  it('shows "Clear all" when a filter is active', () => {
    mockSearchParams = new URLSearchParams('type=library');
    renderWithProvider(<FilterPanel />);
    expect(screen.getByRole('button', { name: 'Clear all' })).toBeInTheDocument();
  });
});
