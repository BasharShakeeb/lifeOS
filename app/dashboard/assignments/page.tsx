'use client';

import React from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAppStore } from '@/stores/useAppStore';
import { Assignment } from '@/types';
import { Plus, BookOpen } from 'lucide-react';

export default function AssignmentsPage() {
  const { assignments, openDrawer, openModal, deleteAssignment } = useAppStore();

  const columns: Column<Assignment>[] = [
    {
      header: 'عنوان التكليف',
      accessorKey: 'title',
      cell: (item) => (
        <div>
          <span className="font-semibold text-on-surface hover:text-primary transition-colors">
            {item.title}
          </span>
          {item.notes && <p className="text-xs text-text-muted truncate max-w-xs">{item.notes}</p>}
        </div>
      ),
    },
    {
      header: 'المادة / الدورة',
      accessorKey: 'subject',
      cell: (item) => <span className="font-mono text-xs text-secondary font-bold">{item.subject}</span>,
    },
    {
      header: 'الأولوية',
      accessorKey: 'priority',
      cell: (item) => <Badge status={item.priority}>{item.priority}</Badge>,
    },
    {
      header: 'الحالة',
      accessorKey: 'status',
      cell: (item) => <Badge status={item.status}>{item.status.replace('_', ' ')}</Badge>,
    },
    {
      header: 'تاريخ التسليم',
      accessorKey: 'dueDate',
      cell: (item) => <span className="font-mono text-xs text-text-muted">{item.dueDate}</span>,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline text-primary tracking-tight">
            التكليفات الأكاديمية والمهنية
          </h1>
          <p className="text-xs font-mono text-text-muted mt-1">
            متابعة التكليفات الدراسية، التقارير، والواجبات المحددة بمواعيد.
          </p>
        </div>

        <button
          onClick={() => openDrawer('assignment', 'create')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-primary text-on-primary font-bold text-sm hover:bg-primary-container shadow-offset transition-all active:translate-x-0.5 active:translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          إضافة تكليف
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          id="stat-a-1"
          title="إجمالي التكليفات"
          value={assignments.length}
          iconName="BookOpen"
          subtitle="جميع التكليفات الدراسية"
        />
        <StatCard
          id="stat-a-2"
          title="تنتظر التسليم"
          value={assignments.filter((a) => a.status !== 'submitted' && a.status !== 'graded').length}
          iconName="Clock"
          subtitle="تتطلب التسليم قريبًا"
        />
        <StatCard
          id="stat-a-3"
          title="أولوية مرتفعة"
          value={assignments.filter((a) => a.priority === 'high' || a.priority === 'urgent').length}
          iconName="AlertTriangle"
          subtitle="مستحقة خلال أسبوع"
        />
      </div>

      {/* Table */}
      <DataTable
        data={assignments}
        columns={columns}
        onView={(item) => openModal('assignment', item)}
        onEdit={(item) => openDrawer('assignment', 'edit', item)}
        onDelete={(item) => deleteAssignment(item.id)}
        pageSize={5}
        emptyState={
          <EmptyState
            icon={<BookOpen className="w-8 h-8" />}
            title="لا توجد تكليفات بعد"
            description="أضف أول تكليف دراسي أو مهني لمتابعة مواعيد التسليم والأولويات."
            actionLabel="إضافة تكليف"
            onAction={() => openDrawer('assignment', 'create')}
          />
        }
      />
    </div>
  );
}
