"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "@/shared/ui/i18n";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import type { Announcement } from "@/types/announcement";

const AUTO_ROTATE_MS = 8000;

function resolveHref(slide: Announcement): string {
  if (slide.cta_url) return slide.cta_url;

  if (slide.type === "breaking_change" && slide.resource_id) {
    return `/resources/${slide.resource_id}`;
  }

  return "/resources";
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

  // Keyboard navigation is scoped to the banner itself: arrow keys pressed
  // elsewhere on the page — including on interactive children such as the
  // CTA link — do not change the announcement.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (isSingle) return;
    if (e.target !== e.currentTarget) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  if (isLoading || slides.length === 0) {
    return null;
  }

  const slide = slides[currentIndex];
  const href = resolveHref(slide);

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pt-16 sm:pt-8">
      <div
        className="flex w-full flex-col items-center gap-3 rounded-2xl bg-black px-5 py-5 text-center text-white outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:py-6 md:flex-row md:items-center md:gap-8 md:px-8 md:py-6 md:text-start"
        role="region"
        aria-roledescription="carousel"
        aria-label={t.announcements.title}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setIsPaused(false);
          }
        }}
      >
        <h2 className="shrink-0 text-2xl font-black leading-tight sm:text-3xl">
          {t.announcements.title}
        </h2>

        <p
          key={slide.id}
          aria-live="polite"
          className="min-w-0 flex-1 break-words text-sm leading-7 text-white sm:text-base md:text-center motion-safe:animate-fade-in"
        >
          <span className="font-bold">{t.announcements.newLabel} </span>
          {slide.title}
        </p>

        <Link
          href={href}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-black transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {t.announcements.viewResource}
        </Link>
      </div>
    </section>
  );
}
