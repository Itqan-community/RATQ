'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n';
import { ApiPreview } from './preview/ApiPreview';
import { SdkPreview } from './preview/SdkPreview';
import { DatasetPreview } from './preview/DatasetPreview';
import { AudioPreview } from './preview/AudioPreview';
import { PdfPreview } from './preview/PdfPreview';
import { JsonPreview } from './preview/JsonPreview';
import type { ResourceType } from '@/types/resource';
import type { PreviewData } from '@/hooks/usePreview';

interface ResourcePreviewProps {
  resourceType: ResourceType;
  previewData: PreviewData | null;
  loading: boolean;
}

const PREVIEWABLE_TYPES: ResourceType[] = ['api', 'sdk', 'dataset', 'audio', 'pdf', 'json'];

const HIDDEN_TYPES: ResourceType[] = ['library', 'tafsir'];

export function ResourcePreview({ resourceType, previewData, loading }: ResourcePreviewProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`preview-expanded-${resourceType}`);
      if (saved !== null) {
        setExpanded(saved === 'true');
      }
    }
  }, [resourceType]);

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`preview-expanded-${resourceType}`, String(next));
    }
  };

  if (HIDDEN_TYPES.includes(resourceType)) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 bg-[var(--bg-secondary)] rounded w-24 skeleton" />
          <div className="h-4 bg-[var(--bg-secondary)] rounded w-6 skeleton" />
        </div>
        <div className="h-32 bg-[var(--bg-secondary)] rounded skeleton" />
      </div>
    );
  }

  const hasData = previewData && Object.keys(previewData).length > 0;

  if (!hasData) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-6 mb-6 text-center">
        <p className="text-sm text-[var(--text-muted)]">{t.resource.detail.previewUnavailable}</p>
      </div>
    );
  }

  const renderPreview = () => {
    switch (resourceType) {
      case 'api':
        return <ApiPreview data={previewData || {}} />;
      case 'sdk':
        return <SdkPreview data={previewData || {}} />;
      case 'dataset':
        return <DatasetPreview data={previewData || {}} />;
      case 'audio':
        return <AudioPreview data={previewData || {}} />;
      case 'pdf':
        return <PdfPreview data={previewData || {}} />;
      case 'json':
        return <JsonPreview data={previewData || {}} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-6 mb-6">
      <button
        onClick={toggle}
        className="flex items-center justify-between w-full text-left"
        aria-expanded={expanded}
      >
        <h2 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
          {t.resource.detail.preview}
        </h2>
        <svg
          className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-4">
          {renderPreview()}
        </div>
      )}
    </div>
  );
}
