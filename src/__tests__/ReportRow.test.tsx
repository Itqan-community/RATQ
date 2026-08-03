import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ReportRow } from '@/components/developer/ReportRow';
import { LanguageProvider } from '@/i18n/LanguageContext';
import type { Report } from '@/types/resource';

function createReport(overrides: Partial<Report> = {}): Report {
  return {
    id: 1,
    reporter_name: 'Test User',
    resource_slug: 'test-resource',
    reason: 'outdated',
    details: 'This resource is outdated.',
    status: 'open',
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

function renderWithProvider(ui: React.ReactElement) {
  localStorage.setItem('ratq_locale', 'en');
  const result = render(<LanguageProvider>{ui}</LanguageProvider>);
  act(() => {});
  return result;
}

describe('ReportRow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders resource slug', () => {
    renderWithProvider(<ReportRow report={createReport()} />);
    expect(screen.getByText('test-resource')).toBeInTheDocument();
  });

  it('renders open status', () => {
    renderWithProvider(<ReportRow report={createReport({ status: 'open' })} />);
    expect(screen.getByText('مفتوح')).toBeInTheDocument();
  });

  it('renders resolved status', () => {
    renderWithProvider(<ReportRow report={createReport({ status: 'resolved' })} />);
    expect(screen.getByText('محلول')).toBeInTheDocument();
  });

  it('renders closed status', () => {
    renderWithProvider(<ReportRow report={createReport({ status: 'closed' })} />);
    expect(screen.getByText('مغلق')).toBeInTheDocument();
  });

  it('renders outdated reason label', () => {
    renderWithProvider(<ReportRow report={createReport({ reason: 'outdated' })} />);
    expect(screen.getByText('قديم')).toBeInTheDocument();
  });

  it('renders inaccurate reason label', () => {
    renderWithProvider(<ReportRow report={createReport({ reason: 'inaccurate' })} />);
    expect(screen.getByText('غير دقيق')).toBeInTheDocument();
  });

  it('renders inappropriate reason label', () => {
    renderWithProvider(<ReportRow report={createReport({ reason: 'inappropriate' })} />);
    expect(screen.getByText('غير لائق')).toBeInTheDocument();
  });

  it('renders infringing reason label', () => {
    renderWithProvider(<ReportRow report={createReport({ reason: 'infringing' })} />);
    expect(screen.getByText('انتهاك')).toBeInTheDocument();
  });

  it('renders spam reason label', () => {
    renderWithProvider(<ReportRow report={createReport({ reason: 'spam' })} />);
    expect(screen.getByText('مزعج')).toBeInTheDocument();
  });

  it('renders broken-link reason label', () => {
    renderWithProvider(<ReportRow report={createReport({ reason: 'broken-link' })} />);
    expect(screen.getByText('رابط معطل')).toBeInTheDocument();
  });

  it('renders report details', () => {
    renderWithProvider(<ReportRow report={createReport()} />);
    expect(screen.getByText('This resource is outdated.')).toBeInTheDocument();
  });

  it('renders creation date', () => {
    renderWithProvider(<ReportRow report={createReport()} />);
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });
});
