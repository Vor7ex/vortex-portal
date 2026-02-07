# 🚀 Quick Start - Fase 3

## 📍 Punto de Partida

**Fase 2 completada:** Componentes de planetas (canvas, items, botón)

**Archivos creados en Fase 2:**
- `components/planets/planet-item.tsx` (103 líneas)
- `components/planets/planet-canvas.tsx` (215 líneas)
- `components/layout/create-planet-button.tsx` (23 líneas)
- `app/page.tsx` (modificado)

---

## 🎯 Objetivos Fase 3

Implementar 3 modales para gestionar planetas:

1. **PlanetCreateModal** - Crear nuevo planeta
2. **PlanetDetailModal** - Ver detalles del planeta
3. **PlanetEditModal** - Editar/eliminar planeta

---

## 📦 Componentes a Crear

### 1. `components/planets/planet-create-modal.tsx`

**Funcionalidad:**
- Form con campos: name, description, image
- File input con preview de imagen
- Validaciones con funciones existentes:
  - `validatePlanetName()`
  - `validatePlanetDescription()`
  - `validatePlanetImage()`
- Conversión de imagen a base64 con `fileToBase64()`
- Generar posición con `generateRandomPosition(viewport)`
- Tamaño aleatorio: 100-150px
- Submit → `addPlanet()` → actualizar canvas → cerrar modal

**Props:**
```typescript
interface PlanetCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentViewport: { x: number; y: number };
  onSuccess: () => void; // Callback para refrescar canvas
}
```

---

### 2. `components/planets/planet-detail-modal.tsx`

**Funcionalidad:**
- Muestra imagen grande del planeta
- Nombre (font-retro, text-2xl)
- Descripción (font-pixel, text-base)
- Botón "Editar" → abre EditModal
- Botón "Cerrar"
- Layout responsive

**Props:**
```typescript
interface PlanetDetailModalProps {
  planet: Planet | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (planet: Planet) => void;
}
```

---

### 3. `components/planets/planet-edit-modal.tsx`

**Funcionalidad:**
- Form precargado con datos del planeta
- Editar: name, description
- Cambiar imagen (opcional, muestra preview)
- Editar posición (inputs numéricos X/Y)
- Botón "Guardar" → `updatePlanet()` → refrescar canvas
- Botón "Eliminar" → confirmación → `deletePlanet()` → cerrar
- Validaciones

**Props:**
```typescript
interface PlanetEditModalProps {
  planet: Planet | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void; // Callback para refrescar canvas
  onDelete: () => void; // Callback después de eliminar
}
```

---

## 🔄 Modificaciones en `app/page.tsx`

**Estados a agregar:**
```typescript
const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
```

**Handlers a implementar:**
```typescript
const handlePlanetClick = (planet: Planet) => {
  setSelectedPlanet(planet);
  setIsDetailModalOpen(true);
};

const handleCreatePlanet = () => {
  setIsCreateModalOpen(true);
};

const handleEditPlanet = (planet: Planet) => {
  setSelectedPlanet(planet);
  setIsDetailModalOpen(false);
  setIsEditModalOpen(true);
};

const handleRefreshCanvas = () => {
  // Trigger canvas refresh (Fase 4 - context o state management)
  window.location.reload(); // Temporal para Fase 3
};
```

---

## 🛠️ Utilidades Disponibles

**Ya implementadas en `lib/planet-storage.ts`:**
- ✅ `addPlanet(data)` - Agregar planeta
- ✅ `updatePlanet(id, updates)` - Actualizar planeta
- ✅ `deletePlanet(id)` - Eliminar planeta
- ✅ `fileToBase64(file)` - Convertir File a base64
- ✅ `generateRandomPosition(viewport, existingPlanets)` - Generar posición

**Ya implementadas en `types/planet.ts`:**
- ✅ `validatePlanetName(name)` - Validar nombre
- ✅ `validatePlanetDescription(desc)` - Validar descripción
- ✅ `validatePlanetImage(file)` - Validar imagen

