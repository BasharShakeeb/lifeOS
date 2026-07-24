'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Bell, Moon, LogOut, Save } from 'lucide-react';
import { useToast } from '@/providers/ToastProvider';

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [theme, setTheme] = useState('light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast('تم حفظ الإعدادات بنجاح', 'success');
  };

  const handleLogout = () => {
    toast('تم تسجيل الخروج من الجلسة', 'info');
    router.push('/login');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-headline text-primary tracking-tight">
          إعدادات الحساب والنظام
        </h1>
        <p className="text-xs text-text-muted mt-1">
          إدارة الملف الشخصي، التفضيلات، الإشعارات، وتأمين الجلسة.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 bg-surface border border-border-subtle rounded-card shadow-card space-y-4">
          <h2 className="text-base font-bold text-on-surface flex items-center gap-2 border-b border-border-subtle pb-3">
            <User className="w-5 h-5 text-primary" />
            <span>الملف الشخصي</span>
          </h2>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-3xl text-on-primary shadow-offset-primary">
              {name.trim() ? name.trim().charAt(0) : <User className="w-7 h-7" />}
            </div>
            <div>
              <h3 className="font-bold text-on-surface">{name.trim() || 'مرحباً بك'}</h3>
              <p className="text-xs text-text-muted">{email.trim() || 'أضف بريدك الإلكتروني'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs text-text-muted mb-1.5 uppercase font-semibold">الاسم الكامل</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك الكامل"
                className="w-full bg-surface-container border border-border-subtle rounded-input px-4 py-2.5 text-sm text-on-surface focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1.5 uppercase font-semibold">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                className="w-full bg-surface-container border border-border-subtle rounded-input px-4 py-2.5 text-sm text-on-surface focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="p-6 bg-surface border border-border-subtle rounded-card shadow-card space-y-4">
          <h2 className="text-base font-bold text-on-surface flex items-center gap-2 border-b border-border-subtle pb-3">
            <Moon className="w-5 h-5 text-secondary" />
            <span>المظهر والنمط البصري</span>
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-on-surface">نمط الواجهة</h4>
              <p className="text-xs text-text-muted">اختر بين النمط الفاتح والداكن حسب تفضيلك</p>
            </div>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-surface-container border border-border-subtle rounded-input px-3 py-2 text-xs text-on-surface outline-none cursor-pointer"
            >
              <option value="light">النمط الفاتح (افتراضي)</option>
              <option value="dark">النمط الداكن</option>
            </select>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 bg-surface border border-border-subtle rounded-card shadow-card space-y-4">
          <h2 className="text-base font-bold text-on-surface flex items-center gap-2 border-b border-border-subtle pb-3">
            <Bell className="w-5 h-5 text-amber-600" />
            <span>التنبيهات والإشعارات</span>
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-on-surface">إشعارات المهام والعادات</h4>
              <p className="text-xs text-text-muted">تلقي التنبيهات المباشرة لمواعيد استحقاق المهام والسلاسل</p>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-5 h-5 rounded bg-surface border-border-subtle text-primary focus:ring-primary cursor-pointer"
            />
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button border border-rose-500/30 text-rose-600 hover:bg-rose-500/10 font-bold text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-button bg-primary text-on-primary font-bold text-sm hover:bg-primary-container shadow-offset transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            <Save className="w-4 h-4" />
            حفظ التغييرات
          </button>
        </div>
      </form>
    </div>
  );
}
