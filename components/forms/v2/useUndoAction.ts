'use client';

import { useToast } from '@/providers/ToastProvider';
import { useCallback } from 'react';

export function useUndoAction() {
  const { toast } = useToast();

  const triggerUndoableAction = useCallback(
    ({
      successMessage,
      onUndo,
    }: {
      successMessage: string;
      onUndo: () => void;
    }) => {
      // Show success toast with Undo trigger notification
      toast(`${successMessage} (يمكنك التراجع من زر التراجع)`, 'success');
    },
    [toast]
  );

  return { triggerUndoableAction };
}
