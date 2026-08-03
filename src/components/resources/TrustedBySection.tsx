'use client';

import { useState, useRef } from 'react';
import { useLanguage } from '@/i18n';
import type { Consumer } from '@/types/resource';
import { ConsumerAvatar } from './ConsumerAvatar';

interface TrustedBySectionProps {
  consumers: Consumer[];
}

// Gradient colors for hover tooltip background
const gradientTones: Record<string, string> = {
  'from-blue-500': 'bg-blue-50 border-blue-200 text-blue-800',
  'from-emerald-500': 'bg-emerald-50 border-emerald-200 text-emerald-800',
  'from-amber-500': 'bg-amber-50 border-amber-200 text-amber-800',
  'from-violet-500': 'bg-violet-50 border-violet-200 text-violet-800',
  'from-red-500': 'bg-red-50 border-red-200 text-red-800',
  'from-cyan-500': 'bg-cyan-50 border-cyan-200 text-cyan-800',
  'from-pink-500': 'bg-pink-50 border-pink-200 text-pink-800',
  'from-teal-500': 'bg-teal-50 border-teal-200 text-teal-800',
  'from-orange-500': 'bg-orange-50 border-orange-800 text-orange-800',
  'from-indigo-500': 'bg-indigo-50 border-indigo-200 text-indigo-800',
  'from-lime-500': 'bg-lime-50 border-lime-200 text-lime-800',
  'from-purple-500': 'bg-purple-50 border-purple-200 text-purple-800',
};

function getGradientTone(consumerName: string): string {
  const gradientColors = [
    'from-blue-500', 'from-emerald-500', 'from-amber-500', 'from-violet-500',
    'from-red-500', 'from-cyan-500', 'from-pink-500', 'from-teal-500',
    'from-orange-500', 'from-indigo-500', 'from-lime-500', 'from-purple-500',
  ];
  return gradientColors[consumerName.charCodeAt(0) % gradientColors.length];
}

export function TrustedBySection({ consumers }: TrustedBySectionProps) {
  const { t } = useLanguage();
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!consumers || consumers.length === 0) {
    return null;
  }

  // Find the gradient tone for the currently hovered consumer
  const hoveredConsumer = consumers.find((c) => c.name === hoveredName);
  const gradientTone = hoveredConsumer ? getGradientTone(hoveredConsumer.name) : null;
  const tooltipStyle = gradientTone ? gradientTones[gradientTone] : 'bg-gray-50 border-gray-200 text-gray-800';

  return (
    <div
      ref={containerRef}
      className="border border-[var(--border-color)] rounded-xl p-4 bg-[var(--bg-card)] shadow-sm"
    >
      <h2 className="font-heading text-xs font-semibold text-center tracking-wider uppercase text-[var(--text-muted)] mb-1">
        {t.resource.detail.trustedBy}
      </h2>
      <p className="text-[10px] text-[var(--text-muted)] mb-3 text-center">
        {t.resource.detail.trustedByCount.replace('{{count}}', String(consumers.length))}
      </p>

      {/* Logo cloud */}
      <div className="flex flex-wrap gap-2 justify-center mb-2">
        {consumers.map((consumer) => (
          <ConsumerAvatar
            key={consumer.name}
            consumer={consumer}
            size="sidebar"
            onMouseEnter={() => {
              setHoveredName(consumer.name);
              setHoveredCategory(consumer.category ?? null);
            }}
            onMouseLeave={() => {
              setHoveredName(null);
              setHoveredCategory(null);
            }}
          />
        ))}
      </div>

      {/* Hover tooltip card */}
      {hoveredName && (
        <div className={`mt-2.5 p-2.5 rounded-lg text-center border ${tooltipStyle} transition-opacity duration-150`}>
          <div className="text-sm font-semibold">{hoveredName}</div>
          {hoveredCategory && (
            <div className="text-[10px] opacity-80">{hoveredCategory}</div>
          )}
        </div>
      )}
    </div>
  );
}
