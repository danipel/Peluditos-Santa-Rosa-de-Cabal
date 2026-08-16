import { supabase } from "../supabaseClient";

/**
 * Obtiene la información del punto de acopio / albergue temporal de una ciudad.
 */
export async function fetchAlbergues(ciudad) {
  const { data, error } = await supabase
    .from("albergue_info")
    .select("*")
    .eq("ciudad", ciudad)
    .order("id", { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Actualiza la información del punto de acopio / albergue temporal (registro id: 1).
 */
export async function updateAlbergueInfo(info) {
  const { error } = await supabase
    .from("albergue_info")
    .update(info)
    .eq("id", 1);

  if (error) throw error;
}
