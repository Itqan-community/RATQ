// Rows of the "technical details" card that come from the sources-sheet import. Pure: the view maps `key` to a
// translated label (detail.src_<key>) and renders an undefined value as the localized "Not stated".
import { pickText } from './localizeResource';
import type { Resource } from '@/types';

export interface SourceRow { key: string; value?: string; url?: boolean }

export function sourceRows(r: Resource, en: boolean): SourceRow[] {
  if (!r.sheet_id) return [];
  const a = r.api;
  const hasApi = r.has_api === 'yes' || r.has_api === 'planned' || r.has_api === 'iframe';
  const row = (key: string, value?: string, url?: boolean): SourceRow => ({ key, value, ...(url && { url }) });
  return [
    row('domain', pickText(r.content_domain, en)),
    row('riwayah', pickText(r.riwayah, en)),
    row('languages', r.source_languages?.join(', ')),
    row('smallest_unit', pickText(r.smallest_unit, en)),
    row('query_units', pickText(r.query_units, en)),
    row('numbering', pickText(r.numbering_reference, en)),
    row('has_api', r.has_api),
    ...(hasApi
      ? [
          row('docs', r.docs_url, true),
          row('base_url', a?.base_url, true),
          row('api_key_url', a?.api_key_url, true),
          row('playground_url', a?.playground_url, true),
          row('authentication', pickText(a?.authentication, en)),
          row('data_formats', a?.data_formats?.join(', ')),
          row('rate_limits', pickText(a?.rate_limits, en)),
        ]
      : []),
    row('download', r.download_url, true),
    row('repository', r.repository_url, true),
    row('review', pickText(r.scholarly_review, en)),
    row('attribution', pickText(r.attribution, en)),
    row('verified_on', r.verified_on),
    row('source_status', r.source_status),
  ];
}
