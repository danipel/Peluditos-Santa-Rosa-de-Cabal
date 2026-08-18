import { useState } from "react";
import { MapPin, Phone, MessageCircle, PawPrint, AlertCircle, Copy, Check } from "lucide-react";
import { ESTADOS, ESPECIES } from "../../constants/mascotas";
import { conTransformacion } from "../../utils/imagen";
import ImageModal from "../common/ImageModal";
import "./ReporteCard.css";

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
        className={`reporte-card-imagen ${
          reporte.foto_url ? "reporte-card-imagen--clicable" : ""
        }`}
      >
        {reporte.foto_url ? (
          <img src={conTransformacion(reporte.foto_url)} alt="" />
        ) : (
          <PawPrint size={32} color="#B4AF9F" />
        )}
      </div>

      <div className="reporte-card-info-wrapper">
        <div className="reporte-card-info-scroll">
          <div className="reporte-card-cabecera">
            <h2 className="reporte-card-nombre">
              {reporte.nombre ? reporte.nombre : (ESPECIES[reporte.especie] || reporte.especie)}{" "}
              <span className="reporte-card-nombre-especie">
                {reporte.nombre ? `· ${ESPECIES[reporte.especie] || reporte.especie}` : ""}
              </span>
            </h2>
            <span
              className="reporte-card-etiqueta"
              style={{ color: estado.color, background: estado.bg }}
            >
              {estado.label}
            </span>
          </div>

          <section className="reporte-card-señas">
            <h3 className="reporte-card-señas-titulo">Señas particulares</h3>

            <div className="reporte-card-dato">
              {reporte.color}
              {reporte.tamano ? ` · ${reporte.tamano}` : ""}
            </div>

            <div className="reporte-card-sector">
              <MapPin size={14} color="#8A8A85" /> {reporte.sector}
            </div>

            {reporte.telefono && (
              <div className="reporte-card-telefono">
                <Phone size={13} color="#7A7870" />
                <span className="reporte-card-telefono-numero">
                  {reporte.telefono}
                </span>
                <button
                  type="button"
                  onClick={handleCopiarTelefono}
                  className={`reporte-card-copiar ${
                    copiado ? "reporte-card-copiar--copiado" : ""
                  }`}
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
              <div className="reporte-card-descripcion">
                {reporte.descripcion}
              </div>
            )}
          </section>

          {coincidencias.length > 0 && (
            <div className="reporte-card-coincidencia">
              <AlertCircle size={15} className="reporte-card-coincidencia-icono" />
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
              className="reporte-card-whatsapp"
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
          )}
          <select
            value={reporte.estado}
            onChange={(e) => onCambiarEstado(reporte.id, e.target.value)}
            className="reporte-card-select"
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
  );
}
