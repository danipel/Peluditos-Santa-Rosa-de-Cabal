import { Plus } from "lucide-react";

export default function BotonReportar({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        background: "#1F3A34",
        color: "#fff",
        border: "none",
        borderRadius: 999,
        padding: "13px 18px",
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 14,
        fontWeight: 700,
        boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
        cursor: "pointer",
        zIndex: 40,
      }}
    >
      <Plus size={18} /> Reportar
    </button>
  );
}
