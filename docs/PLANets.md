# 🌌 PLANets - Sistema de Creación de Planetas

## 📋 Resumen del Proyecto

Sistema interactivo para crear, editar y visualizar planetas en un canvas navegable tipo espacio infinito con estética retro pixel-art.

### Especificaciones Técnicas

- **Persistencia:** localStorage (solo navegador)
- **Canvas:** Navegable por drag (mouse/touch), límites dinámicos
- **Planetas:** Posicionables vía drag & drop, editables vía modal
- **Interacción:** Click en planeta → modal con info completa
- **Imágenes:** Sin restricciones de tamaño (ajustadas con CSS)
- **Navegación:** Drag libre, sin minimapa

---

## 🏗️ Arquitectura de Componentes

```
types/
  └── planet.ts                         # Interfaces TypeScript

components/
  ├── ui/
  │   ├── button.tsx                    # Botón reutilizable estilo retro
  │   ├── modal.tsx                     # Modal base reutilizable
  │   └── input.tsx                     # Input con estilo retro
  │
  ├── planets/
  │   ├── planet-canvas.tsx             # Canvas navegable principal
  │   ├── planet-item.tsx               # Componente visual de planeta
  │   ├── planet-create-modal.tsx       # Modal para crear planeta
  │   ├── planet-edit-modal.tsx         # Modal para editar planeta
  │   └── planet-detail-modal.tsx       # Modal para ver info del planeta
  │
  └── layout/
      └── create-planet-button.tsx      # Botón flotante "Nuevo planeta"

lib/
  └── planet-storage.ts                 # Utilidades para localStorage

app/
  └── page.tsx                          # MODIFICAR: integrar canvas
```

---

## 📦 Estructura de Datos

### Planet Interface

