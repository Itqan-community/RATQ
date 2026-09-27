import { describe, it, expect, beforeEach } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen, act } from '@testing-library/react';
import { ResourceDetailClient } from '@/app/resources/[slug]/ResourceDetailClient';
import { LanguageProvider } from '@/shared/ui/i18n/LanguageContext';
import { mockResources } from '@/modules/resources/infrastructure/mock-data';
import type { Resource } from '@/types/resource';

// The direction rule under test (issue #303):
//   contentDirection = content_language === 'ar' ? 'rtl'
//                    : content_language === 'en' ? 'ltr'
//                    : siteDirection
// It must apply ONLY to resource-owned content (title, description,
// meta-info row). Page/sidebar layout stays driven by the site language, and
// the CTA banner / photo carousel keep their existing (site) direction.

function createResource(overrides: Partial<Resource> = {}): Resource {
  return {
    id: 1,
    name: 'Test Resource',
    slug: 'test-resource',
    type: 'library',
    description: 'A test resource description',
    short_description: 'Test resource summary',
    documentation_url: null,
    github_url: null,
    license: 'MIT',
    itqan_badge: false,
    status: 'published',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    version: '1.0.0',
    github_stats: null,
    total_downloads: 1000,
    downloads: 1000,
    source: 'ratq',
    source_url: null,
    ...overrides,
  };
}

function renderDetail(resource: Resource, locale: 'ar' | 'en' = 'en') {
  localStorage.setItem('ratq_locale', locale);
  const result = render(
    <LanguageProvider>
      <ResourceDetailClient resource={resource} repoPreview={null} />
    </LanguageProvider>,
  );
  act(() => {});
  return result;
}

// Deterministic handles derived from stable DOM structure (no test IDs).
function getTitle() {
  return screen.getByRole('heading', { level: 1 });
}
function getDescription() {
  return getTitle().closest('header')?.parentElement?.querySelector('p') as HTMLElement;
}
function getMetaRow() {
  // The meta-info row is the element right after the h1 inside the header.
  return getTitle().nextElementSibling as HTMLElement;
}
function getGrid() {
  return getTitle().closest('header')?.nextElementSibling as HTMLElement;
}
function getPageContainer() {
  // Nearest dir-carrying ancestor of the grid: the page wrapper. The grid's
  // immediate parent is <main>, which carries no dir of its own.
  return getGrid().closest('div[dir]') as HTMLElement;
}

beforeEach(() => {
  localStorage.clear();
});

describe('ResourceDetailClient content-language direction (issue #303)', () => {
  it('Arabic content on the English site: title/description/meta row are rtl, site layout stays ltr', () => {
    renderDetail(createResource({ content_language: 'ar', description: 'وصف المورد بالعربية' }), 'en');

    expect(getTitle()).toHaveAttribute('dir', 'rtl');
    expect(getDescription()).toHaveAttribute('dir', 'rtl');
    expect(getMetaRow()).toHaveAttribute('dir', 'rtl');

    // Site-driven layout is untouched by the resource's content language.
    expect(getPageContainer()).toHaveAttribute('dir', 'ltr'); // page container
    expect(getGrid()).not.toHaveAttribute('dir'); // no hardcoded grid direction
    expect(getGrid().children[0]).toHaveAttribute('dir', 'ltr'); // aside
    expect(getGrid().children[1]).toHaveAttribute('dir', 'ltr'); // main content column
  });

  it('English content on the Arabic site: title/description/meta row are ltr, site layout stays rtl', () => {
    renderDetail(createResource({ content_language: 'en' }), 'ar');

    expect(getTitle()).toHaveAttribute('dir', 'ltr');
    expect(getDescription()).toHaveAttribute('dir', 'ltr');
    expect(getMetaRow()).toHaveAttribute('dir', 'ltr');

    expect(getPageContainer()).toHaveAttribute('dir', 'rtl'); // page container
    expect(getGrid()).not.toHaveAttribute('dir'); // grid inherits the site direction
    expect(getGrid().children[0]).toHaveAttribute('dir', 'rtl'); // aside
    expect(getGrid().children[1]).toHaveAttribute('dir', 'rtl'); // main content column
  });

  it('missing content_language + Arabic site: resource content falls back to the site direction (rtl)', () => {
    renderDetail(createResource({ content_language: undefined }), 'ar');

    expect(getTitle()).toHaveAttribute('dir', 'rtl');
    expect(getDescription()).toHaveAttribute('dir', 'rtl');
    expect(getMetaRow()).toHaveAttribute('dir', 'rtl');
  });

  it('missing content_language + English site: resource content falls back to the site direction (ltr)', () => {
    renderDetail(createResource({ content_language: undefined }), 'en');

    expect(getTitle()).toHaveAttribute('dir', 'ltr');
    expect(getDescription()).toHaveAttribute('dir', 'ltr');
    expect(getMetaRow()).toHaveAttribute('dir', 'ltr');
  });
});

