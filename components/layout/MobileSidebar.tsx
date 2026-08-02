'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  CheckCircle2,
  Grid,
  FolderOpen,
  BookOpen,
  Target,
  Heart,
  Repeat,
  Settings,
  X,
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { Logo } from '@/components/ui/Logo';

const navigationItems = [
  { label: 'الرئيسية', href: '/dashboard', icon: LayoutDashboard },
  { label: 'المهام', href: '/dashboard/tasks', icon: CheckCircle2 },
  { label: 'المراكز (Hubs)', href: '/dashboard/hubs', icon: Grid },
  { label: 'المشاريع', href: '/dashboard/projects', icon: FolderOpen },
  { label: 'الواجبات', href: '/dashboard/assignments', icon: BookOpen },
  { label: 'الأهداف', href: '/dashboard/goals', icon: Target },
  { label: 'الصحة', href: '/dashboard/health', icon: Heart },
  { label: 'العادات', href: '/dashboard/habits', icon: Repeat },
];

export const MobileSidebar: React.FC = () => {
  const pathname = usePathname();
  const { isMobileSidebarOpen, closeMobileSidebar } = useAppStore();

  // Lock body scroll when the drawer is open.
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen]);

  // Close on Escape.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileSidebar();
    };
    if (isMobileSidebarOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileSidebarOpen, closeMobileSidebar]);

  return (
    <AnimatePresence>
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-[70]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMobileSidebar}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          />

          {/* Drawer panel — slides in from the right (RTL) */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="absolute top-0 right-0 h-full w-[85%] max-w-[300px] bg-surface-container-lowest border-l border-outline-variant/40 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-outline-variant/30">
              <Logo variant="full" size={120} />
              <button
                onClick={closeMobileSidebar}
                className="p-2 rounded-xl text-outline hover:bg-surface-container hover:text-on-surface transition-colors"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileSidebar}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-primary-container text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Settings at bottom */}
            <div className="px-3 py-3 border-t border-outline-variant/30">
              <Link
                href="/dashboard/settings"
                onClick={closeMobileSidebar}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  pathname === '/dashboard/settings'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <Settings className="w-5 h-5 shrink-0" />
                <span>الإعدادات</span>
              </Link>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

