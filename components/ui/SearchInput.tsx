'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Shows the ⌘K keyboard hint on the trailing edge. */
  showShortcut?: boolean;
}

/**
 * Reusable RTL search input with a leading icon and optional clear button.
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'ابحث...',
  className = '',
  showShortcut = false,
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="w-4 h-4 text-outline absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pr-11 pl-12 py-2.5 bg-surface-container border border-outline-variant rounded-full text-sm text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all shadow-subtle"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-1 rounded-full hover:bg-surface-container-high transition-colors"
          aria-label="مسح البحث"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      ) : (
        showShortcut && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-outline font-semibold bg-surface-container-lowest px-2 py-0.5 rounded border border-outline-variant">
            ⌘ K
          </span>
        )
      )}
    </div>
  );
};
