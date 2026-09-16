'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/shared/ui/i18n';
import { RESOURCE_TYPES } from '@/shared/constants/resource-types';
import { RESOURCE_TYPE_COLORS } from '@/shared/constants/resource-type-colors';
import { TypeIcon } from '@/shared/constants/resource-type-icon';
import { CC_LICENSE_ROWS, type CcLicenseRow } from '@/shared/utils/license-filter';

// Re-exported so existing imports (and tests) that pull CC_LICENSE_ROWS from
// this component path keep working — the shared license-filter module is now
// the single source of truth, this file just re-exposes it for convenience.
export { CC_LICENSE_ROWS };
export type { CcLicenseRow };

// ─── Icon helpers ──────────────────────────────────────────────────────────

/** Trash / clear-all icon */
function TrashIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </svg>
  );
}

// ─── FilterPanel ───────────────────────────────────────────────────────────

export function FilterPanel() {
  const { direction, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeType = searchParams.get('type') ?? '';
  // Multi-value license: ?license=a&license=b
  const activeLicenses = searchParams.getAll('license');

  // ── Type toggle (single-select, same behaviour as before) ──────────────
  function toggleType(type: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (activeType === type) {
      params.delete('type');
    } else {
      params.set('type', type);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  // ── License toggle (multi-select via repeated params) ──────────────────
  function toggleLicense(values: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    // A CC row is "active" if *any* of its stored values is currently selected.
    const rowIsActive = values.some((v) => activeLicenses.includes(v));

    // Remove all existing license params, then re-add the ones that should
    // stay — this is the cleanest way to handle repeated params in the browser.
    params.delete('license');
    const next = rowIsActive
      ? // Deselect: keep every active license except the ones in this row.
        activeLicenses.filter((l) => !values.includes(l))
      : // Select: add this row's values that aren't already present.
        [...activeLicenses, ...values.filter((v) => !activeLicenses.includes(v))];

    next.forEach((l) => params.append('license', l));
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
    <aside
      className="w-full shrink-0 sm:w-64"
      dir={direction}
      aria-label={t.catalog.filters.title}
    >
      {/* ── Panel card ───────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#e7e7e7] bg-white p-5">

        {/* Header row: title + clear-all (trash button always visible per design) */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-black">{t.catalog.filters.title}</h2>
            <p className="mt-0.5 text-xs text-[#8b8b8b]">{t.catalog.filters.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={clearAll}
            aria-label={t.catalog.filters.clearAll}
            className="mt-0.5 flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold text-[#8b8b8b] transition hover:bg-[#f5f5f5] hover:text-black"
          >
            <TrashIcon />
            {t.catalog.filters.clearAll}
          </button>
        </div>

        {/* ── Resource-type section ───────────────────────────────────────── */}
        <fieldset className="mt-5">
          <legend className="text-sm font-black">{t.catalog.filters.resourceType}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {RESOURCE_TYPES.map((type) => {
              const isActive = activeType === type;
              const colorClass = RESOURCE_TYPE_COLORS[type];
              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => toggleType(type)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                    isActive
                      ? `${colorClass} ring-2 ring-black/20`
                      : `${colorClass} opacity-60 hover:opacity-100`
                  }`}
                >
                  <TypeIcon type={type} className="h-3.5 w-3.5" />
                  {t.catalog.types[type]}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Divider */}
        <div className="my-5 border-t border-[#f0f0f0]" />

        {/* ── License section ─────────────────────────────────────────────── */}
        <fieldset>
          <legend className="text-sm font-black">{t.catalog.filters.licenses}</legend>
          <div className="mt-3 flex flex-col gap-3">
            {CC_LICENSE_ROWS.map((row) => {
              const rowActive = row.values.some((v) => activeLicenses.includes(v));
              const checkboxId = `license-${row.labelKey}`;
              return (
                <label
                  key={row.labelKey}
                  htmlFor={checkboxId}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-1 py-0.5 transition hover:bg-[#f9f9f9]"
                >
                  {/* Right side: description label (panel is RTL in Arabic) */}
                  <span className="text-sm text-[#3a3a3a]">
                    {t.catalog.filters.licenseLabels[row.labelKey]}
                  </span>

                  {/* Left side: badge chip + checkbox */}
                  <span className="flex shrink-0 items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black leading-none text-black ${row.badgeColor}`}
                    >
                      {row.badge}
                    </span>
                    <input
                      id={checkboxId}
                      type="checkbox"
                      checked={rowActive}
                      onChange={() => toggleLicense(row.values)}
                      className="h-4 w-4 cursor-pointer rounded border-[#d0d0d0] accent-black"
                    />
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

      </div>
    </aside>
  );
}