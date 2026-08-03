'use client';

import { useLanguage } from '@/i18n';

interface ApiPreviewProps {
  data: {
    api_endpoint?: string;
    api_docs?: string;
    api_test_url?: string;
  };
}

export function ApiPreview({ data }: ApiPreviewProps) {
  const { t } = useLanguage();
  const { api_endpoint, api_docs, api_test_url } = data;

  if (!api_endpoint && !api_docs) return null;

  return (
    <div className="space-y-4">
      {api_endpoint && (
        <div>
          <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            {t.resource.detail.previewApiEndpoint}
          </h4>
          <code className="block bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md px-4 py-3 text-sm text-[var(--text-primary)] font-mono overflow-x-auto">
            {api_endpoint}
          </code>
        </div>
      )}

      {api_docs && (
        <div>
          <a
            href={api_docs}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-xs py-2 px-4 inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Documentation
          </a>
        </div>
      )}

      {api_test_url && (
        <div>
          <a
            href={api_test_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t.resource.detail.previewApiTryIt}
          </a>
        </div>
      )}
    </div>
  );
}
