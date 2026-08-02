'use client';

import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { MobileNav } from './MobileNav';
import { MobileSidebar } from './MobileSidebar';
import { GlobalModalManager } from '@/components/modals/GlobalModalManager';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useAppStore } from '@/stores/useAppStore';
import { supabase } from '@/lib/supabase/client';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSidebarCollapsed, fetchInitialData } = useAppStore();

  // Load persisted data from the backend once the session is confirmed,
  // so refreshing any dashboard route (e.g. /dashboard/projects) shows
  // the existing records from the database.
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        fetchInitialData();
      }
    });
  }, [fetchInitialData]);

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

      {/* Mobile Sidebar Drawer */}
      <MobileSidebar />

      {/* Global Orchestrator for Drawers and Modals */}
      <GlobalModalManager />
    </div>
  );
};
