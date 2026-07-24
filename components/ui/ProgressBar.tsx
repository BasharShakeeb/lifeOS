import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  color?: 'primary' | 'sky' | 'emerald' | 'amber';
  height?: string;
  showPercentage?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = 'primary',
  height = 'h-2',
  showPercentage = false,
  className = '',
}) => {
  const normalizedValue = Math.min(100, Math.max(0, value));

  const colorStyles = {
    primary: 'bg-primary',
    sky: 'bg-sky-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-600',
  };

  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="flex justify-between items-center text-xs font-mono text-text-muted mb-1.5">
          <span>نسبة الإنجاز</span>
          <span className="font-semibold text-primary">{normalizedValue}%</span>
        </div>
      )}
      <div className={`w-full bg-surface-input rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ease-out ${colorStyles[color]}`}
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    </div>
  );
};
