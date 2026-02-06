'use client';

import { SpiralAnimation } from '@/components/portal/spiral-animation';

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      {/* Spiral Animation */}
      <SpiralAnimation />

      {/* Content revealed after curtain opens */}
      <div className="text-center">
        <h1 className="text-phosphorescent text-2xl md:text-4xl mb-8 animate-pulse">
          VORTEX PORTAL
        </h1>
        <p className="text-phosphorescent text-xs md:text-sm opacity-70">
          Iniciando experiencia...
        </p>
      </div>
    </main>
  );
}
