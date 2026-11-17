import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { toDesignReview, fetchComments, fetchMyComments, postComment, deleteComment } from '@/lib/payloadComments';

const API = 'http://payload.test/api';
const ok = (body: unknown = {}) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
const fail = (status: number, message: string) =>
  Promise.resolve(new Response(JSON.stringify({ errors: [{ message }] }), { status }));
const doc = (over = {}) => ({
  id: 8, content: 'Great library', author: 3, author_name: 'Ada', resource: 7,
  createdAt: '2026-01-01T00:00:00.000Z', ...over,
});

beforeEach(() => vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', API));
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('toDesignReview', () => {
  it('maps a comment: name from author_name (never email), no rating, accepts populated relations', () => {
    expect(toDesignReview(doc())).toMatchObject({
      id: 'payload_comment_8', resource_id: 'payload_7', profile_id: 'payload_user_3',
      rating: 0, body_ar: 'Great library', status: 'published',
    });
    expect(toDesignReview(doc()).profile?.display_name).toBe('Ada');
    expect(toDesignReview(doc({ author: { id: 4 }, resource: { id: 9 } }))).toMatchObject({
      profile_id: 'payload_user_4', resource_id: 'payload_9',
    });
  });
});

describe('fetchComments', () => {
  it('queries by resource, newest first, and maps results', async () => {
    const f = vi.fn(() => ok({ docs: [doc()] }));
    vi.stubGlobal('fetch', f);
    const out = await fetchComments('payload_7');
    expect(out).toHaveLength(1);
    const url = decodeURIComponent((f.mock.calls[0] as unknown as [string])[0]);
    expect(url).toContain(`${API}/comments?`);
    expect(url).toContain('where[resource][equals]=7');
    expect(url).toContain('sort=-createdAt');
    expect(url).toContain('limit=100'); // old prod's cap; 50 silently hid older comments
  });

  it('returns [] for non-live resources (no request) and on failure', async () => {
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    expect(await fetchComments('res_b_1')).toEqual([]);
    expect(f).not.toHaveBeenCalled();
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('network'))));
    expect(await fetchComments('payload_7')).toEqual([]);
  });
});

describe('postComment', () => {
  it('posts only resource + content (author/author_name are server-set)', async () => {
    const f = vi.fn(() => ok({ doc: doc() }));
    vi.stubGlobal('fetch', f);
    expect(await postComment('payload_7', 'Great library')).toBeNull();
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${API}/comments`);
    expect(init.credentials).toBe('include');
    expect(JSON.parse(init.body as string)).toEqual({ resource: 7, content: 'Great library' });
  });

  it('returns server errors and rejects non-live resources', async () => {
    vi.stubGlobal('fetch', vi.fn(() => fail(403, 'You are not allowed to perform this action.')));
    expect(await postComment('payload_7', 'x')).toBe('You are not allowed to perform this action.');
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    expect(await postComment('res_b_1', 'x')).toBeTruthy();
    expect(f).not.toHaveBeenCalled();
  });
});

describe('deleteComment', () => {
  it('DELETEs by id with the session cookie', async () => {
    const f = vi.fn(() => ok());
    vi.stubGlobal('fetch', f);
    expect(await deleteComment('payload_comment_8')).toBeNull();
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${API}/comments/8`);
    expect(init.method).toBe('DELETE');
    expect(init.credentials).toBe('include');
  });

  it('surfaces a refusal (not the author) and rejects non-live ids', async () => {
    vi.stubGlobal('fetch', vi.fn(() => fail(403, 'Forbidden')));
    expect(await deleteComment('payload_comment_8')).toBe('Forbidden');
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    expect(await deleteComment('rev_1')).toBeTruthy();
    expect(f).not.toHaveBeenCalled();
  });
});

describe('fetchMyComments', () => {
  const doc = { id: 11, content: 'jazak Allah', author: 5, author_name: 'Sara', resource: { id: 7, name: 'Tafsir' }, createdAt: '2026-01-01T00:00:00.000Z' };

  it('filters by author = me and keeps the resource name for display', async () => {
    const f = vi.fn(() => Promise.resolve(new Response(JSON.stringify({ docs: [doc] }), { status: 200 })));
    vi.stubGlobal('fetch', f);
    const rows = await fetchMyComments('payload_user_5');
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${API}/comments?where[author][equals]=5&sort=-createdAt&depth=1&limit=100`);
    expect(init.credentials).toBe('include');
    expect(rows).toHaveLength(1);
    expect(rows[0].review).toMatchObject({ id: 'payload_comment_11', resource_id: 'payload_7', body_ar: 'jazak Allah' });
    expect(rows[0].resourceName).toBe('Tafsir');
  });

  it('guest / non-payload profile: no request, empty list', async () => {
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    expect(await fetchMyComments('user_dev_001')).toEqual([]);
    expect(f).not.toHaveBeenCalled();
  });

  it('empty list on server refusal or network failure', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response('{}', { status: 500 }))));
    expect(await fetchMyComments('payload_user_5')).toEqual([]);
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('network'))));
    expect(await fetchMyComments('payload_user_5')).toEqual([]);
  });
});
