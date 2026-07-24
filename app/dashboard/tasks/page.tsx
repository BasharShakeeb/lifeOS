'use client';

import React from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAppStore } from '@/stores/useAppStore';
import { Task } from '@/types';
import { Plus, CheckCircle2 } from 'lucide-react';

export default function TasksPage() {
  const { tasks, searchQuery, selectedFilter, openDrawer, openModal, deleteTask, toggleTaskCompletion } = useAppStore();

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'in_progress' && t.status === 'in_progress') ||
      (selectedFilter === 'completed' && t.status === 'completed') ||
      (selectedFilter === 'urgent' && t.priority === 'urgent');
    return matchesSearch && matchesFilter;
  });

  const columns: Column<Task>[] = [
    {
      header: 'عنوان المهمة',
      accessorKey: 'title',
      cell: (task) => (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={() => toggleTaskCompletion(task.id)}
            className="w-4 h-4 rounded bg-surface border-border-subtle text-primary focus:ring-primary cursor-pointer"
          />
          <div>
            <span
              className={`font-medium ${
                task.status === 'completed' ? 'line-through text-text-muted' : 'text-on-surface'
              }`}
            >
              {task.title}
            </span>
            {task.description && (
              <p className="text-xs text-text-muted truncate max-w-xs">{task.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'الأولوية',
      accessorKey: 'priority',
      cell: (task) => <Badge status={task.priority}>{task.priority}</Badge>,
    },
    {
      header: 'الحالة',
      accessorKey: 'status',
      cell: (task) => <Badge status={task.status}>{task.status.replace('_', ' ')}</Badge>,
    },
    {
      header: 'تاريخ الاستحقاق',
      accessorKey: 'dueDate',
      cell: (task) => <span className="font-mono text-xs text-text-muted">{task.dueDate}</span>,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline text-primary tracking-tight">
            إدارة المهام اليومية
          </h1>
          <p className="text-xs font-mono text-text-muted mt-1">
            ترتيب، تنظيم، وإنجاز المهام حسب الأولوية وتاريخ الاستحقاق.
          </p>
        </div>

        <button
          onClick={() => openDrawer('task', 'create')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-primary text-on-primary font-bold text-sm hover:bg-primary-container shadow-offset transition-all active:translate-x-0.5 active:translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          إضافة مهمة
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          id="stat-t-1"
          title="إجمالي المهام"
          value={tasks.length}
          iconName="CheckCircle"
          subtitle="جميع المهام المسجلة"
        />
        <StatCard
          id="stat-t-2"
          title="قيد التنفيذ"
          value={tasks.filter((t) => t.status === 'in_progress').length}
          iconName="Clock"
          subtitle="المهام النشطة حالياً"
        />
        <StatCard
          id="stat-t-3"
          title="عاجلة جداً"
          value={tasks.filter((t) => t.priority === 'urgent').length}
          iconName="AlertTriangle"
          subtitle="تتطلب التركيز الفوري"
        />
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredTasks}
        columns={columns}
        onView={(task) => openModal('task', task)}
        onEdit={(task) => openDrawer('task', 'edit', task)}
        onDelete={(task) => deleteTask(task.id)}
        pageSize={6}
        emptyState={
          <EmptyState
            icon={<CheckCircle2 className="w-8 h-8" />}
            title="لا توجد مهام بعد"
            description="ابدأ بإضافة أول مهمة لتنظيم يومك ومتابعة إنجازاتك حسب الأولوية."
            actionLabel="إضافة مهمة"
            onAction={() => openDrawer('task', 'create')}
          />
        }
      />
    </div>
  );
}
