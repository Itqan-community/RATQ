import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { ResourcePhotoCarousel } from '@/modules/resources/components/ResourcePhotoCarousel';
import { ResourceDetailClient } from '@/app/resources/[slug]/ResourceDetailClient';
import { LanguageProvider } from '@/shared/ui/i18n/LanguageContext';
import type { Resource } from '@/types/resource';

const PHOTOS = [
  'https://r2.example.com/presigned-a.jpg',
  'https://r2.example.com/presigned-b.jpg',
  'https://r2.example.com/presigned-c.jpg',
];

function createResource(overrides: Partial<Resource> = {}): Resource {
  return {
    id: 1,
    name: 'Test Resource',
    slug: 'test-resource',
    type: 'library',
    description: 'A test resource description for testing purposes',
    short_description: 'Test resource summary',
    image_url: null,
    preview_images: undefined,
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

function renderCarousel(resource: Partial<Resource>, locale: 'ar' | 'en' = 'en') {
  localStorage.setItem('ratq_locale', locale);
  const result = render(
    <LanguageProvider>
      <ResourcePhotoCarousel resource={createResource(resource)} />
    </LanguageProvider>,
  );
  act(() => {});
  return result;
}

function currentPhoto() {
  return screen.getByRole('img', { name: /Photo \d+ of \d+|الصورة \d+ من \d+/ });
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe('ResourcePhotoCarousel - photo selection (issue #295)', () => {
  it('uses the photo list when it contains photos', () => {
    renderCarousel({ preview_images: PHOTOS, image_url: 'https://r2.example.com/other.jpg' });

    expect(currentPhoto()).toHaveAttribute('src', PHOTOS[0]);
  });

  it('falls back to the single-photo field when the list is empty', () => {
    renderCarousel({ preview_images: [], image_url: 'https://r2.example.com/fallback.jpg' });

    expect(currentPhoto()).toHaveAttribute('src', 'https://r2.example.com/fallback.jpg');
    expect(screen.getByRole('img', { name: 'Photo 1 of 1' })).toBeInTheDocument();
  });

  it('does not duplicate the fallback photo when the list already contains it', () => {
    renderCarousel({ preview_images: [PHOTOS[0]], image_url: PHOTOS[0] });

    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getByRole('img', { name: 'Photo 1 of 1' })).toBeInTheDocument();
  });

  it('renders nothing when there are no usable photos', () => {
    const { container } = renderCarousel({ preview_images: [], image_url: null });

    expect(container).toBeEmptyDOMElement();
  });
});

describe('ResourcePhotoCarousel - multiple photos', () => {
  it('navigates all photos with the arrows and updates the counter', () => {
    renderCarousel({ preview_images: PHOTOS });

    fireEvent.click(screen.getByRole('button', { name: 'Next photo' }));
    expect(currentPhoto()).toHaveAttribute('src', PHOTOS[1]);
    expect(screen.getByText('2 / 3')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Previous photo' }));
    expect(currentPhoto()).toHaveAttribute('src', PHOTOS[0]);
  });

  it('selects the matching photo when a dot is clicked', () => {
    renderCarousel({ preview_images: PHOTOS });

    fireEvent.click(screen.getByRole('button', { name: 'Go to photo 3' }));
    expect(currentPhoto()).toHaveAttribute('src', PHOTOS[2]);
    expect(screen.getByText('3 / 3')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Go to photo 1' }));
    expect(currentPhoto()).toHaveAttribute('src', PHOTOS[0]);
  });

  it('wraps around at both ends instead of stopping', () => {
    renderCarousel({ preview_images: PHOTOS });

    fireEvent.click(screen.getByRole('button', { name: 'Next photo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next photo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next photo' }));
    expect(currentPhoto()).toHaveAttribute('src', PHOTOS[0]);

    fireEvent.click(screen.getByRole('button', { name: 'Previous photo' }));
    expect(currentPhoto()).toHaveAttribute('src', PHOTOS[2]);
  });

  it('marks the active dot with aria-current', () => {
    renderCarousel({ preview_images: PHOTOS });

    expect(screen.getByRole('button', { name: 'Go to photo 1' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Go to photo 2' })).not.toHaveAttribute(
      'aria-current',
    );
  });
});

describe('ResourcePhotoCarousel - single photo', () => {
  it('renders the photo but hides arrows, counter, and dots', () => {
    renderCarousel({ image_url: 'https://r2.example.com/single.jpg' });

    expect(screen.getByRole('img', { name: 'Photo 1 of 1' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Previous photo' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next photo' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Go to photo/ })).not.toBeInTheDocument();
    expect(screen.queryByText('1 / 1')).not.toBeInTheDocument();
  });
});

describe('ResourcePhotoCarousel - zero photos', () => {
  it('renders no carousel region at all', () => {
    renderCarousel({});

    expect(screen.queryByRole('region', { name: 'Photo gallery' })).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});

describe('ResourcePhotoCarousel - certification badge', () => {
  it('shows the Itqan badge overlay only for certified resources', () => {
    const { rerender } = renderCarousel({ preview_images: PHOTOS, itqan_badge: true });
    expect(screen.getByText('إتقان')).toBeInTheDocument();

    rerender(
      <LanguageProvider>
        <ResourcePhotoCarousel resource={createResource({ preview_images: PHOTOS, itqan_badge: false })} />
      </LanguageProvider>,
    );
    act(() => {});
    expect(screen.queryByText('إتقان')).not.toBeInTheDocument();
  });
});

describe('ResourcePhotoCarousel - RTL / LTR arrows', () => {
  it('flips the arrow visuals in RTL without swapping button meaning', () => {
    renderCarousel({ preview_images: PHOTOS }, 'ar');

    const prevButton = screen.getByRole('button', { name: 'الصورة السابقة' });
    const nextButton = screen.getByRole('button', { name: 'الصورة التالية' });
    // Visual flip only: the previous chevron points right (toward the older
    // photo in RTL) and the next chevron points left - but prev stays prev.
    expect(prevButton.querySelector('svg')).not.toHaveClass('-scale-x-100');
    expect(nextButton.querySelector('svg')).toHaveClass('-scale-x-100');

    // Logical meaning is unchanged in RTL: "next" advances the photo.
    fireEvent.click(nextButton);
    expect(currentPhoto()).toHaveAttribute('src', PHOTOS[1]);
  });

  it('does not flip the arrow visuals in LTR', () => {
    renderCarousel({ preview_images: PHOTOS }, 'en');

    expect(
      screen.getByRole('button', { name: 'Previous photo' }).querySelector('svg'),
    ).toHaveClass('-scale-x-100');
    expect(
      screen.getByRole('button', { name: 'Next photo' }).querySelector('svg'),
    ).not.toHaveClass('-scale-x-100');
  });

  it('renders the slide counter with fixed LTR digits in both locales', () => {
    renderCarousel({ preview_images: PHOTOS }, 'ar');

    const counter = screen.getByText('1 / 3');
    expect(counter).toHaveAttribute('dir', 'ltr');
  });
});

describe('ResourcePhotoCarousel - keyboard navigation', () => {
  it('advances with ArrowRight and goes back with ArrowLeft in English', () => {
    renderCarousel({ preview_images: PHOTOS }, 'en');

    const region = screen.getByRole('region', { name: 'Photo gallery' });
    region.focus();
    fireEvent.keyDown(region, { key: 'ArrowRight' });
    expect(currentPhoto()).toHaveAttribute('src', PHOTOS[1]);
    fireEvent.keyDown(region, { key: 'ArrowLeft' });
    expect(currentPhoto()).toHaveAttribute('src', PHOTOS[0]);
  });

  it('mirrors the arrow-key mapping in Arabic (RTL)', () => {
    renderCarousel({ preview_images: PHOTOS }, 'ar');

    const region = screen.getByRole('region', { name: 'معرض الصور' });
    region.focus();
    // In RTL, ArrowLeft follows the reading direction to the next photo.
    fireEvent.keyDown(region, { key: 'ArrowLeft' });
    expect(currentPhoto()).toHaveAttribute('src', PHOTOS[1]);
    fireEvent.keyDown(region, { key: 'ArrowRight' });
    expect(currentPhoto()).toHaveAttribute('src', PHOTOS[0]);
  });

  it('ignores arrow keys pressed on child controls (scoped to the carousel)', () => {
    renderCarousel({ preview_images: PHOTOS }, 'en');

    const region = screen.getByRole('region', { name: 'Photo gallery' });
    const nextButton = screen.getByRole('button', { name: 'Next photo' });

    // Keyboard on a child button must not move the carousel.
    nextButton.focus();
    fireEvent.keyDown(nextButton, { key: 'ArrowRight' });
    expect(currentPhoto()).toHaveAttribute('src', PHOTOS[0]);

    // Keyboard on the carousel itself does.
    region.focus();
    fireEvent.keyDown(region, { key: 'ArrowRight' });
    expect(currentPhoto()).toHaveAttribute('src', PHOTOS[1]);
  });
});

describe('ResourcePhotoCarousel - i18n keys', () => {
  it('defines every carousel string in both Arabic and English', async () => {
    const en = (await import('@/shared/ui/i18n/messages/en.json')).default;
    const ar = (await import('@/shared/ui/i18n/messages/ar.json')).default;

    const keys = [
      'photoCarousel',
      'photoPrev',
      'photoNext',
      'photoGoTo',
      'photoCounter',
      'photoAlt',
    ] as const;

    for (const key of keys) {
      expect(typeof en.resource.detail[key]).toBe('string');
      expect((en.resource.detail[key] as string).length).toBeGreaterThan(0);
      expect(typeof ar.resource.detail[key]).toBe('string');
      expect((ar.resource.detail[key] as string).length).toBeGreaterThan(0);
    }
  });
});

describe('ResourcePhotoCarousel - detail page integration', () => {
  it('renders from ResourceDetailClient for resources with photos', () => {
    localStorage.setItem('ratq_locale', 'en');
    render(
      <LanguageProvider>
        <ResourceDetailClient
          resource={createResource({ preview_images: PHOTOS })}
          repoPreview={null}
        />
      </LanguageProvider>,
    );
    act(() => {});

    expect(screen.getByRole('region', { name: 'Photo gallery' })).toBeInTheDocument();
    expect(currentPhoto()).toHaveAttribute('src', PHOTOS[0]);
  });
});
