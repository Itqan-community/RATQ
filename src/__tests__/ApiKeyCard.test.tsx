import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { ApiKeyCard } from '@/components/developer/ApiKeyCard';
import { LanguageProvider } from '@/i18n/LanguageContext';
import type { APIKey } from '@/types/resource';

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
  writable: true,
  configurable: true,
});

function createApiKey(overrides: Partial<APIKey> = {}): APIKey {
  return {
    id: 1,
    name: 'Test Key',
    resource_slug: 'test-api',
    resource_name: 'Test API',
    key: 'ratq_live_abc123def456',
    scope: 'read',
    created_at: '2024-01-01T00:00:00Z',
    last_used_at: null,
    ...overrides,
  };
}

function renderWithProvider(ui: React.ReactElement) {
  localStorage.setItem('ratq_locale', 'en');
  const result = render(<LanguageProvider>{ui}</LanguageProvider>);
  act(() => {});
  return result;
}

describe('ApiKeyCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders key name and scope', () => {
    renderWithProvider(<ApiKeyCard apiKey={createApiKey()} />);
    expect(screen.getByText('Test Key')).toBeInTheDocument();
    expect(screen.getByText('read')).toBeInTheDocument();
  });

  it('renders masked key', () => {
    renderWithProvider(<ApiKeyCard apiKey={createApiKey()} />);
    // maskKey shows first 10 chars + dots: 'ratq_live_' + '••••••••'
    expect(screen.getByText(/ratq_live_/)).toBeInTheDocument();
  });

  it('renders copy button', () => {
    renderWithProvider(<ApiKeyCard apiKey={createApiKey()} />);
    expect(screen.getByText('نسخ')).toBeInTheDocument();
  });

  it('copies full key to clipboard on copy click', async () => {
    renderWithProvider(<ApiKeyCard apiKey={createApiKey()} />);
    const copyBtn = screen.getByText('نسخ');
    await act(async () => {
      fireEvent.click(copyBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('ratq_live_abc123def456');
  });

  it('shows "تم النسخ" after successful copy', async () => {
    renderWithProvider(<ApiKeyCard apiKey={createApiKey()} />);
    const copyBtn = screen.getByText('نسخ');
    await act(async () => {
      fireEvent.click(copyBtn);
    });

    await waitFor(() => {
      expect(screen.getByText('تم النسخ')).toBeInTheDocument();
    });
  });

  it('shows revoke button when onRevoke is provided', () => {
    const onRevoke = vi.fn();
    renderWithProvider(<ApiKeyCard apiKey={createApiKey()} onRevoke={onRevoke} />);
    expect(screen.getByText('إبطال')).toBeInTheDocument();
  });

  it('does not show revoke button when onRevoke is not provided', () => {
    renderWithProvider(<ApiKeyCard apiKey={createApiKey()} />);
    expect(screen.queryByText('إبطال')).not.toBeInTheDocument();
  });

  it('calls onRevoke with key id when revoke button is clicked', () => {
    const onRevoke = vi.fn();
    renderWithProvider(<ApiKeyCard apiKey={createApiKey()} onRevoke={onRevoke} />);
    fireEvent.click(screen.getByText('إبطال'));
    expect(onRevoke).toHaveBeenCalledWith(1);
  });

  it('renders creation date', () => {
    renderWithProvider(<ApiKeyCard apiKey={createApiKey()} />);
    // Date is rendered via toLocaleDateString('ar')
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });

  it('renders last used date when present', () => {
    renderWithProvider(
      <ApiKeyCard apiKey={createApiKey({ last_used_at: '2024-06-15T00:00:00Z' })} />
    );
    expect(screen.getByText(/آخر استخدام/)).toBeInTheDocument();
  });

  it('does not render last used date when null', () => {
    renderWithProvider(<ApiKeyCard apiKey={createApiKey({ last_used_at: null })} />);
    expect(screen.queryByText(/آخر استخدام/)).not.toBeInTheDocument();
  });

  it('renders short key as dots when key is 10 chars or less', () => {
    renderWithProvider(<ApiKeyCard apiKey={createApiKey({ key: 'shortkey' })} />);
    expect(screen.getByText('••••••••')).toBeInTheDocument();
  });
});
