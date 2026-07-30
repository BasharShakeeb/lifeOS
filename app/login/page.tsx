'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Check,
  Home,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Smile,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '@/providers/ToastProvider';
import { Logo } from '@/components/ui/Logo';

import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUpMode) {
        // Sign Up Mode
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName || email.split('@')[0] },
          },
        });

        if (error) {
          toast(error.message || 'حدث خطأ أثناء إنشاء الحساب', 'error');
          setIsLoading(false);
          return;
        }

        toast('تم إنشاء الحساب بنجاح! يتم الآن تحويلك إلى لوحة التحكم.', 'success');
        router.push('/dashboard');
      } else {
        // Sign In Mode
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast('بيانات الدخول غير صحيحة، يرجى التحقق وإعادة المحاولة', 'error');
          setIsLoading(false);
          return;
        }

        toast('تم تسجيل الدخول بنجاح! يتم الآن تحويلك إلى لوحة التحكم.', 'success');
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast('تعذر الاتصال بـ Supabase، يرجى التحقق من الملف .env.local', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    toast('جاري الاتصال بخدمة تسجيل الدخول عبر Google...', 'info');

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast(`تنبيه Google OAuth: ${error.message} (يرجى تفعيل Google من لوحة Supabase Dashboard)`, 'warning');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (err: any) {
      toast('جاري تحويلك لوحة التحكم...', 'info');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* 1. Top Navigation */}
      <nav className="w-full py-6 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto" data-purpose="top-navigation">
        {/* Logo Brand */}
        <div className="flex items-center">
          <Logo variant="full" size={120} className="h-10 w-auto" />
        </div>

        {/* Back to Home Link */}
        <Link
          href="/"
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-medium"
        >
          <span>العودة إلى الصفحة الرئيسية</span>
          <Home className="w-4 h-4" />
        </Link>
      </nav>

      {/* 2. Main Content Auth Container */}
      <main className="flex-grow flex items-center justify-center px-4 py-8 md:py-12">
        <div
          className="max-w-6xl w-full bg-surface-container-lowest rounded-[32px] shadow-xl shadow-surface-dim/40 overflow-hidden flex flex-col min-h-[680px] md:flex-row-reverse border border-outline-variant/30"
          data-purpose="auth-container"
        >
          {/* Right Section (Visual / Hero Side in RTL) */}
          <section
            className="md:w-1/2 bg-surface-container-low p-8 md:p-12 flex flex-col justify-between relative overflow-hidden"
            data-purpose="hero-area"
          >
            {/* Background Blur Shapes */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary-container/30 rounded-full blur-3xl opacity-60 pointer-events-none" />

            {/* Header Text */}
            <div className="relative z-10 text-right">
              <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface mb-3 font-display">
                مرحبا بك في <span className="text-primary block mt-2">LifeOS</span>
              </h1>
              <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-md">
                منصة متكاملة تساعدك على إدارة مهامك، عاداتك، دراستك وصحتك في مكان واحد.
              </p>
            </div>

            {/* App Preview Illustration */}
            <div className="relative z-10 my-8 flex justify-center items-center">
              <div className="relative max-w-sm w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/30 bg-white flex flex-col items-center justify-center gap-4 p-6">
                <img
                  src="/images/logo/lifeos-logo.png"
                  alt="LifeOS Logo"
                  className="w-40 h-auto object-contain"
                />
              </div>
            </div>



          </section>

          {/* Left Section (Login Form Side in RTL) */}
          <section className="md:w-1/2 p-8 md:p-14 flex flex-col justify-center" data-purpose="login-form-area">
            <div className="max-w-md w-full mx-auto">
              <div className="text-right mb-8">
                <h2 className="text-3xl font-bold text-on-surface mb-2 font-display">
                  {isSignUpMode ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
                </h2>
                <p className="text-sm text-on-surface-variant">
                  {isSignUpMode
                    ? 'أدخل بياناتك لإنشاء مساحة عملك الجديدة في LifeOS'
                    : 'اختر الطريقة التي تفضلها لتسجيل الدخول'}
                </p>
              </div>

              {/* Social Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-outline-variant rounded-xl hover:bg-surface-container transition-all duration-200 font-semibold text-on-surface bg-surface-container-lowest shadow-subtle"
                data-purpose="google-login"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>استمرار عبر Google</span>
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/40" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-surface-container-lowest text-on-surface-variant/70 font-mono text-xs">
                    أو
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name (Only on Sign Up) */}
                {isSignUpMode && (
                  <div className="space-y-1.5 text-right">
                    <label className="block text-xs font-semibold text-on-surface-variant" htmlFor="fullName">
                      الاسم الكامل
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-outline">
                        <Smile className="h-4 w-4 text-outline" />
                      </div>
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="أدخل اسمك الكامل"
                        className="block w-full pr-10 pl-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface text-sm outline-none"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1.5 text-right">
                  <label className="block text-xs font-semibold text-on-surface-variant" htmlFor="email">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-outline">
                      <Mail className="h-4 h-4 text-outline" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="أدخل بريدك الإلكتروني"
                      className="block w-full pr-10 pl-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface text-sm outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5 text-right">
                  <label className="block text-xs font-semibold text-on-surface-variant" htmlFor="password">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-outline">
                      <Lock className="h-4 h-4 text-outline" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور"
                      className="block w-full pr-10 pl-10 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface text-sm outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-outline hover:text-on-surface-variant transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 h-4" /> : <Eye className="h-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-subtle text-sm font-bold text-on-primary bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading
                    ? 'جاري الاتصال بـ Supabase...'
                    : isSignUpMode
                    ? 'إنشاء حساب جديد'
                    : 'تسجيل الدخول'}
                </button>
              </form>

              {/* Sign Up / Sign In Toggle Link */}
              <p className="mt-8 text-center text-xs text-on-surface-variant">
                {isSignUpMode ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUpMode(!isSignUpMode)}
                  className="font-bold text-primary hover:underline transition-colors mr-1 cursor-pointer"
                >
                  {isSignUpMode ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
                </button>
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* 3. Bottom Features Summary */}
      <section
        className="max-w-7xl mx-auto w-full px-6 py-10 border-t border-outline-variant/20"
        data-purpose="features-summary"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
          {/* Feature 1 */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-subtle">
            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface">إدارة متكاملة</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">كل أدواتك في مكان واحد</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-subtle">
            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
              <Smile className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface">سهولة الاستخدام</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">واجهة بسيطة وتجربة سلسة</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-subtle">
            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface">آمن وموثوق</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">حماية متقدمة لبياناتك</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer
        className="w-full py-8 flex flex-col items-center justify-center border-t border-outline-variant/10 bg-surface-container-lowest text-xs text-on-surface-variant"
        data-purpose="main-footer"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-on-primary">
            <Check className="h-4 w-4 stroke-[3]" />
          </div>
          <span className="text-lg font-bold text-on-surface tracking-tight font-display">
            LifeOS
          </span>
        </div>
        <p>جميع الحقوق محفوظة © 2026 LifeOS</p>
      </footer>
    </div>
  );
}
