'use client';

import React from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAppStore } from '@/stores/useAppStore';
import { Plus, Flame, CheckCircle2, Award, Repeat } from 'lucide-react';

export default function HabitsPage() {
  const { habits, toggleHabitToday, openDrawer, deleteHabit } = useAppStore();

  const totalStreaks = habits.reduce((acc, h) => acc + h.streak, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline text-primary tracking-tight">
            سلسلة العادات اليومية
          </h1>
          <p className="text-xs font-mono text-text-muted mt-1">
            بناء الالتزام اليومي ومتابعة الاستمرارية.
          </p>
        </div>

        <button
          onClick={() => openDrawer('habit', 'create')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-primary text-on-primary font-bold text-sm hover:bg-primary-container shadow-offset transition-all active:translate-x-0.5 active:translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          إضافة عادة
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          id="stat-h-1"
          title="العادات النشطة"
          value={habits.length}
          iconName="Repeat"
          subtitle="العادات اليومية المستمرة"
        />
        <StatCard
          id="stat-h-2"
          title="منجزة اليوم"
          value={`${habits.filter((h) => h.completedToday).length} / ${habits.length}`}
          iconName="CheckCircle"
          subtitle="إنجاز اليوم"
        />
        <StatCard
          id="stat-h-3"
          title="مجموع السلاسل"
          value={`${totalStreaks} يوم`}
          iconName="Flame"
          subtitle="التزام متراكم"
        />
      </div>

      {/* Habits Grid */}
      {habits.length === 0 ? (
        <EmptyState
          icon={<Repeat className="w-8 h-8" />}
          title="لا توجد عادات بعد"
          description="أضف أول عادة يومية لبناء الالتزام ومتابعة استمراريتك."
          actionLabel="إضافة عادة"
          onAction={() => openDrawer('habit', 'create')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="p-6 bg-surface border border-border-subtle rounded-card shadow-card hover:border-primary/50 transition-all duration-200 flex flex-col justify-between space-y-4 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-secondary font-bold uppercase tracking-wider">
                  {habit.category}
                </span>
                <h3 className="text-lg font-bold text-on-surface mt-1">{habit.title}</h3>
              </div>

              <button
                onClick={() => toggleHabitToday(habit.id)}
                className={`p-3 rounded-button border transition-all duration-200 flex items-center justify-center ${
                  habit.completedToday
                    ? 'bg-primary text-on-primary border-primary shadow-offset'
                    : 'bg-surface-container border-border-subtle text-text-muted hover:text-primary hover:border-primary/50'
                }`}
              >
                <CheckCircle2 className="w-6 h-6" />
              </button>
            </div>

            <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5 text-secondary font-bold">
                <Flame className="w-4 h-4" />
                <span>سلسلة {habit.streak} أيام</span>
              </div>

              <div className="flex items-center gap-1 text-text-muted">
                <Award className="w-3.5 h-3.5" />
                <span>الأفضل: {habit.bestStreak} يوم</span>
              </div>

              <button
                onClick={() => deleteHabit(habit.id)}
                className="text-rose-600 hover:underline text-[11px]"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
