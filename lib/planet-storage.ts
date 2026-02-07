import type { Planet, CanvasState } from '@/types/planet';
import { isPlanet, PLANET_CONSTRAINTS } from '@/types/planet';

const PLANETS_KEY = 'vortex-planets';
const VIEWPORT_KEY = 'vortex-viewport';

/**
 * Load all planets from localStorage
 */
export function loadPlanets(): Planet[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(PLANETS_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    
    // Validate each planet
    return parsed.filter(isPlanet);
  } catch (error) {
    console.error('Error loading planets from localStorage:', error);
    return [];
  }
}

/**
 * Save planets array to localStorage
 */
export function savePlanets(planets: Planet[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(PLANETS_KEY, JSON.stringify(planets));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new Error('El almacenamiento está lleno. Por favor elimina algunos planetas.');
    }
    throw error;
  }
}

/**
 * Add a new planet to the collection
 */
export function addPlanet(
  planetData: Omit<Planet, 'id' | 'createdAt' | 'updatedAt'>
): Planet {
  const planets = loadPlanets();
  
  const newPlanet: Planet = {
    ...planetData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  planets.push(newPlanet);
  savePlanets(planets);
  
  return newPlanet;
}

/**
 * Update an existing planet
 */
export function updatePlanet(
  id: string,
  updates: Partial<Omit<Planet, 'id' | 'createdAt'>>
): void {
  const planets = loadPlanets();
  const index = planets.findIndex((p) => p.id === id);
  
  if (index === -1) {
    throw new Error(`Planet with id ${id} not found`);
  }
  
  planets[index] = {
    ...planets[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  savePlanets(planets);
}

/**
 * Delete a planet by id
 */
export function deletePlanet(id: string): void {
  const planets = loadPlanets();
  const filtered = planets.filter((p) => p.id !== id);
  
  if (filtered.length === planets.length) {
    throw new Error(`Planet with id ${id} not found`);
  }
  
  savePlanets(filtered);
}

/**
 * Load viewport state from localStorage
 */
export function loadViewport(): { x: number; y: number } {
  if (typeof window === 'undefined') {
    return { x: 0, y: 0 };
  }
  
  try {
    const stored = localStorage.getItem(VIEWPORT_KEY);
    if (!stored) return { x: 0, y: 0 };
    
    const parsed = JSON.parse(stored) as CanvasState;
    return {
      x: parsed.viewport.x || 0,
      y: parsed.viewport.y || 0,
    };
  } catch (error) {
    console.error('Error loading viewport from localStorage:', error);
    return { x: 0, y: 0 };
  }
}

/**
 * Save viewport state to localStorage
 */
export function saveViewport(viewport: { x: number; y: number }): void {
  if (typeof window === 'undefined') return;
  
  try {
    const canvasState: CanvasState = {
      viewport: {
        x: viewport.x,
        y: viewport.y,
        scale: 1, // Future feature
      },
    };
    localStorage.setItem(VIEWPORT_KEY, JSON.stringify(canvasState));
  } catch (error) {
    console.error('Error saving viewport to localStorage:', error);
  }
}

/**
 * Convert File to base64 data URL
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Generate a random UUID v4
 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Calculate bounds of all planets for canvas limits
 */
export function calculateBounds(planets: Planet[]): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  if (planets.length === 0) {
    return {
      minX: -PLANET_CONSTRAINTS.CANVAS_MARGIN,
      maxX: PLANET_CONSTRAINTS.CANVAS_MARGIN,
      minY: -PLANET_CONSTRAINTS.CANVAS_MARGIN,
      maxY: PLANET_CONSTRAINTS.CANVAS_MARGIN,
    };
  }
  
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  
  planets.forEach((planet) => {
    const halfSize = planet.size / 2;
    minX = Math.min(minX, planet.position.x - halfSize);
    maxX = Math.max(maxX, planet.position.x + halfSize);
    minY = Math.min(minY, planet.position.y - halfSize);
    maxY = Math.max(maxY, planet.position.y + halfSize);
  });
  
  // Add margin
  return {
    minX: minX - PLANET_CONSTRAINTS.CANVAS_MARGIN,
    maxX: maxX + PLANET_CONSTRAINTS.CANVAS_MARGIN,
    minY: minY - PLANET_CONSTRAINTS.CANVAS_MARGIN,
    maxY: maxY + PLANET_CONSTRAINTS.CANVAS_MARGIN,
  };
}

/**
 * Generate random position near viewport center
 */
export function generateRandomPosition(
  viewportCenter: { x: number; y: number },
  existingPlanets: Planet[] = []
): { x: number; y: number } {
  const maxAttempts = 10;
  const minDistance = 200; // Minimum distance from other planets
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const position = {
      x: viewportCenter.x + (Math.random() - 0.5) * 400,
      y: viewportCenter.y + (Math.random() - 0.5) * 400,
    };
    
    // Check if position is far enough from existing planets
    const tooClose = existingPlanets.some((planet) => {
      const dx = planet.position.x - position.x;
      const dy = planet.position.y - position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < minDistance;
    });
    
    if (!tooClose) {
      return position;
    }
  }
  
  // If all attempts fail, just return a random position
  return {
    x: viewportCenter.x + (Math.random() - 0.5) * 400,
    y: viewportCenter.y + (Math.random() - 0.5) * 400,
  };
}

/**
 * Clear all planets (useful for testing)
 */
export function clearAllPlanets(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PLANETS_KEY);
}

/**
 * Clear viewport state (useful for testing)
 */
export function clearViewport(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(VIEWPORT_KEY);
}
