import { useState } from "react";
import { Eye, MapPin, Phone, Camera } from "lucide-react";
import Modal from "../common/Modal";
import { ESPECIES } from "../../constants/mascotas";

export default function ModalAvistamiento({ reporte, onClose, onSave }) {
  const [sector, setSector] = useState(reporte?.sector || "");
  const [descripcion, setDescripcion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [file, setFile] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const nombreMascota =
    reporte?.nombre ||
    ESPECIES[reporte?.especie] ||
    reporte?.especie ||
    "la mascota";

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
    display: "flex",
    alignItems: "center",
    gap: 5,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sector.trim()) return;

    setEnviando(true);
    const ok = await onSave(reporte.id, { sector, descripcion, telefono }, file);
    setEnviando(false);
    if (ok) {
      setGuardado(true);
    }
  };

  if (guardado) {
    return (
      <Modal onClose={onClose} title="¡Avistamiento reportado!">
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "#FAF1D6",
              color: "#8A6D00",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
            }}
          >
            <Eye size={28} />
          </div>
          <h4 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "#1E1E1C" }}>
            Gracias por ayudar a {nombreMascota}
          </h4>
          <p style={{ fontSize: 13.5, color: "#4A4A47", lineHeight: 1.5, margin: "0 0 18px" }}>
            Tu reporte de avistamiento ha sido registrado y ya aparece visible en el historial para que su familia y la comunidad puedan ubicarlo.
          </p>
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
    <Modal onClose={onClose} title={`Reportar avistamiento de ${nombreMascota}`}>
      <div
        style={{
          background: "#FAF1D6",
          border: "1px solid #F2E3B3",
          borderRadius: 8,
          padding: "9px 12px",
          fontSize: 13,
          color: "#7A5F00",
          marginBottom: 14,
          lineHeight: 1.4,
        }}
      >
        Indica dónde y cuándo viste a este peludito. Toda información ayuda a su familia a encontrarlo más rápido.
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={labelStyle}>
            <MapPin size={14} color="#8A8A85" />
            ¿Dónde lo viste? (Sector / Barrio / Punto de referencia) *
          </label>
          <input
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            placeholder="Ej: Frente al parque de las Araucarias, Cra 14..."
            style={inputStyle}
            required
          />
        </div>

        <div>
          <label style={labelStyle}>Detalles / Hacia dónde se dirigía</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej: Lo vi hace 20 min, iba caminando hacia la salida a Chinchiná, se veía asustado..."
            style={{ ...inputStyle, minHeight: 65, resize: "vertical" }}
          />
        </div>

        <div>
          <label style={labelStyle}>
            <Camera size={14} color="#8A8A85" />
            Foto del avistamiento (opcional)
          </label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginTop: 4, fontSize: 13 }}
          />
        </div>

        <div>
          <label style={labelStyle}>
            <Phone size={14} color="#8A8A85" />
            Tu teléfono de contacto (WhatsApp opcional)
          </label>
          <input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej: 3101234567"
            style={inputStyle}
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
            marginTop: 6,
          }}
        >
          {enviando ? "Guardando avistamiento..." : "Publicar avistamiento"}
        </button>
      </form>
    </Modal>
  );
}
