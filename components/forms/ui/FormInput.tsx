'use client';

import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  hint?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  icon,
  hint,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);

  return (
    <div className="space-y-1.5 text-right w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-on-surface-variant">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <div className="absolute right-3.5 pointer-events-none text-outline">
            {icon}
          </div>
        )}

        <input
          id={inputId}
          className={`block w-full py-2.5 bg-surface-container-lowest border rounded-xl transition-all text-on-surface text-sm outline-none placeholder:text-outline-variant/60 ${
            icon ? 'pr-10 pl-3.5' : 'px-3.5'
          } ${
            error
              ? 'border-error focus:ring-2 focus:ring-error/20'
              : 'border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/20'
          } ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-error font-medium mt-1">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-on-surface-variant/70 mt-1">{hint}</p>
      ) : null}
    </div>
  );
};
