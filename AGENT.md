# Guía de Desarrollo para Agentes de IA (`AGENT.md`)

Este documento define la arquitectura, el sistema de diseño estándar y las convenciones de desarrollo del proyecto **Peluditos - Mascotas Perdidas (Santa Rosa de Cabal)**. Cualquier agente de IA que genere o modifique código en este repositorio **debe seguir estas pautas estrictamente** para garantizar coherencia visual, rendimiento y prevenir conflictos de fusión (*merge conflicts*) en el trabajo colaborativo en equipo.

---

## 1. Stack Tecnológico

- **Framework:** React 18 + Vite (Javascript moderno / ES Modules)
- **Backend / BaaS:** Supabase (`@supabase/supabase-js`)
  - Base de datos relacional PostgreSQL
  - Storage (Bucket público `fotos`)
  - Postgres Realtime (WebSockets)
- **Iconografía:** `lucide-react`
- **Tipografía:** `'Inter', system-ui, sans-serif`

---

## 2. Sistema de Diseño y Estilos Estándar (Design Tokens)

Para mantener una interfaz consistente, sobria, accesible y con estética premium, se deben utilizar exclusivamente los siguientes tokens de color, tipografía y formas. **Estos tokens están definidos como variables CSS en `src/styles/tokens.css`** (ver sección 2.5).

### 2.1. Paleta de Colores

| Token / Uso | Valor Hex | Descripción |
|---|---|---|
| **Fondo Principal de la App** | `#F6F5F2` | Tono hueso / arena cálido y descansado para la vista |
| **Superficie de Tarjetas / Modales** | `#FFFFFF` | Blanco puro para contenedores con elevación o borde |
| **Primario Institucional (Header/FAB)** | `#1F3A34` | Verde bosque profundo para elementos primarios |
| **Secundario / Acento (Albergue/WhatsApp)** | `#1F6E5C` | Verde esmeralda para acciones de rescate y éxito |
| **Borde Estándar** | `#DAD6CC` | Gris suave para bordes de inputs, cards y botones |
| **Borde / Fondo Suave (Placeholder)** | `#EFEDE6` / `#B4AF9F` | Fondo neutral para miniaturas sin foto y divisores |
| **Texto Principal** | `#2A2A28` | Casi negro cálido con alto contraste |
| **Texto Secundario** | `#4A4A47` | Gris oscuro para subtítulos y etiquetas de formulario |
| **Texto Muted / Metadatos** | `#8A8A85` / `#9A9A94` | Gris medio para iconos auxiliares y placeholders |

### 2.2. Colores Semánticos de Estado (Mascotas & Alertas)

| Estado | Color de Texto / Borde | Color de Fondo | Caso de Uso |
|---|---|---|---|
| **Perdido** | `#B4472E` | `#FBE9E4` | Mascota extraviada / Alertas de error |
| **Avistado / Coincidencia** | `#8A6D00` / `#7A5F00` | `#FAF1D6` | Mascota vista / Banner de coincidencia de sector |
| **En Albergue** | `#1F6E5C` | `#E1F0EA` | Mascota resguardada en punto de acopio |
| **Reunido** | `#5B5B5B` | `#EBEBEB` | Mascota que ya regresó con su dueño |

### 2.3. Tipografía y Jerarquía

- **Fuente:** `'Inter', system-ui, sans-serif`
- **Títulos Principales (Header):** `fontSize: 18`, `fontWeight: 700`, `letterSpacing: -0.2`
- **Títulos de Tarjetas / Modales:** `fontSize: 14.5` a `15.5`, `fontWeight: 700`
- **Cuerpo / Textos de Formulario:** `fontSize: 13` a `13.5`, `color: "#4A4A47"`
- **Etiquetas de Campo (Labels):** `fontSize: 12.5`, `fontWeight: 600`, `color: "#4A4A47"`
- **Badges / Píldoras de Filtro:** `fontSize: 11` a `12.5`, `fontWeight: 600` o `700`
- **PIN de Confirmación:** `fontSize: 26`, `fontWeight: 800`, `letterSpacing: 4`

### 2.4. Geometría y Espaciado (Layout & Radii)

