import { useState, useEffect, useMemo, useCallback } from "react";
import {
  fetchReportes,
  createReporte,
  updateEstadoReporte,
  deleteReporte,
  subscribeReportesRealtime,
} from "../services/reportesService";
import {
  fetchAllAvistamientos,
  createAvistamiento,
  subscribeAvistamientosRealtime,
} from "../services/avistamientosService";
import { ESTADOS } from "../constants/mascotas";

/**
 * Hook que centraliza el dominio de reportes y avistamientos:
 * carga de datos, filtros, conteos, coincidencias y acciones de mutación.
 */
export function useReportes(ciudad) {
  const [reportes, setReportes] = useState([]);
  const [avistamientos, setAvistamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filtroCategoria, setFiltroCategoria] = useState("mascotas");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroEspecie, setFiltroEspecie] = useState("todas");
  const [busqueda, setBusqueda] = useState("");

  const cargarReportes = useCallback(async () => {
    if (!ciudad) return;
    try {
      const data = await fetchReportes(ciudad);
      setReportes(data || []);
    } catch (err) {
      setError("No se pudieron cargar los reportes.");
    } finally {
      setLoading(false);
    }
  }, [ciudad]);

  const cargarAvistamientos = useCallback(async () => {
    try {
      const data = await fetchAllAvistamientos();
      setAvistamientos(data || []);
    } catch (err) {
      // Silencioso: los avistamientos son información complementaria
    }
  }, []);

  useEffect(() => {
    if (!ciudad) return;

    setLoading(true);
    cargarReportes();
    cargarAvistamientos();

    const unsubscribeReportes = subscribeReportesRealtime(ciudad, () => {
      cargarReportes();
    });
    const unsubscribeAvistamientos = subscribeAvistamientosRealtime(() => {
      cargarAvistamientos();
    });

    return () => {
      unsubscribeReportes();
      unsubscribeAvistamientos();
    };
  }, [ciudad, cargarReportes, cargarAvistamientos]);

  // ---------------------------------------------------------
  // Mutaciones
  // ---------------------------------------------------------

  const agregarReporte = async (form, file) => {
    setError("");

    if (!ciudad) {
      setError("No se pudo determinar el ciudad del reporte.");
      return null;
    }

    try {
      const pin = await createReporte(form, file);
      await cargarReportes();
      return pin;
    } catch (e) {
      setError("No se pudo publicar el reporte: " + e.message);
      return null;
    }
  };

  const agregarAvistamiento = async (reporte_id, form) => {
    setError("");

    try {
      await createAvistamiento(reporte_id, form);
      await cargarAvistamientos();
      return true;
    } catch (e) {
      setError("No se pudo guardar el avistamiento: " + e.message);
      return false;
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
    if (
      !window.confirm(
        "¿Seguro que deseas eliminar este reporte? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    try {
      await deleteReporte(id);
      await cargarReportes();
      await cargarAvistamientos();
    } catch (err) {
      setError(
        err?.message?.includes("RLS")
          ? err.message
          : "No se pudo eliminar el reporte."
      );
    }
  };

  // ---------------------------------------------------------
  // Filtros
  // ---------------------------------------------------------

  const cumpleFiltrosBase = useCallback(
    (r) => {
      if (filtroCategoria === "mascotas" && r.especie === "persona") {
        return false;
      }

      if (filtroCategoria === "personas" && r.especie !== "persona") {
        return false;
      }

      if (
        filtroCategoria === "mascotas" &&
        filtroEspecie !== "todas" &&
        r.especie !== filtroEspecie
      ) {
        return false;
      }

      if (busqueda.trim()) {
        const q = busqueda.trim().toLowerCase();
        const campo = `${r.nombre || ""}`.toLowerCase();

        if (!campo.includes(q)) {
          return false;
        }
      }

      return true;
    },
    [filtroCategoria, filtroEspecie, busqueda]
  );

  const filtrados = useMemo(() => {
    return reportes.filter((r) => {
      if (!cumpleFiltrosBase(r)) return false;

      if (filtroTipo !== "todos" && r.estado !== filtroTipo) {
        return false;
      }

      return true;
    });
  }, [reportes, cumpleFiltrosBase, filtroTipo]);

  const conteos = useMemo(() => {
    const resultado = { todos: 0 };

    Object.keys(ESTADOS).forEach((estado) => {
      resultado[estado] = 0;
    });

    reportes.forEach((r) => {
      if (!cumpleFiltrosBase(r)) return;

      resultado.todos += 1;

      if (resultado[r.estado] !== undefined) {
        resultado[r.estado] += 1;
      }
    });

    return resultado;
  }, [reportes, cumpleFiltrosBase]);

  const conteosPorEspecie = useMemo(() => {
    const resultado = {};

    reportes.forEach((r) => {
      if (!cumpleFiltrosBase(r)) return;

      const clave = r.especie || "otro";
      resultado[clave] = (resultado[clave] || 0) + 1;
    });

    return resultado;
  }, [reportes, cumpleFiltrosBase]);

  // ---------------------------------------------------------
  // Coincidencias (actividad en el mismo sector)
  // ---------------------------------------------------------

  const coincidencias = useCallback(
    (reporte) => {
      if (reporte.estado === "reunido") {
        return [];
      }

      const enSuSector = (arr) =>
        arr.filter(
          (x) =>
            x.sector &&
            reporte.sector &&
            x.sector.trim().toLowerCase() ===
              reporte.sector.trim().toLowerCase()
        );

      if (reporte.estado === "perdido") {
        const avistadosCoincidentes = enSuSector(
          avistamientos.filter((a) => a.reporte_id !== reporte.id)
        );

        const enAlbergueCoincidentes = enSuSector(
          reportes.filter(
            (r) =>
              r.id !== reporte.id &&
              r.estado === "en_albergue" &&
              r.especie === reporte.especie
          )
        );

        return [...avistadosCoincidentes, ...enAlbergueCoincidentes];
      }

      return [];
    },
    [reportes, avistamientos]
  );

  return {
    reportes,
    avistamientos,
    loading,
    error,
    setError,
    filtroCategoria,
    setFiltroCategoria,
    filtroTipo,
    setFiltroTipo,
    filtroEspecie,
    setFiltroEspecie,
    busqueda,
    setBusqueda,
    filtrados,
    conteos,
    conteosPorEspecie,
    coincidencias,
    agregarReporte,
    agregarAvistamiento,
    cambiarEstado,
    borrarReporte,
    cargarReportes,
  };
}
