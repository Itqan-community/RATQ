import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import LegalPage from '@/views/LegalPage';
import i18n from 'i18next';
import '@/i18n/config';

// Payload hashes keys with plain SHA-256 (no pepper) and has no Postgres RLS; the page must not claim otherwise.
const FALSE_CLAIMS = /pepper|RLS|Row Level|فلفل|Pepper/i;

describe('LegalPage privacy', () => {
  it.each(['en', 'ar'])('LegalPage_PrivacyDoc_MakesNoPepperOrRlsClaim (%s)', async (lng) => {
    await i18n.changeLanguage(lng);
    const { container } = render(
      <MemoryRouter initialEntries={['/legal/privacy']}>
        <Routes>
          <Route path="/legal/:slug" element={<LegalPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(container.textContent).not.toMatch(FALSE_CLAIMS);
  });
});
