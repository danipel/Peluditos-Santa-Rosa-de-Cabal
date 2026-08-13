import { Home } from "lucide-react";

export default function AlbergueBanner({ albergue, onEditar }) {
  const tieneDatos = Boolean(albergue?.nombre || albergue?.direccion);

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #DAD6CC",
        borderLeft: "4px solid #1F6E5C",
        borderRadius: 10,
        padding: "12px 14px",
        marginBottom: 16,
        display: "flex",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", gap: 10 }}>
        <Home
          size={18}
          color="#1F6E5C"
          style={{ marginTop: 2, flexShrink: 0 }}
        />
        <div>
          <div style={{ fontWeight: 700, fontSize: 13.5 }}>
            Punto de acopio / albergue temporal
          </div>
          {tieneDatos ? (
            <div style={{ fontSize: 13, color: "#4A4A47", marginTop: 2 }}>
              {albergue.nombre && <div>{albergue.nombre}</div>}
              {albergue.direccion && <div>{albergue.direccion}</div>}
              {albergue.horario && (
                <div style={{ opacity: 0.8 }}>
                  Horario: {albergue.horario}
                </div>
              )}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "#8A8A85", marginTop: 2 }}>
              Aún no se ha registrado la ubicación
            </div>
          )}
        </div>
      </div>
      <button
        onClick={onEditar}
        style={{
          fontSize: 12,
          color: "#1F6E5C",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Editar
      </button>
    </div>
  );
}
