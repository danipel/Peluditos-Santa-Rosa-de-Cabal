# Peluditos — Mascotas Perdidas (Santa Rosa de Cabal)

Plataforma web para ayudar a reencontrar mascotas perdidas tras el sismo del 10 de agosto. Permite publicar reportes de animales perdidos, registrar avistamientos, consultar el punto de acopio / albergue temporal y compartir contactos por WhatsApp o llamada.

Frontend en **React 18 + Vite** conectado a **Supabase** (base de datos PostgreSQL, storage de fotos, autenticación y tiempo real).

## Funcionalidades

- **Reportes de mascotas**: publicar mascotas perdidas o que están en el albergue, con foto, especie, color, tamaño, sector y descripción.
- **Avistamientos**: registrar dónde y cuándo se vio a una mascota y verlos en su tarjeta.
- **Filtros y búsqueda** por estado (perdido / en albergue / reunido), especie y texto libre.
- **Contacto directo**: botones de llamada y WhatsApp preconfigurados.
- **Albergue temporal**: banner con la ubicación y horario del punto de acopio (editable por admin).
- **Acceso administrador**: login con Supabase Auth para editar el albergue y cambiar estados.
- **Tiempo real**: los cambios se reflejan al instante vía Realtime.

## Stack

- React 18 + Vite
- Supabase (`@supabase/supabase-js`) — base de datos, Storage, Auth y Realtime
- `lucide-react` (iconos)
- Tipografía: Inter

## Requisitos

- Node.js 18+ y `pnpm` (o `npm`)

## Estructura del proyecto

```
src/
├── constants/mascotas.js       # Estados, especies y enlaces de contacto
├── styles/                     # Estilos compartidos (importados en main.jsx)
│   ├── tokens.css              # Variables CSS de diseño (colores, radios)
│   ├── base.css                # Clases globales (.pagina) y animaciones
│   └── forms.css               # Clases reutilizables de formularios
├── utils/compartir.js          # Helpers de compartir (Web Share, enlaces, portapapeles)
├── services/                   # Capa de acceso a Supabase
│   ├── reportesService.js
│   ├── avistamientosService.js
│   └── albergueService.js
├── hooks/                      # Lógica de negocio y estado reactivo
│   ├── useReportes.js          # Reportes + avistamientos (carga, filtros, mutaciones)
│   ├── useAlbergue.js          # Albergue temporal por ciudad
│   ├── useSession.js           # Sesión de autenticación (Supabase Auth)
│   └── useBodyScrollLock.js    # Bloqueo del scroll en modales
├── components/                 # Componentes por dominio (cada .jsx con su .css)
│   ├── common/                 # Modal, Card, BannerAyuda, BotonCompartir, VisorFoto...
│   ├── layout/                 # Header, Footer, ScrollToTop
│   ├── albergue/               # AlbergueBanner
│   ├── reportes/               # ReporteCard, ReportesFiltros, ReportesLista, BotonReportar
│   ├── forms/                  # Formularios (Reporte, Avistamiento, Login, Albergue)
│   └── index.js                # Barrel export
├── App.jsx / App.css           # Vista principal (listado + filtros)
├── home.jsx / home.css         # Pantalla de selección de ciudad
├── Root.jsx                    # Rutas de la aplicación (react-router)
├── supabaseClient.js
└── main.jsx                    # Punto de montaje + estilos globales
```

### Rutas

| Ruta | Componente | Descripción |
|---|---|---|
| `/home` | `home.jsx` | Selección de ciudad |
| `/?ciudad=<nombre>` | `App.jsx` | Listado y filtros de reportes |

> Nota: la capa de datos vive en `services/` (llamadas a Supabase) y la lógica de estado en `hooks/`. `App.jsx` y `home.jsx` orquestan componentes y consumen esos hooks (no acceden a Supabase directamente).


## Ejecutar en local

```bash
pnpm install      # o npm install
pnpm dev          # o npm run dev
```

Abre `http://localhost:5173`.

## Build y preview

```bash
pnpm build
pnpm preview
```

## Notas de seguridad

- Las políticas RLS actuales son abiertas (cualquiera puede insertar/actualizar) para priorizar la velocidad de uso durante la emergencia.
