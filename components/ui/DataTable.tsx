'use client';

import React, { useState } from 'react';
import { Edit2, Eye, Trash2 } from 'lucide-react';
import { Pagination } from './Pagination';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onView?: (item: T) => void;
  onDelete?: (item: T) => void;
  pageSize?: number;
  /** Rendered when there is no data to display. */
  emptyState?: React.ReactNode;
}

/* ─── Inline Action Button with Tooltip ─── */
interface ActionBtnProps {
  onClick: (e: React.MouseEvent) => void;
  icon: React.ReactNode;
  label: string;
  variant: 'neutral' | 'primary' | 'danger';
  'aria-label'?: string;
}

const variantStyles: Record<ActionBtnProps['variant'], string> = {
  neutral:
    'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high',
  primary:
    'text-primary hover:text-primary hover:bg-primary/10',
  danger:
    'text-rose-500 hover:text-rose-600 hover:bg-rose-500/10',
};

function ActionBtn({ onClick, icon, label, variant, 'aria-label': ariaLabel }: ActionBtnProps) {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        aria-label={ariaLabel ?? label}
        onClick={onClick}
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        onFocus={() => setShowTip(true)}
        onBlur={() => setShowTip(false)}
        className={`
          relative p-2 rounded-lg transition-all duration-150
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
          active:scale-90
          ${variantStyles[variant]}
        `}
      >
        {icon}
      </button>

      {/* Tooltip */}
      {showTip && (
        <div
          className="
            pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2
            whitespace-nowrap rounded-md bg-gray-900/90 text-white text-[11px] font-medium
            px-2 py-1 shadow-lg z-[9999]
            animate-in fade-in-0 zoom-in-95 duration-100
          "
        >
          {label}
          {/* Caret */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/90" />
        </div>
      )}
    </div>
  );
}

/* ─── DataTable ─── */
export function DataTable<T extends { id: string }>({
  data,
  columns,
  onEdit,
  onView,
  onDelete,
  pageSize = 6,
  emptyState,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = data.slice(startIndex, startIndex + pageSize);

  const hasActions = onEdit || onView || onDelete;

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-card shadow-card overflow-hidden">

      {/* ── Desktop Table View ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-right text-sm text-on-surface">
          <thead className="bg-surface-container-low text-xs font-semibold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/40">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 font-medium tracking-wider">
                  {col.header}
                </th>
              ))}
              {hasActions && (
                <th className="px-6 py-4 font-medium tracking-wider text-center w-32">
                  الإجراءات
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {currentData.map((item) => (
              <tr
                key={item.id}
                onClick={() => onView && onView(item)}
                className="hover:bg-surface-container-low/80 transition-colors cursor-pointer group"
              >
                {columns.map((col, idx) => (
                  <td key={idx} className="px-6 py-4 whitespace-nowrap">
                    {col.cell
                      ? col.cell(item)
                      : String(col.accessorKey ? item[col.accessorKey] ?? '' : '')}
                  </td>
                ))}

                {hasActions && (
                  <td
                    className="px-4 py-3 whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-center gap-0.5">
                      {onView && (
                        <ActionBtn
                          onClick={() => onView(item)}
                          icon={<Eye className="w-4 h-4" />}
                          label="عرض التفاصيل"
                          variant="neutral"
                          aria-label="عرض تفاصيل العنصر"
                        />
                      )}
                      {onEdit && (
                        <ActionBtn
                          onClick={() => onEdit(item)}
                          icon={<Edit2 className="w-4 h-4" />}
                          label="تعديل"
                          variant="primary"
                          aria-label="تعديل العنصر"
                        />
                      )}
                      {onDelete && (
                        <ActionBtn
                          onClick={() => onDelete(item)}
                          icon={<Trash2 className="w-4 h-4" />}
                          label="حذف"
                          variant="danger"
                          aria-label="حذف العنصر"
                        />
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Card List View ── */}
      <div className="md:hidden divide-y divide-border-subtle">
        {currentData.map((item) => (
          <div
            key={item.id}
            onClick={() => onView && onView(item)}
            className="p-4 space-y-3 hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            {columns.map((col, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-xs font-mono text-text-muted">{col.header}:</span>
                <span className="text-on-surface font-medium">
                  {col.cell
                    ? col.cell(item)
                    : String(col.accessorKey ? item[col.accessorKey] ?? '' : '')}
                </span>
              </div>
            ))}

            {hasActions && (
              <div
                className="pt-2 flex items-center justify-end gap-1 border-t border-border-subtle"
                onClick={(e) => e.stopPropagation()}
              >
                {onView && (
                  <ActionBtn
                    onClick={() => onView(item)}
                    icon={<Eye className="w-4 h-4" />}
                    label="عرض"
                    variant="neutral"
                  />
                )}
                {onEdit && (
                  <ActionBtn
                    onClick={() => onEdit(item)}
                    icon={<Edit2 className="w-4 h-4" />}
                    label="تعديل"
                    variant="primary"
                  />
                )}
                {onDelete && (
                  <ActionBtn
                    onClick={() => onDelete(item)}
                    icon={<Trash2 className="w-4 h-4" />}
                    label="حذف"
                    variant="danger"
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Pagination Footer ── */}
      {totalPages > 1 && (
        <div className="px-6 py-3 bg-surface-container-low border-t border-outline-variant/40">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={data.length}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
