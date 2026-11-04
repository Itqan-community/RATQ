// src/components/home/HeroRings.tsx
import React from 'react';

/**
 * Concentric animated circular rings behind the Hero section illustration.
 * Features:
 * - 5 graduated circles from smallest to largest
 * - Gradient opacity fading outwards from innermost to outermost
 * - Continuous slow rotations in alternating directions
 * - Orbiting glowing accent dots positioned on the circumferences
 */
export const HeroRings: React.FC = () => {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-visible"
      aria-hidden="true"
    >
      {/* Central soft ambient glow */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-ratq-500/15 dark:bg-ratq-400/20 blur-3xl transform scale-90" />

      {/* Circle 1: Smallest (Innermost) - Highest opacity */}
      <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border border-ratq-500/45 dark:border-ratq-400/50 bg-ratq-500/[0.05] animate-spin-slow">
        {/* Orbit dots */}
        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-ratq-500 dark:bg-ratq-400 text-ratq-500 dark:text-ratq-400 shadow-[0_0_10px_currentColor]" />
        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
      </div>

      {/* Circle 2: Small-Medium - High-medium opacity */}
      <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-dashed border-ratq-500/35 dark:border-ratq-400/40 bg-ratq-500/[0.035] animate-spin-reverse-slow">
        {/* Orbit dots */}
        <span className="absolute top-1/4 -start-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
        <span className="absolute bottom-1/4 -end-1 w-2 h-2 rounded-full bg-ratq-400 text-ratq-400 shadow-[0_0_8px_currentColor]" />
        <span className="absolute -top-1 end-1/3 w-1.5 h-1.5 rounded-full bg-ratq-400 text-ratq-400 shadow-[0_0_6px_currentColor]" />
      </div>

      {/* Circle 3: Medium - Moderate opacity */}
      <div className="absolute w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full border border-ratq-500/25 dark:border-ratq-400/30 bg-ratq-500/[0.02] animate-spin-slow-alt">
        {/* Orbit dots */}
        <span className="absolute top-0 end-1/4 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
        <span className="absolute bottom-4 start-1/4 w-2 h-2 rounded-full bg-ratq-400 text-ratq-400 shadow-[0_0_8px_currentColor]" />
        <span className="absolute top-1/2 -start-1.5 w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
      </div>

      {/* Circle 4: Medium-Large - Lower opacity */}
      <div className="absolute w-[440px] h-[440px] sm:w-[540px] sm:h-[540px] rounded-full border border-dashed border-ratq-500/15 dark:border-ratq-400/20 bg-ratq-500/[0.01] animate-spin-reverse-slow-alt">
        {/* Orbit dots */}
        <span className="absolute -top-1.5 start-1/3 w-2 h-2 rounded-full bg-ratq-400 text-ratq-400 shadow-[0_0_8px_currentColor]" />
        <span className="absolute -bottom-1.5 end-1/3 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
        <span className="absolute top-1/3 -end-1 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(252,211,77,0.8)]" />
      </div>

      {/* Circle 5: Largest (Outermost) - Faintest gradient opacity with subtle breath */}
      <div className="absolute w-[540px] h-[540px] sm:w-[660px] sm:h-[660px] rounded-full border border-ratq-500/10 dark:border-ratq-400/12 bg-gradient-to-b from-ratq-500/[0.01] to-transparent animate-pulse-subtle">
        {/* Ambient dots on perimeter */}
        <span className="absolute top-12 start-20 w-2 h-2 rounded-full bg-ratq-400/80 text-ratq-400 shadow-[0_0_8px_currentColor]" />
        <span className="absolute bottom-16 end-24 w-2 h-2 rounded-full bg-amber-400/80 shadow-[0_0_8px_rgba(251,191,36,0.7)]" />
        <span className="absolute top-1/2 -end-1 w-1.5 h-1.5 rounded-full bg-sky-400/70 shadow-[0_0_6px_rgba(56,189,248,0.7)]" />
        <span className="absolute bottom-1/3 -start-1 w-1.5 h-1.5 rounded-full bg-ratq-400/70 text-ratq-400 shadow-[0_0_6px_currentColor]" />
      </div>
    </div>
  );
};
