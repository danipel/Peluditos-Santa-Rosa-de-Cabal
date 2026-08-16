import { Plus } from "lucide-react";
import "./CtaReportar.css";

export default function CtaReportar({
  titulo,
  texto,
  etiquetaBoton = "Reportar mascota",
  onReportar,
  onVerReportes,
}) {
  return (
    <section className="cta-reportar">
      <div className="cta-reportar-contenido">
        <h2 className="cta-reportar-titulo">{titulo}</h2>

        {texto && <p className="cta-reportar-texto">{texto}</p>}
      </div>

      <div className="cta-reportar-acciones">
        {onVerReportes && (
          <button
            type="button"
            onClick={onVerReportes}
            className="cta-reportar-boton cta-reportar-boton--secundario"
          >
            Ver reportes
          </button>
        )}

        <button
          type="button"
          onClick={onReportar}
          className="cta-reportar-boton cta-reportar-boton--primario"
        >
          <Plus size={18} /> {etiquetaBoton}
        </button>
      </div>
    </section>
  );
}
