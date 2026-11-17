import React from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ContactPage } from '@/views/Contact';

// Old prod's contact page is static: email, GitHub issues, community forum. A form that only fakes "sent"
// would silently drop real messages, so live mode shows the real channels instead.
const renderPage = () =>
  render(
    <MemoryRouter>
      <ContactPage />
    </MemoryRouter>
  );

afterEach(() => vi.unstubAllEnvs());

describe('ContactPage', () => {
  it('contactPage_LiveMode_ShowsRealChannelsAndNoFakeForm', () => {
    vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', 'http://payload.test/api');
    renderPage();
    const hrefs = Array.from(document.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('mailto:connect@itqan.dev');
    expect(hrefs).toContain('https://github.com/Itqan-community/RATQ/issues');
    expect(hrefs).toContain('https://community.itqan.dev');
    expect(document.querySelector('form')).toBeNull();
    expect(screen.queryByText(/security@ratq\.org/)).toBeNull(); // not a real mailbox
  });

  it('contactPage_NoDeadOrGenericCommunityLinks', () => {
    vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', 'http://payload.test/api');
    renderPage();
    const hrefs = Array.from(document.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(hrefs).not.toContain('#forum');
    expect(hrefs).not.toContain('https://github.com');
  });

  it('contactPage_MockMode_StillShowsTheDemoForm', () => {
    renderPage();
    expect(document.querySelector('form')).not.toBeNull();
  });
});
