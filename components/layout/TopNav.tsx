'use client';

import React from 'react';
import { Bell, MessageSquare, User } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { SearchInput } from '@/components/ui/SearchInput';

export const TopNav: React.FC = () => {
  const { searchQuery, setSearchQuery, isSidebarCollapsed } = useAppStore();

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-16 bg-surface-container-lowest border-b border-outline-variant/30 z-40 px-6 flex items-center justify-between transition-all duration-300 ${
        isSidebarCollapsed ? 'md:right-20' : 'md:right-64'
      }`}
    >
      {/* Search Input */}
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="ابحث عن مهام، مواعيد، ملاحظات..."
        showShortcut
        className="flex-1 max-w-md"
      />

      {/* Right Side Icons & Profile */}
      <div className="flex items-center gap-4">
        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full relative transition-all"
            aria-label="الإشعارات"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-all"
            aria-label="الرسائل"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>

        {/* User Profile (placeholder — ready for backend/auth integration) */}
        <div className="flex items-center gap-3 pr-3 border-r border-outline-variant/30">
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-on-surface leading-tight">مرحباً بك</p>
            <p className="text-[10px] font-medium text-on-surface-variant mt-0.5">حسابي</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-surface-container border border-outline-variant/40 flex items-center justify-center text-on-surface-variant shrink-0">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
