import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AnnouncementsCarousel from '@/modules/resources/components/AnnouncementsCarousel';
import { LanguageProvider } from '@/shared/ui/i18n/LanguageContext';

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
    window.localStorage.clear();
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

  it('returns null while loading even when announcements are present', () => {
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

  it('does not render the old carousel controls with multiple announcements', () => {
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
    expect(screen.queryByLabelText('Previous announcement')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next announcement')).not.toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.queryByText('1 / 2')).not.toBeInTheDocument();
  });

  it('auto-rotates through announcements and cycles back to the start', () => {
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

    renderWithProvider(<AnnouncementsCarousel />);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(8000);
    });
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(8000);
    });
    expect(screen.getByText('First')).toBeInTheDocument();
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

    renderWithProvider(<AnnouncementsCarousel />);
    const carousel = screen.getByRole('region');

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

  it('resumes auto-rotation after hover ends', () => {
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

    renderWithProvider(<AnnouncementsCarousel />);
    const carousel = screen.getByRole('region');

    fireEvent.mouseEnter(carousel);
    act(() => {
      vi.advanceTimersByTime(8000);
    });
    expect(screen.getByText('First')).toBeInTheDocument();

    fireEvent.mouseLeave(carousel);
    act(() => {
      vi.advanceTimersByTime(8000);
    });
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('pauses auto-rotation while focused and resumes on blur', () => {
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

    renderWithProvider(<AnnouncementsCarousel />);
    const banner = screen.getByRole('region');

    fireEvent.focus(banner);
    act(() => {
      vi.advanceTimersByTime(8000);
    });
    expect(screen.getByText('First')).toBeInTheDocument();

    fireEvent.blur(banner, { relatedTarget: document.body });
    act(() => {
      vi.advanceTimersByTime(8000);
    });
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('navigates with arrow keys when the banner is focused', () => {
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

    renderWithProvider(<AnnouncementsCarousel />);
    const banner = screen.getByRole('region');

    act(() => {
      banner.focus();
    });
    expect(document.activeElement).toBe(banner);

    expect(screen.getByText('First')).toBeInTheDocument();

    fireEvent.keyDown(banner, { key: 'ArrowRight' });
    expect(screen.getByText('Second')).toBeInTheDocument();

    fireEvent.keyDown(banner, { key: 'ArrowLeft' });
    expect(screen.getByText('First')).toBeInTheDocument();
  });

  it('does not navigate with arrow keys when focus is on the CTA link inside the banner', () => {
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

    renderWithProvider(<AnnouncementsCarousel />);
    const cta = screen.getByRole('link');

    act(() => {
      cta.focus();
    });
    expect(document.activeElement).toBe(cta);

    fireEvent.keyDown(cta, { key: 'ArrowRight' });
    expect(screen.getByText('First')).toBeInTheDocument();

    fireEvent.keyDown(cta, { key: 'ArrowLeft' });
    expect(screen.getByText('First')).toBeInTheDocument();
  });

  it('ignores arrow keys pressed outside the banner', () => {
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

    renderWithProvider(<AnnouncementsCarousel />);
    expect(screen.getByText('First')).toBeInTheDocument();

    fireEvent.keyDown(document.body, { key: 'ArrowRight' });
    expect(screen.getByText('First')).toBeInTheDocument();

    fireEvent.keyDown(document.body, { key: 'ArrowLeft' });
    expect(screen.getByText('First')).toBeInTheDocument();
  });

  it('renders a CTA link to the general resources page when the announcement has no specific link', () => {
    mockUseAnnouncements.mockReturnValue({
      announcements: [
        {
          id: '1',
          type: 'maintenance',
          title: 'Planned downtime',
          description: 'Desc',
          created_at: new Date().toISOString(),
          is_active: true,
        },
      ],
      isLoading: false,
      error: null,
    });

    renderWithProvider(<AnnouncementsCarousel />);
    const cta = screen.getByRole('link');
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href', '/resources');
  });

  it('preserves the specific destination when an announcement has one', () => {
    mockUseAnnouncements.mockReturnValue({
      announcements: [
        {
          id: '1',
          type: 'new_resource',
          title: 'New SDK',
          description: 'Desc',
          resource_id: 'cms-10',
          cta_url: '/resources/cms-10',
          cta_label: 'View resource',
          created_at: new Date().toISOString(),
          is_active: true,
        },
      ],
      isLoading: false,
      error: null,
    });

    renderWithProvider(<AnnouncementsCarousel />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/resources/cms-10');
  });

  it('links a breaking_change announcement to its resource when no cta_url exists', () => {
    mockUseAnnouncements.mockReturnValue({
      announcements: [
        {
          id: '1',
          type: 'breaking_change',
          title: 'API v1 Deprecation Notice',
          description: 'Desc',
          resource_id: 'cms-10',
          created_at: new Date().toISOString(),
          is_active: true,
        },
      ],
      isLoading: false,
      error: null,
    });

    renderWithProvider(<AnnouncementsCarousel />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/resources/cms-10');
  });

  it('renders Arabic banner strings by default', () => {
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
    expect(screen.getByRole('heading', { name: 'الإعلانات' })).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveTextContent(/جديد:/);
  });

  it('renders English banner strings when the locale is English', () => {
    window.localStorage.setItem('ratq_locale', 'en');
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
    expect(screen.getByRole('heading', { name: 'Announcements' })).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveTextContent(/New:/);
    window.localStorage.clear();
  });

  it('exposes the banner as a landmark region with a carousel roledescription', () => {
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
    expect(carousel).toHaveAttribute('aria-label', 'الإعلانات');
  });
});
