import { useState, useEffect, useCallback } from "react";
import { fetchAlbergues, updateAlbergueInfo } from "../services/albergueService";

/**
 * Hook que gestiona la información del punto de acopio / albergue temporal
 * de una ciudad determinada.
 */
export function useAlbergue(ciudad) {
  const [albergues, setAlbergues] = useState([]);

  const cargarAlbergue = useCallback(async () => {
    if (!ciudad) return;
    try {
      const data = await fetchAlbergues(ciudad);
      setAlbergues(data || []);
    } catch (err) {
      // Silencioso: si no hay datos, se muestra el estado "sin registrar"
    }
  }, [ciudad]);

  useEffect(() => {
    cargarAlbergue();
  }, [cargarAlbergue]);

  const guardarAlbergue = async (info) => {
    try {
      await updateAlbergueInfo(info);
      await cargarAlbergue();
      return true;
    } catch (err) {
      return false;
    }
  };

  return {
    albergues,
    cargarAlbergue,
    guardarAlbergue,
  };
}
