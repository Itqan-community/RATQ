import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EcosystemApp } from '@/types';
import { clsx } from 'clsx';
import { CheckCircle2 } from 'lucide-react';

export interface ResourceAppBadgesProps {
  apps: EcosystemApp[];
  maxDisplay?: number;
  showLabel?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
  linkToTechStack?: boolean;
}

interface AppIconItemProps {
  app: EcosystemApp;
  dimensionPx: number;
  linkToTechStack?: boolean;
}

const AppIconItem: React.FC<AppIconItemProps> = ({ app, dimensionPx, linkToTechStack }) => {
  const [hasError, setHasError] = useState(false);

  const tooltipText = app.tagline_ar
    ? `${app.name_ar} — ${app.tagline_ar}`
    : app.name_ar;

  const boxStyle: React.CSSProperties = {
    width: `${dimensionPx}px`,
    height: `${dimensionPx}px`,
    minWidth: `${dimensionPx}px`,
    minHeight: `${dimensionPx}px`,
    maxWidth: `${dimensionPx}px`,
    maxHeight: `${dimensionPx}px`,
  };

  const content = hasError ? (
    <div
      style={boxStyle}
      className="rounded-lg bg-ratq-500/10 border border-ratq-500/30 text-ratq-700 dark:text-ratq-300 font-bold flex items-center justify-center text-xs shadow-2xs select-none"
    >
      {app.name_ar.trim().charAt(0)}
    </div>
  ) : (
    <div
      style={boxStyle}
      className="rounded-lg overflow-hidden ring-1 ring-black/10 dark:ring-white/15 bg-canvas shadow-2xs hover:scale-105 hover:ring-ratq-500 hover:shadow-xs transition-transform duration-150 inline-flex items-center justify-center cursor-pointer shrink-0"
    >
      <img
        src={app.icon_url}
        alt={app.name_ar}
        width={dimensionPx}
        height={dimensionPx}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover block select-none"
      />
    </div>
  );

  // Instant tooltip positioned directly underneath the icon, horizontally centered
  const tooltipElement = (
    <div
      role="tooltip"
      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none opacity-0 invisible group-hover/app:opacity-100 group-hover/app:visible transition-all duration-75 delay-0"
    >
      {/* Upward pointer arrow */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-zinc-900 dark:bg-zinc-100 border-t border-l border-zinc-700/60 dark:border-zinc-300" />

      {/* Tooltip Card */}
      <div className="relative px-2.5 py-1 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-[11px] font-semibold whitespace-nowrap shadow-xl border border-zinc-700/60 dark:border-zinc-300 flex items-center gap-1.5 text-center">
        <span>{app.name_ar}</span>
      </div>
    </div>
  );

  if (linkToTechStack) {
    return (
      <Link
        to={`/tech-stacks#${app.id}`}
        style={boxStyle}
        className="inline-flex shrink-0 relative group/app"
        aria-label={tooltipText}
      >
        {content}
        {tooltipElement}
      </Link>
    );
  }

  if (app.live_url) {
    return (
      <a
        href={app.live_url}
        target="_blank"
        rel="noopener noreferrer"
        style={boxStyle}
        className="inline-flex shrink-0 relative group/app"
        aria-label={tooltipText}
      >
        {content}
        {tooltipElement}
      </a>
    );
  }

  return (
    <div style={boxStyle} className="inline-flex shrink-0 relative group/app" aria-label={tooltipText}>
      {content}
      {tooltipElement}
    </div>
  );
};

export const ResourceAppBadges: React.FC<ResourceAppBadgesProps> = ({
  apps,
  maxDisplay = 6,
  showLabel = true,
  className,
  size = 'sm',
  linkToTechStack = false,
}) => {
  if (!apps || apps.length === 0) {
    return null;
  }

  const displayedApps = apps.slice(0, maxDisplay);
  const remainingCount = apps.length - maxDisplay;
  const remainingApps = remainingCount > 0 ? apps.slice(maxDisplay) : [];
  const remainingNames = remainingApps.map((a) => a.name_ar).join('، ');

  // Crisp dimensions: 36px for sm ensures excellent clarity for fine Arabic calligraphy and details
  const dimensionPx = size === 'xs' ? 24 : size === 'md' ? 44 : 36;

  const overflowStyle: React.CSSProperties = {
    width: `${dimensionPx}px`,
    height: `${dimensionPx}px`,
    minWidth: `${dimensionPx}px`,
    minHeight: `${dimensionPx}px`,
    maxWidth: `${dimensionPx}px`,
    maxHeight: `${dimensionPx}px`,
  };

  return (
    <div
      className={clsx(
        'flex items-center gap-2 flex-wrap text-start',
        className
      )}
    >
      {showLabel && (
        <span className="text-[11px] font-medium text-fg-subtle shrink-0 flex items-center gap-1 select-none">
          <CheckCircle2 className="w-3.5 h-3.5 text-ratq-600 dark:text-ratq-400 shrink-0" />
          <span>مُعتمد في:</span>
        </span>
      )}

      <div className="flex items-center gap-1.5 shrink-0">
        {displayedApps.map((app) => (
          <AppIconItem key={app.id} app={app} dimensionPx={dimensionPx} linkToTechStack={linkToTechStack} />
        ))}

        {remainingCount > 0 && (
          <div
            style={overflowStyle}
            className="relative group/overflow rounded-lg bg-muted/90 dark:bg-muted ring-1 ring-black/10 dark:ring-white/20 flex items-center justify-center font-mono font-bold text-[11px] text-fg-muted shadow-xs hover:bg-subtle transition-colors cursor-help shrink-0 select-none"
          >
            +{remainingCount}

            {/* Instant Tooltip for Remaining Apps */}
            <div
              role="tooltip"
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none opacity-0 invisible group-hover/overflow:opacity-100 group-hover/overflow:visible transition-all duration-75 delay-0"
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-zinc-900 dark:bg-zinc-100 border-t border-l border-zinc-700/60 dark:border-zinc-300" />
              <div className="relative px-2.5 py-1 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-[11px] font-semibold whitespace-nowrap shadow-xl border border-zinc-700/60 dark:border-zinc-300 text-center">
                <span>تطبيقات أخرى: {remainingNames}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
