'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/shared/ui/i18n';
import { ResourceCard } from '@/modules/resources/components/ResourceCard';
import { Pagination } from '@/shared/ui/Pagination';
import { useResources } from '@/hooks/useResources';
import { parsePageParam } from '@/shared/utils/utils';

const PAGE_SIZE = 12;

export function CatalogContent() {
  const { locale, direction, t } = useLanguage();
  const searchParams = useSearchParams();
  const page = parsePageParam(searchParams.get('page'));
  const { data, error, isLoading } = useResources({ page, page_size: PAGE_SIZE });
  const resources = data?.results ?? [];

  return (
    <div className="bg-white pb-10 pt-32 text-black sm:pt-36" dir={direction}>
      <main className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[28px] bg-[linear-gradient(118deg,#eef1f1_18%,#dcebf7_100%)] px-5 py-12 text-center sm:px-10 sm:py-14 lg:px-24">
          <h1 className="text-3xl font-black leading-tight sm:text-4xl">
            {locale === 'ar' ? 'مكتبة الموارد' : 'Resource Library'}
          </h1>
          <p className="mt-3 text-xl font-medium leading-relaxed sm:text-3xl">
            {locale === 'ar'
              ? 'مصدر لكل ما تحتاجه لدراساتك القرآنية'
              : 'Everything you need for Quranic studies'}
          </p>
        </section>

        {isLoading ? (
          <section className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="skeleton min-h-[305px] rounded-[13px]" />
            ))}
          </section>
        ) : error ? (
          <section className="mt-7 rounded-[18px] border border-[#e7e7e7] bg-[#fafafa] px-6 py-16 text-center">
            <p className="text-lg font-black">{t.catalog.error.title}</p>
            <p className="mt-2 text-sm text-[#8b8b8b]">{t.catalog.error.subtitle}</p>
          </section>
        ) : resources.length === 0 ? (
          <section className="mt-7 rounded-[18px] border border-[#e7e7e7] bg-[#fafafa] px-6 py-16 text-center">
            <p className="text-lg font-black">{t.catalog.noResources.title}</p>
            <p className="mt-2 text-sm text-[#8b8b8b]">{t.catalog.noResources.subtitle}</p>
          </section>
        ) : (
          <>
            <section className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </section>
            <Pagination count={data?.count ?? 0} pageSize={PAGE_SIZE} />
          </>
        )}

        <section className="mt-24 overflow-hidden rounded-[24px] bg-[linear-gradient(112deg,#edf1f1_15%,#dbeaf6_100%)] px-7 sm:px-12">
          <div className="grid items-stretch md:min-h-[340px] gap-8 md:grid-cols-[330px_1fr]" dir="ltr">
            <div className="flex h-[220px] items-end justify-center self-stretch overflow-hidden sm:h-[270px] md:h-full">
              <img
                src="/images/rocket.png"
                alt=""
                className="h-full w-auto max-w-full object-contain object-bottom md:max-w-none"
              />
            </div>
            <div className="flex flex-col items-start justify-center py-10 text-start" dir={direction}>
              <h2 className="text-3xl font-black leading-tight sm:text-5xl">
                {locale === 'ar' ? 'انشر موردك القرآني' : 'Publish your Quranic resource'}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#818181] sm:text-lg">
                {locale === 'ar'
                  ? 'شارك مكتبتك أو أداة التطوير أو مجموعة البيانات مع المجتمع. صِل إلى المطورين الذين يبنون الجيل القادم.'
                  : 'Share your library, development tool, or dataset with the community and reach developers building the next generation.'}
              </p>
              <Link
                href="/dashboard/resources"
                className="mt-7 inline-flex rounded-full bg-black px-10 py-4 text-base font-black text-white transition hover:bg-[#171717]"
              >
                {locale === 'ar' ? 'انشره الآن' : 'Publish now'}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
