import { Home } from "lucide-react";
import "./AlbergueBanner.css";

export default function AlbergueBanner({ albergue, onEditar }) {
  const tieneDatos = Boolean(albergue?.nombre || albergue?.direccion);

  return (
    <div className="albergue-banner">
      <div className="albergue-banner-contenido">
        <Home
          size={18}
          color="#1F6E5C"
          className="albergue-banner-icono"
        />
        <div>
          <div className="albergue-banner-titulo">
            Punto de acopio / albergue temporal
          </div>
          {tieneDatos ? (
            <div className="albergue-banner-datos">
              {albergue.nombre && <div>{albergue.nombre}</div>}
              {albergue.direccion && <div>{albergue.direccion}</div>}
              {albergue.horario && (
                <div className="albergue-banner-horario">
                  Horario: {albergue.horario}
                </div>
              )}
            </div>
          ) : (
            <div className="albergue-banner-vacio">
              Aún no se ha registrado la ubicación
            </div>
          )}
        </div>
      </div>
      <button onClick={onEditar} className="albergue-banner-editar">
        Editar
      </button>
    </div>
  );
}
