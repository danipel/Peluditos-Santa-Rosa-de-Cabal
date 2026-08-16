import { MessageCircle } from "lucide-react";
import { WHATSAPP_AYUDA } from "../../constants/mascotas";

const MENSAJE_AYUDA = encodeURIComponent(
  "Hola, necesito ayuda para reportar a mi mascota perdida."
);

export default function BannerAyuda() {
  return (
    <a
      href={`https://wa.me/57${WHATSAPP_AYUDA}?text=${MENSAJE_AYUDA}`}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#E1F0EA",
        border: "1px solid #DAD6CC",
        borderLeft: "4px solid #1F6E5C",
        borderRadius: 10,
        padding: "12px 14px",
        marginBottom: 16,
        textDecoration: "none",
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
        ¿Necesitas ayuda para reportar tu amigo perdido? Escríbenos en WhatsApp!
      </span>
    </a>
  );
}
