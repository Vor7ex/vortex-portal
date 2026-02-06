'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

// Animation configuration
const PARTICLE_COUNT = 50;
const SPIRAL_ROTATIONS = 3;
const PARTICLE_SIZE = 10; // pixels
const DURATION = 3; // seconds
const STAGGER_DELAY = 0.015; // 150ms between particles

interface SpiralPoint {
  x: number;
  y: number;
  delay: number;
  index: number;
}

/**
 * Calculate position along logarithmic spiral
 * Formula: r = a + b*θ (where θ is angle in radians)
 */
function calculateSpiralPoint(index: number, total: number): SpiralPoint {
  const progress = index / total;
  const theta = progress * (Math.PI * 2 * SPIRAL_ROTATIONS);
  
  // Logarithmic spiral: radius grows with angle
  const minRadius = 100; // Start near center
  const maxRadius = 1000; // End far from center (off screen)
  const radius = minRadius + progress * maxRadius;
  
  return {
    x: radius * Math.cos(theta),
    y: radius * Math.sin(theta),
    delay: index * STAGGER_DELAY,
    index
  };
}

export function SpiralAnimation() {
  const [isComplete, setIsComplete] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldAnimate(!mediaQuery.matches);
    
    // If user prefers reduced motion, skip animation immediately
    if (mediaQuery.matches) {
      setIsComplete(true);
    }
  }, []);

  // Generate all spiral points (memoized for performance)
  const spiralPoints = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => 
      calculateSpiralPoint(i, PARTICLE_COUNT)
    );
  }, []);

  // Don't render if animation is complete or user prefers reduced motion
  if (isComplete || !shouldAnimate) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {/* CRT Scanlines Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px)',
          zIndex: 2
        }}
      />

      {/* Particle Container - centered on screen */}
      <div className="absolute inset-0 flex items-center justify-center">
        {spiralPoints.map((point) => (
          <motion.div
            key={point.index}
            className="absolute"
            style={{
              width: PARTICLE_SIZE,
              height: PARTICLE_SIZE,
              backgroundColor: '#00ff00',
              boxShadow: '0 0 12px rgba(0, 255, 0, 0.6)',
              willChange: 'transform, opacity',
            }}
            initial={{ 
              x: 0, 
              y: 0, 
              opacity: 0, 
              scale: 0 
            }}
            animate={{
              x: point.x,
              y: point.y,
              opacity: [0, 1, 1, 0],
              scale: [0, 2, 1, 0.8]
            }}
            transition={{
              duration: DURATION,
              opacity: { 
                duration: DURATION,
                times: [0, 0.1, 0.9, 1],
              },
              scale: { 
                times: [0, 0.1, 0.9, 1],
                ease: [0.34, 1.56, 0.64, 1] // Cubic bezier for bounce effect
              }
            }}
            onAnimationComplete={() => {
              // Mark complete when last particle finishes
              if (point.index === PARTICLE_COUNT - 1) {
                setTimeout(() => setIsComplete(true), 100);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
