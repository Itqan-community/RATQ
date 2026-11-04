// src/components/ui/BranchedMenu.tsx
import React, { isValidElement, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown, Folder, FolderOpen } from 'lucide-react';
import './BranchedMenu.css';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface BranchedMenuItemChild {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  badge?: string | number;
  [key: string]: any;
}

export interface BranchedMenuItem {
  value?: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  children?: BranchedMenuItemChild[];
  badge?: string | number;
  [key: string]: any;
}

export interface BranchedMenuProps {
  items: BranchedMenuItem[];
  defaultOpen?: number | number[];
  defaultActive?: string;
  active?: string;
  onSelect?: (value: string, item: BranchedMenuItem | BranchedMenuItemChild) => void;
  onToggle?: (index: number, open: boolean) => void;
  color?: string;
  accentColor?: string;
  lineColor?: string;
  width?: number | string;
  rowHeight?: number;
  indent?: number;
  trunk?: number;
  radius?: number;
  lineWidth?: number;
  fontSize?: number;
  drawDuration?: number;
  foldDuration?: number;
  className?: string;
  isRtl?: boolean;
}

const PAD = 6;
const MARK = 16;

const renderIcon = (icon: any) => {
  if (!icon) return null;
  if (isValidElement(icon)) return icon;
  const IconComp = icon;
  return <IconComp className="w-4 h-4 shrink-0" />;
};

const toSet = (open: number | number[] | undefined): Set<number> => {
  if (Array.isArray(open)) return new Set(open);
  if (typeof open === 'number' && open >= 0) return new Set([open]);
  return new Set();
};

