'use client';

import { useState } from 'react';
import { useLanguage } from '@/i18n';

interface SdkPreviewProps {
  data: {
    sdk_install_command?: string;
    sdk_examples?: string;
  };
}

export function SdkPreview({ data }: SdkPreviewProps) {
  const { t } = useLanguage();
  const { sdk_install_command, sdk_examples } = data;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!sdk_install_command) return;
    await navigator.clipboard.writeText(sdk_install_command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {sdk_install_command && (
        <div>
          <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            {t.resource.detail.previewSdkInstall}
          </h4>
          <div className="flex items-center gap-2">
            <code className="flex-grow bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md px-4 py-3 text-sm text-[var(--text-primary)] font-mono overflow-x-auto">
              {sdk_install_command}
            </code>
            <button
              onClick={handleCopy}
              className="shrink-0 px-3 py-2 text-xs border border-[var(--border-color)] rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              {copied ? t.resource.detail.previewSdkCopied : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {sdk_examples && (
        <div>
          <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            Examples
          </h4>
          <pre className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md px-4 py-3 text-sm text-[var(--text-primary)] font-mono overflow-x-auto whitespace-pre-wrap">
            {sdk_examples}
          </pre>
        </div>
      )}
    </div>
  );
}
