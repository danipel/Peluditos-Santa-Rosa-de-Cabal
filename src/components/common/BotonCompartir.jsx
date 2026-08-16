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
import "./BotonCompartir.css";

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
    <div ref={contenedorRef} className="boton-compartir-contenedor">
      {abierto && (
        <div
          className="boton-compartir-menu"
          role="menu"
          aria-label="Opciones para compartir"
        >
          <div className="boton-compartir-menu-titulo">Compartir</div>

          <button
            type="button"
            role="menuitem"
            onClick={manejarCopiar}
            className="boton-compartir-opcion"
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
            >
              <Icono size={18} color="#1F6E5C" /> {etiqueta}
            </a>
          ))}
        </div>
      )}

      <div className="boton-compartir-fila">
        {feedback && (
          <span
            role="status"
            aria-live="polite"
            className={`boton-compartir-toast ${
              esExito
                ? "boton-compartir-toast--exito"
                : "boton-compartir-toast--error"
            }`}
          >
            {esExito ? <Check size={15} /> : <AlertCircle size={15} />}
            {feedback.mensaje}
          </span>
        )}

        <button
          type="button"
          onClick={manejarClic}
          className={`boton-compartir ${
            esExito ? "boton-compartir--exito" : ""
          }`}
          aria-label="Compartir esta página"
          aria-expanded={abierto}
          aria-haspopup="menu"
          title="Compartir esta página"
        >
          {esExito ? <Check size={20} /> : <Share2 size={20} />}
        </button>
      </div>
    </div>
  );
}
