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
import "./Card.css";

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

  const acciones = [];

  if (tel && reporte.estado !== "reunido") {
    acciones.push(
      <a
        key="llamar"
        href={`tel:${tel}`}
        className="card-accion card-accion--llamar"
      >
        <Phone size={13} /> Llamar
      </a>
    );
    acciones.push(
      <a
        key="whatsapp"
        href={`https://wa.me/57${tel}?text=${waMsg}`}
        target="_blank"
        rel="noreferrer"
        className="card-accion card-accion--whatsapp"
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
        className="card-accion card-accion--avistamiento"
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
        className="card-accion card-accion--fuerte card-accion--casa"
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
        onChange={(e) => onCambiarEstado(reporte.id, e.target.value)}
        className="card-accion-select"
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
        className="card-accion card-accion--borrar"
      >
        <Trash2 size={15} />
      </button>
    );
  }

  return (
    <div className="reporte-card">
      <div
        onClick={reporte.foto_url ? onAmpliarFoto : undefined}
        className={`card-imagen ${
          reporte.foto_url ? "card-imagen--clicable" : ""
        }`}
      >
        {reporte.foto_url ? (
          <img src={reporte.foto_url} alt="" />
        ) : (
          <PawPrint size={40} color="#B4AF9F" />
        )}
      </div>

      <div className="card-info-wrapper">
        <div className="card-info-scroll">
          <div className="card-cabecera">
            <h2 className="card-nombre">
              {reporte.nombre ? reporte.nombre : especie}

              <span className="card-nombre-especie">
                {reporte.nombre ? ` · ${especie}` : ""}
              </span>
            </h2>

            <span
              className="card-etiqueta-estado"
              style={{ color: estado.color, background: estado.bg }}
            >
              {estado.label}
            </span>
          </div>

          <section className="card-señas">
            <h3 className="card-señas-titulo">Señas particulares</h3>

            <div className="card-dato">
              {reporte.color}

              {reporte.tamano ? ` · ${reporte.tamano}` : ""}
            </div>

            <div className="card-sector">
              <MapPin size={12} />
              {reporte.sector + " - " + reporte.ciudad}
            </div>

            {reporte.descripcion && (
              <div className="card-descripcion">{reporte.descripcion}</div>
            )}
          </section>

          {avistamientos.length > 0 && (
            <section className="card-avistamientos">
              <h3 className="card-avistamientos-titulo">
                <Eye size={12} />

                {avistamientos.length} avistamiento
                {avistamientos.length > 1 ? "s" : ""}
              </h3>

              <ul className="card-avistamientos-lista">
                {avistamientos.slice(0, 3).map((a) => (
                  <li key={a.id} className="card-avistamiento">
                    {a.sector}
                    {a.hora ? ` · ${a.hora}` : ""}
                    {a.descripcion ? ` — ${a.descripcion}` : ""}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {coincidencias.length > 0 && (
            <div className="card-coincidencia">
              <AlertCircle size={14} className="card-coincidencia-icono" />

              <span>
                Hay actividad (
                {avistamientos.length ? "avistamientos" : "reportes"}) en el
                mismo sector — revisa si coincide.
              </span>
            </div>
          )}
        </div>

        <div className="card-acciones">
          {acciones.map((accion, i) => (
            <div key={i}>{accion}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
