import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { toPayloadReason, buildDetails, submitReport } from '@/lib/payloadReports';

const API = 'http://payload.test/api';
const ok = (body: unknown = {}) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
const fail = (status: number, message: string) =>
  Promise.resolve(new Response(JSON.stringify({ errors: [{ message }] }), { status }));

beforeEach(() => vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', API));
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('toPayloadReason', () => {
  it('maps every design reason onto a value Payload accepts', () => {
    const accepted = ['inaccurate', 'inappropriate', 'infringing', 'spam', 'outdated', 'broken-link'];
    for (const r of ['inappropriate', 'inaccurate', 'copyright', 'misleading', 'abuse', 'broken', 'sacred_error', 'other'] as const)
      expect(accepted).toContain(toPayloadReason(r));
    expect(toPayloadReason('copyright')).toBe('infringing');
    expect(toPayloadReason('broken')).toBe('broken-link');
  });
});

describe('buildDetails', () => {
  it('keeps the original design reason (lossy mapping) and the evidence link', () => {
    const d = buildDetails('sacred_error', 'wrong ayah', 'https://x.test/a.png');
    expect(d).toContain('[sacred_error]');
    expect(d).toContain('wrong ayah');
    expect(d).toContain('https://x.test/a.png');
  });
  it('never exceeds the 500 char server limit', () => {
    expect(buildDetails('other', 'x'.repeat(900), 'https://x.test/' + 'y'.repeat(200)).length).toBeLessThanOrEqual(500);
  });
});

describe('submitReport', () => {
  it('posts resource, mapped reason and details only; status/reporter are server-set', async () => {
    const f = vi.fn(() => ok());
    vi.stubGlobal('fetch', f);
    expect(await submitReport('payload_7', 'broken', 'dead link', '')).toBeNull();
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${API}/reports`);
    expect(init.credentials).toBe('include');
    const body = JSON.parse(init.body as string);
    expect(Object.keys(body).sort()).toEqual(['details', 'reason', 'resource']);
    expect(body).toMatchObject({ resource: 7, reason: 'broken-link' });
  });

  it('surfaces the duplicate-open-report refusal', async () => {
    vi.stubGlobal('fetch', vi.fn(() => fail(400, 'You already have an open report for this resource.')));
    expect(await submitReport('payload_7', 'broken', 'again', '')).toBe('You already have an open report for this resource.');
  });

  it('rejects non-live resources without a request and survives network failure', async () => {
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    expect(await submitReport('res_b_1', 'broken', 'x', '')).toBeTruthy();
    expect(f).not.toHaveBeenCalled();
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('network'))));
    expect(await submitReport('payload_7', 'broken', 'x', '')).toBeTruthy();
  });
});
