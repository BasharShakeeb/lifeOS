'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Check,
  LayoutDashboard,
  CheckCircle2,
  Grid,
  FolderOpen,
  BookOpen,
  Heart,
  Repeat,
  Target,
  Settings,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

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

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <aside
      className={`hidden md:flex fixed right-0 top-0 h-screen bg-surface-container-lowest border-l border-outline-variant/40 flex-col p-4 z-50 overflow-y-auto transition-all duration-300 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center shrink-0 shadow-sm text-on-primary">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          {!isSidebarCollapsed && (
            <span className="font-display text-2xl font-extrabold text-on-surface tracking-tight">
              LifeOS
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 hover:bg-surface-container rounded-lg transition-colors text-outline hover:text-on-surface"
          title={isSidebarCollapsed ? 'توسيع القائمة' : 'طّي القائمة'}
        >
          {isSidebarCollapsed ? <PanelRightOpen className="w-5 h-5" /> : <PanelRightClose className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="mt-auto pt-4 border-t border-outline-variant/30">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
            pathname === '/dashboard/settings'
              ? 'bg-primary-container text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
          }`}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!isSidebarCollapsed && <span>الإعدادات</span>}
        </Link>
      </div>
    </aside>
  );
};
