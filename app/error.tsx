'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { logger } from '@/lib/logger';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Root error boundary caught exception:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-on-surface">Application Error</h1>
      <p className="text-sm text-text-muted mt-2 max-w-md leading-relaxed">
        {error.message || 'An unexpected runtime exception occurred.'}
      </p>

      <button
        onClick={reset}
        className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-button bg-primary text-on-primary font-bold text-sm hover:bg-primary-inverse shadow-glow transition-all active:scale-[0.98]"
      >
        <RefreshCw className="w-4 h-4" />
        Reset Application State
      </button>
    </div>
  );
}