export const BranchedMenu: React.FC<BranchedMenuProps> = ({
  items,
  defaultOpen = 0,
  defaultActive = '',
  active: activeProp,
  onSelect,
  onToggle,
  color = 'var(--fg-default, #0f172a)',
  accentColor = 'var(--ratq-primary-600, #059669)',
  lineColor = 'var(--border-default, #cbd5e1)',
  width = '100%',
  rowHeight = 34,
  indent = 36,
  trunk = 14,
  radius = 10,
  lineWidth = 1.5,
  fontSize = 13,
  drawDuration = 400,
  foldDuration = 300,
  className = '',
  isRtl = true,
}) => {
  const [open, setOpen] = useState<Set<number>>(() => toSet(defaultOpen));
  const [internalActive, setInternalActive] = useState<string>(() => {
    if (activeProp !== undefined) return activeProp;
    if (defaultActive) return defaultActive;
    const first = items.find((it, i) => it.children && toSet(defaultOpen).has(i));
    return first?.children?.[0]?.value ?? '';
  });

  const active = activeProp !== undefined ? activeProp : internalActive;

  // Auto-expand section if active item is inside it
  useEffect(() => {
    if (!active) return;
    const idx = items.findIndex((it) => it.children?.some((k) => k.value === active));
    if (idx >= 0) {
      setOpen((prev) => {
        if (prev.has(idx)) return prev;
        const next = new Set(prev);
        next.add(idx);
        return next;
      });
    }
  }, [active, items]);

  const navRef = useRef<HTMLElement | null>(null);
  const heads = useRef<(HTMLButtonElement | null)[]>([]);
  const markerRef = useRef<HTMLSpanElement | null>(null);
  const latest = useRef({ onSelect, onToggle });
  latest.current = { onSelect, onToggle };

  const activeSection = items.findIndex((it) => it.children?.some((kid) => kid.value === active));
  const markerShown = activeSection >= 0 && open.has(activeSection);

  useIsomorphicLayoutEffect(() => {
    const place = (glide: boolean) => {
      const m = markerRef.current;
      const el = heads.current[activeSection];
      if (!m) return;
      const on = markerShown && el;
      if (!glide) m.style.transition = 'none';
      if (on && el) m.style.top = `${el.offsetTop + (el.offsetHeight - MARK) / 2}px`;
      m.toggleAttribute('data-on', Boolean(on));
      if (!glide) {
        void m.offsetHeight;
        m.style.transition = '';
      }
    };
    place(true);
    let first = true;
    if (typeof ResizeObserver !== 'undefined' && navRef.current) {
      const ro = new ResizeObserver(() => {
        if (first) {
          first = false;
          return;
        }
        place(false);
      });
      ro.observe(navRef.current);
      return () => ro.disconnect();
    }
  }, [activeSection, markerShown, items, fontSize, rowHeight]);

  const select = (value: string, item: BranchedMenuItem | BranchedMenuItemChild) => {
    setInternalActive(value);
    latest.current.onSelect?.(value, item);
  };

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      const isOpen = !next.has(i);
      if (isOpen) next.add(i);
      else next.delete(i);
      latest.current.onToggle?.(i, isOpen);
      return next;
    });
  };

  const r = Math.min(radius, rowHeight / 2 - 2);
  const endX = indent - 8;
  const rowY = (k: number) => PAD + k * rowHeight + rowHeight / 2;
  const branch = (k: number) => `M ${trunk} ${rowY(k) - r} A ${r} ${r} 0 0 0 ${trunk + r} ${rowY(k)} H ${endX}`;
  const reach = (k: number) => `M ${trunk} 0 V ${rowY(k) - r} A ${r} ${r} 0 0 0 ${trunk + r} ${rowY(k)} H ${endX}`;
  const length = (k: number) => rowY(k) - r + (Math.PI * r) / 2 + (endX - trunk - r);

  return (
    <nav
      ref={navRef}
      className={`branched-menu ${isRtl ? 'rtl' : ''} ${className}`.trim()}
      style={
        {
          '--bm-w': typeof width === 'number' ? `${width}px` : width,
          '--bm-ink': color,
          '--bm-accent': accentColor,
          '--bm-line': lineColor,
          '--bm-font': `${fontSize}px`,
          '--bm-row': `${rowHeight}px`,
          '--bm-indent': `${indent}px`,
          '--bm-line-w': lineWidth,
          '--bm-draw': `${drawDuration}ms`,
          '--bm-fold': `${foldDuration}ms`,
        } as React.CSSProperties
      }
    >
      <span ref={markerRef} className="branched-menu__marker" aria-hidden="true" />
      {items.map((item, i) => {
        const kids = item.children;
        const isOpen = kids ? open.has(i) : false;
        const leafValue = item.value ?? item.label;
        const leafActive = !kids && leafValue === active;
        const bodyH = kids ? PAD * 2 + kids.length * rowHeight : 0;

        return (
          <div key={item.value ?? item.label} className="branched-menu__section" data-open={isOpen ? '' : undefined}>
            <button
              ref={(el) => {
                heads.current[i] = el;
              }}
              type="button"
              className="branched-menu__head"
              aria-expanded={kids ? isOpen : undefined}
              aria-current={leafActive ? 'true' : undefined}
              data-active={leafActive ? '' : undefined}
              onClick={() => (kids ? toggle(i) : select(leafValue, item))}
            >
              <div className="flex items-center gap-2 w-full justify-between">
                <div className="flex items-center gap-2 truncate">
                  {kids ? (
                    isOpen ? (
                      <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
                    ) : (
                      <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                    )
                  ) : item.icon ? (
                    <span className="branched-menu__icon">{renderIcon(item.icon)}</span>
                  ) : null}
                  <span className="truncate">{item.label}</span>
                </div>
                {kids && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-fg-subtle shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-0' : '-rotate-90 rtl:rotate-90'
                    }`}
                  />
                )}
              </div>
            </button>

            {kids ? (
              <div className="branched-menu__body">
                <div className="branched-menu__fold">
                  <div className="branched-menu__tree" style={{ height: bodyH }}>
                    <svg className="branched-menu__lines" width={indent} height={bodyH} aria-hidden="true">
                      <path className="branched-menu__base" d={`M ${trunk} 0 V ${rowY(kids.length - 1) - r}`} />
                      {kids.map((kid, k) => (
                        <path key={kid.value} className="branched-menu__base" d={branch(k)} />
                      ))}
                      {kids.map((kid, k) => (
                        <path
                          key={kid.value}
                          className="branched-menu__reach"
                          d={reach(k)}
                          style={{
                            strokeDasharray: length(k),
                            strokeDashoffset: kid.value === active ? 0 : length(k),
                          }}
                        />
                      ))}
                    </svg>

                    {kids.map((kid) => (
                      <button
                        key={kid.value}
                        type="button"
                        className="branched-menu__item"
                        aria-current={kid.value === active ? 'true' : undefined}
                        data-active={kid.value === active ? '' : undefined}
                        tabIndex={isOpen ? 0 : -1}
                        onClick={() => select(kid.value, kid)}
                      >
                        {kid.icon ? (
                          <span className="branched-menu__icon" aria-hidden="true">
                            {renderIcon(kid.icon)}
                          </span>
                        ) : null}
                        <span className="branched-menu__label">{kid.label}</span>
                        {kid.badge !== undefined && (
                          <span className="ms-auto text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-subtle text-fg-subtle border border-border-subtle">
                            {kid.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
};

export default BranchedMenu;
