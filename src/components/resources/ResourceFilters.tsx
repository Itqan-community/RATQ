// src/components/resources/ResourceFilters.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCatalogStore } from '@/store/useCatalogStore';
import { Checkbox } from '@/components/ui/Checkbox';
import { Switch } from '@/components/ui/Switch';
import { RESOURCE_TYPES, TECH_STACK_OPTIONS } from '@/lib/constants';
import { DEMO_LICENSES } from '@/lib/mockData';
import { RotateCcw } from 'lucide-react';
import { getLicenseColorClass } from '@/components/ui/LicenseBadge';
import { FilterHelpTooltip } from './FilterHelpTooltip';
import { CC_LICENSE_ROWS, NO_PUBLISHER_VALUE, type CatalogQuery, type PublisherOption } from '@/lib/catalogQuery';

// Catalog page: type/license/publisher live in the URL (live's shape). Without it (design previews) they stay in the store.
export interface CatalogUrlBinding {
  query: CatalogQuery;
  onChange: (patch: Partial<CatalogQuery>) => void;
  publishers: PublisherOption[];
}

const toggled = (list: string[], values: string[]) =>
  values.some((v) => list.includes(v)) ? list.filter((v) => !values.includes(v)) : [...list, ...values.filter((v) => !list.includes(v))];

const getLicenseTagInfo = (id: string, nameAr: string, nameEn: string, en: boolean) => {
  const [arabicName, extractedCode] = nameAr.split(' — ');
  const code = extractedCode || id.toUpperCase();
  const colorClass = getLicenseColorClass(id);

  // English: the descriptive part of name_en, e.g. "CC BY 4.0 (Attribution)" -> "Attribution".
  const enName = nameEn.match(/\(([^)]+)\)/)?.[1] ?? nameEn;
  return { arabicName: en ? enName : arabicName, code, colorClass };
};

