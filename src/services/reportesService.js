import { supabase } from "../supabaseClient";

/**
 * Obtiene todos los reportes ordenados por fecha de creación descendente.
 */
export async function fetchReportes() {
  const { data, error } = await supabase
    .from("reportes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Sube una fotografía al bucket 'fotos' de Supabase Storage y retorna la URL pública.
 */
export async function uploadFoto(file) {
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: uploadError } = await supabase.storage.from("fotos").upload(path, file);
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("fotos").getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Registra un nuevo reporte en la base de datos con un PIN generado de 4 dígitos.
 */
export async function createReporte(form, file) {
  let foto_url = null;
  if (file) {
    foto_url = await uploadFoto(file);
  }

  const pin = Math.floor(1000 + Math.random() * 9000).toString();

  const { error } = await supabase.from("reportes").insert({
    estado: form.estado,
    especie: form.especie,
    nombre: form.nombre || null,
    color: form.color,
    tamano: form.tamano || null,
    sector: form.sector,
    descripcion: form.descripcion || null,
    foto_url,
    telefono: form.telefono,
    pin,
  });

  if (error) throw error;
  return pin;
}

/**
 * Actualiza el estado de un reporte específico.
 */
export async function updateEstadoReporte(id, estado) {
  const { error } = await supabase
    .from("reportes")
    .update({ estado })
    .eq("id", id);

  if (error) throw error;
}

/**
 * Elimina un reporte y sus avistamientos asociados.
 */
export async function deleteReporte(id) {
  const { error: avistamientosError } = await supabase
    .from("avistamientos")
    .delete()
    .eq("reporte_id", id);

  if (avistamientosError) throw avistamientosError;

  const { data, error } = await supabase
    .from("reportes")
    .delete()
    .eq("id", id)
    .select();

  if (error) throw error;

  if (!data || data.length === 0) {
    throw new Error(
      "No se pudo eliminar: falta la política RLS de DELETE en Supabase."
    );
  }
}

/**
 * Suscribe un listener a cambios en tiempo real en la tabla 'reportes'.
 */
export function subscribeReportesRealtime(onUpdate) {
  const canal = supabase
    .channel("reportes-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "reportes" },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(canal);
  };
}
