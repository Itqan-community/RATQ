import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  canTransition,
  createResource,
  deleteResource,
  fetchResourceById,
  isHttpUrl,
  setResourceStatus,
  toPayloadBody,
  toPayloadPatch,
  updateResource,
  uploadCoverImage,
} from '@/lib/payloadOwnResources';
import { toDesignResource } from '@/lib/payloadResources';

// Owner publish / edit / cover-image flows (parity gaps vs old prod). Server stays the authority
// (owner-only update, admin-only itqan_badge); these tests pin what the client may send.

const API = 'http://payload.test/api';
const ok = (body: unknown = {}) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
const fail = (status: number, message: string) =>
  Promise.resolve(new Response(JSON.stringify({ errors: [{ message }] }), { status }));
type Call = [string, RequestInit];
const lastCall = (f: ReturnType<typeof vi.fn>) => f.mock.calls[0] as unknown as Call;

const form = {
  title_ar: 'مكتبة', summary_ar: 'نبذة', readme_ar: '', resource_type: 'library',
  license_spdx: 'MIT', version: '1.0.0', repository_url: '',
  documentation_url: '', website_url: '',
};
const png = () => new File([new Uint8Array([1, 2, 3])], 'cover.png', { type: 'image/png' });

beforeEach(() => vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', API));
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('canTransition', () => {
  it.each([
    ['draft', 'published', true],
    ['draft', 'archived', true],
    ['published', 'draft', true],
    ['published', 'archived', true],
    ['archived', 'draft', true],
    ['archived', 'published', false], // must go back through draft
    ['draft', 'draft', false],
    ['published', 'published', false],
  ])('canTransition_%s_to_%s_is_%s', (from, to, expected) => {
    expect(canTransition(from as never, to as never)).toBe(expected);
  });

  it('canTransition_UnknownStatus_IsFalse', () => {
    expect(canTransition('draft', 'deleted' as never)).toBe(false);
    expect(canTransition('weird' as never, 'published')).toBe(false);
  });
});

describe('setResourceStatus', () => {
  it('setResourceStatus_DraftToPublished_PatchesOnlyStatus', async () => {
    const f = vi.fn(() => ok({ doc: { id: 7 } }));
    vi.stubGlobal('fetch', f);
    expect(await setResourceStatus('payload_7', 'draft', 'published')).toBeNull();
    const [url, init] = lastCall(f);
    expect(url).toBe(`${API}/resources/7`);
    expect(init.method).toBe('PATCH');
    expect(init.credentials).toBe('include');
    expect(JSON.parse(init.body as string)).toEqual({ status: 'published' });
  });

  it('setResourceStatus_IllegalTransition_RefusesWithoutRequest', async () => {
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    expect(await setResourceStatus('payload_7', 'archived', 'published')).toBeTruthy();
    expect(f).not.toHaveBeenCalled();
  });

  it('setResourceStatus_NonLiveId_RefusesWithoutRequest', async () => {
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    expect(await setResourceStatus('res_001', 'draft', 'published')).toBeTruthy();
    expect(f).not.toHaveBeenCalled();
  });

  it('setResourceStatus_ServerForbids_ReturnsServerMessage', async () => {
    vi.stubGlobal('fetch', vi.fn(() => fail(403, 'You are not allowed to perform this action.')));
    expect(await setResourceStatus('payload_7', 'draft', 'published')).toBe('You are not allowed to perform this action.');
  });

  it('setResourceStatus_NetworkFailure_ReturnsMessageNotThrow', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('network'))));
    expect(await setResourceStatus('payload_7', 'draft', 'published')).toBeTruthy();
  });
});

