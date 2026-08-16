import { Search } from "lucide-react";
import { ESTADOS } from "../../constants/mascotas";
import "./ReportesFiltros.css";

export default function ReportesFiltros({
  busqueda,
  setBusqueda,
  filtroEspecie,
  setFiltroEspecie,
  filtroTipo,
  setFiltroTipo,
}) {
  const tipos = ["todos", "perdido", "avistado", "en_albergue", "reunido"];

  return (
    <div>
      <div className="reportes-filtros">
        <div className="reportes-filtros-busqueda">
          <Search size={15} className="reportes-filtros-icono" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, color, sector..."
            className="reportes-filtros-input"
          />
        </div>
        <select
          value={filtroEspecie}
          onChange={(e) => setFiltroEspecie(e.target.value)}
          className="reportes-filtros-select"
        >
          <option value="todas">Todas las especies</option>
          <option value="perro">Perros</option>
          <option value="gato">Gatos</option>
        </select>
      </div>

      <div className="reportes-filtros-estados">
        {tipos.map((t) => (
          <button
            key={t}
            onClick={() => setFiltroTipo(t)}
            className={`reportes-filtro-boton ${
              filtroTipo === t ? "reportes-filtro-boton--activo" : ""
            }`}
          >
            {t === "todos" ? "Todos" : ESTADOS[t]?.label || t}
          </button>
        ))}
      </div>
    </div>
  );
}
