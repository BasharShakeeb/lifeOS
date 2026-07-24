'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Reusable RTL pagination footer.
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex items-center justify-between text-xs font-semibold text-on-surface-variant ${className}`}
    >
      <span>
        الصفحة {currentPage} من {totalPages}
        {typeof totalItems === 'number' ? ` (إجمالي ${totalItems})` : ''}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="p-1.5 rounded-full border border-outline-variant disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container transition-colors"
          aria-label="الصفحة السابقة"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="p-1.5 rounded-full border border-outline-variant disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container transition-colors"
          aria-label="الصفحة التالية"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
