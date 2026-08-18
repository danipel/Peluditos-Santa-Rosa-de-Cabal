/**
 * Migración única: re-comprime y renombra a .jpg las fotos ya subidas
 * al bucket 'fotos' de Supabase Storage.
 *
 * Qué hace:
 *   1. Guarda una copia de seguridad de las URLs/nombres originales.
 *   2. Descarga cada foto, la redimensiona a máx. 800px y la codifica a
 *      JPEG calidad 70 usando sharp.
 *   3. Si el resultado pesa menos, lo sube como <nombre>.jpg, actualiza
 *      `foto_url` en la tabla `reportes` y elimina el archivo original.
 *
 * Uso:
 *   node scripts/comprimir-fotos.mjs
 *
 *   DRY_RUN=1 node scripts/comprimir-fotos.mjs   # solo simula, no escribe
 *
 * Requiere: sharp y @supabase/supabase-js (devDependencies).
 * Lee VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY del archivo .env.
 * Si existe SUPABASE_SERVICE_ROLE_KEY se usa para poder borrar los
 * archivos originales con permisos completos.
 */

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const DRY_RUN = process.env.DRY_RUN === "1";
const MAX_WIDTH = 800;
const MAX_HEIGHT = 800;
const QUALITY = 70;

// ---------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------

function cargarEnv(ruta) {
  const vars = {};
  let contenido;
  try {
    contenido = readFileSync(ruta, "utf8");
  } catch {
    return vars;
  }
  for (const linea of contenido.split("\n")) {
    const t = linea.trim();
    if (!t || t.startsWith("#")) continue;
    const idx = t.indexOf("=");
    if (idx === -1) continue;
    const k = t.slice(0, idx).trim();
    let v = t.slice(idx + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    vars[k] = v;
  }
  return vars;
}

function extraerPath(fotoUrl) {
  const m = fotoUrl.match(/\/fotos\/(.+)$/);
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
}

function nombreJpg(ruta) {
  const dir = path.dirname(ruta);
  const base = path.basename(ruta, path.extname(ruta)) || "imagen";
  return dir === "." ? `${base}.jpg` : `${dir}/${base}.jpg`;
}

const fmtMb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;
const fmtKb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

// ---------------------------------------------------------------
// Script
// ---------------------------------------------------------------

const env = cargarEnv(path.resolve(process.cwd(), ".env"));

const url = env.VITE_SUPABASE_URL;
const serviceRole = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_SERVICE_KEY;
const key = serviceRole || env.VITE_SUPABASE_ANON_KEY;
const usaServiceRole = Boolean(serviceRole);

if (!url || !key) {
  console.error(
    "Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY en el .env"
  );
  process.exit(1);
}

const supabase = createClient(url, key);
const storage = supabase.storage.from("fotos");

console.log(
  `Modo: ${DRY_RUN ? "SIMULACIÓN (no escribe)" : "REAL"}\n` +
    `Clave: ${usaServiceRole ? "service_role" : "anon"}\n` +
    `Parámetros: máx ${MAX_WIDTH}px, JPEG calidad ${QUALITY}\n`
);

const { data: reportes, error } = await supabase
  .from("reportes")
  .select("id, foto_url")
  .not("foto_url", "is", null);

if (error) {
  console.error("Error al leer la tabla 'reportes':", error.message);
  process.exit(1);
}

const conFoto = (reportes || []).filter((r) => r.foto_url);
console.log(`Reportes con foto: ${conFoto.length}\n`);

// Copia de seguridad de los nombres/URLs originales. Se escribe ANTES de
// modificar nada para poder revertir manualmente si algo sale mal.
const backup = conFoto.map((r) => ({
  id: r.id,
  foto_url: r.foto_url,
  oldPath: extraerPath(r.foto_url),
}));

if (!DRY_RUN) {
  const backupRuta = path.resolve(process.cwd(), "backup-fotos.json");
  writeFileSync(backupRuta, JSON.stringify(backup, null, 2));
  console.log(`Backup de nombres guardado en: ${backupRuta}\n`);
}

const procesados = new Map(); // oldPath -> { nuevaUrl, nuevoPath }
let totalAntes = 0;
let totalDespues = 0;
let reemplazadas = 0;
let omitidas = 0;
let errores = 0;

for (const r of conFoto) {
  const oldPath = extraerPath(r.foto_url);
  if (!oldPath) {
    errores++;
    console.error(`[!] No se pudo extraer el path de: ${r.foto_url}`);
    continue;
  }

  if (procesados.has(oldPath)) {
    continue;
  }

  try {
    const resp = await fetch(r.foto_url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const original = Buffer.from(await resp.arrayBuffer());

    const comprimido = await sharp(original)
      .rotate()
      .resize({
        width: MAX_WIDTH,
        height: MAX_HEIGHT,
        fit: "inside",
        withoutEnlargement: true,
      })
      .flatten({ background: "#FFFFFF" })
      .jpeg({ quality: QUALITY })
      .toBuffer();

    totalAntes += original.length;
    const nuevoPath = nombreJpg(oldPath);

    if (comprimido.length >= original.length) {
      omitidas++;
      console.log(
        `[=] ${oldPath} no se reemplaza (${fmtKb(original.length)} -> ${fmtKb(
          comprimido.length
        )})`
      );
      continue;
    }

    totalDespues += comprimido.length;

    if (!DRY_RUN) {
      const esMismoPath = nuevoPath === oldPath;
      const { error: upErr } = await storage.upload(nuevoPath, comprimido, {
        contentType: "image/jpeg",
        upsert: esMismoPath,
      });
      if (upErr) throw new Error(`upload: ${upErr.message}`);

      if (!esMismoPath) {
        const { data: pub } = storage.getPublicUrl(nuevoPath);
        const nuevaUrl = pub.publicUrl;

        const { error: dbErr } = await supabase
          .from("reportes")
          .update({ foto_url: nuevaUrl })
          .eq("id", r.id);
        if (dbErr) throw new Error(`update reportes: ${dbErr.message}`);

        const { error: delErr } = await storage.remove([oldPath]);
        if (delErr) {
          console.warn(
            `    (aviso) no se pudo borrar el original ${oldPath}: ${delErr.message}`
          );
        }

        procesados.set(oldPath, { nuevaUrl, nuevoPath });
      }
    }

    reemplazadas++;
    console.log(
      `[✓] ${oldPath} -> ${nuevoPath}  (${fmtKb(original.length)} -> ${fmtKb(
        comprimido.length
      )})`
    );
  } catch (err) {
    errores++;
    console.error(`[x] ${oldPath}: ${err.message}`);
  }
}

console.log("\n----------------------------------------");
console.log(`Reemplazadas : ${reemplazadas}`);
console.log(`Omitidas      : ${omitidas}`);
console.log(`Errores       : ${errores}`);
console.log(`Peso antes    : ${fmtMb(totalAntes)}`);
console.log(`Peso después  : ${fmtMb(totalDespues)}`);
if (totalAntes > 0) {
  const ahorro = ((1 - totalDespues / totalAntes) * 100).toFixed(1);
  console.log(`Ahorro aprox. : ${ahorro}% (solo en fotos reemplazadas)`);
}
