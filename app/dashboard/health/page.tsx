'use client';

import React from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAppStore } from '@/stores/useAppStore';
import { HealthRecord } from '@/types';
import { Plus, HeartPulse } from 'lucide-react';

export default function HealthPage() {
  const { healthRecords, openDrawer, openModal, deleteHealthRecord } = useAppStore();

  const columns: Column<HealthRecord>[] = [
    {
      header: 'تاريخ التسجيل',
      accessorKey: 'date',
      cell: (rec) => <span className="font-mono font-semibold text-on-surface">{rec.date}</span>,
    },
    {
      header: 'كمية الماء',
      accessorKey: 'waterIntakeMl',
      cell: (rec) => (
        <span className="font-mono text-xs text-sky-700 font-bold">{rec.waterIntakeMl} مل</span>
      ),
    },
    {
      header: 'ساعات النوم',
      accessorKey: 'sleepHours',
      cell: (rec) => (
        <span className="font-mono text-xs text-primary font-bold">{rec.sleepHours} ساعات</span>
      ),
    },
    {
      header: 'التمارين الرياضية',
      accessorKey: 'exerciseMinutes',
      cell: (rec) => (
        <span className="font-mono text-xs text-emerald-700 font-bold">{rec.exerciseMinutes} دقيقة</span>
      ),
    },
    {
      header: 'ضغط الدم',
      accessorKey: 'bloodPressure',
      cell: (rec) => (
        <span className="font-mono text-xs text-text-muted">{rec.bloodPressure || 'غير مسجل'}</span>
      ),
    },
  ];

  const latestRecord = healthRecords[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline text-primary tracking-tight">
            مؤشرات الصحة واللياقة
          </h1>
          <p className="text-xs font-mono text-text-muted mt-1">
            مراقبة معدل شرب الماء، جودة النوم، دقيقة التمارين، والقياسات الحيوية.
          </p>
        </div>

        <button
          onClick={() => openDrawer('health', 'create')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-primary text-on-primary font-bold text-sm hover:bg-primary-container shadow-offset transition-all active:translate-x-0.5 active:translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          تسجيل مؤشر صحي
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <StatCard
          id="stat-hl-1"
          title="ماء اليوم"
          value={`${latestRecord?.waterIntakeMl ?? 0} مل`}
          iconName="Droplets"
          subtitle="المستهدف اليومي"
        />
        <StatCard
          id="stat-hl-2"
          title="ساعات النوم"
          value={`${latestRecord?.sleepHours ?? 0} س`}
          iconName="Moon"
          subtitle="معدل الراحة والاستشفاء"
        />
        <StatCard
          id="stat-hl-3"
          title="مدة الرياضة"
          value={`${latestRecord?.exerciseMinutes ?? 0} د`}
          iconName="Activity"
          subtitle="تمارين اليوم"
        />
        <StatCard
          id="stat-hl-4"
          title="السعرات المحروقة"
          value={`${latestRecord?.caloriesBurned ?? 0} kcal`}
          iconName="Heart"
          subtitle="طاقة النشاط البدني"
        />
      </div>

      {/* Table of Health Logs */}
      <DataTable
        data={healthRecords}
        columns={columns}
        onView={(rec) => openModal('health', rec)}
        onEdit={(rec) => openDrawer('health', 'edit', rec)}
        onDelete={(rec) => deleteHealthRecord(rec.id)}
        pageSize={5}
        emptyState={
          <EmptyState
            icon={<HeartPulse className="w-8 h-8" />}
            title="لا توجد مؤشرات صحية بعد"
            description="سجّل أول مؤشر صحي لمراقبة شرب الماء والنوم والتمارين والقياسات الحيوية."
            actionLabel="تسجيل مؤشر صحي"
            onAction={() => openDrawer('health', 'create')}
          />
        }
      />
    </div>
  );
}
