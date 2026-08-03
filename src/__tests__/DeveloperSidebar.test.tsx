import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { DeveloperSidebar } from '@/components/layout/DeveloperSidebar';

// Mutable pathname for mock — reset in beforeEach
let mockPathname = '/developer';

// Mock next/navigation — reads from mockPathname
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

// Mock next/link — render children as a <span> so text is queryable
vi.mock('next/link', () => ({
  default: ({ children, className, 'aria-current': ariaCurrent, onClick }: any) => (
    <span className={className} aria-current={ariaCurrent} onClick={onClick}>
      {children}
    </span>
  ),
}));

describe('DeveloperSidebar', () => {
  beforeEach(() => {
    mockPathname = '/developer';
    vi.clearAllMocks();
  });

  it('renders all navigation items', () => {
    render(
      <DeveloperSidebar mobileOpen={false} onMobileClose={() => {}} />
    );

    expect(screen.getByText('نظرة عامة')).toBeInTheDocument();
    expect(screen.getByText('مواردي المنشورة')).toBeInTheDocument();
    expect(screen.getByText('الوصول لدي')).toBeInTheDocument();
    expect(screen.getByText('طلبات الوصول')).toBeInTheDocument();
    expect(screen.getByText('التقارير')).toBeInTheDocument();
    expect(screen.getByText('التعليقات والنقاشات')).toBeInTheDocument();
    expect(screen.getByText('الإشعارات')).toBeInTheDocument();
    expect(screen.getByText('الإعدادات')).toBeInTheDocument();
  });

  it('renders the dashboard header', () => {
    render(
      <DeveloperSidebar mobileOpen={false} onMobileClose={() => {}} />
    );
    expect(screen.getByText('لوحة المطور')).toBeInTheDocument();
  });

  it('marks the active route with active styles', () => {
    mockPathname = '/developer';
    render(
      <DeveloperSidebar mobileOpen={false} onMobileClose={() => {}} />
    );
    const overviewLink = screen.getByText('نظرة عامة').parentElement;
    expect(overviewLink).toHaveClass('bg-[var(--accent-primary)]');
    expect(overviewLink).toHaveClass('text-white');
  });

  it('marks nested route as active for parent', () => {
    mockPathname = '/developer/resources';
    render(
      <DeveloperSidebar mobileOpen={false} onMobileClose={() => {}} />
    );
    const resourcesLink = screen.getByText('مواردي المنشورة').parentElement;
    expect(resourcesLink).toHaveClass('bg-[var(--accent-primary)]');
    expect(resourcesLink).toHaveClass('text-white');
  });

  it('calls onMobileClose when close button is clicked', () => {
    const onMobileClose = vi.fn();
    render(
      <DeveloperSidebar mobileOpen={true} onMobileClose={onMobileClose} />
    );
    const closeBtn = screen.getByLabelText('إغلاق القائمة الجانبية');
    fireEvent.click(closeBtn);
    expect(onMobileClose).toHaveBeenCalledTimes(1);
  });

  it('calls onMobileClose when a nav link is clicked', () => {
    const onMobileClose = vi.fn();
    render(
      <DeveloperSidebar mobileOpen={true} onMobileClose={onMobileClose} />
    );
    fireEvent.click(screen.getByText('نظرة عامة'));
    expect(onMobileClose).toHaveBeenCalledTimes(1);
  });
});
