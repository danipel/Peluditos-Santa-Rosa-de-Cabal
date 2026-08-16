import { useState } from "react";
import Modal from "../common/Modal";

function FormularioAvistamiento({ onClose, onSave }) {
  const [form, setForm] = useState({
    sector: "",
    hora: "",
    descripcion: "",
    telefono: "",
  });

  const [enviando, setEnviando] = useState(false);

  async function submit(e) {
    e.preventDefault();

    if (!form.sector.trim()) return;

    setEnviando(true);

    await onSave(form);

    setEnviando(false);
  }

  return (
    <Modal onClose={onClose} title="Registrar avistamiento">
      <form onSubmit={submit} className="form-columna">
        <div>
          <div className="campo-etiqueta">
            Sector donde lo viste *
          </div>

          <input
            value={form.sector}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                sector: e.target.value,
              }))
            }
            className="campo-input"
            required
          />
        </div>

        <div>
          <div className="campo-etiqueta">
            Hora aproximada
          </div>

          <input
            value={form.hora}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                hora: e.target.value,
              }))
            }
            className="campo-input"
            placeholder="Ej: hoy 3:00 p.m."
          />
        </div>

        <div>
          <div className="campo-etiqueta">
            Descripción del avistamiento
          </div>

          <textarea
            value={form.descripcion}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                descripcion: e.target.value,
              }))
            }
            className="campo-input campo-textarea"
            placeholder="Hacia dónde iba, estado del animal..."
          />
        </div>

        <div>
          <div className="campo-etiqueta">
            Tu contacto (por si el grupo de búsqueda necesita más info)
          </div>

          <input
            value={form.telefono}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                telefono: e.target.value,
              }))
            }
            className="campo-input"
            placeholder="Opcional"
          />
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="boton-enviar boton-enviar-advertencia"
        >
          {enviando ? "Guardando..." : "Guardar avistamiento"}
        </button>
      </form>
    </Modal>
  );
}

export default FormularioAvistamiento;