describe('uploadCoverImage', () => {
  it('uploadCoverImage_Png_PostsMultipartWithFileAndAlt', async () => {
    const f = vi.fn(() => ok({ doc: { id: 42, url: '/media/cover.png' } }));
    vi.stubGlobal('fetch', f);
    const out = await uploadCoverImage(png(), 'مكتبة');
    expect(out).toEqual({ id: 42, error: null });
    const [url, init] = lastCall(f);
    expect(url).toBe(`${API}/media`);
    expect(init.method).toBe('POST');
    expect(init.credentials).toBe('include');
    const body = init.body as FormData;
    expect(body).toBeInstanceOf(FormData);
    expect((body.get('file') as File).name).toBe('cover.png');
    // Payload reads multipart fields only from the `_payload` JSON field (addDataAndFileToRequest.js); a plain `alt` is ignored.
    expect(JSON.parse(body.get('_payload') as string)).toEqual({ alt: 'مكتبة' });
    expect(body.get('alt')).toBeNull();
    // Content-Type must be left to the browser (multipart boundary); a manual JSON header would break the upload.
    expect(JSON.stringify(init.headers ?? {})).not.toMatch(/content-type/i);
  });

  it.each(['image/svg+xml', 'application/pdf', 'text/html'])(
    'uploadCoverImage_%s_RejectedClientSideWithoutRequest',
    async (type) => {
      const f = vi.fn();
      vi.stubGlobal('fetch', f);
      const out = await uploadCoverImage(new File(['x'], 'x', { type }), 'alt');
      expect(out.id).toBeNull();
      expect(out.error).toBeTruthy();
      expect(f).not.toHaveBeenCalled();
    }
  );

  it('uploadCoverImage_BlankAlt_RefusesWithoutRequest', async () => {
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    const out = await uploadCoverImage(png(), '   ');
    expect(out.id).toBeNull();
    expect(out.error).toBeTruthy();
    expect(f).not.toHaveBeenCalled();
  });

  it('uploadCoverImage_ServerError_ReturnsMessage', async () => {
    vi.stubGlobal('fetch', vi.fn(() => fail(413, 'File too large')));
    expect(await uploadCoverImage(png(), 'a')).toEqual({ id: null, error: 'File too large' });
  });

  it('uploadCoverImage_NetworkFailure_ReturnsErrorNotThrow', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('network'))));
    const out = await uploadCoverImage(png(), 'a');
    expect(out.id).toBeNull();
    expect(out.error).toBeTruthy();
  });

  it('uploadCoverImage_ResponseWithoutDocId_IsAnError', async () => {
    vi.stubGlobal('fetch', vi.fn(() => ok({})));
    const out = await uploadCoverImage(png(), 'a');
    expect(out.id).toBeNull();
    expect(out.error).toBeTruthy();
  });
});

describe('isHttpUrl', () => {
  it.each([
    ['https://example.com/a', true],
    ['http://example.com', true],
    ['javascript:alert(1)', false],
    ['ftp://example.com', false],
    ['mailto:a@b.c', false],
    ['not a url', false],
    ['', false],
  ])('isHttpUrl_%s_is_%s', (v, expected) => {
    expect(isHttpUrl(v)).toBe(expected);
  });
});

describe('toPayloadPatch', () => {
  it('toPayloadPatch_EditForm_MapsFieldsAndNeverTouchesStatusOrPrivileged', () => {
    const p = toPayloadPatch({ ...form, documentation_url: 'https://docs.example.com', website_url: 'https://example.com' });
    expect(p).toEqual({
      name: 'مكتبة', type: 'library', short_description: 'نبذة', description: 'نبذة',
      license: 'MIT', version: '1.0.0',
      github_url: null, documentation_url: 'https://docs.example.com', website_url: 'https://example.com',
    });
    for (const k of ['status', 'owner', 'slug', 'itqan_badge', 'image']) expect(p).not.toHaveProperty(k);
  });

  it('toPayloadPatch_EmptyUrl_SendsNullToClearTheField', () => {
    const p = toPayloadPatch({ ...form, repository_url: '', documentation_url: '', website_url: '' });
    expect(p.github_url).toBeNull();
    expect(p.documentation_url).toBeNull();
    expect(p.website_url).toBeNull();
  });

  it('toPayloadPatch_ImageId_IncludedOnlyWhenGiven', () => {
    expect(toPayloadPatch(form)).not.toHaveProperty('image'); // undefined = leave unchanged
    expect(toPayloadPatch(form, 42).image).toBe(42);
    expect(toPayloadPatch(form, null).image).toBeNull(); // null = remove cover
  });

  it('toPayloadPatch_ReadmeEmpty_FallsBackToSummaryForRequiredDescription', () => {
    expect(toPayloadPatch({ ...form, readme_ar: 'تفاصيل' }).description).toBe('تفاصيل');
    expect(toPayloadPatch(form).description).toBe('نبذة');
  });
});

