import { describe, it, expect, beforeEach } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen, act } from '@testing-library/react';
import { ResourceDetailClient } from '@/app/resources/[slug]/ResourceDetailClient';
import { LanguageProvider } from '@/shared/ui/i18n/LanguageContext';
import { formatDate, getSiteNameFromUrl } from '@/shared/utils/utils';
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

describe('bilingual (CMS) resources follow the site language', () => {
  const cmsResource = () =>
    createResource({
      source: 'cms',
      name: 'Ad-Douri Mushaf',
      description: 'English description',
      name_ar: 'المصحف المرتل برواية الدوري',
      description_ar: 'وصف عربي',
      content_language: 'en',
      title_language: 'en',
      publisher: { id: 3, name: 'Tahbeer Center', name_ar: 'مركز تحبير' },
    });

  it('Arabic site: shows Arabic title, description and publisher, all rtl', () => {
    renderDetail(cmsResource(), 'ar');

    expect(getTitle()).toHaveTextContent('المصحف المرتل برواية الدوري');
    expect(getTitle()).toHaveAttribute('dir', 'rtl');
    expect(getDescription()).toHaveTextContent('وصف عربي');
    expect(getDescription()).toHaveAttribute('dir', 'rtl');
    expect(screen.getAllByText('مركز تحبير').length).toBeGreaterThan(0);
  });

  it('English site: shows the English text, ltr', () => {
    renderDetail(cmsResource(), 'en');

    expect(getTitle()).toHaveTextContent('Ad-Douri Mushaf');
    expect(getTitle()).toHaveAttribute('dir', 'ltr');
    expect(getDescription()).toHaveTextContent('English description');
    expect(getDescription()).toHaveAttribute('dir', 'ltr');
  });

  it('Arabic site with no Arabic text: English content stays ltr instead of rendering RTL', () => {
    renderDetail({ ...cmsResource(), name_ar: undefined, description_ar: undefined }, 'ar');

    expect(getTitle()).toHaveAttribute('dir', 'ltr');
    expect(getDescription()).toHaveAttribute('dir', 'ltr');
  });
});

