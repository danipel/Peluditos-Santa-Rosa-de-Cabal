import { Plus } from "lucide-react";

const estilos = `
  .boton-reportar {
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .boton-reportar:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 26px rgba(31, 58, 52, 0.4), 0 0 0 4px rgba(31, 110, 92, 0.18);
  }
  .boton-reportar:active {
    transform: translateY(0);
    box-shadow: 0 6px 18px rgba(31, 58, 52, 0.35);
  }
  .boton-reportar:focus-visible {
    outline: 2px solid #1F6E5C;
    outline-offset: 3px;
  }
  @media (prefers-reduced-motion: reduce) {
    .boton-reportar {
      transition: none;
    }
  }
`;

export default function BotonReportar({ onClick }) {
  return (
    <>
      <style>{estilos}</style>
      <button
        onClick={onClick}
        className="boton-reportar"
        aria-label="Crear un reporte"
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          background:
            "linear-gradient(135deg, #1F6E5C 0%, #1F3A34 100%)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: 999,
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 14.5,
          fontWeight: 700,
          letterSpacing: 0.2,
          boxShadow: "0 6px 18px rgba(31, 58, 52, 0.35)",
          cursor: "pointer",
          zIndex: 40,
        }}
      >
        <Plus size={19} strokeWidth={2.5} /> Reportar
      </button>
    </>
  );
}
