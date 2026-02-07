'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import type { Planet } from '@/types/planet';

export interface PlanetItemProps {
  planet: Planet;
  viewport: { x: number; y: number };
  onClick: (planet: Planet) => void;
}

/**
 * Individual planet component with hover effects and click handling
 */
function PlanetItemComponent({ planet, viewport, onClick }: PlanetItemProps) {
  const handleClick = () => {
    onClick(planet);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(planet);
    }
  };

  return (
    <motion.div
      className="absolute cursor-pointer select-none"
      style={{
        left: planet.position.x + viewport.x,
        top: planet.position.y + viewport.y,
        width: planet.size,
        height: planet.size,
        willChange: 'transform, opacity',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
      whileHover={{
        scale: 1.1,
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Planeta ${planet.name}`}
    >
      {/* Planet image container */}
      <div
        className="relative w-full h-full rounded-full overflow-hidden border-2 border-phosphorescent transition-shadow duration-200 hover:shadow-[0_0_40px_rgba(0,255,0,0.8)] shadow-[0_0_30px_rgba(0,255,0,0.4)]"
        style={{
          imageRendering: 'pixelated',
        }}
      >
        <img
          src={planet.imageUrl}
          alt={planet.name}
          className="w-full h-full object-cover"
          draggable={false}
          style={{
            imageRendering: 'pixelated',
          }}
        />
      </div>

      {/* Tooltip on hover */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        <div className="bg-black border-2 border-phosphorescent px-2 py-1 text-phosphorescent font-pixel text-sm shadow-[0_0_20px_rgba(0,255,0,0.6)]">
          {planet.name}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Memoized planet item to prevent unnecessary re-renders
 */
export const PlanetItem = memo(PlanetItemComponent, (prevProps, nextProps) => {
  return (
    prevProps.planet.id === nextProps.planet.id &&
    prevProps.planet.position.x === nextProps.planet.position.x &&
    prevProps.planet.position.y === nextProps.planet.position.y &&
    prevProps.planet.size === nextProps.planet.size &&
    prevProps.planet.imageUrl === nextProps.planet.imageUrl &&
    prevProps.planet.name === nextProps.planet.name &&
    prevProps.viewport.x === nextProps.viewport.x &&
    prevProps.viewport.y === nextProps.viewport.y
  );
});

PlanetItem.displayName = 'PlanetItem';
