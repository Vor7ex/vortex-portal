'use client';

import { Button } from '@/components/ui/button';

export interface CreatePlanetButtonProps {
  onClick: () => void;
}

/**
 * Floating button to create a new planet
 * Positioned at top-left, appears after SpiralAnimation completes
 */
export function CreatePlanetButton({ onClick }: CreatePlanetButtonProps) {
  return (
    <div className="fixed top-4 left-4 z-40">
      <Button
        variant="primary"
        onClick={onClick}
        className="text-[8px] md:text-xs shadow-[0_0_30px_rgba(0,255,0,0.6)]"
        aria-label="Crear nuevo planeta"
      >
        Nuevo Planeta
      </Button>
    </div>
  );
}