describe('toPayloadBody (create) new URL fields', () => {
  it('toPayloadBody_DocAndWebsiteUrls_SentWhenSetOmittedWhenEmpty', () => {
    const withUrls = toPayloadBody({ ...form, documentation_url: 'https://d.example', website_url: 'https://w.example' });
    expect(withUrls).toMatchObject({ documentation_url: 'https://d.example', website_url: 'https://w.example', status: 'draft' });
    const without = toPayloadBody(form);
    expect(without).not.toHaveProperty('documentation_url');
    expect(without).not.toHaveProperty('website_url');
  });
});

describe('review fixes', () => {
  const pdoc = (over: Record<string, unknown> = {}) => ({
    id: 7, name: 'R', slug: 'r', type: 'sdk', description: 'd', short_description: 's',
    documentation_url: null, github_url: null, website_url: null, license: 'MIT', itqan_badge: false,
    status: 'draft', version: null, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', ...over,
  });

  it('toDesignResource_NonHttpUrls_AreDroppedSoNoJavascriptHrefReachesThePage', () => {
    const r = toDesignResource(pdoc({
      github_url: 'javascript:alert(1)', documentation_url: 'data:text/html,x', website_url: 'ftp://x.example',
    }) as never);
    expect(r.repo_url).toBeUndefined();
    expect(r.docs_url).toBeUndefined();
    expect(r.homepage_url).toBeUndefined();
    const ok = toDesignResource(pdoc({ github_url: 'https://github.com/x/y' }) as never);
    expect(ok.repo_url).toBe('https://github.com/x/y');
  });

  it('toPayloadPatch_UnknownType_IsOmittedSoSavingNeverSilentlyRetypes', () => {
    expect(toPayloadPatch({ ...form, resource_type: 'something-new' })).not.toHaveProperty('type');
    expect(toPayloadPatch({ ...form, resource_type: 'dataset' }).type).toBe('dataset');
  });

  it.each(['payload_', 'payload_ 7', 'payload_1e2', 'payload_-1', 'payload_7.5', 'payload_0x10'])(
    'liveId_MalformedId_%s_RejectedEverywhereWithoutRequest',
    async (bad) => {
      const f = vi.fn();
      vi.stubGlobal('fetch', f);
      expect((await fetchResourceById(bad, 'payload_user_5')).resource).toBeNull();
      expect(await setResourceStatus(bad, 'draft', 'published')).toBeTruthy();
      expect(await updateResource(bad, form)).toBeTruthy();
      expect(await deleteResource(bad)).toBeTruthy();
      expect(f).not.toHaveBeenCalled();
    }
  );

  it('fetchResourceById_LegacyNonHttpLink_IsKeptInTheFormNotBlanked', async () => {
    vi.stubGlobal('fetch', vi.fn(() => ok(pdoc({ github_url: 'github.com/x/y', owner: 5 }))));
    const out = await fetchResourceById('payload_7', 'payload_user_5');
    expect(out.form?.repository_url).toBe('github.com/x/y'); // visible, so saving makes the owner fix it
    expect(await updateResource('payload_7', out.form!)).toBe('Links must start with http:// or https://.');
  });

  it('fetchResourceById_NotTheOwner_IsNotFound', async () => {
    vi.stubGlobal('fetch', vi.fn(() => ok(pdoc({ owner: 9 }))));
    expect((await fetchResourceById('payload_7', 'payload_user_5')).form).toBeNull();
    vi.stubGlobal('fetch', vi.fn(() => ok(pdoc({ owner: { id: 5 } }))));
    expect((await fetchResourceById('payload_7', 'payload_user_5')).form).not.toBeNull(); // populated owner object
    expect((await fetchResourceById('payload_7', 'user_pub_001')).form).toBeNull(); // not a live profile
  });

  it('fetchResourceById_Found_GetsByNumericIdAndMaps', async () => {
    const f = vi.fn(() => ok(pdoc({ owner: 5 })));
    vi.stubGlobal('fetch', f);
    const out = await fetchResourceById('payload_7', 'payload_user_5');
    expect(out.error).toBeNull();
    expect(out.resource?.id).toBe('payload_7');
    expect(out.form?.title_ar).toBe('R');
    const [url, init] = lastCall(f);
    expect(url).toBe(`${API}/resources/7?depth=0`);
    expect(init.credentials).toBe('include');
  });

  it('fetchResourceById_404_IsNotFoundAndNetworkIsDistinct', async () => {
    vi.stubGlobal('fetch', vi.fn(() => fail(404, 'Not Found')));
    expect((await fetchResourceById('payload_7', 'payload_user_5')).error).toBe('Resource not found.');
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('network'))));
    const net = await fetchResourceById('payload_7', 'payload_user_5');
    expect(net.resource).toBeNull();
    expect(net.error).not.toBe('Resource not found.');
  });

  it('fetchResourceById_NonLiveId_NoRequest', async () => {
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    expect((await fetchResourceById('res_001', 'payload_user_5')).resource).toBeNull();
    expect(f).not.toHaveBeenCalled();
  });
});

