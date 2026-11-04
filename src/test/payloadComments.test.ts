import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { toDesignReview, fetchComments, postComment, deleteComment } from '@/lib/payloadComments';

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
