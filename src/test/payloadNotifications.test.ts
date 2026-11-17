import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { toDesignNotification, markNotificationRead, markAllNotificationsRead } from '@/lib/payloadNotifications';

const API = 'http://payload.test/api';
const ok = (body: unknown = {}) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
const fail = (status: number, message: string) =>
  Promise.resolve(new Response(JSON.stringify({ errors: [{ message }] }), { status }));
const doc = (over = {}) => ({
  id: 3, type: 'access_approved', message: 'تمت الموافقة', resource_name: 'Tafsir API',
  recipient: 5, read: false, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-02T00:00:00.000Z', ...over,
});

beforeEach(() => vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', API));
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('toDesignNotification', () => {
  it('maps an approval to the design kind, with the resource as title and a link to requests', () => {
    expect(toDesignNotification(doc())).toMatchObject({
      id: 'payload_notif_3', kind: 'request_approved', title_ar: 'Tafsir API', body_ar: 'تمت الموافقة',
      link_url: '/app/requests', priority: 'normal', read_at: undefined,
    });
  });

  it('flags revocations high priority and keeps other types generic', () => {
    expect(toDesignNotification(doc({ type: 'access_revoked' })).priority).toBe('high');
    expect(toDesignNotification(doc({ type: 'comment_reply' })).kind).toBe('comment_reply');
  });

  it('marks read notifications with a read_at and survives a missing resource_name', () => {
    const n = toDesignNotification(doc({ read: true, resource_name: undefined }));
    expect(n.read_at).toBe('2026-01-02T00:00:00.000Z');
    expect(n.title_ar).toBeTruthy();
  });
});

describe('markNotificationRead', () => {
  it('PATCHes only { read: true } with the session cookie', async () => {
    const f = vi.fn(() => ok());
    vi.stubGlobal('fetch', f);
    expect(await markNotificationRead('payload_notif_3')).toBeNull();
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${API}/notifications/3`);
    expect(init.method).toBe('PATCH');
    expect(init.credentials).toBe('include');
    expect(JSON.parse(init.body as string)).toEqual({ read: true });
  });

  it('returns the server error, and rejects non-live ids without a request', async () => {
    vi.stubGlobal('fetch', vi.fn(() => fail(403, 'Forbidden')));
    expect(await markNotificationRead('payload_notif_3')).toBe('Forbidden');
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    expect(await markNotificationRead('notif_001')).toBeTruthy();
    expect(f).not.toHaveBeenCalled();
  });
});

describe('markAllNotificationsRead', () => {
  it('uses one bulk update scoped to unread, and surfaces failure', async () => {
    const f = vi.fn(() => ok());
    vi.stubGlobal('fetch', f);
    expect(await markAllNotificationsRead()).toBeNull();
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(decodeURIComponent(url)).toBe(`${API}/notifications?where[read][equals]=false`);
    expect(init.method).toBe('PATCH');
    expect(JSON.parse(init.body as string)).toEqual({ read: true });

    vi.stubGlobal('fetch', vi.fn(() => fail(500, 'boom')));
    expect(await markAllNotificationsRead()).toBe('boom');
  });
});