describe('createResource cover image', () => {
  it('createResource_ImageId_SentAsMediaIdStillDraft', async () => {
    const f = vi.fn(() => ok({ doc: { id: 1 } }));
    vi.stubGlobal('fetch', f);
    expect(await createResource(form, 42)).toBeNull();
    const sent = JSON.parse(lastCall(f)[1].body as string);
    expect(sent.image).toBe(42);
    expect(sent.status).toBe('draft');
  });

  it('createResource_NoImageId_OmitsImage', async () => {
    const f = vi.fn(() => ok({ doc: { id: 1 } }));
    vi.stubGlobal('fetch', f);
    await createResource(form);
    expect(JSON.parse(lastCall(f)[1].body as string)).not.toHaveProperty('image');
  });

  it.each(['javascript:alert(1)', 'nope'])('createResource_UnsafeUrl_%s_RefusedWithoutRequest', async (bad) => {
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    expect(await createResource({ ...form, website_url: bad })).toBeTruthy();
    expect(f).not.toHaveBeenCalled();
  });
});

describe('updateResource', () => {
  it('updateResource_Valid_PatchesBodyByNumericId', async () => {
    const f = vi.fn(() => ok({ doc: { id: 7 } }));
    vi.stubGlobal('fetch', f);
    expect(await updateResource('payload_7', form, 42)).toBeNull();
    const [url, init] = lastCall(f);
    expect(url).toBe(`${API}/resources/7`);
    expect(init.method).toBe('PATCH');
    expect(init.credentials).toBe('include');
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json');
    const sent = JSON.parse(init.body as string);
    expect(sent.image).toBe(42);
    expect(sent).not.toHaveProperty('status');
  });

  it('updateResource_NonLiveId_RefusesWithoutRequest', async () => {
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    expect(await updateResource('res_001', form)).toBeTruthy();
    expect(f).not.toHaveBeenCalled();
  });

  it.each(['javascript:alert(1)', 'ftp://x.example', 'nope'])(
    'updateResource_UnsafeUrl_%s_RefusedWithoutRequest',
    async (bad) => {
      const f = vi.fn();
      vi.stubGlobal('fetch', f);
      expect(await updateResource('payload_7', { ...form, website_url: bad })).toBeTruthy();
      expect(await updateResource('payload_7', { ...form, documentation_url: bad })).toBeTruthy();
      expect(await updateResource('payload_7', { ...form, repository_url: bad })).toBeTruthy();
      expect(f).not.toHaveBeenCalled();
    }
  );

  it('updateResource_NotOwner_ReturnsServerRefusal', async () => {
    vi.stubGlobal('fetch', vi.fn(() => fail(403, 'You are not allowed to perform this action.')));
    expect(await updateResource('payload_7', form)).toBe('You are not allowed to perform this action.');
  });

  it('updateResource_NetworkFailure_ReturnsMessageNotThrow', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('network'))));
    expect(await updateResource('payload_7', form)).toBeTruthy();
  });
});
