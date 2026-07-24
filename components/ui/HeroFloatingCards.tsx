'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Calendar, BarChart3 } from 'lucide-react';

interface WidgetCard {
  content: React.ReactNode;
  position: string;
  delay: number;
  duration: number;
  distance: number;
}

/* --- Mini Widget Internals --- */

// 1. Progress bar that fills slowly
const ProgressWidget = () => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-semibold text-on-surface">التقدم</span>
      <span className="text-[10px] font-bold text-primary">72%</span>
    </div>
    <div className="w-24 h-1.5 bg-surface-container rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-primary rounded-full"
        animate={{ width: ['20%', '72%', '20%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  </div>
);

// 2. Circular progress that rotates
const CircularWidget = () => (
  <div className="flex items-center gap-2">
    <div className="relative w-8 h-8">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" className="text-surface-container" strokeWidth="3" />
        <motion.circle
          cx="18" cy="18" r="14" fill="none" stroke="currentColor"
          className="text-emerald-500"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="88"
          animate={{ strokeDashoffset: [88, 22, 88] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
      <motion.span
        className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-on-surface"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        75%
      </motion.span>
    </div>
    <span className="text-[10px] font-semibold text-on-surface">الأهداف</span>
  </div>
);

// 3. Calendar with pulsing day dots
const CalendarWidget = () => (
  <div className="space-y-1">
    <div className="flex items-center gap-1.5">
      <Calendar className="w-3 h-3 text-amber-600" />
      <span className="text-[10px] font-semibold text-on-surface">هذا الأسبوع</span>
    </div>
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <motion.div
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-primary/20"
          animate={{
            backgroundColor: ['rgba(0,108,73,0.15)', 'rgba(0,108,73,0.6)', 'rgba(0,108,73,0.15)'],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}
    </div>
  </div>
);

// 4. Habit streak dots animate sequentially
const HabitWidget = () => (
  <div className="space-y-1">
    <span className="text-[10px] font-semibold text-on-surface">سلسلة العادات</span>
    <div className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded-sm"
          animate={{
            backgroundColor: ['#e0e0e0', '#7c3aed', '#e0e0e0'],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
        />
      ))}
    </div>
  </div>
);

// 5. Mini bar chart that grows
const ChartWidget = () => (
  <div className="flex items-center gap-2">
    <BarChart3 className="w-3 h-3 text-sky-600" />
    <div className="flex items-end gap-0.5 h-5">
      {[40, 65, 50, 80, 60].map((target, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-sky-500 rounded-t-sm"
          animate={{ height: [`30%`, `${target}%`, `30%`] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        />
      ))}
    </div>
  </div>
);

// 6. Goal icon gently pulses
const GoalWidget = () => (
  <div className="flex items-center gap-2">
    <motion.div
      animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Target className="w-5 h-5 text-emerald-600" />
    </motion.div>
    <div>
      <span className="text-[10px] font-bold text-on-surface block leading-tight">3 أهداف</span>
      <span className="text-[9px] text-on-surface-variant">قيد التنفيذ</span>
    </div>
  </div>
);

const widgets: WidgetCard[] = [
  { content: <ProgressWidget />, position: 'top-4 right-0', delay: 0, duration: 5, distance: 10 },
  { content: <CircularWidget />, position: 'top-16 left-0', delay: 1.2, duration: 6, distance: 14 },
  { content: <CalendarWidget />, position: 'bottom-20 right-2', delay: 0.8, duration: 7, distance: 12 },
  { content: <HabitWidget />, position: 'bottom-8 left-4', delay: 2, duration: 5.5, distance: 11 },
  { content: <ChartWidget />, position: 'top-1/2 -translate-y-1/2 right-[-12px]', delay: 1.5, duration: 8, distance: 8 },
  { content: <GoalWidget />, position: 'top-1/3 left-[-8px]', delay: 0.5, duration: 6.5, distance: 13 },
];

export const HeroFloatingCards: React.FC = () => {
  return (
    <>
      {widgets.map((widget, i) => (
        <motion.div
          key={i}
          className={`absolute ${widget.position} z-10 hidden md:flex items-center px-3 py-2.5 rounded-xl bg-surface-container-lowest/90 backdrop-blur-sm border border-outline-variant/50 shadow-subtle`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -widget.distance, 0],
          }}
          transition={{
            opacity: { duration: 0.4, delay: 1 + i * 0.15 },
            scale: { duration: 0.4, delay: 1 + i * 0.15 },
            y: {
              duration: widget.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1 + i * 0.15 + widget.delay,
            },
          }}
        >
          {widget.content}
        </motion.div>
      ))}
    </>
  );
};
