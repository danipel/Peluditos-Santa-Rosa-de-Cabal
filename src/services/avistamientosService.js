import { supabase } from "../supabaseClient";
import { uploadFoto } from "./reportesService";

/**
 * Obtiene todos los avistamientos registrados en el sistema ordenados por fecha.
 */
export async function fetchAllAvistamientos() {
  const { data, error } = await supabase
    .from("avistamientos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Obtiene los avistamientos asociados a un reporte específico.
 */
export async function fetchAvistamientosByReporte(reporteId) {
  const { data, error } = await supabase
    .from("avistamientos")
    .select("*")
    .eq("reporte_id", reporteId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Registra un nuevo avistamiento vinculado a un reporte.
 */
export async function createAvistamiento(reporteId, form, file) {
  let foto_url = null;
  if (file) {
    foto_url = await uploadFoto(file);
  }

  const { data, error } = await supabase
    .from("avistamientos")
    .insert({
      reporte_id: reporteId,
      sector: form.sector,
      descripcion: form.descripcion || null,
      telefono: form.telefono || null,
      foto_url,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Suscribe un listener a cambios en tiempo real en la tabla 'avistamientos'.
 */
export function subscribeAvistamientosRealtime(onUpdate) {
  const canal = supabase
    .channel("avistamientos-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "avistamientos" },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(canal);
  };
}
