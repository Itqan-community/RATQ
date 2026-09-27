'use client';

import { useMemo } from 'react';
import type { Resource } from '@/types/resource';

export interface PreviewData {
  api_endpoint?: string;
  api_docs?: string;
  api_test_url?: string;
  sdk_install_command?: string;
  sdk_examples?: string;
  dataset_sample_data?: string;
  dataset_stats?: string;
  audio_title?: string;
  audio_url?: string;
  audio_thumbnail?: string;
  reciter_name?: string;
  audio_quality?: string;
  pdf_url?: string;
  pdf_excerpt?: string;
  json_content?: string;
}

export interface UsePreviewReturn {
  data: PreviewData | null;
  loading: boolean;
  hasData: boolean;
}

export function getPreviewData(resource: Resource): PreviewData | null {
  // Issue #297 only fixes the audio preview path. Other preview types
  // intentionally remain unchanged until their dedicated work is done.
  if (resource.type !== 'audio' || !resource.audio_url) {
    return null;
  }

  return {
    audio_title: resource.name,
    audio_url: resource.audio_url,
    audio_thumbnail: resource.audio_thumbnail ?? undefined,
    reciter_name: resource.reciter_name ?? undefined,
    audio_quality: resource.audio_quality ?? undefined,
  };
}

export function usePreview(resource: Resource): UsePreviewReturn {
  const data = useMemo(() => getPreviewData(resource), [resource]);

  return {
    data,
    loading: false,
    hasData: data !== null,
  };
}
