import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Pagination } from '@/shared/ui/Pagination';
import { LanguageProvider } from '@/shared/ui/i18n/LanguageContext';

let mockSearchParams = new URLSearchParams();
const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({ push: mockPush }),
}));

function renderWithProvider(ui: React.ReactElement) {
  localStorage.setItem('ratq_locale', 'en');
  const result = render(<LanguageProvider>{ui}</LanguageProvider>);
  act(() => {});
  return result;
}

describe('Pagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it('renders nothing when everything fits on one page', () => {
    const { container } = renderWithProvider(<Pagination count={5} pageSize={12} />);
    expect(container.innerHTML).toBe('');
  });

  it('treats an invalid page param as page 1 instead of NaN', () => {
    mockSearchParams = new URLSearchParams('page=not-a-number');
    renderWithProvider(<Pagination count={30} pageSize={12} />);

    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveClass('bg-[var(--accent-primary)]');
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(mockPush).toHaveBeenCalledWith('/resources?page=2');
  });

  it('treats a missing page param as page 1', () => {
    renderWithProvider(<Pagination count={30} pageSize={12} />);
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
  });

  it('navigates to the correct page on Next/Prev clicks', () => {
    mockSearchParams = new URLSearchParams('page=2');
    renderWithProvider(<Pagination count={30} pageSize={12} />);

    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(mockPush).toHaveBeenCalledWith('/resources?page=3');

    fireEvent.click(screen.getByRole('button', { name: /prev/i }));
    expect(mockPush).toHaveBeenCalledWith('/resources?page=1');
  });
});
