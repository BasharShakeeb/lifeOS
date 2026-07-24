'use client';

import React from 'react';

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterTabsProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Reusable segmented filter control (pill tabs) used to filter list/table data.
 */
export const FilterTabs: React.FC<FilterTabsProps> = ({
  options,
  value,
  onChange,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1 p-1 bg-surface-container rounded-full border border-outline-variant/40 ${className}`}
    >
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              isActive
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            {option.label}
            {typeof option.count === 'number' && (
              <span
                className={`mr-1.5 text-[10px] ${
                  isActive ? 'text-on-primary/80' : 'text-outline'
                }`}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
