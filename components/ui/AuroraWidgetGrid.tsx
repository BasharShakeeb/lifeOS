'use client';

import React, { useState } from 'react';
import {
  BarChart2,
  Sparkles,
  Zap,
  Layers,
  Send,
  CheckCircle2,
  Clock,
  Target,
  ArrowUpRight,
  TrendingUp,
  Flame,
  Award,
} from 'lucide-react';
import { AuroraCard } from './AuroraCard';
import { AuroraStatCard } from './AuroraStatCard';

export const AuroraWidgetGrid: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
  const [promptText, setPromptText] = useState('');
  const [tasksState, setTasksState] = useState([
    { id: 1, title: 'تصميم الواجهات بنمط Glassmorphism', category: 'LifeOS UI', time: '10:30 ص', done: true, tag: 'green' },
    { id: 2, title: 'ربط تدرجات Aurora Mesh Gradients', category: 'Design System', time: '02:00 م', done: false, tag: 'purple' },
    { id: 3, title: 'مراجعة مؤشرات الأداء والتحليلات', category: 'Analytics', time: '04:30 م', done: false, tag: 'blue' },
  ]);

  const toggleTask = (id: number) => {
    setTasksState((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div className="space-y-8">
      {/* 1. Stat Cards Row (Pastel Aurora Mesh Highlights: Blue, Purple, Green, Orange) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AuroraStatCard
          title="معدل الإنجاز"
          value="94.2%"
          subtitle="+12.4% زيادة هذا الأسبوع"
          trend={{ value: "+12.4%", isPositive: true }}
          iconName="Zap"
          theme="purple"
          sparklineData={[30, 45, 55, 60, 78, 85, 94]}
        />
        <AuroraStatCard
          title="المشاريع النشطة"
          value="18 مشروع"
          subtitle="4 مشاريع مكتملة حديثاً"
          trend={{ value: "+3 مشاريع", isPositive: true }}
          iconName="Layers"
          theme="blue"
          sparklineData={[12, 14, 15, 14, 16, 17, 18]}
        />
        <AuroraStatCard
          title="ساعات التركيز"
          value="38.5 ساعة"
          subtitle="متوسط 5.5س / يوم"
          trend={{ value: "+8.5%", isPositive: true }}
          iconName="Clock"
          theme="green"
          sparklineData={[20, 25, 30, 28, 35, 36, 38.5]}
        />
        <AuroraStatCard
          title="سلسلة العادات (Streak)"
          value="14 يوم"
          subtitle="أعلى رقم قياسي شخصي"
          trend={{ value: "مستمر 🔥", isPositive: true }}
          iconName="Flame"
          theme="orange"
          sparklineData={[2, 4, 6, 8, 10, 12, 14]}
        />
      </div>

      {/* 2. Main Dual Grid: Analytics Aurora Glass Card & AI Copilot Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Card (Span 2) */}
        <AuroraCard theme="multi" className="lg:col-span-2 flex flex-col justify-between" badgeText="تحليلات الأداء المتقدمة" badgeColor="purple">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-purple-500" />
                ملخص الإنتاجية والتدفق
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                توزيع ساعات التركيز والمهام المكتملة عبر الأيام
              </p>
            </div>

            {/* Segmented Tab Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/5">
              <button
                onClick={() => setActiveTab('weekly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'weekly'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                أسبوعي
              </button>
              <button
                onClick={() => setActiveTab('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'monthly'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                شهري
              </button>
            </div>
          </div>

          {/* Bar Visualizer with Aurora Pastel Glow Bars */}
          <div className="h-52 w-full flex items-end justify-between gap-3 pt-4 px-2">
            {[
              { day: 'الأحد', val: 65, color: 'from-blue-400 to-indigo-500', glow: 'shadow-[0_0_15px_rgba(96,165,250,0.4)]' },
              { day: 'الإثنين', val: 85, color: 'from-purple-400 to-pink-500', glow: 'shadow-[0_0_15px_rgba(192,132,252,0.4)]' },
              { day: 'الثلاثاء', val: 45, color: 'from-emerald-400 to-teal-500', glow: 'shadow-[0_0_15px_rgba(52,211,153,0.4)]' },
              { day: 'الأربعاء', val: 95, color: 'from-orange-400 to-amber-500', glow: 'shadow-[0_0_15px_rgba(251,146,60,0.4)]' },
              { day: 'الخميس', val: 75, color: 'from-purple-400 to-blue-500', glow: 'shadow-[0_0_15px_rgba(192,132,252,0.4)]' },
              { day: 'الجمعة', val: 40, color: 'from-blue-400 to-emerald-400', glow: 'shadow-[0_0_15px_rgba(96,165,250,0.4)]' },
              { day: 'السبت', val: 80, color: 'from-indigo-400 to-purple-500', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]' },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.val}%
                </div>
                <div className="w-full bg-slate-200/40 dark:bg-slate-800/40 rounded-xl h-40 flex items-end p-1 backdrop-blur-sm">
                  <div
                    style={{ height: `${bar.val}%` }}
                    className={`w-full rounded-lg bg-gradient-to-t ${bar.color} transition-all duration-500 group-hover:scale-[1.03] ${bar.glow}`}
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {bar.day}
                </span>
              </div>
            ))}
          </div>

          {/* Footer Metric summary pill */}
          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping" />
              <span className="font-bold text-slate-700 dark:text-slate-300">أعلى إنتاجية: الأربعاء (95%)</span>
            </div>
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> +18% مقارنة بالأسبوع الماضي
            </span>
          </div>
        </AuroraCard>

        {/* AI Copilot Quick Action Card (Orange/Green Glow) */}
        <AuroraCard theme="orange" badgeText="مساعد LifeOS الذكي" badgeColor="orange" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(251,146,60,0.5)] animate-pulse">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">المساعد الفائق</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">توليد جداول، تلخيص، واقتراحات</p>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="space-y-2 my-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">اقتراحات سريعة:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  '✨ اقترح خطة يومية',
                  '🎯 رتب أولويات اليوم',
                  '📊 حلل تقرير الأسبوع',
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPromptText(chip.replace(/^[^\s]+\s/, ''))}
                    className="text-xs px-3 py-1.5 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-orange-400/60 hover:bg-orange-50/50 dark:hover:bg-orange-950/30 transition-all shadow-sm"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Frosted Glass Input Field */}
          <div className="mt-4">
            <div className="relative flex items-center">
              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="اكتب أمرك هنا..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 shadow-inner text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
              <button
                className="absolute left-2 p-1.5 rounded-lg bg-gradient-to-r from-orange-400 to-amber-500 text-white hover:opacity-90 transition-opacity shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </AuroraCard>
      </div>

      {/* 3. Lower Dual Grid: Active Tasks & Goal Velocity Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Tasks Glass Card (Pastel Green & Blue Highlights) */}
        <AuroraCard theme="green" badgeText="مهام اليوم" badgeColor="green">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              قائمة المهام السريعة
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              {tasksState.filter((t) => t.done).length} من {tasksState.length} مكتملة
            </span>
          </div>

          <div className="space-y-3">
            {tasksState.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`
                  p-3.5 rounded-xl border backdrop-blur-md flex items-center justify-between cursor-pointer transition-all duration-200
                  ${
                    task.done
                      ? 'bg-emerald-500/5 border-emerald-400/20 opacity-75'
                      : 'bg-white/50 dark:bg-slate-800/40 border-white/50 dark:border-white/10 hover:border-emerald-400/40'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                      task.done
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {task.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-bold ${
                        task.done
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">{task.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {task.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </AuroraCard>

        {/* Goal Tracker & Progress Card (Pastel Blue & Purple Highlights) */}
        <AuroraCard theme="blue" badgeText="الهدف الشهري الرئيسي" badgeColor="blue">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              مؤشر تقدم الأهداف
            </h3>
            <button className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
              التفاصيل <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
            {/* Circular SVG Gradient Gauge */}
            <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="text-slate-200 dark:text-slate-800"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="auroraCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="50%" stopColor="#C084FC" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                </defs>
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#auroraCircleGrad)"
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset="62.8"
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">75%</span>
                <span className="block text-[10px] font-bold text-slate-400">مكتمل</span>
              </div>
            </div>

            {/* Goal breakdown items */}
            <div className="flex-1 space-y-3 w-full">
              {[
                { label: 'إطلاق تحديث نظام LifeOS', progress: 90, color: 'bg-blue-400' },
                { label: 'إنهاء قراءة 3 كتب تخصصية', progress: 65, color: 'bg-purple-400' },
                { label: 'ممارسة الرياضة 20 يوم', progress: 70, color: 'bg-emerald-400' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>{item.label}</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200/60 dark:bg-slate-800/60 overflow-hidden backdrop-blur-sm">
                    <div
                      style={{ width: `${item.progress}%` }}
                      className={`h-full rounded-full ${item.color} shadow-[0_0_10px_currentColor]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AuroraCard>
      </div>
    </div>
  );
};
