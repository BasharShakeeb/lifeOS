import React from 'react';
import * as Icons from 'lucide-react';
import { StatCardData } from '@/types';

interface StatCardProps extends StatCardData {
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  iconName,
  subtitle,
  className = '',
}) => {
  const IconComponent = (Icons as any)[
    iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())
  ] || Icons.CheckCircle;

  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant/40 rounded-statCard p-6 min-h-[160px] hover:-translate-y-1 hover:shadow-level2 hover:border-primary-container/60 transition-all duration-200 shadow-card flex flex-col justify-between group ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2.5 rounded-xl bg-primary-container/10 text-primary-container group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-3xl font-bold text-on-surface tracking-tight">
          {value}
        </div>
        {subtitle && <p className="text-xs text-on-surface-variant mt-1">{subtitle}</p>}
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs">
          <span
            className={`flex items-center gap-1 font-semibold ${
              trend.isPositive ? 'text-primary-container' : 'text-rose-600'
            }`}
          >
            {trend.isPositive ? (
              <Icons.TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <Icons.TrendingDown className="w-3.5 h-3.5" />
            )}
            {trend.value}
          </span>
          <span className="text-on-surface-variant">مقارنة بالفترة السابقة</span>
        </div>
      )}
    </div>
  );
};
