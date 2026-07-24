'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Particle {
  size: number;
  color: string;
  x: string;
  y: string;
  duration: number;
  delay: number;
  floatY: number;
  floatX: number;
  blur: number;
  opacity: number;
}

const particles: Particle[] = [
  { size: 6, color: 'rgba(0,108,73,0.15)', x: '15%', y: '20%', duration: 12, delay: 0, floatY: 20, floatX: 8, blur: 3, opacity: 0.4 },
  { size: 8, color: 'rgba(14,165,233,0.12)', x: '80%', y: '15%', duration: 14, delay: 1.5, floatY: 25, floatX: 10, blur: 4, opacity: 0.35 },
  { size: 5, color: 'rgba(0,108,73,0.18)', x: '70%', y: '75%', duration: 10, delay: 0.8, floatY: 18, floatX: 6, blur: 2, opacity: 0.45 },
  { size: 10, color: 'rgba(14,165,233,0.1)', x: '25%', y: '80%', duration: 16, delay: 2, floatY: 30, floatX: 12, blur: 5, opacity: 0.3 },
  { size: 4, color: 'rgba(0,108,73,0.2)', x: '90%', y: '50%', duration: 11, delay: 3, floatY: 15, floatX: 5, blur: 2, opacity: 0.4 },
  { size: 7, color: 'rgba(14,165,233,0.14)', x: '5%', y: '55%', duration: 13, delay: 1, floatY: 22, floatX: 9, blur: 3, opacity: 0.35 },
  { size: 5, color: 'rgba(0,108,73,0.12)', x: '50%', y: '10%', duration: 15, delay: 2.5, floatY: 20, floatX: 7, blur: 4, opacity: 0.3 },
  { size: 9, color: 'rgba(14,165,233,0.1)', x: '40%', y: '90%', duration: 12, delay: 0.5, floatY: 28, floatX: 11, blur: 5, opacity: 0.25 },
];

export const HeroParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block" aria-hidden="true">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
            backgroundColor: p.color,
            filter: `blur(${p.blur}px)`,
            opacity: p.opacity,
          }}
          animate={{
            y: [-p.floatY, p.floatY, -p.floatY],
            x: [-p.floatX, p.floatX, -p.floatX],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
};
