'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { MobileNav } from './MobileNav';
import { GlobalModalManager } from '@/components/modals/GlobalModalManager';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useAppStore } from '@/stores/useAppStore';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSidebarCollapsed } = useAppStore();

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col antialiased overflow-x-hidden">
      {/* Desktop Right Sidebar */}
      <Sidebar />

      {/* Top Fixed Header */}
      <TopNav />

      {/* Main Scrollable Content Area for RTL */}
      <main
        className={`flex-1 transition-all duration-300 pt-20 pb-20 md:pb-8 px-6 md:px-10 ${
          isSidebarCollapsed ? 'md:mr-20' : 'md:mr-64'
        }`}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Global Orchestrator for Drawers and Modals */}
      <GlobalModalManager />
    </div>
  );
};