**Ya implementado en `components/ui/`:**
- ✅ `<Modal>` - Modal base reutilizable
- ✅ `<Input>` - Input/textarea/file estilizado
- ✅ `<Button>` - Botón retro

---

## 📋 Checklist Fase 3

### Componentes
- [ ] Crear `planet-create-modal.tsx`
- [ ] Crear `planet-detail-modal.tsx`
- [ ] Crear `planet-edit-modal.tsx`

### Integración
- [ ] Modificar `app/page.tsx` con estados de modales
- [ ] Implementar handlers reales (reemplazar console.log)
- [ ] Conectar modales con callbacks

### Testing
- [ ] Crear planeta → verifica que se guarda en localStorage
- [ ] Click en planeta → abre modal de detalles
- [ ] Editar planeta → cambios se persisten
- [ ] Eliminar planeta → se elimina y desaparece del canvas
- [ ] Recargar página → cambios persisten

### Verificación
- [ ] `npm run type-check` sin errores
- [ ] No warnings en consola
- [ ] Estilos retro aplicados en todos los modales
- [ ] Responsive en mobile y desktop

---

## 🎨 Diseño de Modales

**Usar componente Modal existente:**
```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Título del Modal"
  maxWidth="lg"
>
  {/* Contenido del form */}
</Modal>
```

**Layout de Form:**
```tsx
<form onSubmit={handleSubmit} className="space-y-4">
  <Input
    type="text"
    label="Nombre"
    value={name}
    onChange={(e) => setName(e.target.value)}
    error={nameError}
    required
  />
  
  {/* Más campos... */}
  
  <div className="flex gap-4 justify-end">
    <Button variant="secondary" onClick={onClose}>
      Cancelar
    </Button>
    <Button variant="primary" type="submit">
      Guardar
    </Button>
  </div>
</form>
```

---

## 🔗 Flujo Completo (End-to-End)

```
1. Usuario click "Nuevo Planeta"
   → Abre CreateModal
   → Usuario llena form (nombre, descripción, imagen)
   → Submit → addPlanet() → planeta aparece en canvas

2. Usuario click en planeta
   → Abre DetailModal
   → Muestra info del planeta
   → Usuario click "Editar"
   → Abre EditModal (cierra DetailModal)
   → Usuario modifica datos
   → Submit → updatePlanet() → cambios reflejados en canvas

3. Usuario click "Eliminar" en EditModal
   → Confirmación
   → deletePlanet() → planeta desaparece del canvas
```

---

## 📝 Notas Importantes

1. **Confirmación de Eliminación:**
   - Usar `window.confirm()` simple para Fase 3
   - Fase 5 puede mejorar con modal de confirmación custom

2. **Loading States:**
   - Mostrar loading durante conversión de imagen a base64
   - Deshabilitar botón submit mientras procesa

3. **Error Handling:**
   - Catch errors de `addPlanet()`, `updatePlanet()`, `deletePlanet()`
   - Mostrar mensajes de error al usuario
   - Especialmente QuotaExceededError (localStorage lleno)

4. **Image Preview:**
   - Mostrar preview de imagen antes de submit
   - Usar FileReader para cargar preview inmediato

5. **Refresh Canvas:**
   - Para Fase 3: usar `window.location.reload()` temporal
   - Fase 4 implementará state management adecuado

---

## 🚀 Orden de Implementación Recomendado

1. **CreateModal** (más complejo, sienta las bases)
2. **DetailModal** (más simple, solo lectura)
3. **EditModal** (similar a CreateModal pero precargado)
4. **Integración en app/page.tsx**
5. **Testing end-to-end**

---

**Duración estimada:** 1-2 horas
**Líneas de código estimadas:** ~500 líneas

**¡Listo para implementar Fase 3!**
