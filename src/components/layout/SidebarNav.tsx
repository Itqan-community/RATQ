// src/components/layout/SidebarNav.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

export interface SidebarNavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  end?: boolean;
}

interface SidebarNavProps {
  title: string;
  items: SidebarNavItem[];
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ title, items }) => {
  return (
    <aside className="w-full lg:w-64 shrink-0 text-start">
      <div className="sticky top-20 flex flex-col gap-1 p-2 rounded-xl border border-border bg-canvas shadow-2xs">
        <div className="px-3 py-2 mb-1 border-b border-border-subtle">
          <h3 className="text-xs font-bold text-fg-subtle uppercase tracking-wider">{title}</h3>
        </div>

        <nav className="flex flex-col gap-0.5">
          {items.map((item) => {
            const hasSubItemInList = items.some(
              (other) => other.href !== item.href && other.href.startsWith(item.href + '/')
            );
            const isRootPortal =
              item.href === '/app' ||
              item.href === '/publisher' ||
              item.href === '/review' ||
              item.href === '/moderation' ||
              item.href === '/admin';
            const isEnd = item.end ?? (hasSubItemInList || isRootPortal);

            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={isEnd}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors',
                    isActive
                      ? 'bg-ratq-50 text-ratq-800 dark:bg-ratq-950 dark:text-ratq-300'
                      : 'text-fg-muted hover:text-fg hover:bg-subtle'
                  )
                }
              >
              <div className="flex items-center gap-2.5">
                <span className="shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-muted text-fg-subtle">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
        </nav>
      </div>
    </aside>
  );
};
