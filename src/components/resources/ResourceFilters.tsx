// src/components/resources/ResourceFilters.tsx
import React from 'react';
import { useCatalogStore } from '@/store/useCatalogStore';
import { Checkbox } from '@/components/ui/Checkbox';
import { Switch } from '@/components/ui/Switch';
import { RESOURCE_TYPES, TECH_STACK_OPTIONS } from '@/lib/constants';
import { DEMO_LICENSES } from '@/lib/mockData';
import { RotateCcw } from 'lucide-react';
import { getLicenseColorClass } from '@/components/ui/LicenseBadge';
import { FilterHelpTooltip, FILTER_TOOLTIPS } from './FilterHelpTooltip';

const getLicenseTagInfo = (id: string, nameAr: string) => {
  const [arabicName, extractedCode] = nameAr.split(' — ');
  const code = extractedCode || id.toUpperCase();
  const colorClass = getLicenseColorClass(id);

  return { arabicName, code, colorClass };
};

export interface ResourceFiltersProps {
  hideBadges?: boolean;
  hideAccess?: boolean;
}

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  hideBadges = false,
  hideAccess = false,
}) => {
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

  const accessOptions = [
    { id: 'open', label: 'مفتوح ومباشر' },
    { id: 'request', label: 'بالطلب' },
    { id: 'institutional', label: 'مؤسسي فقط' },
  ];

  const badgeOptions = [
    { id: 'gold', label: 'إتقان ذهبي' },
    { id: 'certified', label: 'معتمد' },
    { id: 'verified', label: 'موثّق تقنياً' },
    { id: 'basic', label: 'إتقان أساسي' },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 text-start flex flex-col gap-6 p-4 rounded-xl border border-border bg-canvas shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <h3 className="text-xs font-bold text-fg uppercase tracking-wider">الفلاتر المتقدمة</h3>
        <button
          onClick={resetFilters}
          className="text-[10px] text-fg-subtle hover:text-ratq-700 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          <span>إعادة تعيين</span>
        </button>
      </div>

      {/* Itqan Badges */}
      {!hideBadges && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-fg">شارة إتقان</h4>
            <FilterHelpTooltip data={FILTER_TOOLTIPS.badge} />
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
            <h4 className="text-xs font-bold text-fg">مستوى الوصول</h4>
            <FilterHelpTooltip data={FILTER_TOOLTIPS.access} />
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
          <h4 className="text-xs font-bold text-fg">نوع المورد</h4>
          <FilterHelpTooltip data={FILTER_TOOLTIPS.type} />
        </div>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pe-1">
          {RESOURCE_TYPES.map((type) => (
            <Checkbox
              key={type.code}
              label={type.name_ar}
              checked={selectedTypes.includes(type.code)}
              onChange={() => toggleType(type.code)}
              labelClassName="font-normal"
            />
          ))}
        </div>
      </div>

      {/* Licenses */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-fg">التراخيص (CreativeCommons)</h4>
          <FilterHelpTooltip data={FILTER_TOOLTIPS.license} />
        </div>
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pe-1">
          {DEMO_LICENSES.map((lic) => {
            const { arabicName, code, colorClass } = getLicenseTagInfo(lic.id, lic.name_ar);
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
                checked={selectedLicenses.includes(lic.id)}
                onChange={() => toggleLicense(lic.id)}
                labelClassName="font-normal w-full"
                containerClassName="w-full"
              />
            );
          })}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-fg">التقنية / المنصة</h4>
          <FilterHelpTooltip data={FILTER_TOOLTIPS.tech} />
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
          label="استخدام تجاري مسموح"
          description="حسب بنود الرخصة المعلنة"
          checked={commercialOnly}
          onChange={(e) => setCommercialOnly(e.target.checked)}
          labelClassName="font-normal"
        />
        <div className="pt-1">
          <FilterHelpTooltip data={FILTER_TOOLTIPS.commercial} />
        </div>
      </div>
    </aside>
  );
};
