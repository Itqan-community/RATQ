import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { RequestRow } from '@/components/developer/RequestRow';
import { LanguageProvider } from '@/i18n/LanguageContext';
import type { AccessRequest } from '@/types/resource';

function createRequest(overrides: Partial<AccessRequest> = {}): AccessRequest {
  return {
    id: 1,
    applicant_name: 'test@example.com',
    applicant_display_name: 'Test User',
    resource_slug: 'test-resource',
    resource_name: 'Test Resource',
    status: 'pending',
    message: 'Test message',
    publisher_notes: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

function renderWithProvider(ui: React.ReactElement) {
  localStorage.setItem('ratq_locale', 'en');
  const result = render(<LanguageProvider>{ui}</LanguageProvider>);
  act(() => {});
  return result;
}

describe('RequestRow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders resource name', () => {
    renderWithProvider(<RequestRow request={createRequest()} />);
    expect(screen.getByText('Test Resource')).toBeInTheDocument();
  });

  it('renders pending status badge', () => {
    renderWithProvider(<RequestRow request={createRequest({ status: 'pending' })} />);
    expect(screen.getByText('معلق')).toBeInTheDocument();
  });

  it('renders approved status badge', () => {
    renderWithProvider(<RequestRow request={createRequest({ status: 'approved' })} />);
    expect(screen.getByText('مقبول')).toBeInTheDocument();
  });

  it('renders denied status badge', () => {
    renderWithProvider(<RequestRow request={createRequest({ status: 'denied' })} />);
    expect(screen.getByText('مرفوض')).toBeInTheDocument();
  });

  it('shows publisher notes when present', () => {
    renderWithProvider(
      <RequestRow request={createRequest({ publisher_notes: 'Approved for research use' })} />
    );
    expect(screen.getByText('Approved for research use')).toBeInTheDocument();
    expect(screen.getByText('ملاحظات الناشر:')).toBeInTheDocument();
  });

  it('does not show publisher notes section when null', () => {
    renderWithProvider(<RequestRow request={createRequest({ publisher_notes: null })} />);
    expect(screen.queryByText('ملاحظات الناشر:')).not.toBeInTheDocument();
  });

  it('renders creation date', () => {
    renderWithProvider(<RequestRow request={createRequest()} />);
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });
});
