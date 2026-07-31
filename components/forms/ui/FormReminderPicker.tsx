'use client';

import React from 'react';
import { Bell, Clock } from 'lucide-react';

export type ReminderOption = 'none' | '10_mins' | '1_hour' | '1_day' | 'custom';

interface FormReminderPickerProps {
  value: ReminderOption;
  onChange: (value: ReminderOption) => void;
  label?: string;
}

const options: { value: ReminderOption; label: string }[] = [
  { value: 'none', label: 'بدون تذكير' },
  { value: '10_mins', label: 'قبل 10 دقائق' },
  { value: '1_hour', label: 'قبل ساعة' },
  { value: '1_day', label: 'قبل يوم' },
];

export const FormReminderPicker: React.FC<FormReminderPickerProps> = ({
  value,
  onChange,
  label = 'التذكير (Reminder)',
}) => {
  return (
    <div className="space-y-1.5 text-right w-full">
      {label && (
        <label className="block text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-primary" />
          <span>{label}</span>
        </label>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-primary/10 border-primary text-primary font-bold shadow-subtle'
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
