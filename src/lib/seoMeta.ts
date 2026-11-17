// Shared by the Next metadata layer (server) and the SPA title updater, so both agree on a resource's title.
import { isHttpUrl } from './resourceMapping';
import type { Resource } from '@/types';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ratq.itqan.dev').replace(/\/$/, '');
export const SITE_NAME = 'RATQ Community Platform';
export const SITE_DESCRIPTION =
  'مرجعك الموثوق لتطوير البرمجيات القرآنية — كتالوج موثّق، شارات إتقان للجودة، مسارات وصول منظّمة، ومفاتيح API مُدارة.';

// Live titles a resource by its (English) name and describes it with the first 160 chars of its text.
export function resourceMeta(r: Resource): { title: string; description: string; image?: string } {
  const text = r.description_en || r.description_ar || r.summary_en || r.summary_ar || SITE_DESCRIPTION;
  return {
    title: r.title_en || r.title_ar,
    description: text.slice(0, 160),
    image: r.image_url && isHttpUrl(r.image_url) ? r.image_url : undefined,
  };
}
