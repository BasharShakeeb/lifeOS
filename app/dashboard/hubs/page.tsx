'use client';

import React from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, Layers, FolderKanban, CheckCircle2, Target } from 'lucide-react';

export default function HubsPage() {
  const { hubs, openDrawer, openModal, deleteHub } = useAppStore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline text-primary tracking-tight">
            محاور مجالات الحياة
          </h1>
          <p className="text-xs font-mono text-text-muted mt-1">
            تجميع المشاريع والمهام والأهداف في فئات تنظيمية رئيسية.
          </p>
        </div>

        <button
          onClick={() => openDrawer('hub', 'create')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-primary text-on-primary font-bold text-sm hover:bg-primary-container shadow-offset transition-all active:translate-x-0.5 active:translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          إضافة محور
        </button>
      </div>

      {/* Hub Cards Grid */}
      {hubs.length === 0 ? (
        <EmptyState
          icon={<Layers className="w-8 h-8" />}
          title="لا توجد محاور بعد"
          description="أنشئ أول محور لتجميع المشاريع والمهام والأهداف في فئات تنظيمية رئيسية."
          actionLabel="إضافة محور"
          onAction={() => openDrawer('hub', 'create')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hubs.map((hub) => (
          <div
            key={hub.id}
            onClick={() => openModal('hub', hub)}
            className="p-6 bg-surface border border-border-subtle rounded-card shadow-card hover:border-primary/50 transition-all duration-200 cursor-pointer space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold shadow-offset-primary">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                    {hub.name}
                  </h3>
                  <p className="text-xs font-mono text-text-muted">تم الإنشاء في {hub.createdAt}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteHub(hub.id);
                }}
                className="text-xs font-mono text-rose-600 hover:bg-rose-500/10 px-2 py-1 rounded-button opacity-0 group-hover:opacity-100 transition-opacity"
              >
                حذف
              </button>
            </div>

            <p className="text-sm text-text-muted leading-relaxed">{hub.description}</p>

            {/* Metrics Footer */}
            <div className="pt-4 border-t border-border-subtle grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-surface-container">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <FolderKanban className="w-3.5 h-3.5" />
                  <span className="font-bold">{hub.projectCount}</span>
                </div>
                <span className="text-[10px] text-text-muted uppercase">المشاريع</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-container">
                <div className="flex items-center justify-center gap-1 text-emerald-700 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="font-bold">{hub.taskCount}</span>
                </div>
                <span className="text-[10px] text-text-muted uppercase">المهام</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-container">
                <div className="flex items-center justify-center gap-1 text-secondary mb-1">
                  <Target className="w-3.5 h-3.5" />
                  <span className="font-bold">{hub.goalCount}</span>
                </div>
                <span className="text-[10px] text-text-muted uppercase">الأهداف</span>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
