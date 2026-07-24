import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds an interactive hover treatment (lift + primary border). */
  interactive?: boolean;
  /** Renders the card without the default inner padding. */
  noPadding?: boolean;
  as?: 'div' | 'section' | 'article';
  children: React.ReactNode;
}

/**
 * Standardized surface card used across the entire application.
 * Guarantees a consistent border radius, padding, border, shadow and hover
 * effect so every card looks visually identical regardless of context.
 */
export const Card: React.FC<CardProps> = ({
  interactive = false,
  noPadding = false,
  as = 'div',
  className = '',
  children,
  ...rest
}) => {
  const Component = as as any;

  return (
    <Component
      className={[
        'bg-surface-container-lowest border border-outline-variant/40 rounded-card shadow-card',
        noPadding ? '' : 'p-6',
        interactive
          ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-level2 hover:border-primary-container/60'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </Component>
  );
};
