import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import OAuthCallbackPage from '@/app/oauth/callback/page';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { createMockAuthContext } from './test-utils/mockAuth';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

const replace = vi.fn();

function setHash(hash: string) {
  window.history.replaceState(null, '', `/oauth/callback${hash}`);
}

function mockAuth(loginWithCode: ReturnType<typeof vi.fn>) {
  vi.mocked(useAuth).mockReturnValue(createMockAuthContext({ loginWithCode }));
}

describe('OAuthCallbackPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ replace } as unknown as ReturnType<typeof useRouter>);
  });

  // The backend hands the code over in the fragment precisely so it never
  // reaches a server log - reading it from the query string would undo that.
  it('redeems the code from the URL fragment', async () => {
    const loginWithCode = vi.fn().mockResolvedValue({ success: true });
    mockAuth(loginWithCode);
    setHash('#code=ticket-abc');

    render(<OAuthCallbackPage />);

    await waitFor(() => expect(loginWithCode).toHaveBeenCalledWith('ticket-abc'));
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/dashboard'));
  });

  it('strips the code from the address bar', async () => {
    const loginWithCode = vi.fn().mockResolvedValue({ success: true });
    mockAuth(loginWithCode);
    setHash('#code=ticket-abc');

    render(<OAuthCallbackPage />);

    await waitFor(() => expect(window.location.hash).toBe(''));
  });

  it('redeems the code only once', async () => {
    const loginWithCode = vi.fn().mockResolvedValue({ success: true });
    mockAuth(loginWithCode);
    setHash('#code=ticket-abc');

    const { rerender } = render(<OAuthCallbackPage />);
    rerender(<OAuthCallbackPage />);

    await waitFor(() => expect(loginWithCode).toHaveBeenCalledTimes(1));
  });

  it('sends the user back to login when the fragment has no code', async () => {
    const loginWithCode = vi.fn();
    mockAuth(loginWithCode);
    setHash('');

    render(<OAuthCallbackPage />);

    await waitFor(() => expect(replace).toHaveBeenCalledWith('/login?error=oauth_missing_code'));
    expect(loginWithCode).not.toHaveBeenCalled();
  });

  it('sends the user back to login when the exchange fails', async () => {
    const loginWithCode = vi.fn().mockResolvedValue({ success: false, error: 'nope' });
    mockAuth(loginWithCode);
    setHash('#code=spent-ticket');

    render(<OAuthCallbackPage />);

    await waitFor(() => expect(replace).toHaveBeenCalledWith('/login?error=oauth_login_failed'));
  });
});