- **Ancho Máximo Contenedor:** `maxWidth: 720` (centrado con `margin: "0 auto"`).
- **Ancho Máximo Modales:** `maxWidth: 480` (estilo bottom-sheet / modal flotante).
- **Border Radius:**
  - `borderRadius: 8`: Inputs, selects, textareas y botones estándar.
  - `borderRadius: 10` a `12`: Tarjetas (`Card`) y banners.
  - `borderRadius: "16px 16px 0 0"`: Ventanas modales emergentes.
  - `borderRadius: 999`: Píldoras de filtros, badges de estado y botón flotante (FAB).

### 2.5. Dónde viven los Estilos (CSS modular)

Los estilos **NO** deben definirse como objetos `style={{...}}` dentro del JSX ni en bloques `<style>` embebidos. Se organizan en archivos `.css`:

| Archivo | Ubicación | Contenido |
|---|---|---|
| `tokens.css` | `src/styles/` | Variables CSS de diseño (`--color-primario`, `--color-acento`, `--color-borde`, `--radio`, etc.). Úsalas en lugar de repetir valores hex. |
| `base.css` | `src/styles/` | Clases globales (`.pagina`) y animaciones (`.animate-spin`). |
| `forms.css` | `src/styles/` | Clases reutilizables de formularios. |
| `*.css` co-ubicado | junto a cada `.jsx` | Estilos específicos de cada componente (`Card.css`, `Header.css`, ...). |

Los tres archivos de `src/styles/` se importan una sola vez en `src/main.jsx`. Cada componente importa su propio `.css` con `import "./Componente.css"`.

#### Clases de formulario (reemplazan los objetos de estilo)

```jsx
// ANTES (evitar): objetos de estilo inline
const inputStyle = { width: "100%", padding: "9px 10px", ... };

// AHORA (correcto): clases compartidas de src/styles/forms.css
<input className="campo-input" />
<div className="campo-etiqueta">Label</div>
<button className="boton-enviar">Enviar</button>
```

Clases disponibles en `src/styles/forms.css`:
- **Campos:** `.campo-input`, `.campo-textarea`, `.campo-textarea-grande`, `.campo-archivo`, `.campo-input-solo-lectura`
- **Etiquetas y ayudas:** `.campo-etiqueta`, `.campo-etiqueta-icono`, `.campo-helper`, `.campo-helper-error`
- **Botones:** `.boton-enviar` (+ modificadores `--acento`, `--advertencia`)
- **Layout de formulario:** `.form-columna`, `.form-fila`, `.form-flexible`
- **Feedback:** `.alerta`, `.pin-mostrado`, `.texto-detalle`

Los únicos estilos inline permitidos son los **dinámicos dependientes de datos** (ej. `style={{ color: estado.color, background: estado.bg }}` en los badges de estado).

---

## 3. Principio Fundamental: Creación de Componentes Independientes

Para permitir el desarrollo concurrente de varios programadores sin conflictos de merge en Git, **cada componente debe ser una unidad autónoma e independiente**.

### Reglas de Oro para Componentes:
1. **Un componente por archivo:** Cada componente debe residir en su propio archivo `.jsx`.
2. **Componentes "Tontos" (Presentational) vs "Inteligentes" (Containers):**
   - La mayoría de los componentes de UI deben ser puramente presentacionales: reciben datos y callbacks por `props` (`onSave`, `onClose`, `onEditar`, `onCambiarEstado`) y no conocen directamente la existencia de Supabase ni del estado global.
3. **Props explícitas con valores por defecto:** Garantizar que los componentes no rompan si una propiedad opcional no es suministrada (ej: `coincidencias = []`, `initial = {}`).
4. **Cero efectos colaterales ocultos:** Los componentes de UI no deben suscribirse directamente a eventos globales ni alterar variables fuera de su ciclo de vida.
5. **Modularidad atómica:**
   - **Átomos:** Botones, inputs, modales base (`src/components/common/`).
   - **Moléculas/Organismos:** Tarjeta de mascota, barra de filtros, formulario (`src/components/<feature>/`).
   - **Plantillas/Vistas:** Orquestador principal (`src/App.jsx`).

---

## 4. Estructura de Carpetas

