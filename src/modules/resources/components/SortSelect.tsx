'use client';

import { useLanguage } from '@/shared/ui/i18n';
import { SortOption } from '@/types/resource';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

const SORT_OPTIONS: SortOption[] = ['relevance', 'downloads', 'newest', 'oldest', 'name_asc', 'name_desc'];

export default function SortSelect() {
  const { direction, t } = useLanguage();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeSort = searchParams.get('sort') ?? 'relevance';

  function updateParam(key: 'sort', value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Any sort change should reset pagination back to page 1.
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className='flex items-center gap-3 mb-6' dir={direction}>
      <label htmlFor='sort' className='text-sm font-black text-[#8b8b8b]'>
        {t.catalog.sort.by}
      </label>
      <div className='relative'>
        <select
          id='sort'
          name='sort'
          onChange={(e) => updateParam('sort', e.target.value)}
          value={activeSort}
          className='appearance-none rounded-full border border-[#e7e7e7] bg-white py-2 pe-9 ps-4 text-sm font-bold text-black transition hover:border-[#c7c7c7] focus:border-black focus:outline-none'
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {t.catalog.sort.options[option]}
            </option>
          ))}
        </select>
        <svg
          className='pointer-events-none absolute end-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8b8b8b]'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2.5}
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
        </svg>
      </div>
    </div>
  );
}