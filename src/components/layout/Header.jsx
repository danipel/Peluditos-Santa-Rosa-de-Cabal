import { PawPrint, LogIn, LogOut } from "lucide-react";

export default function Header({ session, onLogin, onLogout }) {
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
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
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

            <div
              style={{
                fontSize: 12.5,
                opacity: 0.75,
              }}
            >
              Reencuentro tras el sismo del 10 de agosto
            </div>
          </div>
        </div>

        {session ? (
          <button
            onClick={onLogout}
            title="Cerrar sesión admin"
            style={{
              background: "none",
              border: "none",
              color: "#F6F5F2",
              opacity: 0.8,
              cursor: "pointer",
            }}
          >
            <LogOut size={18} />
          </button>
        ) : (
          <button
            onClick={onLogin}
            title="Acceso administrador"
            style={{
              background: "none",
              border: "none",
              color: "#F6F5F2",
              opacity: 0.5,
              cursor: "pointer",
            }}
          >
            <LogIn size={18} />
          </button>
        )}
      </div>
    </header>
  );
}