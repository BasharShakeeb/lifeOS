'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error caught by ErrorBoundary:', error, { errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-surface border border-border-subtle rounded-card text-center my-6">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-semibold text-on-surface">Something went wrong</h3>
          <p className="text-sm text-text-muted mt-1 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred while rendering this module.'}
          </p>

          <button
            onClick={this.handleReset}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-button bg-primary text-on-primary font-medium text-sm hover:bg-primary-inverse transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
