'use client';

import { useRef, useState } from 'react';
import { useLanguage } from '@/shared/ui/i18n';

interface AudioPreviewProps {
  data: {
    audio_title?: string;
    audio_url?: string;
    audio_thumbnail?: string;
    reciter_name?: string;
    audio_quality?: string;
  };
}

export function getAudioFormat(url?: string): string | null {
  if (!url) return null;

  try {
    const pathname = new URL(url).pathname;
    const fileName = pathname.split('/').pop() || '';
    const match = fileName.match(/\.([a-zA-Z0-9]+)$/);

    return match ? match[1].toUpperCase() : null;
  } catch {
    const clean = url.split(/[?#]/)[0];
    const fileName = clean.split('/').pop() || '';
    const match = fileName.match(/\.([a-zA-Z0-9]+)$/);

    return match ? match[1].toUpperCase() : null;
  }
}

export function formatAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';

  const wholeSeconds = Math.floor(seconds);
  const minutes = Math.floor(wholeSeconds / 60);
  const remainder = wholeSeconds % 60;

  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

export function AudioPreview({ data }: AudioPreviewProps) {
  const {
    audio_title,
    audio_url,
    audio_thumbnail,
    reciter_name,
    audio_quality,
  } = data;

  const { t, direction } = useLanguage();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  if (!audio_url) return null;

  const audioFormat = getAudioFormat(audio_url);
  const safeDuration =
    Number.isFinite(duration) && duration > 0 ? duration : 0;
  const safeCurrentTime = Math.min(currentTime, safeDuration || currentTime);
  const remainingTime = Math.max(safeDuration - safeCurrentTime, 0);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      void audio.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio || !safeDuration) return;

    audio.currentTime = value;
    setCurrentTime(value);
  };

  return (
    <section
      className="overflow-hidden rounded-2xl border border-[#e7e7e7] bg-white"
      dir={direction}
      aria-label={t.resource.detail.audioPlayer}
    >
      {audio_thumbnail && (
        <img
          src={audio_thumbnail}
          alt={t.resource.detail.audioThumbnailAlt}
          className="max-h-64 w-full object-cover"
        />
      )}

      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={togglePlayback}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black text-white transition hover:bg-[#222] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            aria-label={
              isPlaying
                ? t.resource.detail.audioPause
                : t.resource.detail.audioPlay
            }
          >
            {isPlaying ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="currentColor"
              >
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="currentColor"
              >
                <path d="M8 5.5v13l10-6.5-10-6.5Z" />
              </svg>
            )}
          </button>

          <div className="min-w-0 flex-1">
            {audio_title && (
              <h3 className="truncate text-base font-black text-black sm:text-lg">
                {audio_title}
              </h3>
            )}

            {reciter_name && (
              <p className="mt-1 text-sm text-[#747474]">
                <span className="font-semibold">
                  {t.resource.detail.audioReciter}:
                </span>{' '}
                {reciter_name}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <input
            type="range"
            min="0"
            max={safeDuration || 0}
            step="0.1"
            value={safeCurrentTime}
            disabled={!safeDuration}
            onChange={(event) => handleSeek(Number(event.target.value))}
            className="h-2 w-full cursor-pointer accent-black disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t.resource.detail.audioSeek}
            dir="ltr"
          />

          <div
            className="mt-2 flex items-center justify-between text-xs font-semibold text-[#777]"
            dir="ltr"
          >
            <span aria-label={t.resource.detail.audioElapsed}>
              {formatAudioTime(safeCurrentTime)}
            </span>

            <span aria-label={t.resource.detail.audioRemaining}>
              {remainingTime > 0 ? '-' : ''}{formatAudioTime(remainingTime)}
            </span>
          </div>
        </div>

        {(audio_quality || audioFormat) && (
          <div className="mt-5 flex flex-wrap gap-2 border-t border-[#eeeeee] pt-4 text-xs font-bold text-[#555]">
            {audio_quality && (
              <span className="rounded-full bg-[#f4f4f4] px-3 py-1.5">
                {t.resource.detail.audioQuality}: {audio_quality}
              </span>
            )}

            {audioFormat && (
              <span className="rounded-full bg-[#f4f4f4] px-3 py-1.5">
                {t.resource.detail.audioFormat}: {audioFormat}
              </span>
            )}
          </div>
        )}

        <audio
          ref={audioRef}
          src={audio_url}
          preload="metadata"
          onLoadedMetadata={() => {
            const audio = audioRef.current;
            if (!audio) return;

            setDuration(
              Number.isFinite(audio.duration) && audio.duration > 0
                ? audio.duration
                : 0,
            );
          }}
          onTimeUpdate={() => {
            const audio = audioRef.current;
            if (audio) setCurrentTime(audio.currentTime);
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    </section>
  );
}
