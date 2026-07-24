'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckCircle2, Layers, FolderKanban, Settings } from 'lucide-react';

const mobileNavItems = [
  { label: 'الرئيسية', href: '/dashboard', icon: LayoutDashboard },
  { label: 'المهام', href: '/dashboard/tasks', icon: CheckCircle2 },
  { label: 'المحاور', href: '/dashboard/hubs', icon: Layers },
  { label: 'المشاريع', href: '/dashboard/projects', icon: FolderKanban },
  { label: 'الإعدادات', href: '/dashboard/settings', icon: Settings },
];

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest border-t border-outline-variant/40 z-40 px-4 flex items-center justify-around">
      {mobileNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 text-xs transition-colors ${
              isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
