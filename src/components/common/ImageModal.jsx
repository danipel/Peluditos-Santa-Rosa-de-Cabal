import { useEffect } from "react";
import { X } from "lucide-react";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";
import "./ImageModal.css";

export default function ImageModal({ src, alt, title, subtitle, onClose }) {
  useBodyScrollLock(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="image-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title || "Foto en pantalla completa"}
    >
      <button
        onClick={onClose}
        className="image-modal-cerrar"
        aria-label="Cerrar vista previa"
      >
        <X size={22} />
      </button>

      <div
        className="image-modal-contenedor"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt || "Foto de mascota"}
          className="image-modal-imagen"
        />
        {(title || subtitle) && (
          <div className="image-modal-caption">
            {title && <div className="image-modal-titulo">{title}</div>}
            {subtitle && (
              <div className="image-modal-subtitulo">{subtitle}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