export interface ResourceFiltersProps {
  hideBadges?: boolean;
  hideAccess?: boolean;
  url?: CatalogUrlBinding;
}

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  hideBadges = false,
  hideAccess = false,
  url,
}) => {
  const { t, i18n } = useTranslation('site');
  const en = i18n.language === 'en';
  const {
    selectedTypes,
    toggleType,
    selectedLicenses,
    toggleLicense,
    selectedAccess,
    toggleAccess,
    selectedBadges,
    toggleBadge,
    selectedTech,
    toggleTech,
    commercialOnly,
    setCommercialOnly,
    resetFilters,
  } = useCatalogStore();

  const activeTypes = url ? url.query.types : selectedTypes;
  const rowActive = (row: (typeof CC_LICENSE_ROWS)[number]) =>
    url ? row.values.some((v) => url.query.licenses.includes(v)) : selectedLicenses.includes(row.id);
  const resetAll = () => {
    resetFilters();
    url?.onChange({ types: [], licenses: [], publishers: [] });
  };

  const accessOptions = [
    { id: 'open', label: t('filters.access_open') },
    { id: 'request', label: t('filters.access_request') },
    { id: 'institutional', label: t('filters.access_institutional') },
  ];

  const badgeOptions = [
    { id: 'gold', label: t('filters.badge_gold') },
    { id: 'certified', label: t('filters.badge_certified') },
    { id: 'verified', label: t('filters.badge_verified') },
    { id: 'basic', label: t('filters.badge_basic') },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 text-start flex flex-col gap-6 p-4 rounded-xl border border-border bg-canvas shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <h3 className="text-xs font-bold text-fg uppercase tracking-wider">{t('filters.title')}</h3>
        <button
          onClick={resetAll}
          className="text-[10px] text-fg-subtle hover:text-ratq-700 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          <span>{t('filters.reset')}</span>
        </button>
      </div>

      {/* Itqan Badges */}
      {!hideBadges && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-fg">{t('filters.itqan_badge')}</h4>
            <FilterHelpTooltip topic="badge" />
          </div>
          <div className="flex flex-col gap-2">
            {badgeOptions.map((opt) => (
              <Checkbox
                key={opt.id}
                label={opt.label}
                checked={selectedBadges.includes(opt.id)}
                onChange={() => toggleBadge(opt.id)}
                labelClassName="font-normal"
              />
            ))}
          </div>
        </div>
      )}

      {/* Access Level */}
      {!hideAccess && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-fg">{t('filters.access_level')}</h4>
            <FilterHelpTooltip topic="access" />
          </div>
          <div className="flex flex-col gap-2">
            {accessOptions.map((opt) => (
              <Checkbox
                key={opt.id}
                label={opt.label}
                checked={selectedAccess.includes(opt.id)}
                onChange={() => toggleAccess(opt.id)}
                labelClassName="font-normal"
              />
            ))}
          </div>
        </div>
      )}

      {/* Resource Types */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-fg">{t('filters.resource_type')}</h4>
          <FilterHelpTooltip topic="type" />
        </div>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pe-1">
          {RESOURCE_TYPES.map((type) => (
            <Checkbox
              key={type.code}
              label={en ? type.name_en : type.name_ar}
              checked={activeTypes.includes(type.code)}
              onChange={() => (url ? url.onChange({ types: toggled(url.query.types, [type.code]) }) : toggleType(type.code))}
              labelClassName="font-normal"
            />
          ))}
        </div>
      </div>

      {/* Licenses */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-fg">{t('filters.licenses')}</h4>
          <FilterHelpTooltip topic="license" />
        </div>
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pe-1">
          {CC_LICENSE_ROWS.map((row) => {
            const lic = DEMO_LICENSES.find((l) => l.id === row.id);
            if (!lic) return null;
            const { arabicName, code, colorClass } = getLicenseTagInfo(lic.id, lic.name_ar, lic.name_en, en);
            return (
              <Checkbox
                key={lic.id}
                label={
                  <div className="flex items-center justify-between gap-1.5 w-full">
                    <span className="leading-snug">{arabicName}</span>
                    <span
                      dir="ltr"
                      className={`text-[10px] font-mono font-normal px-1.5 py-0.5 rounded-full border shrink-0 ${colorClass}`}
                    >
                      {code}
                    </span>
                  </div>
                }
                checked={rowActive(row)}
                onChange={() => (url ? url.onChange({ licenses: toggled(url.query.licenses, row.values) }) : toggleLicense(row.id))}
                labelClassName="font-normal w-full"
                containerClassName="w-full"
              />
            );
          })}
        </div>
      </div>

      {/* Publisher (URL-backed catalog only, like live's FilterPanel) */}
      {url && (
        <div className="flex flex-col gap-2.5">
          <h4 className="text-xs font-bold text-fg">{t('filters.publisher')}</h4>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pe-1">
            {[{ key: NO_PUBLISHER_VALUE, name: t('filters.no_publisher') }, ...url.publishers].map((pub) => (
              <Checkbox
                key={pub.key}
                label={pub.name}
                checked={url.query.publishers.includes(pub.key)}
                onChange={() => url.onChange({ publishers: toggled(url.query.publishers, [pub.key]) })}
                labelClassName="font-normal"
              />
            ))}
          </div>
        </div>
      )}

      {/* Tech Stack */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-fg">{t('filters.tech')}</h4>
          <FilterHelpTooltip topic="tech" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TECH_STACK_OPTIONS.slice(0, 8).map((tech) => {
            const isSelected = selectedTech.includes(tech);
            return (
              <button
                key={tech}
                onClick={() => toggleTech(tech)}
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full border transition-colors cursor-pointer font-normal ${
                  isSelected
                    ? 'bg-ratq-700 text-white border-ratq-700'
                    : 'bg-subtle text-fg-muted border-border hover:border-border-strong'
                }`}
              >
                {tech}
              </button>
            );
          })}
        </div>
      </div>

      {/* Commercial Toggle */}
      <div className="pt-2 border-t border-border-subtle flex items-start justify-between gap-2">
        <Switch
          label={t('filters.commercial')}
          description={t('filters.commercial_desc')}
          checked={commercialOnly}
          onChange={(e) => setCommercialOnly(e.target.checked)}
          labelClassName="font-normal"
        />
        <div className="pt-1">
          <FilterHelpTooltip topic="commercial" />
        </div>
      </div>
    </aside>
  );
};
