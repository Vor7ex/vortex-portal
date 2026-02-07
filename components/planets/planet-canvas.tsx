'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import debounce from 'lodash.debounce';
import type { Planet } from '@/types/planet';
import { loadPlanets, loadViewport, saveViewport, calculateBounds } from '@/lib/planet-storage';
import { PlanetItem } from './planet-item';

export interface PlanetCanvasProps {
  onPlanetClick: (planet: Planet) => void;
  onRefresh?: () => void;
}

/**
 * Navigable canvas that displays all planets with drag navigation
 */
export function PlanetCanvas({ onPlanetClick, onRefresh }: PlanetCanvasProps) {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [viewport, setViewport] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [clickStart, setClickStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Load planets and viewport from localStorage
  useEffect(() => {
    const loadedPlanets = loadPlanets();
    const loadedViewport = loadViewport();
    
    setPlanets(loadedPlanets);
    setViewport(loadedViewport);
  }, []);

  // Listen for storage events (sync between tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'vortex-planets') {
        setPlanets(loadPlanets());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Calculate bounds based on planets
  const bounds = useMemo(() => calculateBounds(planets), [planets]);

  // Debounced viewport save
  const debouncedSaveViewport = useMemo(
    () => debounce((vp: { x: number; y: number }) => saveViewport(vp), 500),
    []
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSaveViewport.cancel();
    };
  }, [debouncedSaveViewport]);

  // Clamp viewport to bounds
  const clampViewport = useCallback((vp: { x: number; y: number }) => {
    if (!canvasRef.current) return vp;

    const canvasWidth = canvasRef.current.clientWidth;
    const canvasHeight = canvasRef.current.clientHeight;

    return {
      x: Math.max(
        Math.min(vp.x, -bounds.minX),
        -bounds.maxX + canvasWidth
      ),
      y: Math.max(
        Math.min(vp.y, -bounds.minY),
        -bounds.maxY + canvasHeight
      ),
    };
  }, [bounds]);

  // Mouse drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click

    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setClickStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    const newViewport = clampViewport({
      x: viewport.x + dx,
      y: viewport.y + dy,
    });

    setViewport(newViewport);
    setDragStart({ x: e.clientX, y: e.clientY });
    debouncedSaveViewport(newViewport);
  }, [isDragging, dragStart, viewport, clampViewport, debouncedSaveViewport]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;

    setIsDragging(false);

    // Check if this was a click (distance < 5px) or a drag
    const dx = e.clientX - clickStart.x;
    const dy = e.clientY - clickStart.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If distance is small, it was a click (not a drag)
    // In this case, we don't do anything because clicks on planets are handled by PlanetItem
  }, [isDragging, clickStart]);

  // Touch drag handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;

    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setClickStart({ x: touch.clientX, y: touch.clientY });
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;

    // Prevent body scroll
    e.preventDefault();

    const touch = e.touches[0];
    const dx = touch.clientX - dragStart.x;
    const dy = touch.clientY - dragStart.y;

    const newViewport = clampViewport({
      x: viewport.x + dx,
      y: viewport.y + dy,
    });

    setViewport(newViewport);
    setDragStart({ x: touch.clientX, y: touch.clientY });
    debouncedSaveViewport(newViewport);
  }, [isDragging, dragStart, viewport, clampViewport, debouncedSaveViewport]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;

    setIsDragging(false);

    // Check if this was a tap (distance < 5px) or a drag
    const touch = e.changedTouches[0];
    const dx = touch.clientX - clickStart.x;
    const dy = touch.clientY - clickStart.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If distance is small, it was a tap (not a drag)
    // Clicks on planets are handled by PlanetItem
  }, [isDragging, clickStart]);

  // Prevent context menu on right click
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      ref={canvasRef}
      className="w-full h-screen overflow-hidden bg-black select-none"
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none', // Prevent default touch behaviors
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Stop dragging if mouse leaves canvas
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
    >
      {/* Empty state */}
      {planets.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-phosphorescent font-pixel text-xl opacity-50">
            No hay nada aquí
          </p>
        </div>
      )}

      {/* Render all planets */}
      {planets.map((planet) => (
        <PlanetItem
          key={planet.id}
          planet={planet}
          viewport={viewport}
          onClick={onPlanetClick}
        />
      ))}
    </div>
  );
}
