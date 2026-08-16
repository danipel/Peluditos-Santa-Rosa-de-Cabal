import { Plus } from "lucide-react";
import "./BotonReportar.css";

export default function BotonReportar({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="boton-reportar"
      aria-label="Crear un reporte"
    >
      <Plus size={19} strokeWidth={2.5} /> Reportar
    </button>
  );
}
