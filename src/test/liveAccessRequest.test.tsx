import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ResourceDetails } from '@/views/ResourceDetails';
import { toDesignResource, type PayloadResourceDoc } from '@/lib/payloadResources';
import { mockRepo } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

// Old prod shows a request-access button on every resource page; live resources are all mapped to access_level
// 'open', so without this the new design offers no way to request access (and API keys need an approved request).
const doc: PayloadResourceDoc = {
  id: 7, name: 'Live Lib', slug: 'live-lib', type: 'library', description: 'd', short_description: 's',
  documentation_url: null, github_url: null, license: 'MIT', itqan_badge: false, status: 'published',
  version: '1.0.0', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
};

const renderAt = () =>
  render(
    <MemoryRouter initialEntries={['/resources/payload-live-lib']}>
      <Routes>
        <Route path="/resources/:slug" element={<ResourceDetails />} />
        <Route path="/auth/sign-in" element={<div>SIGN-IN-PAGE</div>} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', 'http://payload.test/api');
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response(JSON.stringify({ docs: [] }), { status: 200 }))));
  mockRepo.setLiveResources([toDesignResource(doc)]);
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('request access on a live resource', () => {
  it('liveResource_SignedIn_ShowsRequestAccessAndOpensTheDialog', () => {
    useAuthStore.setState({ isAuthenticated: true, currentRole: 'developer' });
    renderAt();
    fireEvent.click(screen.getByRole('button', { name: /طلب وصول/ }));
    expect(screen.getByText('طلب وصول لمورد مقيّد')).toBeInTheDocument();
  });

  it('liveResource_Guest_RequestAccessSendsThemToSignIn', () => {
    useAuthStore.setState({ isAuthenticated: false, currentRole: 'guest' });
    renderAt();
    fireEvent.click(screen.getByRole('button', { name: /طلب وصول/ }));
    expect(screen.getByText('SIGN-IN-PAGE')).toBeInTheDocument();
  });

  it('liveResource_StillOffersTheDownloadAndUseTab', () => {
    useAuthStore.setState({ isAuthenticated: true, currentRole: 'developer' });
    renderAt();
    expect(screen.getByRole('button', { name: 'تنزيل واستخدام' })).toBeInTheDocument();
  });
});
