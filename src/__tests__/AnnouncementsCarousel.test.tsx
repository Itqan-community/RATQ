import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AnnouncementsCarousel from '@/components/resources/AnnouncementsCarousel';
import { LanguageProvider } from '@/i18n/LanguageContext';

const mockUseAnnouncements = vi.fn();

vi.mock('@/hooks/useAnnouncements', () => ({
  useAnnouncements: () => mockUseAnnouncements(),
}));

function renderWithProvider(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('AnnouncementsCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('returns null when no announcements and not loading', () => {
    mockUseAnnouncements.mockReturnValue({
      announcements: [],
      isLoading: false,
      error: null,
    });

    const { container } = renderWithProvider(<AnnouncementsCarousel />);
    expect(container.innerHTML).toBe('');
  });

  it('returns null when loading', () => {
    mockUseAnnouncements.mockReturnValue({
      announcements: [],
      isLoading: true,
      error: null,
    });

    const { container } = renderWithProvider(<AnnouncementsCarousel />);
    expect(container.innerHTML).toBe('');
  });

  it('renders a single announcement as static banner (no controls)', () => {
    mockUseAnnouncements.mockReturnValue({
      announcements: [
        {
          id: '1',
          type: 'release',
          title: 'Test Announcement',
          description: 'Test description',
          created_at: new Date().toISOString(),
          is_active: true,
        },
      ],
      isLoading: false,
      error: null,
    });

    renderWithProvider(<AnnouncementsCarousel />);
    expect(screen.getByText('Test Announcement')).toBeInTheDocument();
    expect(screen.queryByLabelText('Previous announcement')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next announcement')).not.toBeInTheDocument();
  });

  it('renders carousel controls when multiple announcements', () => {
    mockUseAnnouncements.mockReturnValue({
      announcements: [
        {
          id: '1',
          type: 'release',
          title: 'First',
          description: 'Desc 1',
          created_at: new Date().toISOString(),
          is_active: true,
        },
        {
          id: '2',
          type: 'maintenance',
          title: 'Second',
          description: 'Desc 2',
          created_at: new Date().toISOString(),
          is_active: true,
        },
      ],
      isLoading: false,
      error: null,
    });

    renderWithProvider(<AnnouncementsCarousel />);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous announcement')).toBeInTheDocument();
    expect(screen.getByLabelText('Next announcement')).toBeInTheDocument();
  });

  it('pauses auto-rotation on hover', () => {
    mockUseAnnouncements.mockReturnValue({
      announcements: [
        {
          id: '1',
          type: 'release',
          title: 'First',
          description: 'Desc 1',
          created_at: new Date().toISOString(),
          is_active: true,
        },
        {
          id: '2',
          type: 'release',
          title: 'Second',
          description: 'Desc 2',
          created_at: new Date().toISOString(),
          is_active: true,
        },
      ],
      isLoading: false,
      error: null,
    });

    const { container } = renderWithProvider(<AnnouncementsCarousel />);
    const carousel = container.firstChild as HTMLElement;

    // Advance past auto-rotation interval — changes slide to "Second"
    act(() => {
      vi.advanceTimersByTime(8000);
    });

    expect(screen.getByText('Second')).toBeInTheDocument();

    fireEvent.mouseEnter(carousel);
    // Advance more — should NOT change slide while paused
    act(() => {
      vi.advanceTimersByTime(8000);
    });

    // Still showing "Second" — not rotated again
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('has ARIA carousel role', () => {
    mockUseAnnouncements.mockReturnValue({
      announcements: [
        {
          id: '1',
          type: 'release',
          title: 'Test',
          description: 'Desc',
          created_at: new Date().toISOString(),
          is_active: true,
        },
        {
          id: '2',
          type: 'release',
          title: 'Test 2',
          description: 'Desc 2',
          created_at: new Date().toISOString(),
          is_active: true,
        },
      ],
      isLoading: false,
      error: null,
    });

    renderWithProvider(<AnnouncementsCarousel />);
    const carousel = screen.getByRole('region');
    expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
  });
});
