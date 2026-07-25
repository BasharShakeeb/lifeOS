'use client';

import React, { useState } from 'react';
import { AuroraWidgetGrid } from '@/components/ui/AuroraWidgetGrid';
import { AuroraCard, AuroraColorTheme } from '@/components/ui/AuroraCard';
import { Sparkles, Layers, Sliders, Palette, Zap, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function AuroraDashboardPage() {
  const [selectedTheme, setSelectedTheme] = useState<AuroraColorTheme>('multi');
  const [isAnimated, setIsAnimated] = useState(true);

  return (
    <div className="space-y-8 min-h-screen pb-12">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 md:p-10 border border-white/10 shadow-2xl">
        {/* Soft Animated Aurora Background Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/40 rounded-full blur-3xl animate-aurora-float" />
          <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-purple-500/40 rounded-full blur-3xl animate-aurora-float-delayed" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-aurora-float" />
          <div className="absolute top-10 right-1/3 w-72 h-72 bg-orange-500/30 rounded-full blur-3xl animate-aurora-float-delayed" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>تصميم واجهات السحاب SaaS الممتازة</span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              بطاقات لوحة التحكم بنمط <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-orange-300 bg-clip-text text-transparent">Aurora Mesh & Glassmorphism</span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              بطاقات تفاعلية أنيقة تتميز بظلال ناعمة متدرجة، وهج إشعاعي ضبابي (Blurred Radial Gradients)،
              وتأثيرات الزجاج الضبابي (Glassmorphism)، وإضاءات باستيلية ساطعة بالأزرق والبنفسجي والأخضر والبرتقالي.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xs hover:bg-white/20 transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>العودة للوحة التحكم</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Theme Switcher Bar */}
      <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-purple-500" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">طيف التدرج الباستيلي:</span>
          
          <div className="flex items-center gap-1.5 mr-2">
            {[
              { id: 'multi', label: 'متعدد الألوان', color: 'bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400' },
              { id: 'blue', label: 'أزرق باستيل', color: 'bg-blue-400' },
              { id: 'purple', label: 'بنفسجي باستيل', color: 'bg-purple-400' },
              { id: 'green', label: 'أخضر باستيل', color: 'bg-emerald-400' },
              { id: 'orange', label: 'برتقالي باستيل', color: 'bg-orange-400' },
            ].map((themeItem) => (
              <button
                key={themeItem.id}
                onClick={() => setSelectedTheme(themeItem.id as AuroraColorTheme)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all
                  ${
                    selectedTheme === themeItem.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }
                `}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${themeItem.color}`} />
                <span>{themeItem.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Animation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAnimated(!isAnimated)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all
              ${
                isAnimated
                  ? 'bg-purple-500/10 border-purple-400/40 text-purple-600 dark:text-purple-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 text-slate-500'
              }
            `}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnimated ? 'animate-spin' : ''}`} />
            <span>حركة شبكة Aurora Mesh: {isAnimated ? 'مفعلة' : 'متوقفة'}</span>
          </button>
        </div>
      </div>

      {/* Main Aurora Widget Showcase Grid */}
      <AuroraWidgetGrid />

      {/* Extended Showcase: Individual Aurora Card Color Variants */}
      <div className="space-y-4 pt-6">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500" />
          أنماط بطاقات Aurora Pastel المميزة
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pastel Blue Card */}
          <AuroraCard theme="blue" animatedMesh={isAnimated} badgeText="أزرق باستيل (Blue)" badgeColor="blue">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">شبكة الأوامر والتنبيهات</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              وهج أزرق سماوي ناعم مع إطار زجاجي مضيء يعطي انطباعاً تقنياً احترافياً.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800 text-xs font-bold text-blue-500">
              استكشف الموديول ←
            </div>
          </AuroraCard>

          {/* Pastel Purple Card */}
          <AuroraCard theme="purple" animatedMesh={isAnimated} badgeText="بنفسجي باستيل (Purple)" badgeColor="purple">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">مساحة الابتكار والأفكار</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              تدرجات بنفسجية حالمة تضفي لمسة فخامة وإبداع لبطاقات البيانات.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800 text-xs font-bold text-purple-500">
              استكشف الموديول ←
            </div>
          </AuroraCard>

          {/* Pastel Green Card */}
          <AuroraCard theme="green" animatedMesh={isAnimated} badgeText="أخضر باستيل (Green)" badgeColor="green">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">الصحة والسلامة</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              إضاءة زمردية هادئة تعبر عن النمو، الحيوية، وإكمال المهام بنجاح.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800 text-xs font-bold text-emerald-500">
              استكشف الموديول ←
            </div>
          </AuroraCard>

          {/* Pastel Orange Card */}
          <AuroraCard theme="orange" animatedMesh={isAnimated} badgeText="برتقالي باستيل (Orange)" badgeColor="orange">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">التنبيهات والأهداف</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              وهج برتقالي مشرق وجذاب يلفت الانتباه للمؤشرات الهامة والمهام العاجلة.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800 text-xs font-bold text-orange-500">
              استكشف الموديول ←
            </div>
          </AuroraCard>
        </div>
      </div>
    </div>
  );
}
