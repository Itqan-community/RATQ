// Resource cover / CMS gallery carousel. Renders nothing without usable photos. Photos are shown exactly as loaded
// (CMS links are presigned and expire in ~1h, so callers must not persist them).
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ResourcePhotoCarousel: React.FC<{ photos: string[]; label: string }> = ({ photos, label }) => {
  const { i18n, t } = useTranslation('site');
  const rtl = i18n.language?.startsWith('ar') ?? false;
  const [index, setIndex] = useState(0);
  if (photos.length === 0) return null;

  const multiple = photos.length > 1;
  const i = Math.min(index, photos.length - 1);
  const go = (n: number) => setIndex(((n % photos.length) + photos.length) % photos.length);
  // The physical arrow follows the reading direction; prev/next meaning never changes.
  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!multiple || e.target !== e.currentTarget) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    go(i + ((e.key === 'ArrowRight') === rtl ? -1 : 1));
  };
  const Prev = rtl ? ChevronRight : ChevronLeft;
  const Next = rtl ? ChevronLeft : ChevronRight;
  const btn =
    'absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center focus-visible:ring-2 focus-visible:ring-white outline-none';

  return (
    <div className="mb-8">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={multiple ? 0 : undefined}
        onKeyDown={onKeyDown}
        className="relative overflow-hidden rounded-2xl border border-border bg-subtle outline-none focus-visible:ring-2 focus-visible:ring-ratq-500"
      >
        <img
          key={photos[i]}
          src={photos[i]}
          alt={`${label} ${i + 1}/${photos.length}`}
          referrerPolicy="no-referrer"
          className="h-[220px] sm:h-[320px] w-full object-cover"
        />
        {multiple && (
          <>
            <button type="button" onClick={() => go(i - 1)} aria-label={t('detail.carousel_prev')} className={`${btn} start-3`}>
              <Prev className="w-5 h-5" />
            </button>
            <button type="button" onClick={() => go(i + 1)} aria-label={t('detail.carousel_next')} className={`${btn} end-3`}>
              <Next className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      {multiple && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {photos.map((p, n) => (
            <button
              key={`${n}-${p}`}
              type="button"
              onClick={() => go(n)}
              aria-label={t('detail.carousel_photo', { n: n + 1 })}
              aria-current={n === i ? 'true' : undefined}
              className={`h-2 w-2 rounded-full transition ${n === i ? 'bg-ratq-600' : 'bg-border'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
