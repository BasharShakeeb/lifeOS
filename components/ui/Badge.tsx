import React from 'react';
import { getStatusBadgeColor } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'status' | 'priority' | 'default';
  status?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  status = '',
  className = '',
}) => {
  const colorStyles = getStatusBadgeColor(status || String(children));

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-badge text-xs font-mono font-semibold border uppercase tracking-wider ${colorStyles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {children}
    </span>
  );
};
