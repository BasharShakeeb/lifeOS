import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>

      <h1 className="text-3xl font-extrabold text-on-surface">404 - Page Not Found</h1>
      <p className="text-sm font-mono text-text-muted mt-2 max-w-md">
        The route you are looking for does not exist in LifeOS.
      </p>

      <Link
        href="/dashboard"
        className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-button bg-primary text-on-primary font-bold text-sm hover:bg-primary-inverse shadow-glow transition-all active:scale-[0.98]"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
}
