import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getPreviewData, usePreview } from '@/hooks/usePreview';
import type { Resource } from '@/types/resource';

function makeResource(overrides: Partial<Resource> = {}): Resource {
  return {
    id: 200001,
    name: 'Surah Al-Fatiha',
    slug: 'payload-surah-al-fatiha',
    source: 'payload',
    source_url: null,
    type: 'audio',
    description: 'Audio recitation',
    short_description: 'Recitation',
    documentation_url: null,
    github_url: null,
    license: 'CC BY',
    itqan_badge: false,
    status: 'published',
    created_at: '2026-09-23T00:00:00.000Z',
    updated_at: '2026-09-23T00:00:00.000Z',
    version: null,
    github_stats: null,
    total_downloads: 0,
    downloads: 0,
    ...overrides,
  };
}

describe('getPreviewData', () => {
  it('maps real audio resource data into the preview contract', () => {
    const data = getPreviewData(
      makeResource({
        audio_url: 'https://example.com/fatiha.mp3',
        audio_thumbnail: 'https://example.com/fatiha.jpg',
        reciter_name: 'Example Reciter',
        audio_quality: '128kbps',
      }),
    );

    expect(data).toEqual({
      audio_title: 'Surah Al-Fatiha',
      audio_url: 'https://example.com/fatiha.mp3',
      audio_thumbnail: 'https://example.com/fatiha.jpg',
      reciter_name: 'Example Reciter',
      audio_quality: '128kbps',
    });
  });

  it('returns null when an audio resource has no audio URL', () => {
    expect(getPreviewData(makeResource({ audio_url: null }))).toBeNull();
  });

  it('does not activate unfinished preview types', () => {
    expect(
      getPreviewData(
        makeResource({
          type: 'pdf',
          pdf_url: 'https://example.com/book.pdf',
        }),
      ),
    ).toBeNull();
  });
});

describe('usePreview', () => {
  it('exposes available audio data without a loading state', () => {
    const resource = makeResource({
      audio_url: 'https://example.com/fatiha.mp3',
    });

    const { result } = renderHook(() => usePreview(resource));

    expect(result.current.loading).toBe(false);
    expect(result.current.hasData).toBe(true);
    expect(result.current.data?.audio_url).toBe(
      'https://example.com/fatiha.mp3',
    );
  });
});
