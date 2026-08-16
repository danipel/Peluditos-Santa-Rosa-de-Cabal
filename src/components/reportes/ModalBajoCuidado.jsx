import { useState } from "react";
import { Home, Phone, MapPin, HeartHandshake } from "lucide-react";
import Modal from "../common/Modal";
import { ESPECIES } from "../../constants/mascotas";

export default function ModalBajoCuidado({ reporte, onClose, onSave }) {
  const [sector, setSector] = useState(reporte?.sector || "");
  const [telefono, setTelefono] = useState("");
  const [notas, setNotas] = useState("");
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
    if (!telefono.trim()) return;

    setEnviando(true);
    const ok = await onSave(reporte.id, {
      sector: sector.trim() || reporte.sector,
      telefono: telefono.trim(),
      notas: notas.trim(),
      descripcionActual: reporte.descripcion || "",
    });
    setEnviando(false);
    if (ok) {
      setGuardado(true);
    }
  };

  if (guardado) {
    return (
      <Modal onClose={onClose} title="¡Mascota bajo resguardo!">
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "#E8F2FA",
              color: "#1E5E8A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
            }}
          >
            <HeartHandshake size={28} />
          </div>
          <h4 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "#1E1E1C" }}>
            ¡Muchas gracias por acoger a {nombreMascota}!
          </h4>
          <p style={{ fontSize: 13.5, color: "#4A4A47", lineHeight: 1.5, margin: "0 0 18px" }}>
            El reporte ha sido actualizado a <strong>"En hogar de paso"</strong> con tu número de contacto para que su familia pueda comunicarse contigo directamente.
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
    <Modal onClose={onClose} title={`Tengo a ${nombreMascota} bajo mi cuidado`}>
      <div
        style={{
          background: "#E8F2FA",
          border: "1px solid #C7DFFA",
          borderRadius: 8,
          padding: "9px 12px",
          fontSize: 13,
          color: "#1E5E8A",
          marginBottom: 14,
          lineHeight: 1.4,
        }}
      >
        Indica tus datos para que el dueño sepa que su mascota está a salvo en tu casa y pueda coordinar la entrega.
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={labelStyle}>
            <Phone size={14} color="#8A8A85" />
            Tu teléfono de contacto (WhatsApp) *
          </label>
          <input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej: 3101234567"
            style={inputStyle}
            required
          />
        </div>

        <div>
          <label style={labelStyle}>
            <MapPin size={14} color="#8A8A85" />
            Sector / Barrio donde lo tienes en custodia
          </label>
          <input
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            placeholder="Ej: Barrio La Hermosa, Santa Rosa"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>
            <Home size={14} color="#8A8A85" />
            Notas sobre el estado de la mascota
          </label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Ej: Está bien alimentado, no tiene heridas, lo tengo seguro en mi patio..."
            style={{ ...inputStyle, minHeight: 65, resize: "vertical" }}
          />
        </div>

        <button
          type="submit"
          disabled={enviando}
          style={{
            background: "#1F6E5C",
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
          {enviando ? "Actualizando estado..." : "Confirmar que está bajo mi cuidado"}
        </button>
      </form>
    </Modal>
  );
}
