'use client';

import React, { useState } from 'react';

export type AuroraColorTheme = 'blue' | 'purple' | 'green' | 'orange' | 'multi';

export interface AuroraCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Color theme for the soft radial aurora glow highlights */
  theme?: AuroraColorTheme;
  /** Whether the card expands/glows interactively on hover */
  interactive?: boolean;
  /** Disable inner padding */
  noPadding?: boolean;
  /** Show animated background mesh blobs */
  animatedMesh?: boolean;
  /** Custom badge text to overlay at top corner */
  badgeText?: string;
  badgeColor?: 'blue' | 'purple' | 'green' | 'orange';
  children: React.ReactNode;
}

const THEME_GLOW_STYLES: Record<AuroraColorTheme, {
  glowBlob1: string;
  glowBlob2: string;
  borderHover: string;
  accentBadgeBg: string;
  accentBadgeText: string;
}> = {
  blue: {
    glowBlob1: 'bg-blue-400/25 dark:bg-blue-500/20',
    glowBlob2: 'bg-indigo-400/20 dark:bg-indigo-500/15',
    borderHover: 'hover:border-blue-400/60 dark:hover:border-blue-400/40 hover:shadow-[0_8px_30px_rgb(96,165,250,0.2)]',
    accentBadgeBg: 'bg-blue-100 dark:bg-blue-950/60',
    accentBadgeText: 'text-blue-700 dark:text-blue-300',
  },
  purple: {
    glowBlob1: 'bg-purple-400/25 dark:bg-purple-500/20',
    glowBlob2: 'bg-pink-400/20 dark:bg-pink-500/15',
    borderHover: 'hover:border-purple-400/60 dark:hover:border-purple-400/40 hover:shadow-[0_8px_30px_rgb(192,132,252,0.2)]',
    accentBadgeBg: 'bg-purple-100 dark:bg-purple-950/60',
    accentBadgeText: 'text-purple-700 dark:text-purple-300',
  },
  green: {
    glowBlob1: 'bg-emerald-400/25 dark:bg-emerald-500/20',
    glowBlob2: 'bg-teal-400/20 dark:bg-teal-500/15',
    borderHover: 'hover:border-emerald-400/60 dark:hover:border-emerald-400/40 hover:shadow-[0_8px_30px_rgb(52,211,153,0.2)]',
    accentBadgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    accentBadgeText: 'text-emerald-700 dark:text-emerald-300',
  },
  orange: {
    glowBlob1: 'bg-orange-400/25 dark:bg-orange-500/20',
    glowBlob2: 'bg-amber-400/20 dark:bg-amber-500/15',
    borderHover: 'hover:border-orange-400/60 dark:hover:border-orange-400/40 hover:shadow-[0_8px_30px_rgb(251,146,60,0.2)]',
    accentBadgeBg: 'bg-orange-100 dark:bg-orange-950/60',
    accentBadgeText: 'text-orange-700 dark:text-orange-300',
  },
  multi: {
    glowBlob1: 'bg-blue-400/25 dark:bg-purple-500/20',
    glowBlob2: 'bg-orange-300/25 dark:bg-emerald-500/20',
    borderHover: 'hover:border-purple-400/60 hover:shadow-[0_8px_32px_rgba(192,132,252,0.25)]',
    accentBadgeBg: 'bg-gradient-to-r from-blue-100 via-purple-100 to-orange-100 dark:from-blue-950 dark:to-purple-950',
    accentBadgeText: 'text-purple-700 dark:text-purple-300',
  },
};

/**
 * AuroraCard Component
 * Modern dashboard card featuring soft aurora mesh radial gradients, subtle glow highlights,
 * glassmorphism backdrop blur, and interactive SaaS aesthetics.
 */
export const AuroraCard: React.FC<AuroraCardProps> = ({
  theme = 'multi',
  interactive = true,
  noPadding = false,
  animatedMesh = true,
  badgeText,
  badgeColor,
  className = '',
  children,
  ...rest
}) => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  const styleTheme = THEME_GLOW_STYLES[theme];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePosition(null);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        relative overflow-hidden rounded-2xl transition-all duration-300
        bg-white/70 dark:bg-slate-900/70
        backdrop-blur-xl saturate-150
        border border-white/60 dark:border-white/10
        shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05),0_0_20px_0_rgba(255,255,255,0.6)_inset]
        dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4),0_0_20px_0_rgba(255,255,255,0.05)_inset]
        group
        ${interactive ? `hover:-translate-y-1.5 ${styleTheme.borderHover}` : ''}
        ${noPadding ? '' : 'p-6'}
        ${className}
      `}
      {...rest}
    >
      {/* Background Soft Aurora Blurred Radial Gradient Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Blob 1 - Top Left / Right Radial Soft Aurora */}
        <div
          className={`
            absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl transition-transform duration-700
            ${styleTheme.glowBlob1}
            ${animatedMesh ? 'animate-aurora-float' : ''}
            group-hover:scale-125
          `}
        />

        {/* Blob 2 - Bottom Left / Center Soft Mesh */}
        <div
          className={`
            absolute -bottom-16 -left-16 w-56 h-56 rounded-full blur-3xl transition-transform duration-700
            ${styleTheme.glowBlob2}
            ${animatedMesh ? 'animate-aurora-float-delayed' : ''}
            group-hover:scale-125
          `}
        />

        {/* Multi-mesh extra pastel highlight blobs */}
        {theme === 'multi' && (
          <>
            <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-emerald-300/20 dark:bg-emerald-500/15 rounded-full blur-2xl animate-aurora-float" />
            <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-orange-300/20 dark:bg-orange-500/15 rounded-full blur-2xl animate-aurora-float-delayed" />
          </>
        )}

        {/* Interactive Mouse Tracking Glow (subtle radial light following cursor) */}
        {mousePosition && (
          <div
            className="absolute w-64 h-64 rounded-full blur-2xl transition-opacity duration-300 pointer-events-none"
            style={{
              left: mousePosition.x - 128,
              top: mousePosition.y - 128,
              background:
                theme === 'blue'
                  ? 'radial-gradient(circle, rgba(147, 197, 253, 0.4) 0%, transparent 70%)'
                  : theme === 'purple'
                  ? 'radial-gradient(circle, rgba(216, 180, 254, 0.4) 0%, transparent 70%)'
                  : theme === 'green'
                  ? 'radial-gradient(circle, rgba(167, 243, 208, 0.4) 0%, transparent 70%)'
                  : theme === 'orange'
                  ? 'radial-gradient(circle, rgba(254, 215, 170, 0.4) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(192, 132, 252, 0.35) 0%, rgba(96, 165, 250, 0.2) 50%, transparent 70%)',
            }}
          />
        )}

        {/* Top inner glass highlight light streak */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent opacity-80" />
      </div>

      {/* Optional Badge Header */}
      {badgeText && (
        <div className="relative z-10 mb-4 flex justify-between items-center">
          <span
            className={`
              inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm
              ${badgeColor ? THEME_GLOW_STYLES[badgeColor].accentBadgeBg : styleTheme.accentBadgeBg}
              ${badgeColor ? THEME_GLOW_STYLES[badgeColor].accentBadgeText : styleTheme.accentBadgeText}
            `}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {badgeText}
          </span>
        </div>
      )}

      {/* Card Content Body */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
