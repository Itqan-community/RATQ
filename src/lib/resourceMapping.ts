// Mapping helpers shared by the Payload and CMS resource clients.
import { DEMO_LICENSES } from './mockData';
import { licenseRowIdFor } from './catalogQuery';
import type { License } from '@/types';

// Resource type -> design category id (same grouping the beta snapshot in betaResources.ts used).
const TYPE_CATEGORY: Record<string, string> = {
  library: 'cat_dev', sdk: 'cat_dev', api: 'cat_dev', program: 'cat_dev', search: 'cat_dev',
  dataset: 'cat_datasets', json: 'cat_datasets', linguistic: 'cat_datasets',
  tafsir: 'cat_tafsir',
  audio: 'cat_recitations', recitation: 'cat_recitations',
  mushaf: 'cat_quran_sources', tajweed: 'cat_quran_sources', pdf: 'cat_quran_sources', text: 'cat_quran_sources',
  translation: 'cat_translations',
  font: 'cat_fonts',
};

export const categoriesFor = (type: string): string[] => (TYPE_CATEGORY[type] ? [TYPE_CATEGORY[type]] : []);

export const UNSPECIFIED_LICENSE = 'Unspecified';

// "CC-BY-NC-ND-4.0" -> "cc-by-nc-nd" (design license ids). Unknown licenses (MIT, Apache...) get a
// neutral synthesized entry so the UI never claims CC terms the resource doesn't have.
export function licenseFor(value?: string | null): License {
  const raw = value?.trim() || UNSPECIFIED_LICENSE; // imported sheet rows can have no license
  const id = licenseRowIdFor(raw) ?? raw.toLowerCase().replace(/-\d+(\.\d+)*$/, '');
  return (
    DEMO_LICENSES.find((l) => l.id === id) ?? {
      id: `spdx-${id}`,
      name_ar: raw,
      name_en: raw,
      url: '',
      allows_commercial: false,
      requires_attribution: false,
      requires_share_alike: false,
      allows_modification: false,
      is_osi_approved: false,
    }
  );
}

// Only http(s) links may reach an href/src: the backends validate few URL fields and the API can be called directly.
export function isHttpUrl(v: string): boolean {
  try {
    const p = new URL(v).protocol;
    return p === 'http:' || p === 'https:';
  } catch {
    return false;
  }
}
export const safeUrl = (v?: string | null): string | undefined => (v && isHttpUrl(v) ? v : undefined);

// ponytail: Arabic-script presence, same heuristic class as live's detectLanguage; upgrade if mixed-script text matters.
export const detectLang = (text: string): 'ar' | 'en' => (/[؀-ۿ]/.test(text) ? 'ar' : 'en');
