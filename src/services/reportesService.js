import { supabase } from "../supabaseClient";
import { comprimirImagen } from "../utils/imagen";

/**
 * Obtiene los reportes ordenados por fecha de creación descendente.
 * Si se pasa una ciudad distinta de "Todos", filtra por esa ciudad.
 */
export async function fetchReportes(ciudad) {
  let query = supabase
    .from("reportes")
    .select("*")
    .order("created_at", { ascending: false });

  if (ciudad && ciudad !== "Todos") {
    query = query.eq("ciudad", ciudad);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * Obtiene el conteo global de reportes (por estado y por especie) en toda Risaralda.
 * Se usa para el resumen (TL;DR) de la página de inicio.
 */
export async function fetchConteosGlobales() {
  const { data, error } = await supabase
    .from("reportes")
    .select("estado, especie");

  if (error) throw error;

  const porEstado = {};
  const porEspecie = {};

  (data || []).forEach((r) => {
    if (r.estado) porEstado[r.estado] = (porEstado[r.estado] || 0) + 1;
    if (r.especie) porEspecie[r.especie] = (porEspecie[r.especie] || 0) + 1;
  });

  return {
    total: (data || []).length,
    porEstado,
    porEspecie,
  };
}

/**
 * Sube una fotografía al bucket 'fotos' de Supabase Storage y retorna la URL pública.
 * La imagen se redimensiona (máx. 800px) y comprime (~70% de calidad) en el
 * navegador antes de subirla para reducir el consumo de ancho de banda.
 */
export async function uploadFoto(file) {
  const imagen = await comprimirImagen(file);
  const ext = imagen.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("fotos")
    .upload(path, imagen);
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
    ciudad: form.ciudad,
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
 * Retorna una función de limpieza para desuscribirse.
 */
export function subscribeReportesRealtime(ciudad, onUpdate) {
  const canal = supabase
    .channel(`cambios-reportes-${ciudad}`)
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
