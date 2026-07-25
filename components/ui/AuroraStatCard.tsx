'use client';

import React from 'react';
import * as Icons from 'lucide-react';
import { AuroraCard, AuroraColorTheme } from './AuroraCard';

export interface AuroraStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
    period?: string;
  };
  iconName: string;
  theme?: AuroraColorTheme;
  sparklineData?: number[];
  className?: string;
}

const ICON_THEMES: Record<AuroraColorTheme, {
  bg: string;
  text: string;
  sparklineColor: string;
}> = {
  blue: {
    bg: 'bg-blue-500/10 border-blue-400/20 text-blue-600 dark:text-blue-400',
    text: 'text-blue-500',
    sparklineColor: '#60A5FA',
  },
  purple: {
    bg: 'bg-purple-500/10 border-purple-400/20 text-purple-600 dark:text-purple-400',
    text: 'text-purple-500',
    sparklineColor: '#C084FC',
  },
  green: {
    bg: 'bg-emerald-500/10 border-emerald-400/20 text-emerald-600 dark:text-emerald-400',
    text: 'text-emerald-500',
    sparklineColor: '#34D399',
  },
  orange: {
    bg: 'bg-orange-500/10 border-orange-400/20 text-orange-600 dark:text-orange-400',
    text: 'text-orange-500',
    sparklineColor: '#FDBA74',
  },
  multi: {
    bg: 'bg-gradient-to-br from-purple-500/15 to-blue-500/15 border-purple-400/20 text-purple-600 dark:text-purple-300',
    text: 'text-purple-500',
    sparklineColor: '#C084FC',
  },
};

/**
 * AuroraStatCard Component
 * Modern KPI / Stat Card featuring glassmorphism, soft aurora glow background,
 * SVG sparkline, trend indicator, and pastel highlights.
 */
export const AuroraStatCard: React.FC<AuroraStatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  iconName,
  theme = 'blue',
  sparklineData = [25, 40, 35, 60, 55, 80, 75, 95],
  className = '',
}) => {
  // Safe Icon Lookup from Lucide React
  const iconKey =
    iconName.charAt(0).toUpperCase() +
    iconName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  const IconComponent = (Icons as any)[iconKey] || Icons.Activity;

  const iconStyle = ICON_THEMES[theme];

  // SVG Sparkline path renderer
  const minVal = Math.min(...sparklineData);
  const maxVal = Math.max(...sparklineData);
  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * 100;
      const y = 30 - ((val - minVal) / (maxVal - minVal || 1)) * 25;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <AuroraCard theme={theme} className={`min-h-[160px] flex flex-col justify-between ${className}`}>
      {/* Header Row: Title & Icon */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`p-2.5 rounded-xl border backdrop-blur-md transition-transform duration-300 group-hover:scale-110 ${iconStyle.bg}`}
        >
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      {/* Main Metric Value & Sparkline */}
      <div className="flex items-end justify-between gap-4 my-1">
        <div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {/* Mini SVG Sparkline with glowing gradient */}
        <div className="w-24 h-9 relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 35">
            <defs>
              <linearGradient id={`aurora-spark-${theme}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={iconStyle.sparklineColor} stopOpacity="0.4" />
                <stop offset="100%" stopColor={iconStyle.sparklineColor} stopOpacity="1" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke={`url(#aurora-spark-${theme})`}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>

      {/* Trend Row */}
      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
          <span
            className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full ${
              trend.isPositive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}
          >
            {trend.isPositive ? (
              <Icons.TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <Icons.TrendingDown className="w-3.5 h-3.5" />
            )}
            {trend.value}
          </span>
          <span className="text-slate-400 dark:text-slate-500 font-medium">
            {trend.period || 'مقارنة بالشهر السابق'}
          </span>
        </div>
      )}
    </AuroraCard>
  );
};
