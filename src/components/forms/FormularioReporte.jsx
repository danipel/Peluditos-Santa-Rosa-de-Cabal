import { useState } from "react";
import Modal from "../common/Modal";

function FormularioReporte({ onClose, onSave }) {
  const [form, setForm] = useState({
    estado: "perdido",
    especie: "perro",
    nombre: "",
    color: "",
    tamano: "",
    sector: "",
    descripcion: "",
    telefono: "",
  });

  const [file, setFile] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [pinGenerado, setPinGenerado] = useState(null);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();

    if (
      !form.color.trim() ||
      !form.sector.trim() ||
      !form.telefono.trim()
    ) {
      return;
    }

    setEnviando(true);

    const pin = await onSave(form, file);

    setEnviando(false);

    if (pin) {
      setPinGenerado(pin);
    }
  }

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

  if (pinGenerado) {
    return (
      <Modal onClose={onClose} title="¡Reporte publicado!">
        <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>
          <p>
            Tu reporte ya está visible para todos. Guarda este código por si
            necesitas identificarte luego:
          </p>

          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              textAlign: "center",
              letterSpacing: 4,
              background: "#F6F5F2",
              padding: "14px 0",
              borderRadius: 10,
              margin: "12px 0",
            }}
          >
            {pinGenerado}
          </div>

          <button
            onClick={onClose}
            style={{
              width: "100%",
              background: "#1F3A34",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "11px 0",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Entendido
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose} title="Nuevo reporte">
      <form
        onSubmit={submit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div>
          <div style={labelStyle}>Tipo de reporte</div>

          <select
            value={form.estado}
            onChange={(e) => set("estado", e.target.value)}
            style={inputStyle}
          >
            <option value="perdido">
              Perdido — busco a mi mascota
            </option>
            <option value="en_albergue">
              Está en el albergue temporal
            </option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Especie</div>

            <select
              value={form.especie}
              onChange={(e) => set("especie", e.target.value)}
              style={inputStyle}
            >
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Nombre (si se sabe)</div>

            <input
              value={form.nombre}
              onChange={(e) => set("nombre", e.target.value)}
              style={inputStyle}
              placeholder="Opcional"
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Color *</div>

            <input
              value={form.color}
              onChange={(e) => set("color", e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Tamaño</div>

            <input
              value={form.tamano}
              onChange={(e) => set("tamano", e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <div style={labelStyle}>Sector / barrio *</div>

          <input
            value={form.sector}
            onChange={(e) => set("sector", e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        <div>
          <div style={labelStyle}>
            Descripción / señas particulares
          </div>

          <textarea
            value={form.descripcion}
            onChange={(e) => set("descripcion", e.target.value)}
            style={{
              ...inputStyle,
              minHeight: 60,
              resize: "vertical",
            }}
          />
        </div>

        <div>
          <div style={labelStyle}>Foto</div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={{
              marginTop: 4,
              fontSize: 13,
            }}
          />
        </div>

        <div>
          <div style={labelStyle}>
            Teléfono de contacto (WhatsApp) *
          </div>

          <input
            value={form.telefono}
            onChange={(e) => set("telefono", e.target.value)}
            style={inputStyle}
            placeholder="Ej: 3001234567"
            required
          />
        </div>

        <button
          type="submit"
          disabled={enviando}
          style={{
            background: "#1F3A34",
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
          {enviando ? "Publicando..." : "Publicar reporte"}
        </button>
      </form>
    </Modal>
  );
}

export default FormularioReporte;