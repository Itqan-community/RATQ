import { describe, it, expect } from 'vitest';
import { canonicalAuthUrl } from '@/lib/canonicalHost';

describe('canonicalAuthUrl', () => {
  it('canonicalAuthUrl_QuranTechAuthPath_ReturnsCanonicalUrlKeepingQueryAndHash', () => {
    expect(canonicalAuthUrl('quran.tech', '/auth/sign-in', '?redirect=%2Fapp', '#x')).toBe(
      'https://ratq.itqan.dev/auth/sign-in?redirect=%2Fapp#x',
    );
    expect(canonicalAuthUrl('quran.tech', '/app/keys', '', '')).toBe('https://ratq.itqan.dev/app/keys');
  });

  it('canonicalAuthUrl_PrefixOnlyAsWholeSegment_NoFalsePositive', () => {
    expect(canonicalAuthUrl('quran.tech', '/authors', '', '')).toBeNull();
    expect(canonicalAuthUrl('quran.tech', '/application', '', '')).toBeNull();
  });

  it('canonicalAuthUrl_BareAuthPrefix_Redirects', () => {
    expect(canonicalAuthUrl('quran.tech', '/auth', '', '')).toBe('https://ratq.itqan.dev/auth');
  });

  it('canonicalAuthUrl_PublicPagesOnQuranTech_StayPut', () => {
    expect(canonicalAuthUrl('quran.tech', '/resources', '', '')).toBeNull();
    expect(canonicalAuthUrl('quran.tech', '/', '', '')).toBeNull();
  });

  it('canonicalAuthUrl_OtherHosts_NeverRedirect', () => {
    expect(canonicalAuthUrl('ratq.itqan.dev', '/auth/sign-in', '', '')).toBeNull();
    expect(canonicalAuthUrl('beta.ratq.itqan.dev', '/app', '', '')).toBeNull();
    expect(canonicalAuthUrl('localhost', '/auth/sign-in', '', '')).toBeNull();
    expect(canonicalAuthUrl('evilquran.tech', '/auth/sign-in', '', '')).toBeNull();
  });
});
