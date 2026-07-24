import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/providers/AppProviders';

export const metadata: Metadata = {
  title: 'LifeOS | منصة إدارة الإنتاجية الشخصية',
  description: 'نظام تشغيل شخصي متكامل لإدارة المهام، المحاور، المشاريع، العادات، الأهداف، والتكليفات.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="light">
      <body className="bg-background text-on-surface font-sans antialiased min-h-screen">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