```
src/
├── constants/               # Constantes de dominio, estados, especies y enlaces
│   └── mascotas.js
├── styles/                  # Estilos compartidos (tokens + utilidades globales)
│   ├── tokens.css           # Variables CSS de diseño (colores, radios)
│   ├── base.css             # Clases globales (.pagina) y animaciones
│   └── forms.css            # Clases reutilizables de formularios
├── utils/                   # Funciones puras y helpers reutilizables
│   └── compartir.js         # Lógica de compartir (Web Share, enlaces, portapapeles)
├── services/                # Capa de comunicación con Supabase (CRUD, Storage, Realtime)
│   ├── reportesService.js
│   ├── avistamientosService.js
│   └── albergueService.js
├── hooks/                   # Custom hooks con lógica de negocio y estado reactivo
│   ├── useReportes.js       # Reportes + avistamientos (carga, filtros, mutaciones, realtime)
│   ├── useAlbergue.js       # Información del albergue temporal por ciudad
│   ├── useSession.js        # Sesión de autenticación (Supabase Auth)
│   └── useBodyScrollLock.js # Bloqueo del scroll del body en modales
├── components/              # Componentes independientes agrupados por dominio
│   ├── common/              # Reutilizables agnósticos del negocio (Modal, Card, BannerAyuda, BotonCompartir, ...)
│   ├── layout/              # Header, Footer, ScrollToTop
│   ├── albergue/            # Módulo de Albergue Temporal (AlbergueBanner)
│   ├── reportes/            # Módulo de Reportes (ReporteCard, ReportesFiltros, ReportesLista, BotonReportar)
│   ├── forms/               # Formularios (FormularioReporte, FormularioAvistamiento, FormularioLogin, FormularioAlbergue)
│   └── index.js             # Exportaciones centralizadas (barrel export)
├── App.jsx / App.css        # Vista principal (listado, filtros y orquestación)
├── home.jsx / home.css      # Pantalla de selección de ciudad
├── Root.jsx                 # Definición de rutas de react-router
├── supabaseClient.js        # Inicialización del cliente Supabase
└── main.jsx                 # Punto de montaje (importa los estilos globales de src/styles/)
```

### 4.1. Rutas de la aplicación (`Root.jsx`)

| Ruta | Componente | Descripción |
|---|---|---|
| `/home` | `home.jsx` | Pantalla de selección de ciudad |
| `/` | `Root.jsx` | Redirige a `/home` |
| `/:ciudad` | `App.jsx` | Listado y filtros de reportes (slug de ciudad, ej. `/pereira`, `/todos`) |

Cada componente visual (`*.jsx`) vive acompañado de su archivo de estilos (`*.css`) en la misma carpeta. Los componentes de `components/forms/` usan las clases compartidas de `src/styles/forms.css` en lugar de un CSS propio.

---

## 5. Guía de Implementación para Nuevas Funcionalidades

Cuando un agente vaya a agregar una nueva funcionalidad (ejemplo: *Donaciones*, *Voluntarios* o *Comentarios*):

1. **Definir Constantes (si aplica):** Añadir constantes o tipos en `src/constants/`.
2. **Crear el Servicio:** Crear `src/services/<modulo>Service.js` con las funciones que llaman a Supabase.
3. **Crear el Hook:** Crear `src/hooks/use<Modulo>.js` que gestiona el estado, `loading`, `error` y las llamadas al servicio.
4. **Crear Componentes Independientes:** Crear la carpeta `src/components/<modulo>/` con los componentes visuales necesarios (Tarjetas, Formularios, Listas) y su archivo de estilos `.css` co-ubicado (o reutiliza las clases de `src/styles/forms.css` para formularios).
5. **Re-exportar:** Agregar los nuevos componentes a `src/components/index.js`.
6. **Integrar en `App.jsx`:** Importar el hook y los componentes en `App.jsx` sin introducir lógica de base de datos directa.

---

## 6. Comandos de Verificación Obligatorios

Antes de dar por finalizada cualquier tarea, el agente debe verificar que la aplicación compila limpiamente:

```bash
# Validar compilación, imports y sintaxis con Vite
pnpm build

# Levantar entorno de desarrollo si se requiere probar interacciones
pnpm dev
```
