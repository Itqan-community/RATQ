import { describe, it, expect } from 'vitest';
import { ctaBanner, isSynthesizedLicense, mediaUrl, photosFor, relatedTo, siteHost } from '@/lib/resourceDetail';
import { licenseFor } from '@/lib/resourceMapping';
import type { Resource } from '@/types';

const r = (over: Partial<Resource> = {}): Resource => ({ id: 'payload_1', slug: 'payload-a', resource_type: 'mushaf', ...over } as Resource);

describe('siteHost', () => {
  it('returns the hostname without www and null for non-http or garbage', () => {
    expect(siteHost('https://www.tanzil.net/docs')).toBe('tanzil.net');
    expect(siteHost('javascript:alert(1)')).toBeNull();
    expect(siteHost('not a url')).toBeNull();
    expect(siteHost(undefined)).toBeNull();
  });
});

describe('ctaBanner', () => {
  it('prefers the website, falls back to docs, then to the CMS gallery page', () => {
    expect(ctaBanner(r({ homepage_url: 'https://a.test/', docs_url: 'https://d.test/' }))).toEqual({ kind: 'site', href: 'https://a.test/', host: 'a.test' });
    expect(ctaBanner(r({ docs_url: 'https://d.test/x' }))).toEqual({ kind: 'site', href: 'https://d.test/x', host: 'd.test' });
    expect(ctaBanner(r({ source: 'cms', source_url: 'https://cms.test/gallery/asset/1' }))).toEqual({ kind: 'cms', href: 'https://cms.test/gallery/asset/1' });
  });
  it('lets a malformed website not shadow a good docs link and never links a non-http scheme', () => {
    expect(ctaBanner(r({ homepage_url: 'javascript:1', docs_url: 'https://d.test/' }))?.href).toBe('https://d.test/');
    expect(ctaBanner(r({ homepage_url: 'javascript:1' }))).toBeNull();
    expect(ctaBanner(r({ source: 'cms', source_url: 'javascript:1' }))).toBeNull();
  });
  it('uses the CMS page only when no website exists and the source is the CMS', () => {
    expect(ctaBanner(r({ source: 'payload', source_url: 'https://x.test/' }))).toBeNull();
    expect(ctaBanner(r({ source: 'cms', homepage_url: 'https://a.test/', source_url: 'https://x.test/' }))?.kind).toBe('site');
  });
});

describe('photosFor', () => {
  it('uses preview images, else the single image, http(s) only, never duplicated', () => {
    expect(photosFor(r({ preview_images: ['https://a.test/1.png', 'javascript:1'], image_url: 'https://a.test/c.png' }))).toEqual(['https://a.test/1.png']);
    expect(photosFor(r({ preview_images: [], image_url: 'https://a.test/c.png' }))).toEqual(['https://a.test/c.png']);
    expect(photosFor(r({ image_url: 'data:image/png;base64,AAAA' }))).toEqual([]);
    expect(photosFor(r())).toEqual([]);
  });
});

describe('relatedTo', () => {
  const all = ['a', 'b', 'c', 'd', 'e', 'f'].map((s) => r({ id: s, slug: s, resource_type: 'mushaf' }));
  it('keeps the same type, drops the current resource and caps at 4', () => {
    const out = relatedTo([...all, r({ id: 'x', resource_type: 'font' })], all[0]);
    expect(out.map((x) => x.id)).toEqual(['b', 'c', 'd', 'e']);
  });
  it('is empty when nothing else shares the type', () => {
    expect(relatedTo([all[0], r({ id: 'x', resource_type: 'font' })], all[0])).toEqual([]);
  });
});

describe('isSynthesizedLicense', () => {
  it('flags licenses the platform has no terms for (MIT, Unspecified) but not known CC ones', () => {
    expect(isSynthesizedLicense(licenseFor('MIT'))).toBe(true);
    expect(isSynthesizedLicense(licenseFor('Unspecified'))).toBe(true);
    expect(isSynthesizedLicense(licenseFor('CC-BY-4.0'))).toBe(false);
    expect(isSynthesizedLicense(undefined)).toBe(false);
  });
});

describe('mediaUrl', () => {
  const base = 'https://api.ratq.itqan.dev/api';
  it('resolves a relative upload path against the API origin and keeps absolute http(s)', () => {
    expect(mediaUrl('/api/media/file/a.png', base)).toBe('https://api.ratq.itqan.dev/api/media/file/a.png');
    expect(mediaUrl('https://cdn.test/a.png', base)).toBe('https://cdn.test/a.png');
  });
  it('rejects other schemes, protocol-relative-to-evil is resolved as http(s) only, and empty input', () => {
    expect(mediaUrl('javascript:1', base)).toBeUndefined();
    expect(mediaUrl('data:image/png;base64,AA', base)).toBeUndefined();
    expect(mediaUrl('', base)).toBeUndefined();
    expect(mediaUrl(undefined, base)).toBeUndefined();
    expect(mediaUrl('/a.png', '')).toBeUndefined(); // mock mode: no API origin, nothing to resolve against
  });
});
