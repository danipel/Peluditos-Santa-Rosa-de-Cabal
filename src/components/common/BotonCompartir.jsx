import { useEffect, useRef, useState } from "react";
import {
  Share2,
  Check,
  AlertCircle,
  Link,
  MessageCircle,
  Twitter,
  Facebook,
  Send,
} from "lucide-react";
import {
  tieneCompartirNativo,
  conTimeout,
  copiarTexto,
  construirEnlacesCompartir,
  compartirNativo,
} from "../../utils/compartir";

const estilos = `
  .boton-compartir {
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .boton-compartir:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(31, 58, 52, 0.3);
  }
  .boton-compartir:active {
    transform: translateY(0);
  }
  .boton-compartir:focus-visible {
    outline: 2px solid #1F6E5C;
    outline-offset: 3px;
  }
  .boton-compartir-toast {
    animation: boton-compartir-aparece 0.2s ease;
  }
  .boton-compartir-menu {
    animation: boton-compartir-aparece 0.15s ease;
  }
  .boton-compartir-opcion {
    transition: background 0.12s ease;
  }
  .boton-compartir-opcion:hover {
    background: #F2F1EC;
  }
  .boton-compartir-opcion:focus-visible {
    outline: 2px solid #1F6E5C;
    outline-offset: -2px;
  }
  @keyframes boton-compartir-aparece {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .boton-compartir {
      transition: none;
    }
    .boton-compartir-toast,
    .boton-compartir-menu {
      animation: none;
    }
    .boton-compartir-opcion {
      transition: none;
    }
  }
`;

export default function BotonCompartir() {
  const [abierto, setAbierto] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const timeoutRef = useRef(null);
  const contenedorRef = useRef(null);

  const notificar = (tipo, mensaje) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setFeedback({ tipo, mensaje });
    timeoutRef.current = setTimeout(() => setFeedback(null), 3000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!abierto) return;

    const cerrarFuera = (e) => {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(e.target)
      ) {
        setAbierto(false);
      }
    };

    const cerrarConEscape = (e) => {
      if (e.key === "Escape") setAbierto(false);
    };

    document.addEventListener("mousedown", cerrarFuera);
    document.addEventListener("keydown", cerrarConEscape);
    return () => {
      document.removeEventListener("mousedown", cerrarFuera);
      document.removeEventListener("keydown", cerrarConEscape);
    };
  }, [abierto]);

  const manejarClic = async () => {
    const url = window.location.href;

    if (tieneCompartirNativo()) {
      try {
        await conTimeout(compartirNativo(url), 3000);
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return;
        console.warn("Compartir nativo falló o expiró:", err);
      }
    }

    setAbierto((prev) => !prev);
  };

  const manejarCopiar = async () => {
    const url = window.location.href;
    try {
      await copiarTexto(url);
      setAbierto(false);
      notificar("exito", "¡Enlace copiado!");
    } catch (err) {
      console.error("Error al copiar el enlace:", err);
      notificar("error", "No se pudo copiar el enlace");
    }
  };

  const enlaces = construirEnlacesCompartir(window.location.href);

  const redes = [
    { id: "whatsapp", etiqueta: "WhatsApp", Icono: MessageCircle, href: enlaces.whatsapp },
    { id: "telegram", etiqueta: "Telegram", Icono: Send, href: enlaces.telegram },
    { id: "twitter", etiqueta: "X / Twitter", Icono: Twitter, href: enlaces.twitter },
    { id: "facebook", etiqueta: "Facebook", Icono: Facebook, href: enlaces.facebook },
  ];

  const esExito = feedback && feedback.tipo === "exito";

  return (
    <>
      <style>{estilos}</style>

      <div
        ref={contenedorRef}
        style={{
          position: "fixed",
          bottom: 92,
          right: 20,
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 10,
        }}
      >
        {abierto && (
          <div
            className="boton-compartir-menu"
            role="menu"
            aria-label="Opciones para compartir"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E0DDD5",
              borderRadius: 12,
              boxShadow: "0 12px 32px rgba(31, 58, 52, 0.22)",
              padding: 8,
              minWidth: 210,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#8A8A85",
                textTransform: "uppercase",
                letterSpacing: 0.4,
                padding: "6px 10px 8px",
              }}
            >
              Compartir
            </div>

            <button
              type="button"
              role="menuitem"
              onClick={manejarCopiar}
              className="boton-compartir-opcion"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                background: "transparent",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                color: "#1F3A34",
                textAlign: "left",
              }}
            >
              <Link size={18} color="#1F6E5C" /> Copiar enlace
            </button>

            {redes.map(({ id, etiqueta, Icono, href }) => (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noreferrer"
                role="menuitem"
                className="boton-compartir-opcion"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1F3A34",
                  textDecoration: "none",
                }}
              >
                <Icono size={18} color="#1F6E5C" /> {etiqueta}
              </a>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {feedback && (
            <span
              role="status"
              aria-live="polite"
              className="boton-compartir-toast"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: esExito ? "#1F6E5C" : "#B4472E",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                padding: "8px 14px",
                borderRadius: 999,
                boxShadow: "0 6px 18px rgba(31, 58, 52, 0.25)",
                whiteSpace: "nowrap",
              }}
            >
              {esExito ? <Check size={15} /> : <AlertCircle size={15} />}
              {feedback.mensaje}
            </span>
          )}

          <button
            type="button"
            onClick={manejarClic}
            className="boton-compartir"
            aria-label="Compartir esta página"
            aria-expanded={abierto}
            aria-haspopup="menu"
            title="Compartir esta página"
            style={{
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: esExito ? "#1F6E5C" : "#FFFFFF",
              color: esExito ? "#FFFFFF" : "#1F6E5C",
              border: "1px solid #1F6E5C",
              borderRadius: 999,
              boxShadow: "0 6px 18px rgba(31, 58, 52, 0.25)",
              cursor: "pointer",
            }}
          >
            {esExito ? <Check size={20} /> : <Share2 size={20} />}
          </button>
        </div>
      </div>
    </>
  );
}
