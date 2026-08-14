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

  const inputStyle = {
    width: "100%",
    padding: "9px 10px",
    borderRadius: 8,
    border: "1px solid #DAD6CC",
    fontSize: 13.5,
    boxSizing: "border-box",
    marginTop: 4,
  };

  const labelStyle = {
    fontSize: 12.5,
    fontWeight: 600,
    color: "#4A4A47",
  };

  async function submit(e) {
    e.preventDefault();

    if (!form.sector.trim()) return;

    setEnviando(true);

    await onSave(form);

    setEnviando(false);
  }

  return (
    <Modal
      onClose={onClose}
      title="Registrar avistamiento"
    >
      <form
        onSubmit={submit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div>
          <div style={labelStyle}>
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
            style={inputStyle}
            required
          />
        </div>

        <div>
          <div style={labelStyle}>
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
            style={inputStyle}
            placeholder="Ej: hoy 3:00 p.m."
          />
        </div>

        <div>
          <div style={labelStyle}>
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
            style={{
              ...inputStyle,
              minHeight: 60,
              resize: "vertical",
            }}
            placeholder="Hacia dónde iba, estado del animal..."
          />
        </div>

        <div>
          <div style={labelStyle}>
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
            style={inputStyle}
            placeholder="Opcional"
          />
        </div>

        <button
          type="submit"
          disabled={enviando}
          style={{
            background: "#8A6D00",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "11px 0",
            fontSize: 14,
            fontWeight: 700,
            cursor: enviando ? "default" : "pointer",
            opacity: enviando ? 0.7 : 1,
          }}
        >
          {enviando
            ? "Guardando..."
            : "Guardar avistamiento"}
        </button>
      </form>
    </Modal>
  );
}

export default FormularioAvistamiento;