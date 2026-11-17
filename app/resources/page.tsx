import type { Metadata } from 'next';
import { SpaShell } from '../SpaShell';
import { SeoBlock, getResources, openGraph } from '../seo';

export const dynamic = 'force-dynamic';

const TITLE = 'مكتبة الموارد';
const DESCRIPTION = 'تصفّح مكتبة الموارد القرآنية: مكتبات، حزم تطوير، مجموعات بيانات، تلاوات وتفاسير مفتوحة المصدر.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/resources' },
  openGraph: openGraph({ title: TITLE, description: DESCRIPTION, path: '/resources' }),
};

export default async function ResourcesPage() {
  const resources = await getResources();
  return <SpaShell seo={<SeoBlock title={TITLE} description={DESCRIPTION} resources={resources} />} />;
}
