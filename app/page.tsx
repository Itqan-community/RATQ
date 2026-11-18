import { SpaShell } from './SpaShell';
import { SeoBlock, getResources } from './seo';
import { SITE_DESCRIPTION, SITE_NAME_AR } from '@/lib/seoMeta';

export const dynamic = 'force-dynamic';
export const runtime = 'edge'; // the list comes from the live APIs on every request

export default async function Home() {
  const resources = (await getResources()).slice(0, 12);
  return <SpaShell seo={<SeoBlock title={SITE_NAME_AR} description={SITE_DESCRIPTION} heading="الموارد" resources={resources} />} />;
}
