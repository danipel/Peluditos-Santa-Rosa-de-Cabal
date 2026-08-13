import { PawPrint } from "lucide-react";

export default function Header() {
  return (
    <header
      style={{
        background: "#1F3A34",
        color: "#F6F5F2",
        padding: "18px 16px",
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <PawPrint size={26} strokeWidth={2} />
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: -0.2,
            }}
          >
            Mascotas Perdidas — Santa Rosa de Cabal
          </div>
          <div style={{ fontSize: 12.5, opacity: 0.75 }}>
            Reencuentro tras el sismo del 10 de agosto
          </div>
        </div>
      </div>
    </header>
  );
}
