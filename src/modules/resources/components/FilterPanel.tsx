'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/shared/ui/i18n';
import { RESOURCE_TYPES } from '@/shared/constants/resource-types';

// Free-form strings from resource data (not an enum in src/types/resource.ts).
// Sourced from observed values across mock-data.ts / cms.ts / payload.ts.
// SPDX-style license identifiers are conventionally left untranslated.
const LICENSES = [
  'MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause',
  'CC-BY-4.0', 'CC-BY-SA-4.0', 'CC-BY-SA-3.0', 'CC-BY-NC-4.0', 'custom',
];

export function FilterPanel() {
  const { direction, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeType = searchParams.get('type') ?? '';
  const activeLicense = searchParams.get('license') ?? '';
  const hasActiveFilters = Boolean(activeType || activeLicense);

  function updateParam(key: 'type' | 'license', value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Any filter change should reset pagination back to page 1.
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('type');
    params.delete('license');
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <aside className="w-full shrink-0 sm:w-56" dir={direction}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black">{t.catalog.filters.title}</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-bold text-[#8b8b8b] underline hover:text-black"
          >
            {t.catalog.filters.clearAll}
          </button>
        )}
      </div>

      <fieldset className="mt-5">
        <legend className="text-xs font-black text-[#8b8b8b]">{t.catalog.filters.type}</legend>
        <div className="mt-2 flex flex-col gap-2">
          {RESOURCE_TYPES.map((type) => {
            const isActive = activeType === type;
            return (
              <button
                key={type}
                type="button"
                aria-pressed={isActive}
                onClick={() => updateParam('type', isActive ? '' : type)}
                className={`w-fit rounded-full px-3 py-1 text-left text-sm transition ${
                  isActive ? 'bg-black font-bold text-white' : 'text-[#4a4a4a] hover:bg-[#f0f0f0]'
                }`}
              >
                {t.catalog.types[type]}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-xs font-black text-[#8b8b8b]">{t.catalog.filters.license}</legend>
        <div className="mt-2 flex flex-col gap-2">
          {LICENSES.map((license) => {
            const isActive = activeLicense === license;
            return (
              <button
                key={license}
                type="button"
                aria-pressed={isActive}
                onClick={() => updateParam('license', isActive ? '' : license)}
                className={`w-fit rounded-full px-3 py-1 text-left text-sm transition ${
                  isActive ? 'bg-black font-bold text-white' : 'text-[#4a4a4a] hover:bg-[#f0f0f0]'
                }`}
              >
                {license}
              </button>
            );
          })}
        </div>
      </fieldset>
    </aside>
  );
}
