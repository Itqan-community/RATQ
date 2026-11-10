import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LEGACY_REDIRECTS, legacyRoutes } from '@/lib/legacyRoutes';

// Every page.tsx under live RATQ main `src/app` that the new router does not serve natively.
const OLD_ONLY_PATHS = [
  '/login', '/register', '/forgot-password', '/logout', '/privacy',
  '/dashboard', '/dashboard/requests', '/dashboard/api-keys', '/dashboard/settings', '/dashboard/resources',
  '/developer', '/developer/resources', '/developer/requests', '/developer/access', '/developer/comments',
  '/developer/reports', '/developer/notifications', '/developer/settings',
];

const Where: React.FC = () => {
  const l = useLocation();
  return <div data-testid="where">{l.pathname + l.search + l.hash}</div>;
};

const renderAt = (url: string) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        {legacyRoutes}
        <Route path="*" element={<Where />} />
      </Routes>
    </MemoryRouter>
  );

describe('legacy redirects', () => {
  it.each(OLD_ONLY_PATHS.filter((p) => p !== '/logout'))('legacyRoutes_OldPath_HasTarget (%s)', (p) => {
    expect(LEGACY_REDIRECTS[p]).toMatch(/^\//);
  });

  it('legacyRoutes_LoginPath_RedirectsToSignIn', () => {
    renderAt('/login');
    expect(screen.getByTestId('where').textContent).toBe('/auth/sign-in');
  });

  it('legacyRoutes_DeveloperResourceSlug_KeepsSlugEncoded', () => {
    renderAt('/developer/resources/my%20slug');
    expect(screen.getByTestId('where').textContent).toBe('/resources/my%20slug');
  });

  it('legacyRoutes_QueryAndHash_Preserved', () => {
    renderAt('/dashboard/api-keys?x=1#h');
    expect(screen.getByTestId('where').textContent).toBe('/app/keys?x=1#h');
  });

  it('legacyRoutes_NoTargetIsAnotherLegacyPath_NoChains', () => {
    for (const to of Object.values(LEGACY_REDIRECTS)) expect(LEGACY_REDIRECTS[to]).toBeUndefined();
  });
});
