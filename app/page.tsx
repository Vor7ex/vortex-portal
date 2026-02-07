'use client';

import { SpiralAnimation } from '@/components/portal/spiral-animation';
import { PlanetCanvas } from '@/components/planets/planet-canvas';
import { CreatePlanetButton } from '@/components/layout/create-planet-button';
import type { Planet } from '@/types/planet';

export default function Home() {
  // Placeholder handlers for Phase 3 modals
  const handlePlanetClick = (planet: Planet) => {
    console.log('Planet clicked:', planet.name);
    // TODO: Open planet detail modal in Phase 3
  };

  const handleCreatePlanet = () => {
    console.log('Create planet button clicked');
    // TODO: Open create planet modal in Phase 3
  };

  return (
    <main className="min-h-screen bg-black relative">
      {/* Spiral Animation - appears on top, fades to reveal content */}
      <SpiralAnimation />

      {/* Create Planet Button - behind spiral animation, appears after fade */}
      <CreatePlanetButton onClick={handleCreatePlanet} />

      {/* Planet Canvas - main content area */}
      <PlanetCanvas onPlanetClick={handlePlanetClick} />
    </main>
  );
}
