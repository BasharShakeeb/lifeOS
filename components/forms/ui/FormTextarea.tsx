'use client';

import React from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  error,
  hint,
  className = '',
  id,
  rows = 3,
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

      <textarea
        id={inputId}
        rows={rows}
        className={`block w-full px-3.5 py-2.5 bg-surface-container-lowest border rounded-xl transition-all text-on-surface text-sm outline-none placeholder:text-outline-variant/60 resize-y min-h-[72px] ${
          error
            ? 'border-error focus:ring-2 focus:ring-error/20'
            : 'border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/20'
        } ${className}`}
        {...props}
      />

      {error ? (
        <p className="text-xs text-error font-medium mt-1">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-on-surface-variant/70 mt-1">{hint}</p>
      ) : null}
    </div>
  );
};
