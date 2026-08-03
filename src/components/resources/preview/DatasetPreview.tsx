'use client';

import { useLanguage } from '@/i18n';

interface DatasetPreviewProps {
  data: {
    dataset_sample_data?: string;
    dataset_stats?: string;
  };
}

function parseStats(stats: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!stats) return result;
  const lines = stats.split('\n');
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      result[key.trim()] = valueParts.join(':').trim();
    }
  }
  return result;
}

export function DatasetPreview({ data }: DatasetPreviewProps) {
  const { t } = useLanguage();
  const { dataset_sample_data, dataset_stats } = data;
  const stats = parseStats(dataset_stats || '');

  return (
    <div className="space-y-4">
      {dataset_stats && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md p-3 text-center">
            <p className="text-xs text-[var(--text-muted)] mb-1">{t.resource.detail.previewDatasetRows}</p>
            <p className="text-lg font-bold text-[var(--text-primary)]">{stats['Rows'] || '-'}</p>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md p-3 text-center">
            <p className="text-xs text-[var(--text-muted)] mb-1">{t.resource.detail.previewDatasetColumns}</p>
            <p className="text-lg font-bold text-[var(--text-primary)]">{stats['Columns'] || '-'}</p>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md p-3 text-center">
            <p className="text-xs text-[var(--text-muted)] mb-1">{t.resource.detail.previewDatasetSize}</p>
            <p className="text-lg font-bold text-[var(--text-primary)]">{stats['Size'] || '-'}</p>
          </div>
        </div>
      )}

      {dataset_sample_data && (
        <div>
          <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            Sample Data
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  {dataset_sample_data.split('\n')[0]?.split(',').map((header, i) => (
                    <th key={i} className="px-3 py-2 text-left font-semibold text-[var(--text-muted)]">
                      {header.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataset_sample_data.split('\n').slice(1, 11).map((row, i) => (
                  <tr key={i} className="border-b border-[var(--border-color)]/50">
                    {row.split(',').map((cell, j) => (
                      <td key={j} className="px-3 py-2 text-[var(--text-secondary)]">
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
