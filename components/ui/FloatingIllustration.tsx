'use client';

import React, { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface FloatingIllustrationProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const FloatingIllustration: React.FC<FloatingIllustrationProps> = ({
  src,
  alt,
  width,
  height,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, scale: 1 });
  const [glow, setGlow] = useState({ x: 50, y: 50, visible: false });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    // Only apply on pointer devices (desktop)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / rect.height; // 0 to 1

    const maxTilt = 8;
    const rotateY = (x - 0.5) * maxTilt * 2; // -8 to 8
    const rotateX = (0.5 - y) * maxTilt * 2; // -8 to 8

    setTilt({ rotateX, rotateY, scale: 1.03 });
    setGlow({ x: x * 100, y: y * 100, visible: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
    setGlow((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="relative"
    >
      {/* Mouse-following glow */}
      <div
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          background: `radial-gradient(circle 220px at ${glow.x}% ${glow.y}%, rgba(0, 108, 73, 0.12), transparent 70%)`,
          opacity: glow.visible ? 1 : 0,
          transition: 'opacity 0.4s ease-out, background 0.15s ease-out',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-[1]"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
          transition: 'transform 0.3s ease-out',
          willChange: 'transform',
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto max-w-full object-contain"
          priority
        />
      </div>
    </motion.div>
  );
};
