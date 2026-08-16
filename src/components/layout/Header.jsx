import { PawPrint, LogIn, LogOut } from "lucide-react";
import "./Header.css";

export default function Header({ session, onLogin, onLogout }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-header-marca">
          <PawPrint size={26} strokeWidth={2} />

          <div>
            <div className="site-header-titulo">
              Mascotas Perdidas — Risaralda
            </div>

            <div className="site-header-subtitulo">
              Reencuentro tras el sismo del 10 de agosto
            </div>
          </div>
        </div>

        {session ? (
          <button
            onClick={onLogout}
            title="Cerrar sesión admin"
            className="site-header-boton site-header-boton--logout"
          >
            <LogOut size={18} />
          </button>
        ) : (
          <button
            onClick={onLogin}
            title="Acceso administrador"
            className="site-header-boton site-header-boton--login"
          >
            <LogIn size={18} />
          </button>
        )}
      </div>
    </header>
  );
}
