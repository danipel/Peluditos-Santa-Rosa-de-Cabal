import {
  MapPin,
  Phone,
  MessageCircle,
  PawPrint,
  AlertCircle,
  Eye,
  Trash2,
  Heart,
} from "lucide-react";

import { ESTADOS, ESPECIES, WHATSAPP_AYUDA } from "../../constants/mascotas";

const estilos = `
  .reporte-card {
    min-height: 60vh;
    height: auto;
    display: flex;
    flex-direction: column;
    background: #fff;
    border: 1px solid #DAD6CC;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .card-imagen {
    height: 50vh;
    flex: 0 0 50vh;
    width: 100%;
    background: #EFEDE6;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  .card-info-wrapper {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #fff;
  }

  .card-info-scroll {
    flex: 1 1 auto;
    padding: 12px;
  }

  .card-acciones {
    flex-shrink: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border-top: 1px solid #EFEDE6;
    background: #fff;
    margin-top: auto;
  }

  @media (min-width: 640px) {
    .reporte-card {
      min-height: unset;
      height: auto;
    }
    .card-imagen {
      height: clamp(240px, 40vh, 480px);
      flex: none;
    }
    .card-info-wrapper {
      height: auto;
      flex: 1 1 auto;
      justify-content: flex-start;
    }
    .card-info-scroll {
      flex: 1 1 auto;
      padding: 12px;
    }
    .card-acciones {
      margin-top: auto;
    }
  }
`;

export default function Card({
  reporte,
  session,
  avistamientos,
  coincidencias,
  onCambiarEstado,
  onBorrar,
  onAgregarAvistamiento,
  onAmpliarFoto,
}) {
  const estado = ESTADOS[reporte.estado] || ESTADOS.perdido;

  const tel = (reporte.telefono || "").replace(/\D/g, "");

  const especie = ESPECIES[reporte.especie] || reporte.especie;

  const waMsg = encodeURIComponent(
    `Hola, escribo por el reporte de ${especie.toLowerCase()} en ${reporte.sector} (Mascotas Perdidas Santa Rosa de Cabal).`
  );

  const waReunidoMsg = encodeURIComponent(
    `Hola, quiero informar que ya está en casa la mascota del reporte en ${reporte.sector} (Mascotas Perdidas Santa Rosa de Cabal).`
  );

  const estiloAccion = (color, fontWeight = 600) => ({
    width: "100%",
    border: "none",
    background: "transparent",
    color,
    fontSize: 12.5,
    fontWeight,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    padding: "9px 4px",
    textDecoration: "none",
    textAlign: "center",
  });

  const acciones = [];

  if (tel && reporte.estado !== "reunido") {
    acciones.push(
      <a key="llamar" href={`tel:${tel}`} style={estiloAccion("#1F3A34")}>
        <Phone size={13} /> Llamar
      </a>
    );
    acciones.push(
      <a
        key="whatsapp"
        href={`https://wa.me/57${tel}?text=${waMsg}`}
        target="_blank"
        rel="noreferrer"
        style={estiloAccion("#1F6E5C")}
      >
        <MessageCircle size={13} /> WhatsApp
      </a>
    );
  }

  if (reporte.estado !== "reunido") {
    acciones.push(
      <button
        key="avistamiento"
        type="button"
        onClick={onAgregarAvistamiento}
        style={estiloAccion("#8A6D00")}
      >
        <Eye size={13} /> + Avistamiento
      </button>
    );
    acciones.push(
      <a
        key="casa"
        href={`https://wa.me/57${WHATSAPP_AYUDA}?text=${waReunidoMsg}`}
        target="_blank"
        rel="noreferrer"
        title="Avisar que la mascota ya está en casa"
        style={estiloAccion("#C0392B", 700)}
      >
        <Heart size={13} /> Ya está en casa
      </a>
    );
  }

  if (session) {
    acciones.push(
      <select
        key="estado"
        value={reporte.estado}
        onChange={(e) =>
          onCambiarEstado(reporte.id, e.target.value)
        }
        style={{
          width: "100%",
          border: "none",
          background: "transparent",
          fontSize: 12.5,
          fontWeight: 600,
          color: "#4A4A47",
          textAlign: "center",
          cursor: "pointer",
          padding: "9px 4px",
        }}
      >
        {Object.entries(ESTADOS).map(([k, v]) => (
          <option key={k} value={k}>
            Marcar: {v.label}
          </option>
        ))}
      </select>
    );
    acciones.push(
      <button
        key="borrar"
        type="button"
        onClick={() => onBorrar(reporte.id)}
        title="Eliminar reporte"
        style={estiloAccion("#B4472E")}
      >
        <Trash2 size={15} />
      </button>
    );
  }

  return (
    <>
      <style>{estilos}</style>

      <div className="reporte-card">
        <div
          onClick={reporte.foto_url ? onAmpliarFoto : undefined}
          className="card-imagen"
          style={{
            cursor: reporte.foto_url ? "pointer" : "default",
          }}
        >
          {reporte.foto_url ? (
            <img
              src={reporte.foto_url}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <PawPrint size={40} color="#B4AF9F" />
          )}
        </div>

        <div className="card-info-wrapper">
          <div className="card-info-scroll">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 6,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14.5,
                }}
              >
                {reporte.nombre ? reporte.nombre : especie}

                <span
                  style={{
                    fontWeight: 400,
                    color: "#8A8A85",
                    fontSize: 12.5,
                  }}
                >
                  {reporte.nombre ? ` · ${especie}` : ""}
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

            <div
              style={{
                fontSize: 13,
                color: "#4A4A47",
                marginTop: 3,
              }}
            >
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
              <MapPin size={12} />
              {reporte.sector + " - " + reporte.ciudad}
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

            {avistamientos.length > 0 && (
              <div
                style={{
                  paddingTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: "#8A6D00",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Eye size={12} />

                  {avistamientos.length} avistamiento
                  {avistamientos.length > 1 ? "s" : ""}
                </div>

                {avistamientos.slice(0, 3).map((a) => (
                  <div
                    key={a.id}
                    style={{
                      fontSize: 12,
                      color: "#6B6B66",
                      paddingLeft: 16,
                    }}
                  >
                    {a.sector}
                    {a.hora ? ` · ${a.hora}` : ""}
                    {a.descripcion ? ` — ${a.descripcion}` : ""}
                  </div>
                ))}
              </div>
            )}

            {coincidencias.length > 0 && (
              <div
                style={{
                  background: "#FAF1D6",
                  padding: "8px 12px",
                  fontSize: 12.5,
                  color: "#7A5F00",
                  display: "flex",
                  gap: 6,
                  borderRadius: 6,
                  marginTop: 8,
                }}
              >
                <AlertCircle
                  size={14}
                  style={{
                    marginTop: 1,
                    flexShrink: 0,
                  }}
                />

                <span>
                  Hay actividad (
                  {avistamientos.length ? "avistamientos" : "reportes"}
                  ) en el mismo sector — revisa si coincide.
                </span>
              </div>
            )}
          </div>

          <div className="card-acciones">
            {acciones.map((accion, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  borderRight:
                    i % 2 === 0
                      ? "1px solid #EFEDE6"
                      : "none",
                  borderTop:
                    i >= 2
                      ? "1px solid #EFEDE6"
                      : "none",
                }}
              >
                {accion}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

