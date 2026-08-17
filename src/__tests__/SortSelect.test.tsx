import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import SortSelect from '@/modules/resources/components/SortSelect';
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
    act(() => { });
    return result;
}

describe('SortSelect', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockSearchParams = new URLSearchParams();
    });

    it('pushes the sort param onto the URL when an option is selected', () => {
        renderWithProvider(<SortSelect />);

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'downloads' } });

        expect(mockPush).toHaveBeenCalledWith('/resources?sort=downloads', { scroll: false });
    });

    it('resets the page param when the sort changes', () => {
        mockSearchParams = new URLSearchParams('page=3');
        renderWithProvider(<SortSelect />);

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'newest' } });

        expect(mockPush).toHaveBeenCalledWith('/resources?sort=newest', { scroll: false });
    });

    it('preserves other active params when sort changes', () => {
        mockSearchParams = new URLSearchParams('type=library&license=MIT');
        renderWithProvider(<SortSelect />);

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'name_asc' } });

        expect(mockPush).toHaveBeenCalledWith('/resources?type=library&license=MIT&sort=name_asc', { scroll: false });
    });

    it('defaults to relevance when no sort param is in the URL', () => {
        renderWithProvider(<SortSelect />);

        expect(screen.getByRole('combobox')).toHaveValue('relevance');
    });

    it('reflects the active sort value from the URL', () => {
        mockSearchParams = new URLSearchParams('sort=oldest');
        renderWithProvider(<SortSelect />);

        expect(screen.getByRole('combobox')).toHaveValue('oldest');
    });
});