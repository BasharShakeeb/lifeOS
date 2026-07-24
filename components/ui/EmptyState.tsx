import React from 'react';
import { Inbox, Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-surface-container-lowest border border-outline-variant/40 rounded-card shadow-card">
      <div className="w-16 h-16 rounded-full bg-primary-container/10 border border-primary-container/20 flex items-center justify-center text-primary-container mb-4">
        {icon || <Inbox className="w-8 h-8" />}
      </div>

      <h3 className="text-lg font-bold text-on-surface tracking-tight">{title}</h3>
      <p className="text-sm text-on-surface-variant mt-1.5 max-w-md leading-relaxed">{description}</p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-button bg-primary text-on-primary font-bold text-sm hover:bg-primary-hover transition-colors shadow-subtle active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
