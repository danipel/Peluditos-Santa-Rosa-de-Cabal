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
├── constants/mascotas.js       # Estados y especies
├── services/                   # Capa de acceso a Supabase
│   ├── reportesService.js
│   └── albergueService.js
├── hooks/                      # Lógica de negocio y estado reactivo
│   ├── useReportes.js
│   └── useAlbergue.js
├── components/                 # Componentes por dominio
│   ├── common/                 # Modal, ImageModal
│   ├── layout/                 # Header
│   ├── albergue/               # AlbergueBanner, FormularioAlbergue
│   ├── reportes/               # ReporteCard, Filtros, Lista, Formulario, BotonReportar
│   └── index.js
├── App.jsx                     # Orquestador principal
├── supabaseClient.js
└── main.jsx
```

> Nota: `App.jsx` es autónomo e incluye la mayoría de la lógica y vistas; la carpeta `components/` contiene versiones modulares de esos mismos componentes como base para el desarrollo colaborativo.


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
