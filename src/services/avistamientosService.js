import { supabase } from "../supabaseClient";

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
export async function createAvistamiento(reporteId, form) {
  const { error } = await supabase.from("avistamientos").insert({
    reporte_id: reporteId,
    sector: form.sector,
    hora: form.hora || null,
    descripcion: form.descripcion || null,
    telefono: form.telefono || null,
  });

  if (error) throw error;
}

/**
 * Suscribe un listener a cambios en tiempo real en la tabla 'avistamientos'.
 * Retorna una función de limpieza para desuscribirse.
 */
export function subscribeAvistamientosRealtime(onUpdate) {
  const canal = supabase
    .channel("cambios-avistamientos")
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
