import { Loader2 } from "lucide-react";
import ReporteCard from "./ReporteCard";
import "./ReportesLista.css";

export default function ReportesLista({
  reportes,
  loading,
  coincidencias,
  onCambiarEstado,
}) {
  if (loading) {
    return (
      <div className="reportes-lista-cargando">
        <Loader2 className="animate-spin" size={16} /> Cargando reportes...
      </div>
    );
  }

  if (reportes.length === 0) {
    return (
      <div className="reportes-lista-vacia">
        No hay reportes con estos filtros todavía.
      </div>
    );
  }

  return (
    <div className="reportes-lista">
      {reportes.map((reporte) => (
        <ReporteCard
          key={reporte.id}
          reporte={reporte}
          coincidencias={coincidencias(reporte)}
          onCambiarEstado={onCambiarEstado}
        />
      ))}
    </div>
  );
}
