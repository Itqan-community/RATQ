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

import { toDesignReport, fetchReports, resolveReport } from '@/lib/payloadReports';

const reportDoc = (over = {}) => ({
  id: 4, resource: { id: 7, name: 'Tafsir API' }, reporter: 3, reason: 'inaccurate', details: '[sacred_error] wrong ayah',
  status: 'open', createdAt: '2026-01-01T00:00:00.000Z', ...over,
});

describe('toDesignReport', () => {
  it('maps ids/status and recovers the original design reason + priority from the details tag', () => {
    expect(toDesignReport(reportDoc())).toMatchObject({
      id: 'payload_report_4', target_kind: 'resource', target_id: 'payload_7', target_title: 'Tafsir API',
      reason: 'sacred_error', details_ar: 'wrong ayah', priority: 'critical', status: 'open',
    });
  });

  it('falls back to the reverse reason map for untagged details and maps closed -> dismissed', () => {
    const r = toDesignReport(reportDoc({ reason: 'infringing', details: 'plain text', status: 'closed' }));
    expect(r.reason).toBe('copyright');
    expect(r.details_ar).toBe('plain text');
    expect(r.status).toBe('dismissed');
    expect(r.priority).toBe('normal');
  });

  it('accepts a bare resource id and missing details', () => {
    const r = toDesignReport(reportDoc({ resource: 7, details: undefined }));
    expect(r.target_id).toBe('payload_7');
    expect(r.details_ar).toBe('');
  });
});

describe('fetchReports / resolveReport', () => {
  it('lists newest first with credentials and maps docs', async () => {
    const f = vi.fn(() => ok({ docs: [reportDoc()] }));
    vi.stubGlobal('fetch', f);
    expect(await fetchReports()).toHaveLength(1);
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain(`${API}/reports?`);
    expect(url).toContain('sort=-createdAt');
    expect(init.credentials).toBe('include');
  });

  it('returns [] on a refused or failed request', async () => {
    vi.stubGlobal('fetch', vi.fn(() => fail(403, 'no')));
    expect(await fetchReports()).toEqual([]);
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('network'))));
    expect(await fetchReports()).toEqual([]);
  });

  it('PATCHes only { status: "resolved" } and surfaces non-admin refusal', async () => {
    const f = vi.fn(() => ok());
    vi.stubGlobal('fetch', f);
    expect(await resolveReport('payload_report_4')).toBeNull();
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${API}/reports/4`);
    expect(init.method).toBe('PATCH');
    expect(JSON.parse(init.body as string)).toEqual({ status: 'resolved' });
    vi.stubGlobal('fetch', vi.fn(() => fail(403, 'You are not allowed to perform this action.')));
    expect(await resolveReport('payload_report_4')).toBe('You are not allowed to perform this action.');
    const g = vi.fn();
    vi.stubGlobal('fetch', g);
    expect(await resolveReport('rep_001')).toBeTruthy();
    expect(g).not.toHaveBeenCalled();
  });
});
