import { MapPin, Phone, MessageCircle, PawPrint, AlertCircle } from "lucide-react";
import { ESTADOS, ESPECIES } from "../../constants/mascotas";

export default function ReporteCard({ reporte, coincidencias = [], onCambiarEstado }) {
  const estado = ESTADOS[reporte.estado] || {
    label: reporte.estado,
    color: "#5B5B5B",
    bg: "#EBEBEB",
  };
  const tel = (reporte.telefono || "").replace(/\D/g, "");
  const especieTexto = (ESPECIES[reporte.especie] || reporte.especie || "").toLowerCase();
  const waMsg = encodeURIComponent(
    `Hola, escribo por el reporte de ${especieTexto} en ${reporte.sector} (Mascotas Perdidas Santa Rosa de Cabal).`
  );

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #DAD6CC",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", gap: 12, padding: 12 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 10,
            background: "#EFEDE6",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {reporte.foto_url ? (
            <img
              src={reporte.foto_url}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <PawPrint size={26} color="#B4AF9F" />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 6,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>
              {reporte.nombre ? reporte.nombre : (ESPECIES[reporte.especie] || reporte.especie)}{" "}
              <span
                style={{
                  fontWeight: 400,
                  color: "#8A8A85",
                  fontSize: 12.5,
                }}
              >
                {reporte.nombre ? `· ${ESPECIES[reporte.especie] || reporte.especie}` : ""}
              </span>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: estado.color,
                background: estado.bg,
                padding: "2px 8px",
                borderRadius: 999,
                whiteSpace: "nowrap",
              }}
            >
              {estado.label}
            </span>
          </div>
          <div style={{ fontSize: 13, color: "#4A4A47", marginTop: 3 }}>
            {reporte.color}
            {reporte.tamano ? ` · ${reporte.tamano}` : ""}
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: "#8A8A85",
              display: "flex",
              alignItems: "center",
              gap: 3,
              marginTop: 3,
            }}
          >
            <MapPin size={12} /> {reporte.sector}
          </div>
          {reporte.descripcion && (
            <div
              style={{
                fontSize: 12.5,
                color: "#5B5B57",
                marginTop: 4,
              }}
            >
              {reporte.descripcion}
            </div>
          )}
        </div>
      </div>

      {coincidencias.length > 0 && (
        <div
          style={{
            background: "#FAF1D6",
            padding: "8px 12px",
            fontSize: 12.5,
            color: "#7A5F00",
            display: "flex",
            gap: 6,
          }}
        >
          <AlertCircle size={14} style={{ marginTop: 1, flexShrink: 0 }} />
          <span>
            Posible coincidencia con {coincidencias.length} reporte
            {coincidencias.length > 1 ? "s" : ""} en el mismo sector.
          </span>
        </div>
      )}

      <div style={{ display: "flex", borderTop: "1px solid #EFEDE6" }}>
        {tel && reporte.estado !== "reunido" && (
          <>
            <a
              href={`tel:${tel}`}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "9px 0",
                fontSize: 12.5,
                fontWeight: 600,
                color: "#1F3A34",
                textDecoration: "none",
                display: "flex",
                justifyContent: "center",
                gap: 5,
                alignItems: "center",
                borderRight: "1px solid #EFEDE6",
              }}
            >
              <Phone size={13} /> Llamar
            </a>
            <a
              href={`https://wa.me/57${tel}?text=${waMsg}`}
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1,
                textAlign: "center",
                padding: "9px 0",
                fontSize: 12.5,
                fontWeight: 600,
                color: "#1F6E5C",
                textDecoration: "none",
                display: "flex",
                justifyContent: "center",
                gap: 5,
                alignItems: "center",
                borderRight: "1px solid #EFEDE6",
              }}
            >
              <MessageCircle size={13} /> WhatsApp
            </a>
          </>
        )}
        <select
          value={reporte.estado}
          onChange={(e) => onCambiarEstado(reporte.id, e.target.value)}
          style={{
            flex: 1.2,
            border: "none",
            background: "transparent",
            fontSize: 12.5,
            fontWeight: 600,
            color: "#4A4A47",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          {Object.entries(ESTADOS).map(([k, v]) => (
            <option key={k} value={k}>
              Marcar: {v.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
