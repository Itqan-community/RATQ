'use client';

import { useCallback, useState } from 'react';
import { useLanguage } from '@/shared/ui/i18n';
import { interpolate } from '@/shared/utils/utils';
import type { Resource } from '@/types/resource';

interface ResourcePhotoCarouselProps {
  resource: Pick<Resource, 'image_url' | 'preview_images' | 'itqan_badge'>;
}

// Photo list for the carousel (issue #295): the resource's own photo list when
// non-empty, otherwise the existing single-photo field - never duplicated.
// Photos are rendered exactly as loaded: CMS preview URLs are presigned and
// expire after ~1 hour, so they must not be persisted or cached for reuse.
function getPhotos(resource: ResourcePhotoCarouselProps['resource']): string[] {
  if (resource.preview_images && resource.preview_images.length > 0) {
    return resource.preview_images.filter(Boolean);
  }
  return resource.image_url ? [resource.image_url] : [];
}

// Chevron arrow, mirrored horizontally in RTL layouts via -scale-x-100. The
// button *meaning* (previous/next) never changes - only the visual direction
// flips, per issue #295's arrow semantics.
function ArrowIcon({ flip }: { flip: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-5 w-5 ${flip ? '-scale-x-100' : ''}`}
    >
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

export function ResourcePhotoCarousel({ resource }: ResourcePhotoCarouselProps) {
  const { t, direction } = useLanguage();
  const photos = getPhotos(resource);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isMultiple = photos.length > 1;
  const rtl = direction === 'rtl';

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(((index % photos.length) + photos.length) % photos.length);
    },
    [photos.length],
  );
  const next = useCallback(
    () => setCurrentIndex((index) => (index + 1) % photos.length),
    [photos.length],
  );
  const prev = useCallback(
    () => setCurrentIndex((index) => (index - 1 + photos.length) % photos.length),
    [photos.length],
  );

  // Keyboard navigation is scoped to the carousel itself (issue #295): the
  // handler lives on the carousel container and ignores events bubbling from
  // children, exactly like AnnouncementsCarousel. No page-wide listener.
  // Arrow keys follow the reading direction (RTL mirrors the mapping) - the
  // buttons' logical meaning (prev/next) never changes.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!isMultiple) return;
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (rtl) prev(); else next();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (rtl) next(); else prev();
    }
  };

  // Zero usable photos: render nothing at all - no broken or empty photo area.
  if (photos.length === 0) {
    return null;
  }

  const safeIndex = Math.min(currentIndex, photos.length - 1);
  const current = photos[safeIndex];

  return (
    <div className="mx-auto mb-8 max-w-[760px] lg:ms-auto lg:me-0">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={t.resource.detail.photoCarousel}
        tabIndex={isMultiple ? 0 : undefined}
        onKeyDown={handleKeyDown}
        dir={direction}
        className="relative overflow-hidden rounded-2xl bg-[#0d1116] outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      >
        <img
          key={current}
          src={current}
          alt={interpolate(t.resource.detail.photoAlt, { number: safeIndex + 1, total: photos.length })}
          className="h-[220px] w-full object-cover sm:h-[300px]"
        />

        {/* Itqan certification badge - only when the resource is actually
            certified. Same pill as the header badge. */}
        {resource.itqan_badge && (
          <span className="absolute start-4 top-4 z-10 inline-flex h-9 items-center rounded-full bg-[#171717] px-4 text-xs font-black text-white">
            إتقان
          </span>
        )}

        {isMultiple && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label={t.resource.detail.photoPrev}
              className="absolute start-4 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ArrowIcon flip={!rtl} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={t.resource.detail.photoNext}
              className="absolute end-4 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ArrowIcon flip={rtl} />
            </button>
          </>
        )}
      </div>

      {isMultiple && (
        <div className="mt-3 flex flex-col items-center gap-3" dir={direction}>
          <p className="text-xs font-bold text-[#808080]" dir="ltr">
            {interpolate(t.resource.detail.photoCounter, {
              current: safeIndex + 1,
              total: photos.length,
            })}
          </p>
          <div className="flex items-center gap-2">
            {photos.map((photo, index) => (
              <button
                key={`${index}-${photo}`}
                type="button"
                onClick={() => goTo(index)}
                aria-label={interpolate(t.resource.detail.photoGoTo, { number: index + 1 })}
                aria-current={index === safeIndex ? 'true' : undefined}
                className={`h-2 w-2 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
                  index === safeIndex ? 'bg-black' : 'bg-[#d9d9d9]'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
