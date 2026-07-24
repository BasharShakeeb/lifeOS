'use client';

import React, { useState } from 'react';
import { MoreVertical, Edit2, Eye, Trash2 } from 'lucide-react';
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
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = data.slice(startIndex, startIndex + pageSize);

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-card shadow-card overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-right text-sm text-on-surface">
          <thead className="bg-surface-container-low text-xs font-semibold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/40">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 font-medium tracking-wider">
                  {col.header}
                </th>
              ))}
              {(onEdit || onView || onDelete) && (
                <th className="px-6 py-4 font-medium tracking-wider text-left">الإجراءات</th>
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
                    {col.cell ? col.cell(item) : String(col.accessorKey ? item[col.accessorKey] ?? '' : '')}
                  </td>
                ))}
                {(onEdit || onView || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-left relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => toggleMenu(item.id, e)}
                      className="p-1.5 rounded-button text-text-muted hover:text-primary hover:bg-surface-container transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === item.id && (
                      <div className="absolute left-6 top-10 z-50 w-40 bg-surface border border-border-subtle rounded-card shadow-modal p-1 flex flex-col text-xs font-medium">
                        {onView && (
                          <button
                            onClick={() => {
                              onView(item);
                              setActiveMenuId(null);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-text-muted hover:text-primary hover:bg-surface-container rounded-md text-right"
                          >
                            <Eye className="w-3.5 h-3.5" /> عرض التفاصيل
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => {
                              onEdit(item);
                              setActiveMenuId(null);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-text-muted hover:text-primary hover:bg-surface-container rounded-md text-right"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> تعديل
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => {
                              onDelete(item);
                              setActiveMenuId(null);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-500/10 rounded-md text-right"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> حذف
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden divide-y divide-border-subtle">
        {currentData.map((item) => (
          <div
            key={item.id}
            onClick={() => onView && onView(item)}
            className="p-4 space-y-3 hover:bg-surface-container-low transition-colors"
          >
            {columns.map((col, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-xs font-mono text-text-muted">{col.header}:</span>
                <span className="text-on-surface font-medium">
                  {col.cell ? col.cell(item) : String(col.accessorKey ? item[col.accessorKey] ?? '' : '')}
                </span>
              </div>
            ))}
            <div className="pt-2 flex justify-end gap-2 border-t border-border-subtle" onClick={(e) => e.stopPropagation()}>
              {onView && (
                <button
                  onClick={() => onView(item)}
                  className="px-3 py-1.5 rounded-button bg-surface-container text-xs text-on-surface hover:bg-surface-container-high"
                >
                  التفاصيل
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(item)}
                  className="px-3 py-1.5 rounded-button bg-primary/10 text-xs text-primary hover:bg-primary/20"
                >
                  تعديل
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
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
