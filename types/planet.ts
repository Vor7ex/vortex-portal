/**
 * Planet data structure
 */
export interface Planet {
  id: string;                    // UUID v4
  name: string;                  // Max 50 characters
  description: string;           // Max 500 characters
  imageUrl: string;              // Data URL (base64) or external URL
  position: {
    x: number;                   // X coordinate in canvas
    y: number;                   // Y coordinate in canvas
  };
  size: number;                  // Planet size in pixels (80-200)
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}

/**
 * Canvas viewport state
 */
export interface CanvasState {
  viewport: {
    x: number;                   // Camera offset X
    y: number;                   // Camera offset Y
    scale: number;               // Zoom level (future feature)
  };
}

/**
 * Form data for creating a new planet
 */
export interface CreatePlanetForm {
  name: string;
  description: string;
  image: File | null;
}

/**
 * Validation constants
 */
export const PLANET_CONSTRAINTS = {
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 500,
  MIN_SIZE: 80,
  MAX_SIZE: 200,
  DEFAULT_SIZE: 120,
  MAX_IMAGE_SIZE_MB: 2,
  CANVAS_MARGIN: 500,           // Margin around planets for bounds
} as const;

/**
 * Validation helper for planet name
 */
export function validatePlanetName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'El nombre es requerido' };
  }
  if (name.length > PLANET_CONSTRAINTS.NAME_MAX_LENGTH) {
    return { valid: false, error: `El nombre no puede exceder ${PLANET_CONSTRAINTS.NAME_MAX_LENGTH} caracteres` };
  }
  return { valid: true };
}

/**
 * Validation helper for planet description
 */
export function validatePlanetDescription(description: string): { valid: boolean; error?: string } {
  if (!description || description.trim().length === 0) {
    return { valid: false, error: 'La descripción es requerida' };
  }
  if (description.length > PLANET_CONSTRAINTS.DESCRIPTION_MAX_LENGTH) {
    return { valid: false, error: `La descripción no puede exceder ${PLANET_CONSTRAINTS.DESCRIPTION_MAX_LENGTH} caracteres` };
  }
  return { valid: true };
}

/**
 * Validation helper for image file
 */
export function validatePlanetImage(file: File | null): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'La imagen es requerida' };
  }
  
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'El archivo debe ser una imagen' };
  }
  
  // Check file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > PLANET_CONSTRAINTS.MAX_IMAGE_SIZE_MB) {
    return { valid: false, error: `La imagen no puede exceder ${PLANET_CONSTRAINTS.MAX_IMAGE_SIZE_MB}MB` };
  }
  
  return { valid: true };
}

/**
 * Type guard to check if value is a Planet
 */
export function isPlanet(value: unknown): value is Planet {
  if (typeof value !== 'object' || value === null) return false;
  
  const planet = value as Record<string, unknown>;
  
  return (
    typeof planet.id === 'string' &&
    typeof planet.name === 'string' &&
    typeof planet.description === 'string' &&
    typeof planet.imageUrl === 'string' &&
    typeof planet.position === 'object' &&
    planet.position !== null &&
    typeof (planet.position as { x?: unknown }).x === 'number' &&
    typeof (planet.position as { y?: unknown }).y === 'number' &&
    typeof planet.size === 'number' &&
    typeof planet.createdAt === 'string' &&
    typeof planet.updatedAt === 'string'
  );
}