```typescript
export interface Planet {
  id: string;                    // UUID v4
  name: string;                  // Máx 50 caracteres
  description: string;           // Máx 500 caracteres
  imageUrl: string;              // Data URL (base64) o URL externa
  position: {
    x: number;                   // Coordenadas en el canvas
    y: number;
  };
  size: number;                  // Tamaño del planeta (80-200px)
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

### CanvasState Interface

```typescript
export interface CanvasState {
  viewport: {
    x: number;                   // Offset de la cámara
    y: number;
    scale: number;               // Zoom (futuro - fase 2)
  };
}
```

### localStorage Schema

```typescript
{
  "vortex-planets": Planet[],
  "vortex-canvas-state": CanvasState
}
```

---

## 🎨 Sistema de Diseño Retro

### Paleta de Colores

```css
--color-phosphorescent: #00ff00;
--color-phosphorescent-alt: #39ff14;
--color-bg: #000000;
```

### Componentes UI

**Button Style:**
```
- px-4 py-2
- bg-black border-2 border-phosphorescent
- text-phosphorescent font-retro text-xs
- hover:shadow-[0_0_20px_rgba(0,255,0,0.6)]
- transition-shadow duration-200
- cursor-pointer uppercase
```

**Input/Textarea Style:**
```
- w-full bg-black
- border-2 border-phosphorescent
- text-phosphorescent font-pixel text-base
- p-2 focus:outline-none
- focus:shadow-[0_0_15px_rgba(0,255,0,0.4)]
```

**Modal Container:**
```
- fixed inset-0 z-50
- flex items-center justify-center
- bg-black/80 backdrop-blur-sm
```

**Modal Content:**
```
- bg-black border-4 border-phosphorescent
- shadow-[0_0_40px_rgba(0,255,0,0.8)]
- p-8 max-w-lg w-full mx-4
```

---

## 📱 Responsive Design

### Mobile (< 768px)
- Botón "NUEVO PLANETA" más pequeño (text-[8px])
- Modales ocupan 95% del ancho
- Touch gestures para drag
- Planetas min 100px para facilitar tap

### Desktop (≥ 768px)
- Botón tamaño normal
- Modales max-width: 600px
- Mouse events para drag
- Planetas 80-200px

---

## ⚠️ Consideraciones Técnicas

### Performance
- Debounce drag events (16ms/60fps)
- Lazy render planetas visibles
- useMemo para cálculos de bounds
- Advertir si imagen > 2MB

### Accesibilidad
- Keyboard navigation (Tab + Enter)
- ARIA labels en planetas
- Focus rings fosforescentes
- Alt text = nombre del planeta

### Edge Cases
- Sin planetas → mensaje "Crea tu primer planeta"
- Drag vs Click → distancia < 5px = click
- Límites canvas → prevenir navegación fuera de bounds
- localStorage lleno → catch QuotaExceededError

---

# 🚀 FASES DE IMPLEMENTACIÓN

---

## ✅ FASE 1: Infraestructura Base

### Objetivos
Crear la base del sistema: tipos, utilidades de storage y componentes UI reutilizables.

### Tareas

#### 1.1 Types & Interfaces
- [x] Crear `types/planet.ts`
  - [x] Interface `Planet`
  - [x] Interface `CanvasState`
  - [x] Type helpers y validadores

#### 1.2 Storage Utilities
- [x] Crear `lib/planet-storage.ts`
  - [x] `loadPlanets(): Planet[]`
  - [x] `savePlanets(planets: Planet[]): void`
  - [x] `addPlanet(planet): Planet`
  - [x] `updatePlanet(id, updates): void`
  - [x] `deletePlanet(id): void`
  - [x] `loadViewport(): { x, y }`
  - [x] `saveViewport(viewport): void`
  - [x] `fileToBase64(file): Promise<string>`
  - [x] UUID generator

#### 1.3 UI Components Base
- [x] Crear `components/ui/button.tsx`
  - [x] Props interface (variant, onClick, children, disabled)
  - [x] Estilos retro fosforescentes
  - [x] Hover effects
  - [x] Accessibility (keyboard, aria)

- [x] Crear `components/ui/input.tsx`
  - [x] Support para text, textarea, file
  - [x] Props interface (label, error, required)
  - [x] Estilos retro
  - [x] Focus states
  - [x] Error handling visual

- [x] Crear `components/ui/modal.tsx`
  - [x] Props interface (isOpen, onClose, title, children)
  - [x] Backdrop con blur
  - [x] Contenedor con bordes fosforescentes
  - [x] Animaciones Framer Motion (enter/exit)
  - [x] Click fuera para cerrar
  - [x] ESC para cerrar
  - [x] Trap focus dentro del modal

### Testing Fase 1
- [x] Importar tipos sin errores de TypeScript
- [x] Storage funciona en localStorage
- [x] Componentes UI se renderizan correctamente
- [x] Estilos retro aplicados correctamente

---

## 🔨 FASE 2: Componentes de Planetas

### Objetivos
Crear los componentes específicos para renderizar y gestionar planetas.

### Tareas

#### 2.1 Planet Item Component
- [ ] Crear `components/planets/planet-item.tsx`
  - [ ] Props interface (planet, viewport, onClick, onDragStart)
  - [ ] Renderizado de imagen con estilo pixel-art
  - [ ] Tooltip con nombre en hover
  - [ ] Glow effect fosforescente
  - [ ] Transformaciones según viewport
  - [ ] Click handler
  - [ ] Drag start handler (fase 3)

#### 2.2 Planet Canvas Component
- [ ] Crear `components/planets/planet-canvas.tsx`
  - [ ] Estado: planets, viewport, isDragging, dragStart
  - [ ] Load planets desde localStorage en mount
  - [ ] Renderizar todos los planetas
  - [ ] Mouse/touch drag handlers para navegación
  - [ ] Calcular límites dinámicos
  - [ ] Prevenir navegación fuera de bounds
  - [ ] Guardar viewport en localStorage (debounced)
  - [ ] Diferenciar drag vs click (5px threshold)
  - [ ] Event delegation a planet items

#### 2.3 Create Planet Button
- [ ] Crear `components/layout/create-planet-button.tsx`
  - [ ] Posición fixed top-4 left-4 z-50
  - [ ] Texto "NUEVO PLANETA"
  - [ ] Usar componente Button
  - [ ] Click handler para abrir modal
  - [ ] Solo visible después de SpiralAnimation

### Testing Fase 2
- [ ] Canvas renderiza sin planetas
- [ ] Drag funciona para navegar
- [ ] Viewport se guarda en localStorage
- [ ] Botón aparece en posición correcta
- [ ] Click en botón dispara evento

---

## 🎭 FASE 3: Modales de Gestión

### Objetivos
Implementar formularios y vistas para crear, editar y visualizar planetas.

### Tareas

#### 3.1 Create Planet Modal
- [ ] Crear `components/planets/planet-create-modal.tsx`
  - [ ] Props interface (isOpen, onClose, currentViewport)
  - [ ] Form state (name, description, image, imagePreview)
  - [ ] File input handler con preview
  - [ ] Validaciones (campos requeridos, max chars)
  - [ ] Convert imagen a base64
  - [ ] Generar posición inicial (viewport center + random)
  - [ ] Generar tamaño aleatorio (100-150px)
  - [ ] Submit handler → addPlanet → close modal
  - [ ] Error handling y mensajes
  - [ ] Loading state durante conversión de imagen

#### 3.2 Planet Detail Modal
- [ ] Crear `components/planets/planet-detail-modal.tsx`
  - [ ] Props interface (planet, isOpen, onClose, onEdit)
  - [ ] Imagen grande del planeta
  - [ ] Nombre con fuente retro
  - [ ] Descripción con fuente pixel
  - [ ] Botón "Editar" → trigger onEdit
  - [ ] Botón "Cerrar"
  - [ ] Layout responsive

#### 3.3 Edit Planet Modal
- [ ] Crear `components/planets/planet-edit-modal.tsx`
  - [ ] Props interface (planet, isOpen, onClose, onSave, onDelete)
  - [ ] Form state precargado con datos del planeta
  - [ ] Editar nombre, descripción
  - [ ] Cambiar imagen (opcional)
  - [ ] Editar posición (inputs X/Y numéricos)
  - [ ] Botón "Guardar" → updatePlanet
  - [ ] Botón "Eliminar" con confirmación
  - [ ] Validaciones
  - [ ] Drag & drop del planeta (Fase 4)

### Testing Fase 3
- [ ] Create modal valida campos correctamente
- [ ] Imagen se convierte a base64
- [ ] Planeta se crea y persiste
- [ ] Detail modal muestra info correcta
- [ ] Edit modal actualiza datos
- [ ] Delete funciona con confirmación

---

## 🔗 FASE 4: Integración Completa

### Objetivos
Conectar todos los componentes y añadir interacciones avanzadas.

### Tareas

#### 4.1 Integración en app/page.tsx
- [ ] Modificar `app/page.tsx`
  - [ ] Estado para controlar modales (create, detail, edit)
  - [ ] Estado selectedPlanet
  - [ ] Renderizar CreatePlanetButton
  - [ ] Renderizar PlanetCanvas
  - [ ] Renderizar modales condicionalmente
  - [ ] Handlers para abrir/cerrar modales
  - [ ] Sincronizar viewport entre componentes

#### 4.2 Planet Click Interaction
- [ ] Implementar flujo click en planeta
  - [ ] PlanetCanvas detecta click en planeta
  - [ ] Abrir PlanetDetailModal con planeta seleccionado
  - [ ] Desde detail, botón editar → abrir EditModal
  - [ ] Cerrar detail al abrir edit

#### 4.3 Drag & Drop de Planetas
- [ ] Implementar en EditModal
  - [ ] Botón "Mover planeta en canvas"
  - [ ] Minimizar modal o hacerlo semi-transparente
  - [ ] Activar modo drag del planeta
  - [ ] Usuario arrastra planeta a nueva posición
  - [ ] Botón "Confirmar posición"
  - [ ] Restaurar modal, actualizar coordenadas

#### 4.4 State Management
- [ ] Centralizar estado de planetas
  - [ ] Context o estado en page.tsx
  - [ ] Callback para refrescar canvas al crear/editar/eliminar
  - [ ] Sincronización con localStorage

### Testing Fase 4
- [ ] Crear planeta desde botón funciona end-to-end
- [ ] Click en planeta abre detalles
- [ ] Editar desde detalles funciona
- [ ] Drag & drop de planeta actualiza posición
- [ ] Eliminar planeta funciona
- [ ] Recargar página persiste todo

---

## 💎 FASE 5: Polish & Optimización

### Objetivos
Pulir animaciones, performance y UX final.

### Tareas

#### 5.1 Animaciones Framer Motion
- [ ] Planet appear animation
  - [ ] Fade in + scale cuando se crea
  - [ ] Duración 300ms, ease-out

- [ ] Modal transitions
  - [ ] Enter: opacity 0→1 + scale 0.9→1
  - [ ] Exit: opacity 1→0 + scale 1→0.95
  - [ ] Backdrop fade in/out

- [ ] Button hover
  - [ ] Glow intensity aumenta suavemente
  - [ ] whileHover en Framer Motion

- [ ] Planet hover
  - [ ] Scale 1→1.1 suave
  - [ ] Glow se intensifica

#### 5.2 Reduced Motion Support
- [ ] Detectar prefers-reduced-motion
  - [ ] Deshabilitar animaciones complejas
  - [ ] Mantener transiciones esenciales instantáneas
  - [ ] Aplicar en todos los motion components

#### 5.3 Performance Optimization
- [ ] Debounce viewport save
  - [ ] Solo guardar en localStorage cada 500ms
  - [ ] Usar lodash.debounce o custom hook

- [ ] Memoization
  - [ ] useMemo para cálculos de bounds
  - [ ] useMemo para lista de planetas filtrados
  - [ ] React.memo en PlanetItem

- [ ] Image optimization
  - [ ] Advertir si imagen > 2MB
  - [ ] Comprimir automáticamente (opcional)
  - [ ] Lazy load imágenes de planetas fuera de viewport

#### 5.4 Accessibility Audit
- [ ] Keyboard navigation
  - [ ] Tab entre planetas
  - [ ] Enter para abrir detalles
  - [ ] ESC para cerrar modales

- [ ] Screen reader
  - [ ] ARIA labels en planetas
  - [ ] ARIA live regions para feedback
  - [ ] Anunciar cuando se crea/edita planeta

- [ ] Focus management
  - [ ] Focus trap en modales
  - [ ] Return focus al cerrar modal
  - [ ] Focus rings visibles

- [ ] Color contrast
  - [ ] Verificar 4.5:1 ratio
  - [ ] Probar con herramientas de accesibilidad

#### 5.5 Error Handling
- [ ] localStorage lleno
  - [ ] Catch QuotaExceededError
  - [ ] Mostrar mensaje al usuario
  - [ ] Sugerir eliminar planetas antiguos

- [ ] Imagen corrupta
  - [ ] Catch error al cargar base64
  - [ ] Mostrar placeholder o error

- [ ] Validaciones robustas
  - [ ] Sanitizar inputs (XSS prevention)
  - [ ] Límites de tamaño de archivo

#### 5.6 Cross-Browser Testing
- [ ] Chrome (Windows/Mac)
- [ ] Firefox (Windows/Mac)
- [ ] Safari (Mac/iOS)
- [ ] Edge (Windows)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

### Testing Fase 5
- [ ] Todas las animaciones funcionan
- [ ] Reduced motion respetado
- [ ] No lag al drag con muchos planetas
- [ ] Keyboard navigation completa
- [ ] Screen reader usable
- [ ] Funciona en todos los navegadores

---

## 🎯 Criterios de Aceptación Final

### Funcionalidad Core
- [x] ✅ Usuario puede crear planetas con nombre, descripción e imagen
- [ ] ✅ Planetas se muestran en canvas navegable
- [ ] ✅ Usuario puede arrastrar canvas para explorar
- [ ] ✅ Click en planeta muestra detalles
- [ ] ✅ Usuario puede editar planetas existentes
- [ ] ✅ Usuario puede mover planetas (drag & drop o coordenadas)
- [ ] ✅ Usuario puede eliminar planetas
- [ ] ✅ Todo persiste en localStorage

### UX/UI
- [x] ✅ Estética retro pixel-art consistente
- [x] ✅ Colores fosforescentes (#00ff00) aplicados
- [x] ✅ Fuentes retro (Press Start 2P, VT323)
- [ ] ✅ Animaciones suaves y no invasivas
- [ ] ✅ Responsive en mobile y desktop
- [ ] ✅ Touch gestures funcionan en móvil

### Calidad de Código
- [x] ✅ TypeScript strict sin errores
- [x] ✅ Componentes bien separados y reutilizables
- [x] ✅ No warnings de ESLint
- [ ] ✅ Performance óptima (no lag)
- [ ] ✅ Accesibilidad AAA

### Testing
- [ ] ✅ Funciona en Chrome, Firefox, Safari, Edge
- [ ] ✅ Funciona en móvil (iOS y Android)
- [ ] ✅ Recarga de página mantiene estado
- [ ] ✅ No errores en consola

---

## 🚧 Limitaciones Conocidas

1. **localStorage limits:** ~5-10MB dependiendo del navegador
2. **Sin sincronización:** Cada navegador tiene sus propios planetas
3. **Sin backend:** No hay autenticación ni multiusuario
4. **Imágenes grandes:** Pueden llenar localStorage rápidamente

---

## 🔮 Mejoras Futuras (Post-Launch)

### Corto Plazo
- [ ] Zoom in/out con scroll wheel
- [ ] Grid/rulers opcionales para posicionamiento preciso
- [ ] Undo/Redo para ediciones
- [ ] Duplicar planeta
- [ ] Ordenar planetas (por fecha, nombre, etc)

### Medio Plazo
- [ ] Búsqueda/filtrado de planetas
- [ ] Categorías/tags personalizables
- [ ] Exportar/importar planetas (JSON)
- [ ] Temas de color alternativos
- [ ] Minimap togglable

### Largo Plazo
- [ ] Backend con Supabase/Firebase
- [ ] Autenticación de usuarios
- [ ] Modo colaborativo (multiplayer)
- [ ] Animaciones orbitales automáticas
- [ ] Efectos de partículas en background
- [ ] Relaciones entre planetas (conexiones visuales)
- [ ] Historias/narrativas por planeta

---

## 📊 Progreso General

- **Fase 1 (Infraestructura):** ✅ COMPLETADA
- **Fase 2 (Componentes):** ⏳ Pendiente
- **Fase 3 (Modales):** ⏳ Pendiente
- **Fase 4 (Integración):** ⏳ Pendiente
- **Fase 5 (Polish):** ⏳ Pendiente

---

**Última actualización:** 2026-02-06  
**Estado del proyecto:** En desarrollo - Fase 1 completada  
**Próximo hito:** Implementar Fase 2 - Componentes de Planetas
