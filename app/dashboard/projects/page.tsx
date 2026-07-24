'use client';

import React from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAppStore } from '@/stores/useAppStore';
import { Project } from '@/types';
import { Plus, FolderKanban } from 'lucide-react';

export default function ProjectsPage() {
  const { projects, openDrawer, openModal, deleteProject } = useAppStore();

  const columns: Column<Project>[] = [
    {
      header: 'اسم المشروع',
      accessorKey: 'name',
      cell: (project) => (
        <div>
          <span className="font-semibold text-on-surface hover:text-primary transition-colors">
            {project.name}
          </span>
          <p className="text-xs text-text-muted truncate max-w-xs">{project.description}</p>
        </div>
      ),
    },
    {
      header: 'المحور التابع',
      accessorKey: 'hubName',
      cell: (project) => <Badge status="info">{project.hubName}</Badge>,
    },
    {
      header: 'نسبة الإنجاز',
      accessorKey: 'progress',
      cell: (project) => (
        <div className="w-36">
          <ProgressBar value={project.progress} showPercentage color="primary" height="h-2" />
        </div>
      ),
    },
    {
      header: 'الحالة',
      accessorKey: 'status',
      cell: (project) => <Badge status={project.status}>{project.status.replace('_', ' ')}</Badge>,
    },
    {
      header: 'تاريخ الإنجاز المتوقع',
      accessorKey: 'endDate',
      cell: (project) => <span className="font-mono text-xs text-text-muted">{project.endDate}</span>,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline text-primary tracking-tight">
            معرض المشاريع القائمة
          </h1>
          <p className="text-xs font-mono text-text-muted mt-1">
            متابعة مشاريع التطوير، البحوث، ومراحل الإنجاز.
          </p>
        </div>

        <button
          onClick={() => openDrawer('project', 'create')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-primary text-on-primary font-bold text-sm hover:bg-primary-container shadow-offset transition-all active:translate-x-0.5 active:translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          إضافة مشروع
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          id="stat-p-1"
          title="المشاريع النشطة"
          value={projects.length}
          iconName="FolderKanban"
          subtitle="جميع المشاريع المسجلة"
        />
        <StatCard
          id="stat-p-2"
          title="متوسط الإنجاز"
          value={`${Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / (projects.length || 1))}%`}
          iconName="CheckCircle"
          subtitle="معدل إكمال المراحل"
        />
        <StatCard
          id="stat-p-3"
          title="المهام المرتبطة"
          value={projects.reduce((acc, p) => acc + p.tasksCount, 0)}
          iconName="Clock"
          subtitle="إجمالي المهام المسجلة"
        />
      </div>

      {/* Projects Table */}
      <DataTable
        data={projects}
        columns={columns}
        onView={(project) => openModal('project', project)}
        onEdit={(project) => openDrawer('project', 'edit', project)}
        onDelete={(project) => deleteProject(project.id)}
        pageSize={5}
        emptyState={
          <EmptyState
            icon={<FolderKanban className="w-8 h-8" />}
            title="لا توجد مشاريع بعد"
            description="أنشئ أول مشروع لتجميع المهام المرتبطة ومتابعة مراحل الإنجاز."
            actionLabel="إضافة مشروع"
            onAction={() => openDrawer('project', 'create')}
          />
        }
      />
    </div>
  );
}