describe('sidebar grid direction (issue #303)', () => {
  it('has no hardcoded dir on the English site and inherits ltr', () => {
    renderDetail(createResource({ content_language: 'en' }), 'en');
    expect(getGrid()).not.toHaveAttribute('dir');
    expect(getPageContainer()).toHaveAttribute('dir', 'ltr');
  });

  it('has no hardcoded dir on the Arabic site and inherits rtl', () => {
    renderDetail(createResource({ content_language: 'en' }), 'ar');
    expect(getGrid()).not.toHaveAttribute('dir');
    expect(getPageContainer()).toHaveAttribute('dir', 'rtl');
  });

  it('keeps resource content_language from deciding the sidebar side', () => {
    // Arabic-content resource on the English site: the aside (sidebar) must
    // still follow the SITE direction, not the resource's content language.
    renderDetail(createResource({ content_language: 'ar' }), 'en');
    expect(getGrid().children[0]).toHaveAttribute('dir', 'ltr');
  });
});

describe('ratq-native content_language seed data (issue #303)', () => {
  const ARABIC_SLUGS = [
    'quranic-text-toolkit',
    'arabic-font-rendering-engine',
    'quranic-keyword-extractor',
    'quranic-arabic-corpus',
  ];

  it('every ratq-native resource has an explicit "ar" or "en" value', () => {
    for (const resource of mockResources) {
      expect(['ar', 'en']).toContain(resource.content_language);
    }
  });

  it('exactly the four former-patch resources are Arabic', () => {
    const arabic = mockResources
      .filter((r) => r.content_language === 'ar')
      .map((r) => r.slug)
      .sort();
    expect(arabic).toEqual([...ARABIC_SLUGS].sort());
  });

  it('Arabic records carry the migrated Arabic description AND short_description canonically', () => {
    const arabicChar = /[\u0600-\u06FF]/;
    for (const slug of ARABIC_SLUGS) {
      const resource = mockResources.find((r) => r.slug === slug);
      expect(resource, slug).toBeDefined();
      expect(resource!.description).toMatch(arabicChar);
      expect(resource!.short_description).toMatch(arabicChar);
    }
  });

  it('English records keep English content (no English short_description paired with "ar")', () => {
    const arabicChar = /[\u0600-\u06FF]/;
    for (const resource of mockResources) {
      if (resource.content_language === 'en') {
        expect(resource.description).not.toMatch(arabicChar);
        expect(resource.short_description).not.toMatch(arabicChar);
      }
    }
  });
});

describe('old by-slug Arabic patch removal (issue #303)', () => {
  it('renders the canonical Arabic description for a former-patch slug on the ENGLISH site too', () => {
    // The removed patch substituted Arabic copy only when locale === 'ar'.
    // With the field-driven rule, the Arabic canonical content renders in
    // both site languages and carries the rtl content direction.
    const slug = 'quranic-text-toolkit';
    const seed = mockResources.find((r) => r.slug === slug)!;
    renderDetail(createResource({ slug, content_language: 'ar', description: seed.description }), 'en');

    expect(screen.getByText(seed.description)).toBeInTheDocument();
    expect(screen.getByText(seed.description)).toHaveAttribute('dir', 'rtl');
  });

  it('the obsolete Arabic-substitution data file is gone', () => {
    expect(existsSync(join(process.cwd(), 'src/shared/ui/i18n/resource-descriptions.ar.json'))).toBe(false);
  });
});

describe('scope guards: #299 CTA banner and #295 photo carousel keep site direction', () => {
  it('CTA banner direction stays driven by the site, not content_language (#299)', () => {
    renderDetail(
      createResource({
        content_language: 'ar',
        website_url: 'https://tahbeer.net',
      }),
      'en',
    );

    const bannerSection = screen
      .getByRole('heading', { name: 'Visit the resource site' })
      .closest('section') as HTMLElement;
    expect(bannerSection).toHaveAttribute('dir', 'ltr');
  });

  it('photo carousel direction stays driven by the site, not content_language (#295)', () => {
    renderDetail(
      createResource({
        content_language: 'ar',
        preview_images: ['https://example.com/photo-1.jpg', 'https://example.com/photo-2.jpg'],
      }),
      'en',
    );

    expect(screen.getByRole('region', { name: 'Photo gallery' })).toHaveAttribute('dir', 'ltr');
  });
});
