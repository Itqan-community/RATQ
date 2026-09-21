'use client';

import { useLanguage } from '@/shared/ui/i18n';

export interface ResourceCtaBannerProps {
  // Required - the destination is always a real external URL (the parent only
  // renders the banner when that URL exists), matching the View GitHub link.
  href: string;
  icon: React.ReactNode;
  title: string;
  // Optional - the API banner may have no endpoint to show when only docs
  // exist; the visit-site banner always shows the destination URL.
  description?: string;
  buttonLabel: string;
  // Label the destination with the caller-provided site name when available;
  // purely decorative banners can omit it.
  ariaLabel?: string;
}

// Shared design for the "visit resource site" / "use API" banners below the
// resource detail preview (issue #299). The parent decides visibility and copy;
// this component only owns the banner look and the external-link behavior.
export function ResourceCtaBanner({
  href,
  icon,
  title,
  description,
  buttonLabel,
  ariaLabel,
}: ResourceCtaBannerProps) {
  const { direction } = useLanguage();

  return (
    <section
      dir={direction}
      className="mt-6 flex flex-col gap-4 rounded-[14px] border border-[#e5e5e5] bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
      aria-label={ariaLabel}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4f4f4] text-[#171717]">
          {icon}
        </span>
        <div>
          <h3 className="text-base font-black text-[#171717]">{title}</h3>
          {description && (
            // No hardcoded dir: the paragraph inherits the section's RTL/LTR
            // direction, so Arabic copy reads correctly while embedded URLs
            // and hostnames are still handled by the bidi algorithm.
            <p className="mt-1 text-xs leading-6 text-[#808080]">{description}</p>
          )}
        </div>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#171717] px-6 py-3 text-sm font-black text-white transition hover:bg-[#000]"
      >
        {buttonLabel}
      </a>
    </section>
  );
}
