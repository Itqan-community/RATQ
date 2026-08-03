'use client';

import { useState } from 'react';
import type { Consumer } from '@/types/resource';

interface ConsumerAvatarProps {
  consumer: Consumer;
  size: 'featured' | 'expanded' | 'sidebar';
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const sizeMap = {
  featured: {
    avatar: 'h-13 w-13 text-lg',    // 52px
    gap: 'gap-2',
  },
  expanded: {
    avatar: 'h-9 w-9 text-sm',      // 36px
    gap: 'gap-1.5',
  },
  sidebar: {
    avatar: 'h-[38px] w-[38px] text-xs',  // 38px
    gap: 'gap-1',
  },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const gradientColors = [
  'from-blue-500 to-blue-700',
  'from-emerald-500 to-emerald-700',
  'from-amber-500 to-amber-700',
  'from-violet-500 to-violet-700',
  'from-red-500 to-red-700',
  'from-cyan-500 to-cyan-700',
  'from-pink-500 to-pink-700',
  'from-teal-500 to-teal-700',
  'from-orange-500 to-orange-700',
  'from-indigo-500 to-indigo-700',
  'from-lime-500 to-lime-700',
  'from-purple-500 to-purple-700',
];

export function ConsumerAvatar({ consumer, size, onMouseEnter, onMouseLeave }: ConsumerAvatarProps) {
  const [logoError, setLogoError] = useState(false);
  const sizes = sizeMap[size];
  const gradient = gradientColors[consumer.name.charCodeAt(0) % gradientColors.length];
  const initials = getInitials(consumer.name);
  const isClickable = consumer.website_url && consumer.website_url.startsWith('http');

  const avatarContent = consumer.logo_url && !logoError ? (
    // eslint-disable-next-line @next/next/no-img-element -- consistent with existing ConsumerCard pattern
    <img
      src={consumer.logo_url}
      alt={`${consumer.name} logo`}
      className={`w-full h-full rounded-full object-cover object-center`}
      onError={() => setLogoError(true)}
    />
  ) : (
    <span className={`font-bold text-white`}>{initials}</span>
  );

  const wrapperClasses = `
    flex flex-col items-center transition-transform duration-200 hover:scale-105
  `;

  if (isClickable) {
    return (
      <a
        href={consumer.website_url}
        target="_blank"
        rel="noopener noreferrer"
        className={wrapperClasses}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div
          className={`flex aspect-square items-center justify-center rounded-full bg-gradient-to-br ${gradient} shadow-sm ${sizes.avatar}`}
        >
          {avatarContent}
        </div>
        {size !== 'sidebar' && (
          <span className={`font-medium text-[var(--text-primary)] ${size === 'featured' ? 'text-xs' : 'text-[10px]'}`}>
            {consumer.name}
          </span>
        )}
        {size !== 'sidebar' && consumer.category && (
          <span className="text-[9px] text-[var(--text-muted)]">{consumer.category}</span>
        )}
      </a>
    );
  }

  return (
    <div
      className={wrapperClasses}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={`flex aspect-square items-center justify-center rounded-full bg-gradient-to-br ${gradient} shadow-sm ${sizes.avatar}`}
      >
        {avatarContent}
      </div>
      {size !== 'sidebar' && (
        <span className={`font-medium text-[var(--text-primary)] ${size === 'featured' ? 'text-xs' : 'text-[10px]'}`}>
          {consumer.name}
        </span>
      )}
      {size !== 'sidebar' && consumer.category && (
        <span className="text-[9px] text-[var(--text-muted)]">{consumer.category}</span>
      )}
    </div>
  );
}
