'use client';

import React from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAppStore } from '@/stores/useAppStore';
import { Plus, Target, CheckSquare, Calendar } from 'lucide-react';

export default function GoalsPage() {
  const { goals, openDrawer, openModal, deleteGoal } = useAppStore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline text-primary tracking-tight">
            الأهداف والغايات المستقبلية
          </h1>
          <p className="text-xs font-mono text-text-muted mt-1">
            تحديد الأهداف طويلة المدى ومتابعة المراحل الرئيسية للإنجاز.
          </p>
        </div>

        <button
          onClick={() => openDrawer('goal', 'create')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-primary text-on-primary font-bold text-sm hover:bg-primary-container shadow-offset transition-all active:translate-x-0.5 active:translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          إضافة هدف
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          id="stat-g-1"
          title="إجمالي الأهداف"
          value={goals.length}
          iconName="Target"
          subtitle="الأهداف المستقبلية المسجلة"
        />
        <StatCard
          id="stat-g-2"
          title="متوسط الإنجاز"
          value={`${Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / (goals.length || 1))}%`}
          iconName="CheckCircle"
          subtitle="معدل تحقق الغايات"
        />
        <StatCard
          id="stat-g-3"
          title="المراحل الإنجازية"
          value={goals.reduce((acc, g) => acc + g.milestones.length, 0)}
          iconName="CheckSquare"
          subtitle="المستهدفات الفرعية"
        />
      </div>

      {/* Goal Cards List */}
      {goals.length === 0 ? (
        <EmptyState
          icon={<Target className="w-8 h-8" />}
          title="لا توجد أهداف بعد"
          description="حدّد أول هدف طويل المدى وتابع مراحله الرئيسية نحو الإنجاز."
          actionLabel="إضافة هدف"
          onAction={() => openDrawer('goal', 'create')}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6">
        {goals.map((goal) => (
          <div
            key={goal.id}
            onClick={() => openModal('goal', goal)}
            className="p-6 bg-surface border border-border-subtle rounded-card shadow-card hover:border-primary/50 transition-all duration-200 cursor-pointer space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono text-secondary font-bold uppercase">
                  {goal.category}
                </span>
                <h3 className="text-lg font-bold text-on-surface mt-0.5">{goal.title}</h3>
              </div>

              <div className="flex items-center gap-3">
                <Badge status={goal.status}>{goal.status.replace('_', ' ')}</Badge>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteGoal(goal.id);
                  }}
                  className="text-xs font-mono text-rose-600 hover:bg-rose-500/10 px-2 py-1 rounded-button"
                >
                  حذف
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <ProgressBar value={goal.progress} showPercentage color="primary" height="h-2.5" />

            {/* Milestones Checklist */}
            <div className="pt-3 border-t border-border-subtle space-y-2">
              <span className="text-xs font-mono text-text-muted uppercase font-semibold">المراحل الإنجازية</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {goal.milestones.map((m) => (
                  <div key={m.id} className="flex items-center gap-2 text-xs text-on-surface">
                    <CheckSquare
                      className={`w-3.5 h-3.5 ${m.completed ? 'text-primary' : 'text-text-muted'}`}
                    />
                    <span className={m.completed ? 'line-through text-text-muted' : ''}>{m.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-xs font-mono text-text-muted flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> تاريخ الاستهداف: {goal.targetDate}
              </span>
              <span>تاريخ الإضافة {goal.createdAt}</span>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
