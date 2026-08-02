'use client';

import React, { useEffect, useState } from 'react';
import { Bell, MessageSquare, User, LogOut, LogIn, ChevronDown, Menu } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { SearchInput } from '@/components/ui/SearchInput';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const TopNav: React.FC = () => {
  const { searchQuery, setSearchQuery, isSidebarCollapsed, toggleMobileSidebar } = useAppStore();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    // 1. Fetch initial user session from Supabase client
    const loadSession = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;

        if (user) {
          setIsLoggedIn(true);
          const metadata = user.user_metadata;
          const name =
            metadata?.full_name ||
            metadata?.name ||
            user.email?.split('@')[0] ||
            'المستخدم';
          setUserName(name);
          setUserEmail(user.email || '');
          if (metadata?.avatar_url) {
            setAvatarUrl(metadata.avatar_url);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error('Error fetching Supabase session:', err);
      }
    };

    loadSession();

    // 2. Listen to real-time auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        const metadata = session.user.user_metadata;
        const name =
          metadata?.full_name ||
          metadata?.name ||
          session.user.email?.split('@')[0] ||
          'المستخدم';
        setUserName(name);
        setUserEmail(session.user.email || '');
        if (metadata?.avatar_url) {
          setAvatarUrl(metadata.avatar_url);
        }
      } else {
        setIsLoggedIn(false);
        setUserName('');
        setUserEmail('');
        setAvatarUrl('');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-16 bg-surface-container-lowest border-b border-outline-variant/30 z-40 px-3 md:px-6 flex items-center justify-between gap-2 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:right-20' : 'md:right-64'
      }`}
    >
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden flex-shrink-0 p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
        aria-label="فتح القائمة"
      >
        <Menu className="w-5 h-5" />
      </button>

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

        {/* User Profile Container */}
        <div className="relative border-r border-outline-variant/30 pr-3">
          {isLoggedIn ? (
            /* Logged-In User Profile Button */
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-surface-container transition-all cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-on-surface leading-tight max-w-[130px] truncate">
                    {userName}
                  </p>
                  <p className="text-[10px] font-medium text-on-surface-variant/80 mt-0.5 max-w-[130px] truncate">
                    {userEmail}
                  </p>
                </div>

                <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0 overflow-hidden shadow-subtle">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
                  ) : (
                    userName.charAt(0).toUpperCase()
                  )}
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-on-surface-variant transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-outline-variant/20">
                    <p className="text-xs font-bold text-on-surface">{userName}</p>
                    <p className="text-[11px] text-on-surface-variant truncate mt-0.5">{userEmail}</p>
                  </div>

                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <User className="w-4 h-4 text-on-surface-variant" />
                    <span>إعدادات الحساب</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-error hover:bg-error/10 transition-colors text-right font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Not Logged In Button */
            <Link
              href="/login"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all text-xs font-bold"
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
