'use client';

import { useEffect, useState, useCallback } from 'react';

const DRAFT_PREFIX = 'lifeos_form_draft_';

export function useFormDraft<T extends Record<string, any>>(
  schemaId: string,
  currentValues: T,
  resetForm: (values: Partial<T>) => void
) {
  const draftKey = `${DRAFT_PREFIX}${schemaId}`;
  const [hasDraft, setHasDraft] = useState(false);
  const [draftData, setDraftData] = useState<T | null>(null);

  // Check for saved draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setHasDraft(true);
          setDraftData(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to read form draft:', e);
    }
  }, [draftKey]);

  // Auto-save draft on values change
  useEffect(() => {
    if (!currentValues || Object.keys(currentValues).length === 0) return;

    const timer = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify(currentValues));
      } catch (e) {
        console.warn('Failed to save form draft:', e);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [currentValues, draftKey]);

  const restoreDraft = useCallback(() => {
    if (draftData) {
      resetForm(draftData);
      setHasDraft(false);
    }
  }, [draftData, resetForm]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(draftKey);
      setHasDraft(false);
      setDraftData(null);
    } catch (e) {
      console.warn('Failed to clear draft:', e);
    }
  }, [draftKey]);

  return { hasDraft, restoreDraft, clearDraft };
}
