import React from 'react';
import { TableSkeleton, StatCardSkeleton } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-24 bg-surface border border-border-subtle rounded-card w-full" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      <TableSkeleton rows={6} />
    </div>
  );
}
