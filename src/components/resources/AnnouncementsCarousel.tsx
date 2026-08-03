'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/i18n';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import type { AnnouncementType } from '@/types/announcement';
import type { JSX } from 'react';

const AUTO_ROTATE_MS = 8000;

const typeConfig: Record<
  AnnouncementType,
  { labelKey: string; accent: string; badgeBg: string; badgeText: string; icon: JSX.Element }
> = {
  release: {
    labelKey: 'announcements.types.release',
    accent: 'var(--accent-primary)',
    badgeBg: 'var(--accent-primary-light)',
    badgeText: 'var(--accent-primary)',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  new_resource: {
    labelKey: 'announcements.types.new_resource',
    accent: 'var(--success)',
    badgeBg: '#dcfce7',
    badgeText: '#15803d',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  maintenance: {
    labelKey: 'announcements.types.maintenance',
    accent: 'var(--warning)',
    badgeBg: '#fef3c7',
    badgeText: '#b45309',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94 1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  breaking_change: {
    labelKey: 'announcements.types.breaking_change',
    accent: 'var(--danger)',
    badgeBg: '#fee2e2',
    badgeText: '#b91c1c',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
};

function resolveMessage(messages: ReturnType<typeof import('@/i18n').useTranslations>, key: string): string {
  const parts = key.split('.');
  let value: unknown = messages;
  for (const part of parts) {
    if (value && typeof value === 'object' && part in (value as Record<string, unknown>)) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  return typeof value === 'string' ? value : key;
}

function formatRelativeTime(dateStr: string, t: ReturnType<typeof import('@/i18n').useTranslations>): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return t.announcements.ago.replace('{{count}}', `${diffMins}m`);
  if (diffHours < 24) return t.announcements.ago.replace('{{count}}', `${diffHours}h`);
  return t.announcements.ago.replace('{{count}}', `${diffDays}d`);
}

export default function AnnouncementsCarousel() {
  const t = useTranslations();
  const { announcements, isLoading } = useAnnouncements();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slides = announcements;
  const isSingle = slides.length <= 1;
  const total = slides.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex((index + total) % total);
    },
    [total],
  );

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  // Auto-rotation
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isPaused && !isSingle && slides.length > 1) {
      timerRef.current = setTimeout(next, AUTO_ROTATE_MS);
    }
  }, [isPaused, isSingle, slides.length, next]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSingle) return;
      if (e.key === 'ArrowLeft') {
        prev();
        setIsPaused(true);
      } else if (e.key === 'ArrowRight') {
        next();
        setIsPaused(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prev, next, isSingle]);

  if (isLoading || slides.length === 0) {
    return null;
  }

  const slide = slides[currentIndex];
  const config = typeConfig[slide.type];
  const typeLabel = resolveMessage(t, config.labelKey);

  return (
    <section
      className="section-padding py-10"
      role="region"
      aria-roledescription="carousel"
      aria-label={t.announcements.title}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-5">
          <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <h2 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
            {t.announcements.title}
          </h2>
          {!isSingle && (
            <span className="text-xs text-[var(--text-muted)] tabular-nums">
              {currentIndex + 1} / {total}
            </span>
          )}
        </div>

        {/* Card */}
        <div className="card relative overflow-hidden">
          {/* Left accent bar */}
          <div
            className="absolute top-0 bottom-0 w-1"
            style={{ backgroundColor: config.accent }}
          />

          <div className="p-6 sm:p-8">
            {/* Badge + timestamp row */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-heading font-medium"
                style={{ backgroundColor: config.badgeBg, color: config.badgeText }}
              >
                {config.icon}
                {typeLabel}
              </span>
              <time dateTime={slide.created_at} className="text-xs text-[var(--text-muted)]">
                {formatRelativeTime(slide.created_at, t)}
              </time>
            </div>

            {/* Content */}
            <h3 className="font-heading text-xl sm:text-2xl font-semibold text-[var(--text-primary)] mb-2 leading-snug">
              {slide.title}
            </h3>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-5">
              {slide.description}
            </p>

            {/* CTA */}
            <div className="min-h-[36px]">
              {slide.cta_url ? (
                <Link
                  href={slide.cta_url}
                  className="inline-flex items-center gap-1.5 text-sm font-heading font-medium text-[var(--accent-primary)] hover:underline group/link"
                >
                  {slide.cta_label || t.announcements.learnMore}
                  <svg
                    className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 rtl:rotate-180 rtl:group-hover/link:-translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : slide.type === 'breaking_change' && slide.resource_id ? (
                <Link
                  href={`/resources/${slide.resource_id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-heading font-medium text-[var(--accent-primary)] hover:underline group/link"
                >
                  {t.announcements.viewResource}
                  <svg
                    className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 rtl:rotate-180 rtl:group-hover/link:-translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : null}
            </div>
          </div>

          {/* Navigation footer */}
          {!isSingle && (
            <div className="flex items-center justify-between gap-4 px-6 sm:px-8 py-3 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
              {/* Prev */}
              <button
                onClick={() => { prev(); setIsPaused(true); }}
                className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors shrink-0"
                aria-label="Previous announcement"
              >
                <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Dots */}
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Announcement slides">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    role="tab"
                    aria-selected={index === currentIndex}
                    aria-label={`Announcement ${index + 1}`}
                    onClick={() => { setCurrentIndex(index); setIsPaused(true); }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-6'
                        : 'w-1.5 bg-[var(--border-color)] hover:bg-[var(--text-muted)]'
                    }`}
                    style={index === currentIndex ? { backgroundColor: config.accent } : {}}
                  />
                ))}
              </div>

              {/* Next */}
              <button
                onClick={() => { next(); setIsPaused(true); }}
                className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors shrink-0"
                aria-label="Next announcement"
              >
                <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
