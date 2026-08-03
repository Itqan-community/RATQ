'use client';

interface PdfPreviewProps {
  data: {
    pdf_url?: string;
    pdf_excerpt?: string;
  };
}

export function PdfPreview({ data }: PdfPreviewProps) {
  const { pdf_url, pdf_excerpt } = data;

  if (!pdf_url) return null;

  return (
    <div className="space-y-3">
      <a
        href={pdf_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md p-6 text-center hover:border-[var(--accent-primary)] transition-colors"
      >
        <svg className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <p className="text-sm font-medium text-[var(--text-primary)]">View PDF</p>
      </a>

      {pdf_excerpt && (
        <div>
          <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            Excerpt
          </h4>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-4">
            {pdf_excerpt}
          </p>
        </div>
      )}
    </div>
  );
}
