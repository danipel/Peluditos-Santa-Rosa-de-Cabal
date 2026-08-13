import { useState, useEffect, useCallback } from "react";
import { fetchAlbergueInfo, updateAlbergueInfo } from "../services/albergueService";

export function useAlbergue() {
  const [albergue, setAlbergue] = useState({
    nombre: "",
    direccion: "",
    horario: "",
  });
  const [loadingAlbergue, setLoadingAlbergue] = useState(true);
  const [albergueError, setAlbergueError] = useState("");

  const cargarAlbergue = useCallback(async () => {
    try {
      const data = await fetchAlbergueInfo();
      if (data) {
        setAlbergue(data);
      }
    } catch (err) {
      // Si no existe aún o falla, mantenemos los valores por defecto
    } finally {
      setLoadingAlbergue(false);
    }
  }, []);

  useEffect(() => {
    cargarAlbergue();
  }, [cargarAlbergue]);

  const guardarAlbergue = async (info) => {
    setAlbergueError("");
    try {
      await updateAlbergueInfo(info);
      setAlbergue(info);
      return true;
    } catch (err) {
      setAlbergueError("No se pudo guardar la info del albergue.");
      return false;
    }
  };

  return {
    albergue,
    loadingAlbergue,
    albergueError,
    setAlbergueError,
    guardarAlbergue,
    cargarAlbergue,
  };
}
