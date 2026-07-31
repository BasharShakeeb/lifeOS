'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  color?: string;
  icon?: React.ReactNode;
}

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon?: React.ReactNode;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);

  return (
    <div className="space-y-1.5 text-right w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-on-surface-variant">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <div className="absolute right-3.5 pointer-events-none text-outline">
            {icon}
          </div>
        )}

        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`block w-full py-2.5 bg-surface-container-lowest border rounded-xl transition-all text-on-surface text-sm outline-none appearance-none cursor-pointer ${
            icon ? 'pr-10 pl-9' : 'pr-3.5 pl-9'
          } ${
            error
              ? 'border-error focus:ring-2 focus:ring-error/20'
              : 'border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/20'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute left-3 pointer-events-none text-outline-variant">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error && <p className="text-xs text-error font-medium mt-1">{error}</p>}
    </div>
  );
};
