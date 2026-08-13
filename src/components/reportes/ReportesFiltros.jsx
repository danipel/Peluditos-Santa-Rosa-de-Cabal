import { Search } from "lucide-react";
import { ESTADOS } from "../../constants/mascotas";

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
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: "1 1 160px" }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              left: 10,
              top: 10,
              color: "#9A9A94",
            }}
          />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, color, sector..."
            style={{
              width: "100%",
              padding: "8px 10px 8px 32px",
              borderRadius: 8,
              border: "1px solid #DAD6CC",
              fontSize: 13.5,
              boxSizing: "border-box",
            }}
          />
        </div>
        <select
          value={filtroEspecie}
          onChange={(e) => setFiltroEspecie(e.target.value)}
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid #DAD6CC",
            fontSize: 13.5,
            background: "#fff",
          }}
        >
          <option value="todas">Todas las especies</option>
          <option value="perro">Perros</option>
          <option value="gato">Gatos</option>
        </select>
      </div>

      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        {tipos.map((t) => (
          <button
            key={t}
            onClick={() => setFiltroTipo(t)}
            style={{
              padding: "5px 12px",
              borderRadius: 999,
              border:
                "1px solid " + (filtroTipo === t ? "#1F3A34" : "#DAD6CC"),
              background: filtroTipo === t ? "#1F3A34" : "#fff",
              color: filtroTipo === t ? "#fff" : "#4A4A47",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t === "todos" ? "Todos" : ESTADOS[t]?.label || t}
          </button>
        ))}
      </div>
    </div>
  );
}
