'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ResourceType } from '@/types/resource';

export interface PreviewData {
  api_endpoint?: string;
  api_docs?: string;
  api_test_url?: string;
  sdk_install_command?: string;
  sdk_examples?: string;
  dataset_sample_data?: string;
  dataset_stats?: string;
  audio_url?: string;
  audio_thumbnail?: string;
  pdf_url?: string;
  pdf_excerpt?: string;
  json_content?: string;
}

export interface UsePreviewReturn {
  data: PreviewData | null;
  loading: boolean;
  hasData: boolean;
}

const PREVIEWABLE_TYPES: ResourceType[] = ['api', 'sdk', 'dataset', 'audio', 'pdf', 'json'];

export function usePreview(slug: string, resourceType: ResourceType): UsePreviewReturn {
  const [data, setData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);

  const hasData = !!data && Object.keys(data).length > 0;

  const fetchPreviewData = useCallback(async () => {
    if (!PREVIEWABLE_TYPES.includes(resourceType)) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Publisher-provided preview fields come through the Resource object.
      // Auto-fetch from GitHub/docs_url would happen here in production.
      // For now, return null — the ResourceDetailClient passes preview data
      // from the resource object directly.
      setData(null);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [resourceType]);

  useEffect(() => {
    fetchPreviewData();
  }, [fetchPreviewData]);

  return { data, loading, hasData };
}
