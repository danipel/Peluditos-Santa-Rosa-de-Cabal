import { Instagram, MessageCircle } from "lucide-react";
import { INSTAGRAM_BRIGADA, WHATSAPP_AYUDA } from "../../constants/mascotas";
import "./BannerAyuda.css";

const MENSAJE_AYUDA = encodeURIComponent(
  "Hola, necesito ayuda para reportar a mi mascota perdida."
);

const ENLACE_WHATSAPP = `https://wa.me/57${WHATSAPP_AYUDA}?text=${MENSAJE_AYUDA}`;

export default function BannerAyuda() {
  return (
    <div className="banner-ayuda">
      <div className="banner-ayuda-encabezado">
        <MessageCircle
          size={20}
          color="#1F6E5C"
          className="banner-ayuda-icono"
        />
        <span className="banner-ayuda-texto">
          ¿Necesitas ayuda para reportar tu amigo perdido?
        </span>
      </div>

      <div className="banner-ayuda-acciones">
        <a
          href={ENLACE_WHATSAPP}
          target="_blank"
          rel="noreferrer"
          className="banner-ayuda-boton banner-ayuda-boton--primario"
        >
          <MessageCircle size={18} /> Escríbenos en WhatsApp
        </a>

        <a
          href={INSTAGRAM_BRIGADA}
          target="_blank"
          rel="noreferrer"
          className="banner-ayuda-boton banner-ayuda-boton--secundario"
        >
          <Instagram size={18} /> Escríbenos en Instagram
        </a>
      </div>
    </div>
  );
}
