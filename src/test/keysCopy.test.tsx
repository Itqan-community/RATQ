import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import i18n from '@/i18n/config';
import { AppKeysPage } from '@/views/AppKeys';
import { KeyTable } from '@/components/keys/KeyTable';
import { DEMO_API_KEYS } from '@/lib/mockData';

// Payload deletes the old key immediately on rotate and stores a plain SHA-256 (no pepper/salt).
const WRONG = /24 ?h|24 ساعة|pepper|salt|فلفل/i;

afterEach(() => i18n.changeLanguage('ar'));

describe('API key page copy matches Payload behaviour', () => {
  it.each(['ar', 'en'])('AppKeysPage_%s_makesNoPepperOrGraceClaims', async (lng) => {
    await i18n.changeLanguage(lng);
    const { container } = render(<AppKeysPage />);
    expect(container.textContent).not.toMatch(WRONG);
    expect(container.textContent).toMatch(/SHA-256/);
  });

  it('KeyTable_RotateButton_saysOldKeyIsDeletedImmediately', () => {
    render(<KeyTable keys={DEMO_API_KEYS.filter((k) => k.status === 'active')} onRotate={() => {}} onRevoke={() => {}} />);
    const title = screen.getAllByText('تدوير')[0].closest('button')!.getAttribute('title')!;
    expect(title).not.toMatch(WRONG);
    expect(title).toContain('فوراً');
  });
});
