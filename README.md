# Vortex Portal

An artistic web experience designed as a museum-style exhibition featuring a mesmerizing portal animation and interactive pixel-art planets. Built with a retro aesthetic inspired by classic phosphorescent green CRT displays.

**Vortex Portal** es una experiencia web artística tipo museo de exhibición, con una animación de portal hipnótica y planetas interactivos en pixel-art. Construido con una estética retro inspirada en las clásicas pantallas CRT verde fosforescente.

![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue?style=flat-square&logo=typescript)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12+-ff69b4?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4+-38bdf8?style=flat-square&logo=tailwind-css)

## Features

- 🌀 **Spiral Portal Animation** - Opening animation with particle effects on page load
- 🪐 **Interactive Planets** - Pixel-art planets with hover effects and information modals
- 🎨 **Retro Aesthetic** - Black background, phosphorescent green colors, pixelated fonts
- ⚡ **Performance Optimized** - GPU-accelerated animations, respects `prefers-reduced-motion`
- 📱 **Responsive Design** - Touch-friendly interactions across all screen sizes
- ♿ **Accessible** - Keyboard navigation, screen reader support, reduced motion support

## Tech Stack

- **[Next.js 16+](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript (strict mode)
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready animation library
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS with `@theme` directive

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/vortex-portal.git
cd vortex-portal

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portal in your browser.

## Development

### Available Commands

```bash
npm run dev          # Start development server with hot reload
npm run build        # Create optimized production build
npm run start        # Run production server
npm run lint         # Run ESLint to check code quality
npm run lint:fix     # Auto-fix ESLint issues
npm run type-check   # Run TypeScript compiler check
```

### Development Workflow

1. **Make changes** - Edit files in `app/`, `components/`, or other directories
2. **Test locally** - Changes auto-reload at http://localhost:3000
3. **Type check** - Run `npm run type-check` to catch TypeScript errors
4. **Build test** - Run `npm run build` before committing (catches build-time errors)
5. **Commit** - Use clear commit messages (e.g., "Add planet hover effects")

## Project Structure

```
vortex-portal/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page with portal animation
│   ├── layout.tsx         # Root layout with metadata
│   └── globals.css        # Global styles + Tailwind theme
├── components/
│   └── portal/
│       └── spiral-animation.tsx  # Portal animation component
├── public/                # Static assets (images, fonts)
├── types/                 # TypeScript type definitions
└── lib/                   # Utility functions and helpers
```

## Contributing

Contributions are welcome! Please read [AGENTS.md](./AGENTS.md) for detailed code style guidelines, TypeScript standards, and project-specific requirements.

### Code Style Highlights

- **TypeScript strict mode** - No `any` types, explicit interfaces for all props
- **File naming** - kebab-case for components (`spiral-animation.tsx`)
- **Component structure** - Functional components with hooks, event handlers, then render
- **Formatting** - 2 spaces, single quotes, semicolons required
- **Imports** - Ordered: React/Next → external libs → internal components → types → styles

See [AGENTS.md](./AGENTS.md) for complete guidelines.

## Aesthetic Guidelines

### Colors
- Background: Pure black `#000000`
- Primary: Phosphorescent green `#00FF00` / `#39FF14`

### Typography
- Headings/UI: **Press Start 2P** (retro pixel font)
- Body text: **VT323** (monospace pixel font)

### Graphics
- All images must be pixel-art style
- CSS enforces pixel-perfect rendering (`image-rendering: pixelated`)
- Optional CRT scanline effects for authenticity

## License

[MIT License](./LICENSE) - feel free to use this project for learning and inspiration.

---

Made with 💚 and retro vibes
