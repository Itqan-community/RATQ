import { SpaShell } from './SpaShell';
import { SeoBlock, getResources } from './seo';
import { SITE_DESCRIPTION } from '@/lib/seoMeta';

export const dynamic = 'force-dynamic'; // the list comes from the live APIs on every request

export default async function Home() {
  const resources = (await getResources()).slice(0, 12);
  return <SpaShell seo={<SeoBlock title="منصة مجتمع RATQ" description={SITE_DESCRIPTION} heading="الموارد" resources={resources} />} />;
}
