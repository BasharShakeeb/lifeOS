'use client';

import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface FormDateTimePickerProps {
  dueDate: string;
  dueTime?: string;
  onDateChange: (date: string) => void;
  onTimeChange?: (time: string) => void;
  label?: string;
}

export const FormDateTimePicker: React.FC<FormDateTimePickerProps> = ({
  dueDate,
  dueTime = '',
  onDateChange,
  onTimeChange,
  label = 'تاريخ ووقت الاستحقاق',
}) => {
  const handleQuickShortcut = (daysToAdd: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    onDateChange(d.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-1.5 text-right w-full">
      {label && <label className="block text-xs font-semibold text-on-surface-variant">{label}</label>}

      {/* Quick Date Shortcuts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => handleQuickShortcut(0)}
          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30 transition-all flex-shrink-0"
        >
          اليوم
        </button>
        <button
          type="button"
          onClick={() => handleQuickShortcut(1)}
          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30 transition-all flex-shrink-0"
        >
          غداً
        </button>
        <button
          type="button"
          onClick={() => handleQuickShortcut(7)}
          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30 transition-all flex-shrink-0"
        >
          الأسبوع القادم
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Date Input */}
        <div className="relative flex items-center">
          <div className="absolute right-3.5 pointer-events-none text-outline">
            <Calendar className="w-4 h-4" />
          </div>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="block w-full pr-10 pl-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface text-xs outline-none cursor-pointer"
          />
        </div>

        {/* Time Input */}
        {onTimeChange && (
          <div className="relative flex items-center">
            <div className="absolute right-3.5 pointer-events-none text-outline">
              <Clock className="w-4 h-4" />
            </div>
            <input
              type="time"
              value={dueTime}
              onChange={(e) => onTimeChange(e.target.value)}
              className="block w-full pr-10 pl-3.5 py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface text-xs outline-none cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};