describe('title direction vs content direction (PR #316 review)', () => {
  it('English title + Arabic content: h1 is ltr while description/meta row stay rtl', () => {
    renderDetail(
      createResource({ title_language: 'en', content_language: 'ar', description: 'وصف المورد بالعربية' }),
      'en',
    );

    expect(getTitle()).toHaveAttribute('dir', 'ltr');
    expect(getDescription()).toHaveAttribute('dir', 'rtl');
    expect(getMetaRow()).toHaveAttribute('dir', 'rtl');
  });

  it('English title + English content: h1 is ltr', () => {
    renderDetail(createResource({ title_language: 'en', content_language: 'en' }), 'en');

    expect(getTitle()).toHaveAttribute('dir', 'ltr');
  });

  it('title_language absent: h1 falls back to the content direction (rtl for Arabic content)', () => {
    renderDetail(createResource({ title_language: undefined, content_language: 'ar' }), 'en');

    expect(getTitle()).toHaveAttribute('dir', 'rtl');
  });

  it('title_language absent and content_language absent: h1 falls back to the site direction', () => {
    renderDetail(createResource({ title_language: undefined, content_language: undefined }), 'ar');

    expect(getTitle()).toHaveAttribute('dir', 'rtl');
  });

  it('title_language is actually consulted (Arabic title on English content renders rtl)', () => {
    renderDetail(createResource({ title_language: 'ar', content_language: 'en' }), 'en');

    expect(getTitle()).toHaveAttribute('dir', 'rtl');
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

  it('keeps English canonical names on the Arabic-content resources (title_language: "en")', () => {
    for (const slug of ARABIC_SLUGS) {
      const resource = mockResources.find((r) => r.slug === slug);
      expect(resource!.title_language).toBe('en');
      expect(resource!.name).toMatch(/^[\x00-\x7F]+$/); // Latin-script name
    }
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

function getSectionForHeading(heading: HTMLElement) {
  return heading.closest('section') as HTMLElement;
}

describe('website badge (issue #294)', () => {
  it('renders the website badge derived from website_url', () => {
    const url = 'https://www.example.com/docs';
    renderDetail(createResource({ website_url: url }));

    expect(getSiteNameFromUrl(url)).toBe('example.com');
    expect(getMetaRow()).toHaveTextContent('example.com');
  });

  it('renders a bare domain without stripping anything else', () => {
    const url = 'https://example.com';
    renderDetail(createResource({ website_url: url }));

    expect(getMetaRow()).toHaveTextContent(getSiteNameFromUrl(url) as string);
    expect(getMetaRow()).toHaveTextContent('example.com');
  });

  it('links the website badge to the resource website', () => {
    const url = 'https://www.example.com/docs';
    renderDetail(createResource({ website_url: url }));

    expect(screen.getByRole('link', { name: 'example.com' })).toHaveAttribute('href', url);
  });

  it('does not render the website badge when website_url is null', () => {
    renderDetail(createResource({ website_url: null }));

    expect(getMetaRow()).not.toHaveTextContent('example.com');
    // The version badge stays - only the website chip is conditional.
    expect(getMetaRow()).toHaveTextContent('v1.0.0');
  });

  it('does not render the website badge when website_url is an empty string', () => {
    renderDetail(createResource({ website_url: '' }));

    expect(screen.queryByText('example.com')).not.toBeInTheDocument();
    expect(getMetaRow()).toHaveTextContent('v1.0.0');
  });

  it('does not fall back to documentation_url for the header badge', () => {
    renderDetail(
      createResource({ website_url: null, documentation_url: 'https://docs.example.com/guide' }),
    );

    // The docs domain must not leak into the header meta row, even though a
    // documentation URL exists (the CTA banner may still use it elsewhere).
    expect(getMetaRow()).not.toHaveTextContent('docs.example.com');
  });
});

describe('version badge (issue #294)', () => {
  it('renders the version badge with a single v prefix', () => {
    renderDetail(createResource({ version: '1.0.0' }));

    expect(getMetaRow()).toHaveTextContent('v1.0.0');
  });

  it('does not double the v prefix when the version already has one', () => {
    renderDetail(createResource({ version: 'v2.4.1' }));

    expect(getMetaRow()).toHaveTextContent('v2.4.1');
    expect(getMetaRow()).not.toHaveTextContent('vv2.4.1');
  });

  it('does not render the version badge when version is missing', () => {
    renderDetail(createResource({ version: null }));

    expect(getMetaRow()).not.toHaveTextContent('v1.0.0');
  });
});

describe('publisher row (issue #294)', () => {
  it('renders the publisher row with the exact localized publisher name', () => {
    renderDetail(createResource({ publisher: { id: 3, name: 'Tahbeer Center' } }));

    expect(screen.getByText('Publisher:')).toBeInTheDocument();
    expect(screen.getByText('Tahbeer Center')).toBeInTheDocument();
  });

  it('renders the Arabic publisher name on the Arabic site', () => {
    renderDetail(
      createResource({ publisher: { id: 3, name: 'Tahbeer Center', name_ar: 'مركز تحبير' } }),
      'ar',
    );

    expect(screen.getByText('مركز تحبير')).toBeInTheDocument();
  });

  it('does not render the publisher row when publisher is missing', () => {
    renderDetail(createResource({ publisher: null }));

    expect(screen.queryByText('Publisher:')).not.toBeInTheDocument();
  });

  it('does not render the publisher row when the publisher name is empty', () => {
    renderDetail(createResource({ publisher: { id: 3, name: '' } }));

    expect(screen.queryByText('Publisher:')).not.toBeInTheDocument();
  });
});

describe('publish date (issue #294)', () => {
  it('renders the publish date generated from created_at', () => {
    renderDetail(createResource({ updated_at: '2024-06-15T00:00:00Z' }));

    expect(screen.getByText('Publish Date:')).toBeInTheDocument();
    expect(screen.getByText(formatDate('2024-01-01T00:00:00Z', 'en'))).toBeInTheDocument();
  });

  it('does not use updated_at for the publish date', () => {
    renderDetail(createResource({ updated_at: '2024-06-15T00:00:00Z' }));

    // created_at and updated_at differ here, so the updated value must not
    // appear anywhere and the old labels must be gone.
    expect(screen.queryByText(formatDate('2024-06-15T00:00:00Z', 'en'))).not.toBeInTheDocument();
    expect(screen.queryByText('Created:')).not.toBeInTheDocument();
    expect(screen.queryByText('Last Updated:')).not.toBeInTheDocument();
  });
});

describe('resource type in Technical Resource Details (issue #294)', () => {
  it('renders the localized type label inside the technical section', () => {
    renderDetail(createResource({ type: 'library' }));

    const techSection = getSectionForHeading(
      screen.getByRole('heading', { name: 'Technical Resource Details' }),
    );
    expect(techSection).toHaveTextContent('Type:');
    expect(techSection).toHaveTextContent('Library');
  });

  it('renders the Arabic type label on the Arabic site', () => {
    renderDetail(createResource({ type: 'library' }), 'ar');

    const techSection = getSectionForHeading(
      screen.getByRole('heading', { name: 'تفاصيل المورد التقني' }),
    );
    expect(techSection).toHaveTextContent('مكتبة');
  });
});

describe('Technical Resource Details section (issue #294)', () => {
  it('renders the renamed section with publish date, type, and publisher', () => {
    renderDetail(createResource({ publisher: { id: 3, name: 'Tahbeer Center' } }));

    const techSection = getSectionForHeading(
      screen.getByRole('heading', { name: 'Technical Resource Details' }),
    );
    expect(techSection).toHaveTextContent('Publish Date:');
    expect(techSection).toHaveTextContent('Type:');
    expect(techSection).toHaveTextContent('Publisher:');
    expect(techSection).toHaveTextContent('Tahbeer Center');
  });

  it('omits the publisher row but keeps the other rows when unavailable', () => {
    renderDetail(createResource({ publisher: null }));

    const techSection = getSectionForHeading(
      screen.getByRole('heading', { name: 'Technical Resource Details' }),
    );
    expect(techSection).toHaveTextContent('Publish Date:');
    expect(techSection).toHaveTextContent('Type:');
    expect(techSection).not.toHaveTextContent('Publisher:');
  });
});

describe('Quick Summary vs Technical Resource Details (issue #294)', () => {
  it('keeps a single distinct Quick Summary section alongside the technical one', () => {
    renderDetail(createResource());

    // Exactly one Quick Summary heading remains (the sidebar box) - the
    // main-content duplicate is gone, replaced by the technical section.
    expect(screen.getAllByRole('heading', { name: 'Quick Summary' })).toHaveLength(1);
    expect(
      screen.getByRole('heading', { name: 'Technical Resource Details' }),
    ).toBeInTheDocument();
  });

  it('does not drop previously shown information', () => {
    renderDetail(createResource({ publisher: { id: 3, name: 'Tahbeer Center' } }));

    // License stays in the sidebar summary, version stays in the hero row,
    // type and publisher stay in the technical section (the type label also
    // appears on the header badge, so scope it to the technical section).
    const quickSection = getSectionForHeading(
      screen.getByRole('heading', { name: 'Quick Summary' }),
    );
    const techSection = getSectionForHeading(
      screen.getByRole('heading', { name: 'Technical Resource Details' }),
    );
    expect(quickSection).toHaveTextContent('MIT');
    expect(getMetaRow()).toHaveTextContent('v1.0.0');
    expect(techSection).toHaveTextContent('Library');
    expect(techSection).toHaveTextContent('Tahbeer Center');
  });
});

describe('Description + Quick Summary layout (issue #294)', () => {
  it('places Description and Quick Summary side by side with Technical below', () => {
    renderDetail(createResource());

    // getGrid() is the row container following the header: it holds the
    // Description and Quick Summary sections, while the technical section
    // follows it - asserted via DOM order, not CSS class strings.
    const row = getGrid();
    const descHeading = screen.getByRole('heading', { name: 'Description' });
    const quickHeading = screen.getByRole('heading', { name: 'Quick Summary' });
    const techSection = getSectionForHeading(
      screen.getByRole('heading', { name: 'Technical Resource Details' }),
    );

    expect(row.contains(descHeading)).toBe(true);
    expect(row.contains(quickHeading)).toBe(true);
    expect(row.contains(techSection)).toBe(false);
    expect(
      (row.compareDocumentPosition(techSection) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0,
    ).toBe(true);
  });
});
