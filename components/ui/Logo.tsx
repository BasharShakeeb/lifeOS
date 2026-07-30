import React from 'react';
import Image from 'next/image';

interface LogoProps {
  /** 'full' shows the full logo; 'icon' shows the icon only */
  variant?: 'full' | 'icon';
  /** Width in pixels (height scales proportionally) */
  size?: number;
  className?: string;
}

const LOGO_SOURCES = {
  full: '/images/logo/lifeos-logo.png',
  icon: '/images/logo/lifeos-icon.png',
} as const;

/** Default sizes matching the design spec */
const DEFAULT_SIZES = {
  full: 130,
  icon: 40,
} as const;

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size,
  className = '',
}) => {
  const src = LOGO_SOURCES[variant];
  const width = size ?? DEFAULT_SIZES[variant];

  return (
    <Image
      src={src}
      alt="LifeOS logo"
      width={width}
      height={width}
      className={`object-contain ${className}`}
      priority
    />
  );
};
