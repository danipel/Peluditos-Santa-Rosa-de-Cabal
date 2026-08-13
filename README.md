# Mascotas Perdidas — Pereira

Frontend en React + Vite conectado a Supabase (base de datos, storage de fotos y realtime).

## 1. Crear el proyecto en Supabase

1. Ve a https://supabase.com → Crea cuenta gratis → **New project**.
2. Cuando esté listo, entra a **SQL Editor** → **New query**, pega el contenido de `schema.sql` (está en la carpeta de arriba de este proyecto) y dale **Run**.
3. Ve a **Storage** → confirma que exista el bucket `fotos` y que esté marcado como **Public**. Si el script no lo creó, créalo manualmente: **New bucket** → nombre `fotos` → **Public bucket: ON**.
4. Ve a **Project Settings → API**. Copia:
   - **Project URL** → va en `VITE_SUPABASE_URL`
   - **anon public key** → va en `VITE_SUPABASE_ANON_KEY`

## 2. Configurar el proyecto localmente

```bash
cp .env.example .env
# edita .env y pega tus valores de Supabase
npm install
npm run dev
```

Esto te abre la app en `http://localhost:5173`. Pruébala, crea un par de reportes de prueba, sube una foto, cambia estados.

## 3. Desplegar en Vercel (gratis)

1. Sube esta carpeta a un repositorio de GitHub (puede ser privado).
2. Ve a https://vercel.com → **Add New Project** → importa el repo.
3. En **Environment Variables**, agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con los mismos valores de tu `.env`.
4. Deploy. En 1-2 minutos tienes una URL pública (`tuapp.vercel.app`) que puedes compartir directamente por WhatsApp o redes.

Cada vez que hagas `git push`, Vercel vuelve a desplegar automáticamente.

## 4. Alternativa: Netlify

Mismo flujo: conectar el repo, definir `Build command: npm run build`, `Publish directory: dist`, y las mismas variables de entorno.

## Notas de seguridad para cuando tengas tiempo de mejorar esto

- Las políticas RLS actuales son abiertas (cualquiera puede insertar/actualizar) para priorizar velocidad de uso en la emergencia. La tabla ya guarda un `pin` de 4 dígitos por reporte — el siguiente paso natural es exigir ese pin antes de permitir el cambio de estado desde el frontend, o mover esa validación a una Edge Function de Supabase.
- Si el uso crece mucho, revisa los límites de la capa gratuita de Supabase (storage y ancho de banda) en el dashboard.
