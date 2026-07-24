'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-8 bg-surface border border-border-subtle rounded-card text-center my-6 space-y-4">
      <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h3 className="text-lg font-bold text-on-surface">Dashboard Module Error</h3>
      <p className="text-sm text-text-muted max-w-md mx-auto">{error.message}</p>

      <button
        onClick={reset}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-primary text-on-primary font-bold text-sm hover:bg-primary-inverse shadow-glow transition-all"
      >
        <RefreshCw className="w-4 h-4" />
        Reload Module
      </button>
    </div>
  );
}
