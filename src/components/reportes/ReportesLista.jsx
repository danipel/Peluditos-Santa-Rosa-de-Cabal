import { Loader2 } from "lucide-react";
import ReporteCard from "./ReporteCard";

export default function ReportesLista({
  reportes,
  loading,
  coincidencias,
  onCambiarEstado,
}) {
  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: 40,
          color: "#9A9A94",
          fontSize: 13.5,
          display: "flex",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <Loader2 className="animate-spin" size={16} /> Cargando reportes...
      </div>
    );
  }

  if (reportes.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: 40,
          color: "#9A9A94",
          fontSize: 13.5,
        }}
      >
        No hay reportes con estos filtros todavía.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
