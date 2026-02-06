# AGENTS.md - Developer Guide for Vortex Portal

## Project Overview

**Vortex Portal** is an artistic web experience designed as a museum-style exhibition featuring:
- Opening portal animation with spiral particle effect
- Interactive pixel-art planets (clickable for information)
- Retro aesthetic: black background, phosphorescent green, pixelated fonts

**Tech Stack:**
- Next.js 16+ (App Router)
- TypeScript (strict mode)
- Framer Motion (animations)
- Tailwind CSS 4 (with `@theme` directive)

## Development Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build (always run before committing)
npm run start        # Run production server
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run type-check   # TypeScript compiler check
```

**Note:** No test framework configured yet. Tests should be added in future iterations.

## Code Style Guidelines

### Import Organization

Organize imports in this order:
```typescript
// 1. React/Next.js → 2. External libs → 3. Internal components → 4. Types → 5. Styles
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlanetCard } from '@/components/planet-card';
import type { Planet } from '@/types/planet';
import styles from './page.module.css';
```

### TypeScript Standards

**Strict mode enabled** - follow these rules:
- Never use `any` (use `unknown` if type is truly unknown)
- Define interfaces for all props, data structures, API responses
- Use type-only imports: `import type { Metadata } from 'next'`
- Leverage type inference when obvious, explicit types when beneficial

**Example component props:**
```typescript
interface PlanetCardProps {
  name: string;
  description: string;
  imageUrl: string;
  onClick: () => void;
}

export function PlanetCard({ name, description, imageUrl, onClick }: PlanetCardProps) {
  // component logic
}
```

### Component Structure

**Directory organization:**
```
app/              # Next.js routes (page.tsx, layout.tsx)
components/
  ├── ui/         # Reusable UI components (buttons, modals)
  ├── planets/    # Planet-specific components
  ├── portal/     # Portal animation components
  └── layout/     # Layout components (header, footer)
lib/              # Utilities and helpers
types/            # TypeScript type definitions
public/           # Static assets (images, fonts)
```

**Functional component pattern:**
```typescript
'use client'; // Only when using hooks/browser APIs

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ComponentProps {
  // props
}

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState();
  
  // 2. Event handlers
  const handleClick = () => { /* logic */ };
  
  // 3. Render
  return <motion.div>{/* JSX */}</motion.div>;
}
```

### File Naming Conventions

- **Components:** `planet-card.tsx`, `spiral-animation.tsx` (kebab-case)
- **Routes:** `page.tsx`, `layout.tsx` (Next.js convention)
- **Utilities:** `format-date.ts`, `api-client.ts` (kebab-case)
- **Types:** `planet.ts`, `animation.ts` (kebab-case in `/types`)
- **Exports:** PascalCase for component names, camelCase for functions

### Formatting

- **Indentation:** 2 spaces
- **Quotes:** Single quotes (strings), double quotes (JSX attributes)
- **Semicolons:** Required
- **Line length:** Max 100 characters
- **Trailing commas:** Yes (multi-line arrays/objects)

### Error Handling

**Client-side error pattern:**
```typescript
try {
  const data = await fetchPlanetData(id);
  setPlanet(data);
} catch (error) {
  console.error('Failed to fetch planet:', error);
  setError('Unable to load planet information');
}
```

Next.js provides automatic error boundaries via `app/error.tsx` - use when needed.

### Next.js Specific Guidelines

**Server vs Client Components:**
- Default to Server Components (no `'use client'` directive)
- Use `'use client'` only for: hooks, event handlers, browser APIs
- Keep client components small and focused

**Metadata (SEO):**
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vortex Portal',
  description: 'An artistic journey through space',
};
```

**Image optimization:**
- Use `next/image` for all images
- Set `priority` for above-fold images (portal animation)
- Specify `width` and `height` to prevent layout shift

### Tailwind CSS 4 Guidelines

**Custom theme (app/globals.css):**
```css
@theme {
  --color-phosphorescent: #00ff00;
  --color-phosphorescent-alt: #39ff14;
  --font-family-retro: "Press Start 2P", monospace;
  --font-family-pixel: "VT323", monospace;
}
```

Use Tailwind utilities in components: `className="text-phosphorescent bg-black"`

**Note:** Tailwind CSS 4 uses `@theme` directive instead of `tailwind.config.js`

### Framer Motion Guidelines

**Performance best practices:**
- Animate `transform` and `opacity` only (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `willChange: 'transform, opacity'` for complex animations
- Memoize animation variants with `useMemo`

**Animation example:**
```typescript
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 1.5, ease: 'easeOut' }}
>
  {/* content */}
</motion.div>
```

**Accessibility:** Always respect `prefers-reduced-motion`:
```typescript
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  setShouldAnimate(!mediaQuery.matches);
}, []);
```

### Retro Aesthetic Requirements

**Colors:**
- Background: Pure black `#000000`
- Primary: Phosphorescent green `#00FF00` or `#39FF14`
- Use high contrast for readability

**Typography:**
- Primary font: 'Press Start 2P' (headings, UI)
- Secondary font: 'VT323' (body text)
- All text should be monospace/pixel style

**Graphics:**
- All images must be pixel-art style
- Preserve sharp edges: `image-rendering: pixelated`
- No anti-aliasing on pixel art assets
- Optional: Add CRT scanline effects, screen glow

**CSS for pixel-perfect rendering:**
```css
* {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
```

## Project-Specific Guidelines

1. **Portal animation:** Must play on page load (~3 seconds), skip if `prefers-reduced-motion`
2. **Planet interactions:** Hover effects (scale 1.1), tap effects (scale 0.95)
3. **Modal windows:** Display planet info in retro green-bordered panels
4. **Responsive design:** Touch-friendly on mobile, maintains aesthetic on all screens
5. **Performance:** Lazy load planet data/images where possible

## Best Practices

- **Commits:** Clear, descriptive messages (e.g., "Add spiral portal animation")
- **Before committing:** Run `npm run build` and `npm run type-check`
- **Component reusability:** Extract common patterns into shared components
- **Documentation:** Add JSDoc comments for complex functions/utilities
- **Testing:** Manual cross-browser testing (Chrome, Firefox, Safari)
- **Accessibility:** Keyboard navigation, screen reader support, reduced motion

## Resources

- [Next.js Docs](https://nextjs.org/docs) - App Router, Image optimization
- [Framer Motion](https://www.framer.com/motion/) - Animation API
- [Tailwind CSS 4](https://tailwindcss.com/docs) - New `@theme` directive
