import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import type { User } from '@/types/resource';

const storedUser: User = {
  id: 42,
  email: 'developer@example.com',
  display_name: 'Test Developer',
  role: 'developer',
  created_at: '2026-08-14T00:00:00.000Z',
};

function jwtWithExp(exp: number): string {
  const header = btoa(JSON.stringify({ alg: 'HS256' }));
  const payload = btoa(JSON.stringify({ exp }));
  return `${header}.${payload}.signature`;
}

function storeSession(exp: number) {
  const token = jwtWithExp(exp);
  localStorage.setItem('ratq_access_token', token);
  localStorage.setItem('ratq_refresh_token', token);
  localStorage.setItem('ratq_user', JSON.stringify(storedUser));
}

function AuthStateProbe() {
  const { user, loading } = useAuth();

  return (
    <p data-testid="auth-state">
      {loading ? 'loading' : user?.email ?? 'anonymous'}
    </p>
  );
}

describe('AuthProvider hydration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('hydrates without a mismatch and restores a stored session', async () => {
    const serverHtml = renderToString(
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>
    );
    expect(serverHtml).toContain('loading');

    const container = document.createElement('div');
    container.innerHTML = serverHtml;
    document.body.appendChild(container);
    storeSession(Math.floor(Date.now() / 1000) + 3600);

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const root = hydrateRoot(
      container,
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(container).toHaveTextContent(storedUser.email);
    });

    const errors = consoleError.mock.calls.flat().map(String).join(' ');
    expect(errors).not.toMatch(/hydration|did not match|server rendered html/i);

    await act(async () => root.unmount());
    container.remove();
  });

  it('restores a valid stored user after mounting', async () => {
    storeSession(Math.floor(Date.now() / 1000) + 3600);

    render(
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent(storedUser.email);
    });
  });

  it('resolves to anonymous when no session is stored', async () => {
    render(
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('anonymous');
    });
  });

  it('clears an expired stored session', async () => {
    storeSession(Math.floor(Date.now() / 1000) - 60);

    render(
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('anonymous');
    });
    expect(localStorage.getItem('ratq_access_token')).toBeNull();
    expect(localStorage.getItem('ratq_refresh_token')).toBeNull();
    expect(localStorage.getItem('ratq_user')).toBeNull();
  });
});
