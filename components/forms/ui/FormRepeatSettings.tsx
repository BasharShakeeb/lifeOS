'use client';

import React from 'react';
import { Repeat } from 'lucide-react';

export type RepeatInterval = 'none' | 'daily' | 'weekly' | 'monthly';

interface FormRepeatSettingsProps {
  value: RepeatInterval;
  onChange: (value: RepeatInterval) => void;
  label?: string;
}

const repeatOptions: { value: RepeatInterval; label: string }[] = [
  { value: 'none', label: 'بدون تكرار' },
  { value: 'daily', label: 'يومياً' },
  { value: 'weekly', label: 'أسبوعياً' },
  { value: 'monthly', label: 'شهرياً' },
];

export const FormRepeatSettings: React.FC<FormRepeatSettingsProps> = ({
  value,
  onChange,
  label = 'التكرار (Recurrence)',
}) => {
  return (
    <div className="space-y-1.5 text-right w-full">
      {label && (
        <label className="block text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
          <Repeat className="w-3.5 h-3.5 text-primary" />
          <span>{label}</span>
        </label>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {repeatOptions.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-purple-500/10 border-purple-500/40 text-purple-700 dark:text-purple-300 font-bold shadow-subtle'
                  : 'bg-surface-container-lowest border-outline-variant/40 text-on-surface-variant hover:border-outline-variant'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
