import { useState, useEffect, useMemo, useCallback } from "react";
import {
  fetchReportes,
  createReporte,
  updateEstadoReporte,
  deleteReporte,
  subscribeReportesRealtime,
} from "../services/reportesService";

export function useReportes() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroEspecie, setFiltroEspecie] = useState("todas");
  const [busqueda, setBusqueda] = useState("");

  const cargarReportes = useCallback(async () => {
    try {
      const data = await fetchReportes();
      setReportes(data || []);
    } catch (err) {
      setError("No se pudieron cargar los reportes.");
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await cargarReportes();
      if (mounted) setLoading(false);
    })();

    const unsubscribe = subscribeReportesRealtime(() => {
      cargarReportes();
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [cargarReportes]);

  const agregarReporte = async (form, file) => {
    setError("");
    try {
      const pin = await createReporte(form, file);
      await cargarReportes();
      return pin;
    } catch (e) {
      setError("No se pudo publicar el reporte: " + e.message);
      return null;
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await updateEstadoReporte(id, estado);
      await cargarReportes();
    } catch (err) {
      setError("No se pudo actualizar el estado.");
    }
  };

  const borrarReporte = async (id) => {
    try {
      await deleteReporte(id);
      await cargarReportes();
    } catch (err) {
      setError("No se pudo eliminar el reporte.");
    }
  };

  const coincidencias = useCallback(
    (reporte) => {
      if (reporte.estado === "reunido") return [];
      const tipoBuscado =
        reporte.estado === "perdido"
          ? ["avistado", "en_albergue"]
          : ["perdido"];

      return reportes.filter(
        (r) =>
          r.id !== reporte.id &&
          tipoBuscado.includes(r.estado) &&
          r.especie === reporte.especie &&
          r.sector?.trim().toLowerCase() === reporte.sector?.trim().toLowerCase()
      );
    },
    [reportes]
  );

  const filtrados = useMemo(() => {
    return reportes.filter((r) => {
      if (filtroTipo !== "todos" && r.estado !== filtroTipo) return false;
      if (filtroEspecie !== "todas" && r.especie !== filtroEspecie) return false;
      if (busqueda.trim()) {
        const q = busqueda.trim().toLowerCase();
        const campo = `${r.nombre || ""} ${r.color || ""} ${r.sector || ""} ${r.descripcion || ""}`.toLowerCase();
        if (!campo.includes(q)) return false;
      }
      return true;
    });
  }, [reportes, filtroTipo, filtroEspecie, busqueda]);

  return {
    reportes,
    filtrados,
    loading,
    error,
    setError,
    filtroTipo,
    setFiltroTipo,
    filtroEspecie,
    setFiltroEspecie,
    busqueda,
    setBusqueda,
    agregarReporte,
    cambiarEstado,
    borrarReporte,
    coincidencias,
    cargarReportes,
  };
}
