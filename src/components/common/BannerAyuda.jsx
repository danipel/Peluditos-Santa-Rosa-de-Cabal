import { Instagram, MessageCircle } from "lucide-react";
import { INSTAGRAM_BRIGADA, WHATSAPP_AYUDA } from "../../constants/mascotas";

const MENSAJE_AYUDA = encodeURIComponent(
  "Hola, necesito ayuda para reportar a mi mascota perdida."
);

const ENLACE_WHATSAPP = `https://wa.me/57${WHATSAPP_AYUDA}?text=${MENSAJE_AYUDA}`;

const estilos = `
  .banner-ayuda-boton {
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .banner-ayuda-boton:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(31, 58, 52, 0.25);
  }
  .banner-ayuda-boton:active {
    transform: translateY(0);
  }
  .banner-ayuda-boton:focus-visible {
    outline: 2px solid #1F6E5C;
    outline-offset: 2px;
  }
  @media (prefers-reduced-motion: reduce) {
    .banner-ayuda-boton {
      transition: none;
    }
  }
`;

export default function BannerAyuda() {
  return (
    <>
      <style>{estilos}</style>
      <div
        style={{
          background: "#E1F0EA",
          border: "1px solid #DAD6CC",
          borderLeft: "4px solid #1F6E5C",
          borderRadius: 10,
          padding: "14px",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <MessageCircle
            size={20}
            color="#1F6E5C"
            style={{ flexShrink: 0, marginTop: 2 }}
          />
          <span
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: "#1F3A34",
              lineHeight: 1.4,
            }}
          >
            ¿Necesitas ayuda para reportar tu amigo perdido?
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 12,
          }}
        >
          <a
            href={ENLACE_WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="banner-ayuda-boton"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#1F6E5C",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 16px",
              fontSize: 13.5,
              fontWeight: 700,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <MessageCircle size={18} /> Escríbenos en WhatsApp
          </a>

          <a
            href={INSTAGRAM_BRIGADA}
            target="_blank"
            rel="noreferrer"
            className="banner-ayuda-boton"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#fff",
              color: "#1F3A34",
              border: "1px solid #1F6E5C",
              borderRadius: 8,
              padding: "10px 16px",
              fontSize: 13.5,
              fontWeight: 700,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <Instagram size={18} /> Escríbenos en Instagram
          </a>
        </div>
      </div>
    </>
  );
}
