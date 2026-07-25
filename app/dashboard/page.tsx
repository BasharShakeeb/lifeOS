'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Rocket,
  BookOpen,
  BarChart3,
  ChevronDown,
  Check,
  MoreHorizontal,
  Plus,
  School,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Droplets,
  Heart,
  Target,
  Sparkles,
  Layers,
  Activity,
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { AuroraStatCard } from '@/components/ui/AuroraStatCard';

export default function DashboardPage() {
  const {
    tasks,
    hubs,
    projects,
    assignments,
    habits,
    goals,
    healthRecords,
    toggleTaskCompletion,
    openDrawer,
    openModal,
  } = useAppStore();

  const [activeDate, setActiveDate] = useState('اليوم');

  // 1. Dynamic Calculations from Zustand Store
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'in_progress').length;
  const avgProjectProgress =
    totalProjects > 0
      ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / totalProjects)
      : 0;

  const totalAssignments = assignments.length;
  const pendingAssignments = assignments.filter(
    (a) => a.status !== 'submitted' && a.status !== 'graded'
  ).length;

  const totalHabits = habits.length;
  const completedHabitsToday = habits.filter((h) => h.completedToday).length;
  const maxHabitStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0;

  const totalGoals = goals.length;
  const avgGoalProgress =
    totalGoals > 0
      ? Math.round(goals.reduce((acc, g) => acc + (g.progress || 0), 0) / totalGoals)
      : 0;

  const latestHealth = healthRecords[0] || {
    waterIntakeMl: 0,
    sleepHours: 0,
    exerciseMinutes: 0,
    caloriesBurned: 0,
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-subtle">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 text-primary-container text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>لوحة الإنتاجية الشخصية</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold flex items-center gap-3 text-on-surface">
            👋 مرحباً بك
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base mt-1">
            لننظم يومك ونحقق أهدافك بكفاءة عبر كافة محاور حياتك.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/aurora"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-button bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold text-xs hover:bg-purple-500/20 transition-all border border-purple-400/30"
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>معرض Aurora Mesh Cards</span>
          </Link>
          <button
            onClick={() => openDrawer('task', 'create')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-primary text-on-primary font-bold text-sm hover:bg-primary/90 shadow-subtle transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة سريعة</span>
          </button>
        </div>
      </div>

      {/* 2. Top Stats KPI Cards with Soft Aurora Mesh & Glassmorphism Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/dashboard/tasks" className="block">
          <AuroraStatCard
            title="إجمالي المهام"
            value={`${completedTasks} / ${totalTasks}`}
            subtitle={`إنجاز ${taskCompletionRate}% من المهام`}
            trend={{ value: `${taskCompletionRate}%`, isPositive: taskCompletionRate >= 50 }}
            iconName="CheckCircle2"
            theme="purple"
            sparklineData={[20, 35, 45, 60, 75, 80, taskCompletionRate || 85]}
          />
        </Link>
        <Link href="/dashboard/projects" className="block">
          <AuroraStatCard
            title="المشاريع النشطة"
            value={`${activeProjects} مشاريع`}
            subtitle={`متوسط التقدم ${avgProjectProgress}%`}
            trend={{ value: `${activeProjects} نشط`, isPositive: true }}
            iconName="Rocket"
            theme="blue"
            sparklineData={[10, 15, 30, 40, 50, 65, avgProjectProgress || 70]}
          />
        </Link>
        <Link href="/dashboard/assignments" className="block">
          <AuroraStatCard
            title="الواجبات والمهام"
            value={`${pendingAssignments} معلقة`}
            subtitle={`إجمالي ${totalAssignments} واجب دراسي`}
            trend={{ value: pendingAssignments === 0 ? "مكتمل 👍" : `${pendingAssignments} قيد الانتظار`, isPositive: pendingAssignments === 0 }}
            iconName="BookOpen"
            theme="orange"
            sparklineData={[50, 40, 35, 30, 20, 15, pendingAssignments || 5]}
          />
        </Link>
        <Link href="/dashboard/habits" className="block">
          <AuroraStatCard
            title="العادات اليومية"
            value={`${completedHabitsToday} / ${totalHabits}`}
            subtitle={`أطول تتابع: ${maxHabitStreak} يوم ⚡`}
            trend={{ value: `سلسلة ${maxHabitStreak}d`, isPositive: true }}
            iconName="Flame"
            theme="green"
            sparklineData={[1, 3, 5, 7, 10, 12, maxHabitStreak || 14]}
          />
        </Link>
      </div>

      {/* 3. Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column (8 Columns on desktop) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Daily Activity Analysis Chart */}
          <section className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/40 shadow-subtle hover:border-outline-variant transition-all">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-primary-container" />
                <h2 className="font-display text-xl font-bold text-on-surface">تحليل النشاط اليومي</h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant bg-surface-container px-4 py-2 rounded-lg cursor-pointer hover:bg-surface-container-high transition-colors">
                <span>{activeDate}</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Dynamic SVG Activity Curve */}
            {totalTasks === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container mb-3">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-on-surface">لا توجد بيانات نشاط بعد</p>
                <p className="text-xs text-on-surface-variant mt-1 max-w-xs leading-relaxed">
                  سيظهر تحليل نشاطك اليومي هنا بعد تسجيل مهامك وإنجازاتك.
                </p>
              </div>
            ) : (
              <div className="h-64 relative pt-4">
                <div className="absolute inset-0 flex items-end justify-between px-2 text-[11px] text-outline font-bold opacity-70">
                  <span>12 ص</span>
                  <span>4 ص</span>
                  <span>8 ص</span>
                  <span>12 م</span>
                  <span>4 م</span>
                  <span>8 م</span>
                </div>
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,40 L0,35 Q10,32 20,30 T40,15 T60,10 T80,18 T100,8 L100,40 Z"
                    fill="url(#chartGradient)"
                  />
                  <path
                    d="M0,35 Q10,32 20,30 T40,15 T60,10 T80,18 T100,8"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                  />
                  <circle cx="60" cy="10" fill="#10b981" r="2.5" />
                </svg>
              </div>
            )}
          </section>

          {/* Today's Tasks Interactive List */}
          <section className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/40 shadow-subtle">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary-container" />
                <h2 className="font-display text-xl font-bold text-on-surface">قائمة مهام اليوم الحية</h2>
              </div>
              <Link
                href="/dashboard/tasks"
                className="text-primary-container font-bold text-xs hover:bg-primary-container/10 px-3 py-1.5 rounded-lg transition-colors"
              >
                عرض الكل ({tasks.length})
              </Link>
            </div>

            <div className="space-y-3">
              {tasks.length === 0 && (
                <div className="py-10 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container mb-3">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-bold text-on-surface">لا توجد مهام لليوم</p>
                  <p className="text-xs text-on-surface-variant mt-1">أضف مهمة جديدة لتبدأ تنظيم يومك.</p>
                </div>
              )}
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all group border ${task.status === 'completed'
                      ? 'bg-surface-container-low/40 border-transparent'
                      : 'bg-surface-container-lowest border-outline-variant/30 hover:border-primary-container/50 hover:bg-surface-container-low/50 shadow-subtle'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.status === 'completed'
                          ? 'bg-primary-container border-primary-container text-white'
                          : 'border-outline-variant hover:border-primary-container'
                        }`}
                      title={task.status === 'completed' ? 'تحديد كغير مكتمل' : 'تحديد كمكتمل'}
                    >
                      {task.status === 'completed' && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>
                    <div>
                      <p
                        onClick={() => openModal('task', task)}
                        className={`font-bold text-sm cursor-pointer hover:text-primary-container transition-colors ${task.status === 'completed' ? 'line-through text-outline' : 'text-on-surface'
                          }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-primary-container bg-primary-container/10 px-2 py-0.5 rounded-full">
                          {task.tags?.[0] || 'عام'}
                        </span>
                        {task.description && (
                          <span className="text-[11px] text-on-surface-variant truncate max-w-xs">
                            {task.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-on-surface-variant text-xs font-mono font-bold bg-surface-container px-2.5 py-1 rounded-md">
                      {task.dueDate || 'اليوم'}
                    </span>
                    <button
                      onClick={() => openModal('task', task)}
                      className="text-outline hover:text-on-surface p-1 rounded-md hover:bg-surface-container transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => openDrawer('task', 'create')}
              className="w-full mt-6 py-3.5 border-2 border-dashed border-outline-variant/60 text-on-surface-variant rounded-xl flex items-center justify-center gap-2 hover:bg-primary-container/5 hover:border-primary-container hover:text-primary-container transition-all font-bold text-sm"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة مهمة جديدة</span>
            </button>
          </section>
        </div>

        {/* Right Column (4 Columns on desktop) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Focus Hubs Progress (Dynamic from Stores) */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/40 shadow-subtle hover:border-outline-variant transition-all">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary-container" />
                <h2 className="font-display text-lg font-bold text-on-surface">مراكز التركيز ({hubs.length})</h2>
              </div>
              <Link href="/dashboard/hubs" className="text-xs font-bold text-primary-container hover:underline">
                إدارة
              </Link>
            </div>

            <div className="space-y-5">
              {hubs.length === 0 && (
                <div className="py-6 text-center">
                  <p className="text-sm font-bold text-on-surface">لا توجد مراكز بعد</p>
                  <p className="text-xs text-on-surface-variant mt-1">أنشئ محوراً لتنظيم مجالات حياتك.</p>
                </div>
              )}
              {hubs.map((hub, idx) => (
                <div key={hub.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {idx % 2 === 0 ? (
                        <School className="w-4 h-4 text-primary-container" />
                      ) : (
                        <Briefcase className="w-4 h-4 text-secondary" />
                      )}
                      <span className="font-bold text-on-surface">{hub.name}</span>
                    </div>
                    <span className="font-mono font-bold text-primary-container">
                      {hub.projectCount * 25}%
                    </span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2">
                    <div
                      className="bg-primary-container h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, hub.projectCount * 25)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mini Calendar Widget */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/40 shadow-subtle hover:border-outline-variant transition-all">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-lg font-bold text-on-surface">التقويم اليومي</h2>
              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-surface-container rounded-lg text-on-surface-variant">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button className="p-1 hover:bg-surface-container rounded-lg text-on-surface-variant">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-y-2 text-center mb-6 font-mono">
              <span className="text-[10px] font-bold text-outline uppercase">س</span>
              <span className="text-[10px] font-bold text-outline uppercase">ح</span>
              <span className="text-[10px] font-bold text-outline uppercase">ن</span>
              <span className="text-[10px] font-bold text-outline uppercase">ث</span>
              <span className="text-[10px] font-bold text-outline uppercase">ك</span>
              <span className="text-[10px] font-bold text-outline uppercase">خ</span>
              <span className="text-[10px] font-bold text-outline uppercase">ج</span>

              <div className="py-1.5 text-xs font-bold hover:bg-surface-container rounded-lg cursor-pointer">20</div>
              <div className="py-1.5 text-xs font-bold hover:bg-surface-container rounded-lg cursor-pointer">21</div>
              <div className="py-1.5 text-xs font-bold hover:bg-surface-container rounded-lg cursor-pointer">22</div>
              <div className="py-1.5 text-xs font-bold hover:bg-surface-container rounded-lg cursor-pointer">23</div>
              <div className="py-1.5 text-xs font-bold bg-primary-container text-on-primary rounded-lg shadow-sm">24</div>
              <div className="py-1.5 text-xs font-bold hover:bg-surface-container rounded-lg cursor-pointer">25</div>
              <div className="py-1.5 text-xs font-bold hover:bg-surface-container rounded-lg cursor-pointer">26</div>
            </div>

            <div className="space-y-3">
              <div className="py-6 text-center">
                <p className="text-sm font-bold text-on-surface">لا توجد مواعيد مجدولة</p>
                <p className="text-xs text-on-surface-variant mt-1">ستظهر مواعيدك وأحداثك هنا عند إضافتها.</p>
              </div>
            </div>
          </section>

          {/* Habit Metrics Ring (Dynamic from Stores) */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/40 shadow-subtle hover:border-outline-variant transition-all">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-container" />
                <h2 className="font-display text-lg font-bold text-on-surface">مؤشرات العادات والصحة</h2>
              </div>
              <Link href="/dashboard/habits" className="text-xs font-bold text-primary-container hover:underline">
                العادات ({habits.length})
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-4 bg-surface-container-low rounded-xl text-center">
                <div className="relative w-12 h-12 mb-2 flex items-center justify-center bg-primary-container/10 rounded-full text-primary-container">
                  <Droplets className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-on-surface">شرب الماء</p>
                <p className="text-base font-extrabold text-on-surface font-mono mt-1">
                  {latestHealth.waterIntakeMl} مل
                </p>
              </div>

              <div className="flex flex-col items-center p-4 bg-surface-container-low rounded-xl text-center">
                <div className="relative w-12 h-12 mb-2 flex items-center justify-center bg-primary-container/10 rounded-full text-primary-container">
                  <Heart className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-on-surface">ساعات النوم</p>
                <p className="text-base font-extrabold text-on-surface font-mono mt-1">
                  {latestHealth.sleepHours} ساعات
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 4. Footer */}
      <footer className="pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4 text-outline text-xs font-medium">
        <p>© 2026 LifeOS - نسخة الإنتاجية المميزة</p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-primary-container transition-colors">عن التطبيق</Link>
          <Link href="#" className="hover:text-primary-container transition-colors">الدعم الفني</Link>
          <Link href="#" className="hover:text-primary-container transition-colors">سياسة الخصوصية</Link>
        </div>
      </footer>
    </div>
  );
}
