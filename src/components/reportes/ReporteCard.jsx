import { useState } from "react";
import { MapPin, Phone, MessageCircle, PawPrint, AlertCircle, Copy, Check } from "lucide-react";
import { ESTADOS, ESPECIES } from "../../constants/mascotas";
import ImageModal from "../common/ImageModal";

const estilos = `
  .reporte-card-item {
    min-height: 60vh;
    height: auto;
    display: flex;
    flex-direction: column;
    background: #fff;
    border: 1px solid #E0DDD5;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .reporte-card-imagen {
    height: 50vh;
    flex: 0 0 50vh;
    width: 100%;
    background: #EFEDE6;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .reporte-card-info-wrapper {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #fff;
  }

  .reporte-card-info-scroll {
    flex: 1 1 auto;
    padding: 12px 14px;
  }

  .reporte-card-acciones {
    flex-shrink: 0;
    display: flex;
    border-top: 1px solid #EAE8E1;
    background: #fff;
    margin-top: auto;
  }

  @media (min-width: 640px) {
    .reporte-card-item {
      min-height: unset;
      height: auto;
    }
    .reporte-card-imagen {
      height: 200px;
      flex: none;
    }
    .reporte-card-info-wrapper {
      height: auto;
      flex: 1 1 auto;
      justify-content: flex-start;
    }
    .reporte-card-info-scroll {
      flex: 1 1 auto;
      padding: 14px;
    }
    .reporte-card-acciones {
      margin-top: auto;
    }
  }
`;

export default function ReporteCard({ reporte, coincidencias = [], onCambiarEstado }) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [copiado, setCopiado] = useState(false);

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

  const handleCopiarTelefono = async () => {
    if (!reporte.telefono) return;
    try {
      await navigator.clipboard.writeText(reporte.telefono);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error("Error al copiar al portapapeles:", err);
    }
  };

  return (
    <>
      <style>{estilos}</style>
      <div className="reporte-card-item">
        <div
          onClick={() => {
            if (reporte.foto_url) setShowImageModal(true);
          }}
          onKeyDown={(e) => {
            if (reporte.foto_url && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              setShowImageModal(true);
            }
          }}
          tabIndex={reporte.foto_url ? 0 : undefined}
          role={reporte.foto_url ? "button" : undefined}
          aria-label={reporte.foto_url ? "Ver foto en pantalla completa" : undefined}
          title={reporte.foto_url ? "Clic para ver en pantalla completa" : undefined}
          className="reporte-card-imagen"
          style={{
            cursor: reporte.foto_url ? "pointer" : "default",
          }}
        >
          {reporte.foto_url ? (
            <img
              src={reporte.foto_url}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <PawPrint size={32} color="#B4AF9F" />
          )}
        </div>

        <div className="reporte-card-info-wrapper">
          <div className="reporte-card-info-scroll">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 8,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 16.5, color: "#1E1E1C", lineHeight: 1.3 }}>
                {reporte.nombre ? reporte.nombre : (ESPECIES[reporte.especie] || reporte.especie)}{" "}
                <span
                  style={{
                    fontWeight: 400,
                    color: "#72726C",
                    fontSize: 13.5,
                  }}
                >
                  {reporte.nombre ? `· ${ESPECIES[reporte.especie] || reporte.especie}` : ""}
                </span>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: estado.color,
                  background: estado.bg,
                  padding: "3px 10px",
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                  letterSpacing: 0.2,
                }}
              >
                {estado.label}
              </span>
            </div>

            <div style={{ fontSize: 14, color: "#42423E", marginTop: 4, lineHeight: 1.4 }}>
              {reporte.color}
              {reporte.tamano ? ` · ${reporte.tamano}` : ""}
            </div>

            <div
              style={{
                fontSize: 13.5,
                color: "#6E6E68",
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginTop: 4,
              }}
            >
              <MapPin size={14} color="#8A8A85" /> {reporte.sector}
            </div>

            {reporte.telefono && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 6,
                  padding: "4px 10px",
                  background: "#F5F4F0",
                  borderRadius: 8,
                  border: "1px solid #E3E0D8",
                  fontSize: 13,
                  width: "fit-content",
                }}
              >
                <Phone size={13} color="#7A7870" />
                <span style={{ fontWeight: 600, color: "#1E1E1C" }}>
                  {reporte.telefono}
                </span>
                <button
                  type="button"
                  onClick={handleCopiarTelefono}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                    background: copiado ? "#1F6E5C" : "#E5E3DC",
                    color: copiado ? "#FFFFFF" : "#3A3A36",
                    border: "none",
                    borderRadius: 5,
                    padding: "3px 7px",
                    fontSize: 11.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    marginLeft: 4,
                  }}
                  title="Copiar número de contacto"
                  aria-label="Copiar número de teléfono"
                >
                  {copiado ? (
                    <>
                      <Check size={12} />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {reporte.descripcion && (
              <div
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.45,
                  color: "#4A4A46",
                  marginTop: 6,
                  background: "#FAFAF8",
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid #F0EFEA",
                }}
              >
                {reporte.descripcion}
              </div>
            )}

            {coincidencias.length > 0 && (
              <div
                style={{
                  background: "#FAF1D6",
                  padding: "10px 14px",
                  fontSize: 13.5,
                  color: "#7A5F00",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  borderRadius: 6,
                  marginTop: 8,
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>
                  Posible coincidencia con {coincidencias.length} reporte
                  {coincidencias.length > 1 ? "s" : ""} en el mismo sector.
                </span>
              </div>
            )}
          </div>

          <div className="reporte-card-acciones">
            {tel && reporte.estado !== "reunido" && (
              <a
                href={`https://wa.me/57${tel}?text=${waMsg}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "12px 0",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#1F6E5C",
                  textDecoration: "none",
                  display: "flex",
                  justifyContent: "center",
                  gap: 6,
                  alignItems: "center",
                  borderRight: "1px solid #EAE8E1",
                  transition: "background 0.15s ease",
                }}
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
            )}
            <select
              value={reporte.estado}
              onChange={(e) => onCambiarEstado(reporte.id, e.target.value)}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                fontSize: 13.5,
                fontWeight: 600,
                color: "#3A3A36",
                textAlign: "center",
                padding: "12px 0",
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

        {showImageModal && reporte.foto_url && (
          <ImageModal
            src={reporte.foto_url}
            alt={reporte.nombre || ESPECIES[reporte.especie] || reporte.especie}
            title={
              reporte.nombre
                ? `${reporte.nombre} · ${ESPECIES[reporte.especie] || reporte.especie}`
                : ESPECIES[reporte.especie] || reporte.especie
            }
            subtitle={`${reporte.sector ? `Sector: ${reporte.sector}` : ""}${
              reporte.color ? ` · Color: ${reporte.color}` : ""
            } · Estado: ${estado.label}`}
            onClose={() => setShowImageModal(false)}
          />
        )}
      </div>
    </>
  );
}
