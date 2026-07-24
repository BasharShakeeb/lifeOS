import React from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/ui/HeroSection';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import {
  Check,
  CheckCircle2,
  Grid,
  GraduationCap,
  Heart,
  BarChart3,
  Shield,
  UserCheck,
  Calendar,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  Share2,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* 1. Header Navigation */}
      <header className="bg-surface-container-lowest border-b border-outline-variant/50 sticky top-0 z-50 shadow-subtle">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <span className="font-bold text-2xl text-on-surface tracking-tight font-display">
              Life<span className="text-primary">OS</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant">
            <Link href="/" className="text-primary font-bold border-b-2 border-primary pb-1">
              الرئيسية
            </Link>
            <Link href="#features" className="hover:text-primary transition-colors">
              المميزات
            </Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">
              كيف يعمل
            </Link>
            <Link href="#blog" className="hover:text-primary transition-colors">
              المدونة
            </Link>
            <Link href="#contact" className="hover:text-primary transition-colors">
              تواصل معنا
            </Link>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-button bg-primary text-on-primary font-bold text-sm hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,108,73,0.3)] hover:scale-[1.03] transition-all shadow-subtle active:scale-[0.98]"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <HeroSection />

      {/* 3. Features Section ("مميزات متكاملة لحياة أفضل") */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-outline-variant/30">
        <ScrollReveal className="text-center space-y-2 mb-16">
          <span className="text-xs font-bold text-primary tracking-wider uppercase">كل ما تحتاجه في مكان واحد</span>
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface font-display">
            مميزات متكاملة لحياة أفضل
          </h2>
        </ScrollReveal>

        <ScrollReveal stagger={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: إدارة المهام */}
          <div className="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 shadow-level1 space-y-4 hover:border-primary hover:-translate-y-2 hover:shadow-level2 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low text-primary flex items-center justify-center border border-primary/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-on-surface">إدارة المهام</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              نظم مهامك اليومية والأسبوعية بسهولة تامة من خلال أداة ذكية وأكثر مخصصة!
            </p>
          </div>

          {/* Card 2: المحاور [Hubs] */}
          <div className="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 shadow-level1 space-y-4 hover:border-primary hover:-translate-y-2 hover:shadow-level2 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low text-primary flex items-center justify-center border border-primary/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Grid className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-on-surface">المحاور [Hubs]</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              أنشئ مراكزك الشخصية وكل ما يتعلق بحياتك وعملك في مساحات عمل مخصصة لكل جانب.
            </p>
          </div>

          {/* Card 3: الدراسة والواجبات */}
          <div className="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 shadow-level1 space-y-4 hover:border-primary hover:-translate-y-2 hover:shadow-level2 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low text-primary flex items-center justify-center border border-primary/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-on-surface">الدراسة والواجبات</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              تابع تكاليفك ومشاريعك الدراسية ونظم وقت المذاكرة للتفوق الأكاديمي بخطوات واحدة.
            </p>
          </div>

          {/* Card 4: الصحة والياقة */}
          <div className="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 shadow-level1 space-y-4 hover:border-primary hover:-translate-y-2 hover:shadow-level2 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low text-primary flex items-center justify-center border border-primary/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-on-surface">الصحة واللياقة</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              اهتم بصحتك وسجل نشاطك البدني اليومي بانتظام لمتابعة نمط حياتك الصحي.
            </p>
          </div>

          {/* Card 5: إحصائيات وتقارير */}
          <div className="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 shadow-level1 space-y-4 hover:border-primary hover:-translate-y-2 hover:shadow-level2 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low text-primary flex items-center justify-center border border-primary/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-on-surface">إحصائيات وتقارير</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              احصل على تقارير تفصيلية ورؤى ذكية حول تقدمك الفعلي نحو أهدافك الشخصية الكبرى.
            </p>
          </div>

          {/* Card 6: أمن وموثوق */}
          <div className="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 shadow-level1 space-y-4 hover:border-primary hover:-translate-y-2 hover:shadow-level2 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low text-primary flex items-center justify-center border border-primary/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-on-surface">أمن وموثوق</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              بياناتك محمية بأعلى معايير التشفير والخصوصية لضمان راحة بالك التامة وحماية خصوصيتك.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. "كيف يعمل LifeOS؟" Section */}
      <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto border-t border-outline-variant/30">
        <ScrollReveal className="text-center space-y-2 mb-16">
          <span className="text-xs font-bold text-primary tracking-wider uppercase">بسيطة وفعالة</span>
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface font-display">
            كيف يعمل LifeOS؟
          </h2>
        </ScrollReveal>

        <ScrollReveal stagger={0.12} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-subtle text-center space-y-3 hover:border-primary hover:-translate-y-2 hover:shadow-level2 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <UserCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-on-surface">1. سجل حسابك</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              أنشئ حسابك باستخدام Google أو البريد الإلكتروني في ثوانٍ.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-subtle text-center space-y-3 hover:border-primary hover:-translate-y-2 hover:shadow-level2 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-on-surface">2. نظم يومك</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              أضف مهامك، عاداتك، وأهدافك في مكان مركزي واحد.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-subtle text-center space-y-3 hover:border-primary hover:-translate-y-2 hover:shadow-level2 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-on-surface">3. تابع تقدمك</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              راقب إنجازاتك اليومية واحصل على تقارير دورية تزيد استمراريتك.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-subtle text-center space-y-3 hover:border-primary hover:-translate-y-2 hover:shadow-level2 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-on-surface">4. حقق أهدافك</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              استمر في التطور بثقة لتصل إلى النسخة الأفضل من حياتك المنظمة.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. Bottom Call-To-Action Banner */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full">
        <ScrollReveal>
        <div className="bg-primary text-on-primary rounded-3xl p-8 md:p-12 shadow-level2 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Right Column (RTL text) */}
          <div className="space-y-6 text-right">
            <h2 className="text-3xl md:text-4xl font-extrabold font-display leading-snug">
              ابدأ رحلتك نحو حياة منظمة وأنجز المزيد كل يوم
            </h2>
            <p className="text-sm md:text-base text-on-primary/85 leading-relaxed">
              انضم إلى آلاف المستخدمين الذين يثقون في LifeOS لإدارة حياتهم وتحقيق أهدافهم الحقيقية.
            </p>
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-button bg-surface-container-lowest text-primary font-bold text-base hover:bg-surface-container-low hover:shadow-[0_0_20px_rgba(0,108,73,0.2)] hover:scale-[1.03] transition-all shadow-subtle"
              >
                <span>ابدأ الآن مجاناً</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Left Column Illustration */}
          <div className="flex justify-center">
            <div className="rounded-2xl overflow-hidden border border-white/20 shadow-level1 max-w-md w-full aspect-[3/2] bg-on-primary/10 flex items-center justify-center">
              <div className="w-20 h-20 rounded-3xl bg-on-primary/20 flex items-center justify-center text-on-primary">
                <TrendingUp className="w-10 h-10" />
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* 6. Footer */}
      <ScrollReveal>
      <footer className="mt-auto border-t border-outline-variant/40 bg-surface-container-lowest pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-outline-variant/30">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="font-bold text-xl text-on-surface font-display">
                Life<span className="text-primary">OS</span>
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              المنصة العربية الرائدة لتنظيم الحياة، زيادة الإنتاجية وتحقيق الأهداف من خلال تكنولوجيا بسيطة وذكية.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button className="p-2 rounded-full bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Link Col 1: المنتج */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-on-surface text-sm">المنتج</h4>
            <ul className="space-y-2 text-on-surface-variant">
              <li><Link href="#features" className="hover:text-primary">المميزات</Link></li>
              <li><Link href="#how-it-works" className="hover:text-primary">كيف يعمل</Link></li>
              <li><Link href="#" className="hover:text-primary">الأسئلة الشائعة</Link></li>
              <li><Link href="#" className="hover:text-primary">التحديثات</Link></li>
            </ul>
          </div>

          {/* Link Col 2: الشركة */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-on-surface text-sm">الشركة</h4>
            <ul className="space-y-2 text-on-surface-variant">
              <li><Link href="#" className="hover:text-primary">من نحن</Link></li>
              <li><Link href="#" className="hover:text-primary">المدونة</Link></li>
              <li><Link href="#" className="hover:text-primary">السيرة</Link></li>
              <li><Link href="#" className="hover:text-primary">تواصل معنا</Link></li>
            </ul>
          </div>

          {/* Link Col 3: الدعم */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-on-surface text-sm">الدعم</h4>
            <ul className="space-y-2 text-on-surface-variant">
              <li><Link href="#" className="hover:text-primary">مركز المساعدة</Link></li>
              <li><Link href="#" className="hover:text-primary">سياسة الخصوصية</Link></li>
              <li><Link href="#" className="hover:text-primary">الشروط والأحكام</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-on-surface-variant gap-4">
          <p>© LifeOS 2026. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <span className="font-bold text-primary">العربية</span>
            <span>|</span>
            <span className="hover:text-primary cursor-pointer">English</span>
          </div>
        </div>
      </footer>
      </ScrollReveal>
    </div>
  );
}
