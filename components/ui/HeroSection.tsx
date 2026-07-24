'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, CheckCircle2 } from 'lucide-react';
import { FloatingIllustration } from '@/components/ui/FloatingIllustration';
import { HeroFloatingCards } from '@/components/ui/HeroFloatingCards';
import { HeroParticles } from '@/components/ui/HeroParticles';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-12 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Right Column: Copywriting & CTA */}
        <div className="space-y-6 text-right">
          {/* Top Green Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>منصة متكاملة لإدارة حياتك</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-surface leading-[1.25] tracking-tight font-display"
          >
            نظّم حياتك، <br />
            <span className="text-primary">حقّق أهدافك</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-base md:text-lg text-on-surface-variant leading-relaxed max-w-xl"
          >
            المنصة الشاملة الوحيدة التي تساعدك على إدارة مهامك، ومشاريعك، وعاداتك ودراستك، وصحتك في مكان واحد بسيط وممتع.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Link
              href="/dashboard"
              className="px-8 py-3.5 rounded-button bg-primary text-on-primary font-bold text-base hover:bg-primary/90 hover:shadow-[0_0_24px_rgba(0,108,73,0.35)] hover:scale-[1.03] transition-all shadow-level1 active:scale-[0.98]"
            >
              ابدأ الآن مجاناً
            </Link>
            <button
              type="button"
              className="px-6 py-3.5 rounded-button border border-outline-variant bg-surface-container-lowest text-on-surface font-semibold text-sm hover:bg-surface-container-low transition-colors flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Play className="w-3 h-3 fill-current" />
              </div>
              <span>شاهد كيف يعمل</span>
            </button>
          </motion.div>

          {/* Value Proposition */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="pt-6 flex items-center gap-3 border-t border-outline-variant/40"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-sm text-on-surface-variant font-medium">
              كل أدواتك لإدارة الحياة في مكان واحد منظّم
            </p>
          </motion.div>
        </div>

        {/* Left Column: Hero Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="relative flex items-center justify-center w-full py-8"
        >
          <HeroParticles />
          <HeroFloatingCards />
          <FloatingIllustration
            src="/images/hero/hero-illustration.png"
            alt="LifeOS - منصة إدارة الحياة الشخصية"
            width={600}
            height={500}
          />
        </motion.div>
      </div>
    </section>
  );
};
