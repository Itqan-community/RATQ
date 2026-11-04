import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { safeCtaUrl, toAnnouncement, fetchAnnouncements } from '@/lib/payloadAnnouncements';

const API = 'http://payload.test/api';
const ok = (body: unknown = {}) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
const doc = (over = {}) => ({
  id: 1, type: 'release', title: 'v2 released', description: 'What is new', cta_url: 'https://example.test/x',
  cta_label: 'Read', is_active: true, expires_at: null, ...over,
});

beforeEach(() => vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', API));
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('safeCtaUrl (admin-entered, rendered as a link)', () => {
  it('allows http(s) and site-relative URLs', () => {
    expect(safeCtaUrl('https://a.test/p')).toBe('https://a.test/p');
    expect(safeCtaUrl('http://a.test')).toBe('http://a.test');
    expect(safeCtaUrl('/resources/x')).toBe('/resources/x');
  });

  it('rejects script/data/other schemes, protocol-relative and empty values', () => {
    for (const bad of ['javascript:alert(1)', 'JaVaScRiPt:alert(1)', 'data:text/html,x', 'vbscript:x', '//evil.test', '', null, undefined])
      expect(safeCtaUrl(bad as never)).toBeNull();
  });
});

describe('toAnnouncement', () => {
  it('maps fields and drops an unsafe CTA but keeps the announcement', () => {
    expect(toAnnouncement(doc())).toMatchObject({ id: 1, type: 'release', title: 'v2 released', ctaUrl: 'https://example.test/x', ctaLabel: 'Read' });
    expect(toAnnouncement(doc({ cta_url: 'javascript:alert(1)' })).ctaUrl).toBeNull();
  });
});

describe('fetchAnnouncements', () => {
  it('requests a bounded list and maps the docs (server already filters active/unexpired)', async () => {
    const f = vi.fn(() => ok({ docs: [doc(), doc({ id: 2 })] }));
    vi.stubGlobal('fetch', f);
    const out = await fetchAnnouncements();
    expect(out.map((a) => a.id)).toEqual([1, 2]);
    expect(decodeURIComponent((f.mock.calls[0] as unknown as [string])[0])).toContain(`${API}/announcements?`);
    expect((f.mock.calls[0] as unknown as [string])[0]).toContain('limit=');
  });

  it('returns [] on failure or when not live', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('network'))));
    expect(await fetchAnnouncements()).toEqual([]);
    vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', '');
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    expect(await fetchAnnouncements()).toEqual([]);
    expect(f).not.toHaveBeenCalled();
  });
});
