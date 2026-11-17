// src/lib/constants.ts
// Global System Constants

import { ItqanBadgeLevel, AccessLevel } from '@/types';

export const APP_NAME = 'RATQ';
export const DEFAULT_LOCALE = 'ar';
export const DEFAULT_DIRECTION = 'rtl';

export const ITQAN_BADGES: Record<ItqanBadgeLevel, { name_ar: string; name_en: string; color: string; icon: string }> = {
  none: { name_ar: 'بدون شارة', name_en: 'No Badge', color: 'text-fg-subtle', icon: 'Shield' },
  basic: { name_ar: 'إتقان أساسي', name_en: 'Basic', color: 'text-fg-muted', icon: 'Shield' },
  verified: { name_ar: 'موثّق تقنياً', name_en: 'Verified', color: 'text-ratq-500', icon: 'ShieldCheck' },
  certified: { name_ar: 'معتمد', name_en: 'Certified', color: 'text-badge-certified', icon: 'Award' },
  gold: { name_ar: 'إتقان ذهبي', name_en: 'Gold', color: 'text-badge-gold', icon: 'Crown' },
};

export const ACCESS_LEVELS: Record<AccessLevel, { name_ar: string; name_en: string; color: string }> = {
  open: { name_ar: 'مفتوح', name_en: 'Open', color: 'bg-ratq-50 text-ratq-700 border-ratq-200' },
  request: { name_ar: 'بالطلب', name_en: 'Request', color: 'bg-gold-50 text-gold-700 border-gold-200' },
  institutional: { name_ar: 'مؤسسي فقط', name_en: 'Institutional', color: 'bg-deep-50 text-deep-700 border-deep-200' },
};

export const RESOURCE_TYPES = [
  { code: 'library', name_ar: 'مكتبة برمجية', name_en: 'Library', icon: 'Package' },
  { code: 'recitation', name_ar: 'تلاوة وقراءات', name_en: 'Recitation', icon: 'Mic' },
  { code: 'mushaf', name_ar: 'مصحف رقمي', name_en: 'Mushaf', icon: 'Book' },
  { code: 'tafsir', name_ar: 'تفسير وبيان', name_en: 'Tafsir', icon: 'BookOpen' },
  { code: 'font', name_ar: 'خط طباعي', name_en: 'Font', icon: 'Type' },
  { code: 'dataset', name_ar: 'مجموعة بيانات', name_en: 'Dataset', icon: 'Database' },
  { code: 'api', name_ar: 'واجهة API', name_en: 'API', icon: 'Webhook' },
  { code: 'translation', name_ar: 'ترجمة معاني', name_en: 'Translation', icon: 'Globe' },
  { code: 'tajweed', name_ar: 'أحكام تجويد', name_en: 'Tajweed', icon: 'Sparkles' },
  { code: 'sdk', name_ar: 'حزمة تطوير SDK', name_en: 'SDK', icon: 'Layers' },
  { code: 'tool', name_ar: 'أداة مساعدة', name_en: 'Tool', icon: 'Wrench' },
];

export const TECH_STACK_OPTIONS = [
  'JavaScript',
  'TypeScript',
  'Python',
  'PHP',
  'Java',
  'Kotlin',
  'Swift',
  'Dart',
  'C#',
  'Go',
  'Rust',
  'OpenType',
  'WOFF2',
  'PostgreSQL',
  'JSON',
  'Parquet',
];
