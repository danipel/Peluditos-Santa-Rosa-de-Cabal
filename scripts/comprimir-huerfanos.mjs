/**
 * Comprime en el lugar (sin borrar) los archivos huérfanos del bucket 'fotos',
 * es decir, los que no están referenciados por ningún reporte.
 *
 * Descarga cada archivo, lo redimensiona a máx. 800px y lo re-codifica a JPEG
 * calidad 70. Solo sobrescribe si el resultado pesa menos. Conserva el mismo
 * nombre para no romper URLs ya compartidas.
 *
 * Uso:
 *   node scripts/comprimir-huerfanos.mjs
 *   DRY_RUN=1 node scripts/comprimir-huerfanos.mjs   # solo simula
 */

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { readFileSync } from "node:fs";
import path from "node:path";

const DRY_RUN = process.env.DRY_RUN === "1";
const MAX_WIDTH = 800;
const MAX_HEIGHT = 800;
const QUALITY = 70;

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

const env = cargarEnv(path.resolve(process.cwd(), ".env"));
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_SERVICE_KEY;
if (!env.VITE_SUPABASE_URL || !key) {
  console.error("Faltan credenciales en .env");
  process.exit(1);
}

const supabase = createClient(env.VITE_SUPABASE_URL, key);
const storage = supabase.storage.from("fotos");

console.log(
  `Modo: ${DRY_RUN ? "SIMULACIÓN (no escribe)" : "REAL"}\n` +
    `Parámetros: máx ${MAX_WIDTH}px, JPEG calidad ${QUALITY}\n`
);

const { data: files, error: listErr } = await storage.list();
if (listErr) {
  console.error("Error al listar el bucket:", listErr.message);
  process.exit(1);
}

const { data: reportes } = await supabase
  .from("reportes")
  .select("foto_url")
  .not("foto_url", "is", null);

const referenciados = new Set(
  (reportes || [])
    .map((r) => {
      const m = r.foto_url.match(/\/fotos\/(.+)$/);
      return m ? decodeURIComponent(m[1]) : null;
    })
    .filter(Boolean)
);

const huerfanos = (files || []).filter((f) => !referenciados.has(f.name));
console.log(`Archivos en bucket: ${(files || []).length}`);
console.log(`Huérfanos encontrados: ${huerfanos.length}\n`);

const fmtKb = (b) => `${(b / 1024).toFixed(1)} KB`;
let totalAntes = 0;
let totalDespues = 0;
let comprimidos = 0;
let omitidos = 0;
let errores = 0;

for (const f of huerfanos) {
  const publicUrl = `${env.VITE_SUPABASE_URL}/storage/v1/object/public/fotos/${encodeURIComponent(
    f.name
  )}`;
  try {
    const resp = await fetch(publicUrl);
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

    if (comprimido.length >= original.length) {
      omitidos++;
      console.log(
        `[=] ${f.name} no se comprime (${fmtKb(original.length)} -> ${fmtKb(
          comprimido.length
        )})`
      );
      continue;
    }

    totalDespues += comprimido.length;

    if (!DRY_RUN) {
      const { error: upErr } = await storage.upload(f.name, comprimido, {
        contentType: "image/jpeg",
        upsert: true,
      });
      if (upErr) throw new Error(`upload: ${upErr.message}`);
    }

    comprimidos++;
    console.log(
      `[✓] ${f.name}  (${fmtKb(original.length)} -> ${fmtKb(comprimido.length)})`
    );
  } catch (err) {
    errores++;
    console.error(`[x] ${f.name}: ${err.message}`);
  }
}

console.log("\n----------------------------------------");
console.log(`Comprimidos : ${comprimidos}`);
console.log(`Omitidos    : ${omitidos}`);
console.log(`Errores     : ${errores}`);
console.log(`Peso antes  : ${fmtKb(totalAntes)}`);
console.log(`Peso después: ${fmtKb(totalDespues)}`);
