import {
  MapPin,
  Phone,
  MessageCircle,
  PawPrint,
  AlertCircle,
  Eye,
  Trash2,
} from "lucide-react";

import { ESTADOS, ESPECIES } from "../../constants/mascotas";

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

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #DAD6CC",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          padding: 12,
        }}
      >
        <div
          onClick={reporte.foto_url ? onAmpliarFoto : undefined}
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
            <PawPrint size={26} color="#B4AF9F" />
          )}
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
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
        </div>
      </div>

      {avistamientos.length > 0 && (
        <div
          style={{
            padding: "0 12px 10px",
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

      <div
        style={{
          display: "flex",
          borderTop: "1px solid #EFEDE6",
        }}
      >
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
              <Phone size={13} />
              Llamar
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
              <MessageCircle size={13} />
              WhatsApp
            </a>
          </>
        )}

        {reporte.estado !== "reunido" && (
          <button
            onClick={onAgregarAvistamiento}
            style={{
              flex: 1.3,
              border: "none",
              background: "transparent",
              fontSize: 12.5,
              fontWeight: 600,
              color: "#8A6D00",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              borderRight: "1px solid #EFEDE6",
            }}
          >
            <Eye size={13} />
            + Avistamiento
          </button>
        )}

        {session && (
          <select
            value={reporte.estado}
            onChange={(e) =>
              onCambiarEstado(reporte.id, e.target.value)
            }
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
        )}

        {session && (
          <button
            onClick={() => onBorrar(reporte.id)}
            title="Eliminar reporte"
            style={{
              flex: 0.6,
              border: "none",
              background: "transparent",
              color: "#B4472E",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              borderLeft: "1px solid #EFEDE6",
            }}
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
}