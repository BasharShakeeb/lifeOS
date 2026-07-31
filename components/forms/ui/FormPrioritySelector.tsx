'use client';

import React from 'react';
import { Flag } from 'lucide-react';
import { Priority } from '@/types';

interface FormPrioritySelectorProps {
  value: Priority;
  onChange: (priority: Priority) => void;
  label?: string;
}

const priorities: { value: Priority; label: string; color: string; bg: string; border: string }[] = [
  { value: 'low', label: 'منخفضة', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 hover:bg-emerald-500/20', border: 'border-emerald-500/30' },
  { value: 'medium', label: 'متوسطة', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10 hover:bg-amber-500/20', border: 'border-amber-500/30' },
  { value: 'high', label: 'عالية', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10 hover:bg-orange-500/20', border: 'border-orange-500/30' },
  { value: 'urgent', label: 'عاجلة', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10 hover:bg-rose-500/20', border: 'border-rose-500/30' },
];

export const FormPrioritySelector: React.FC<FormPrioritySelectorProps> = ({
  value,
  onChange,
  label = 'الأولوية',
}) => {
  return (
    <div className="space-y-1.5 text-right w-full">
      {label && <label className="block text-xs font-semibold text-on-surface-variant">{label}</label>}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {priorities.map((item) => {
          const isSelected = value === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all duration-150 ${
                isSelected
                  ? `${item.bg} ${item.border} ${item.color} ring-2 ring-primary/30 shadow-subtle scale-[1.02]`
                  : 'bg-surface-container-lowest border-outline-variant/40 text-on-surface-variant hover:border-outline-variant'
              }`}
            >
              <Flag className={`w-3.5 h-3.5 ${item.color}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
